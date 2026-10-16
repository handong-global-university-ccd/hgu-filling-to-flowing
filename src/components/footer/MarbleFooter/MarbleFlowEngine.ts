import {
  Camera,
  ClampToEdgeWrapping,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  NoBlending,
  NoColorSpace,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";
import {
  advectVelocityFrag,
  curlFrag,
  displacementFrag,
  displayFragment,
  divergenceFrag,
  fullscreenVertex,
  gradientSubtractFrag,
  pressureFrag,
  scaleFrag,
  splatFrag,
  vorticityFrag,
} from "./marbleShaders";

/* ------------------------------------------------------------------ */
/*  Parameters                                                         */
/* ------------------------------------------------------------------ */

export interface MarbleParams {
  /** 반응 반경 (CSS px). Gaussian이 이 거리에서 거의 0이 된다. */
  interactionRadius: number;
  /** 호버 시 손가락이 유체를 끄는 정도. 0.006 → 중심 유체가 프레임당 커서 속도의 30%로 끌려감 */
  hoverStrength: number;
  /** 누른 상태(클릭/터치) 끄는 정도. */
  pressedStrength: number;
  /** 변위 복귀 비율 / 프레임 (60fps). 0.045 ≈ 1.1초. 지수 감쇠라 튕기지 않는다. */
  returnSpeed: number;
  /** 입력 속도 관성 (0..1). 클수록 끈적하고 늦게 따라온다. */
  damping: number;
  /** 누른 상태 최대 변위 (px). 전체 효과의 절대 상한. */
  maxDisplacement: number;
  /** 호버 상태 최대 변위 (px). */
  hoverMaxDisplacement: number;
  /** 입력·유체 속도 제한 (px / 60fps-frame). 찢어짐 방지. */
  maxPointerSpeed: number;
  /** 커서 위치 보간 (0..1). */
  pointerSmoothing: number;
  /** 유체 점성 (0..1). 높을수록 꿀처럼 넓게 함께 움직인다. */
  viscosity: number;
  /** 유체 흐름 유지 (0..1). 높을수록 손을 뗀 뒤에도 더 오래 흘러간다. */
  flow: number;
  /** 소용돌이 컬 세기. 0이면 말림 없음. */
  curl: number;
  /** 액체 표면 광택 (0..1). 0이면 색을 전혀 건드리지 않음. */
  sheen: number;
  /** 외곽 고정 (0..1). 0 = 실루엣도 함께 흐름, 1 = 외곽선 고정. */
  edgeLock: number;
  /** 반응 거리 (반경 대비). 커서가 물감에서 이만큼 떨어져 있어도 반응한다. */
  reach: number;
  /** 앰비언트 흐름 세기 (px). 0이면 완전히 정지. */
  drift: number;
  /** 흐름 무늬가 오른쪽으로 이동하는 속도 (px/s). */
  driftSpeed: number;
  /** 흐름 무늬 크기 (px). 클수록 크고 느긋한 결. */
  driftScale: number;
  /** 외곽 페더 폭 (px). 0이면 원래의 선명한 실루엣. */
  edgeSoftness: number;
  /** 외곽 페더 폭의 불규칙함 (0..1). 높을수록 물감이 번진 듯 들쭉날쭉. */
  edgeRoughness: number;
  /** 변위장 시각화 (디버그). */
  debug: boolean;
}

export const DEFAULT_MARBLE_PARAMS: MarbleParams = {
  interactionRadius: 160,
  hoverStrength: 0.006,
  pressedStrength: 0.01,
  returnSpeed: 0.135,
  damping: 0.9,
  maxDisplacement: 18,
  hoverMaxDisplacement: 10,
  maxPointerSpeed: 28,
  pointerSmoothing: 0.3,
  viscosity: 0.15,
  flow: 0.95,
  curl: 0.25,
  sheen: 0,
  edgeLock: 0,
  reach: 0.8,
  drift: 13.5,
  driftSpeed: 14,
  driftScale: 560,
  edgeSoftness: 0,
  edgeRoughness: 0.6,
  debug: false,
};

/** strength → 끌림 비율 계수 (0.006 × 50 = 0.3) */
export const STRENGTH_SCALE = 50;
const PRESSURE_ITERATIONS = 14;

export interface MarbleFlowOptions {
  container: HTMLElement;
  src: string;
  /** 흰 배경 이미지를 쓸 때: 흰색 = 물감, 검정 = 배경 (커서 게이트에만 사용) */
  maskSrc?: string;
  params?: Partial<MarbleParams>;
  maxDpr?: number;
  /** 모바일 세로 스크롤을 살리려면 'pan-y' (기본) */
  touchAction?: string;
  /** 이미지 위쪽으로 캔버스를 더 깔아 둘 여백 (px). 물감이 위로 흘러넘쳐도 잘리지 않는다. */
  bleedTop?: number;
  onReady?: () => void;
  onError?: (err: unknown) => void;
}

/* ------------------------------------------------------------------ */

const loadTexture = (url: string) =>
  new Promise<Texture>((resolve, reject) => {
    new TextureLoader().load(url, resolve, undefined, reject);
  });

function prepTexture(t: Texture) {
  t.colorSpace = NoColorSpace;
  t.generateMipmaps = true;
  t.minFilter = LinearMipmapLinearFilter;
  t.magFilter = LinearFilter;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.premultiplyAlpha = false;
  t.needsUpdate = true;
}

/** CPU 마스크 샘플러 — 커서가 물감에서 멀리 떨어진 빈 공간이면 입력을 끈다 */
class MaskSampler {
  private data: Uint8ClampedArray | null = null;
  private w = 0;
  private h = 0;
  constructor(
    img: CanvasImageSource & { width: number; height: number },
    private useRed: boolean,
  ) {
    try {
      const w = 256;
      const h = Math.max(1, Math.round((w * img.height) / img.width));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, w, h);
      this.data = ctx.getImageData(0, 0, w, h).data;
      this.w = w;
      this.h = h;
    } catch {
      this.data = null;
    }
  }
  at(u: number, v: number) {
    if (!this.data) return 1;
    if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
    const x = Math.min(this.w - 1, Math.floor(u * this.w));
    const y = Math.min(this.h - 1, Math.floor((1 - v) * this.h));
    return this.data[(y * this.w + x) * 4 + (this.useRed ? 0 : 3)] / 255;
  }
  /** 커서 주변 반경 r 안에 물감이 있는지 (중심 + 8방향 최대값) */
  near(x: number, y: number, r: number, W: number, H: number) {
    // x, y: 이미지 기준 px (y-up). 중심 + 반경 r 위 16방향 + r/2 위 8방향
    let m = this.at(x / W, y / H);
    for (let ring = 1; ring <= 2; ring++) {
      const rr = (r * ring) / 2;
      const n = ring * 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        m = Math.max(
          m,
          this.at((x + Math.cos(a) * rr) / W, (y + Math.sin(a) * rr) / H) * (ring === 1 ? 0.95 : 0.8),
        );
      }
    }
    return m;
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type RT = WebGLRenderTarget;
class PingPong {
  read: RT;
  write: RT;
  constructor(mk: () => RT) {
    this.read = mk();
    this.write = mk();
  }
  swap() {
    [this.read, this.write] = [this.write, this.read];
  }
  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

/* ------------------------------------------------------------------ */

export class MarbleFlowEngine {
  readonly canvas: HTMLCanvasElement;
  private p: MarbleParams;
  private renderer: WebGLRenderer;
  private camera = new Camera();
  private geo = new PlaneGeometry(2, 2);
  private quad: Mesh;
  private scene = new Scene();

  private m: Record<string, ShaderMaterial> = {};
  private vel: PingPong | null = null;
  private disp: PingPong | null = null;
  private pressure: PingPong | null = null;
  private divergence: RT | null = null;
  private curlRT: RT | null = null;
  private fw = 0;
  private fh = 0;

  private image: Texture | null = null;
  private sampler: MaskSampler | null = null;
  private ready = false;
  private disposed = false;

  private w = 1; // 캔버스 (이미지 + 여백) CSS px
  private h = 1;
  private iw = 1; // 이미지 영역 CSS px
  private ih = 1;
  private bx = 0;
  private bt = 0;
  private bb = 0;
  private visible = true;
  private raf = 0;
  private last = 0;

  private inside = false;
  private pressed = false;
  private target = new Vector2();
  private pos = new Vector2();
  private prev = new Vector2();
  private accum = new Vector2();
  private velIn = new Vector2();
  private press = 0;
  private gate = 0;
  private lastMove = 0;
  private eVel = 0;
  private eDisp = 0;
  private fluidActive = false;
  private time = 0;
  private driftRamp = 0;

  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private container: HTMLElement;
  private opts: MarbleFlowOptions;

  constructor(opts: MarbleFlowOptions) {
    this.opts = opts;
    this.container = opts.container;
    this.p = { ...DEFAULT_MARBLE_PARAMS, ...opts.params };

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.bx = 0;
    this.bt = Math.max(0, opts.bleedTop ?? 120);
    this.bb = 0;
    Object.assign(this.canvas.style, {
      position: "absolute",
      left: `${-this.bx}px`,
      top: `${-this.bt}px`,
      width: `calc(100% + ${this.bx * 2}px)`,
      height: `calc(100% + ${this.bt + this.bb}px)`,
      display: "block",
      // 여백이 위쪽 링크·텍스트를 덮어도 클릭은 그대로 통과
      pointerEvents: "none",
    });

    const mk = (frag: string, uniforms: Record<string, unknown>) =>
      new ShaderMaterial({
        vertexShader: fullscreenVertex,
        fragmentShader: frag,
        depthTest: false,
        depthWrite: false,
        blending: NoBlending,
        toneMapped: false,
        uniforms: Object.fromEntries(
          Object.entries({ uTexel: new Vector2(1, 1), ...uniforms }).map(([k, v]) => [k, { value: v }]),
        ),
      });
    const v2 = () => new Vector2();
    this.m.advect = mk(advectVelocityFrag, {
      uVel: null,
      uRes: v2(),
      uDt: 1,
      uDissipation: 0.95,
      uViscosity: 0.15,
      uMaxSpeed: 28,
    });
    this.m.splat = mk(splatFrag, {
      uVel: null,
      uRes: v2(),
      uPointer: v2(),
      uPointerVel: v2(),
      uSigma: 64,
      uAmount: 0,
    });
    this.m.curl = mk(curlFrag, { uVel: null });
    this.m.vort = mk(vorticityFrag, { uVel: null, uCurl: null, uCurlStrength: 0, uDt: 1, uMaxSpeed: 28 });
    this.m.div = mk(divergenceFrag, { uVel: null });
    this.m.press = mk(pressureFrag, { uPressure: null, uDivergence: null });
    this.m.grad = mk(gradientSubtractFrag, { uPressure: null, uVel: null });
    this.m.scale = mk(scaleFrag, { uSrc: null, uScale: 0.8 });
    this.m.disp = mk(displacementFrag, {
      uDisp: null,
      uVel: null,
      uRes: v2(),
      uDt: 1,
      uDecay: 0.955,
      uCap: 10,
      uMaxAbs: 18,
    });
    this.m.display = mk(displayFragment, {
      uImage: null,
      uDisp: null,
      uRes: v2(),
      uImgOffset: v2(),
      uImgSize: v2(),
      uDispTexel: v2(),
      uEdgeLock: 0,
      uSheen: 0,
      uTime: 0,
      uDrift: 0,
      uDriftSpeed: 14,
      uDriftScale: 520,
      uEdgeSoft: 0,
      uEdgeRough: 0.6,
      uTexW: 2560,
      uDebug: 0,
    });
    this.m.display.transparent = true;

    this.quad = new Mesh(this.geo, this.m.display);
    this.scene.add(this.quad);

    if (getComputedStyle(this.container).position === "static") this.container.style.position = "relative";
    this.container.style.touchAction = opts.touchAction ?? "pan-y";
    this.container.appendChild(this.canvas);

    this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    // 캔버스가 클릭을 통과시키므로 입력은 window에서 받아 캔버스 영역(이미지 + 위쪽 여백) 안인지 판정
    window.addEventListener("pointermove", this.onWinMove, { passive: true });
    window.addEventListener("pointerdown", this.onWinDown, { passive: true });
    window.addEventListener("pointerup", this.onUp, { passive: true });
    window.addEventListener("pointercancel", this.onCancel, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onLeave);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.container);
    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (!this.visible) this.stop();
        else if (this.fluidActive || this.p.drift > 0.01) this.start();
      },
      { rootMargin: "100px" },
    );
    this.io.observe(this.container);

    this.applyParams();
    this.load().catch((err) => opts.onError?.(err));
  }

  /* ---------------------------- public ---------------------------- */

  setParams(next: Partial<MarbleParams>) {
    Object.assign(this.p, next);
    this.applyParams();
    if (this.ready && !this.raf) {
      if (this.p.drift > 0.01) this.start();
      else this.renderDisplay();
    }
  }

  getParams(): MarbleParams {
    return { ...this.p };
  }

  /** 대략적인 현재 최대 변위 (px) — 표시용 추정치 */
  getEnergy() {
    return this.eDisp;
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.ro.disconnect();
    this.io.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    window.removeEventListener("pointermove", this.onWinMove);
    window.removeEventListener("pointerdown", this.onWinDown);
    window.removeEventListener("pointerup", this.onUp);
    window.removeEventListener("pointercancel", this.onCancel);
    document.documentElement.removeEventListener("pointerleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.disposeTargets();
    this.image?.dispose();
    Object.values(this.m).forEach((m) => m.dispose());
    this.geo.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }

  /* --------------------------- internals -------------------------- */

  private async load() {
    const { src, maskSrc } = this.opts;
    const [image, mask] = await Promise.all([
      loadTexture(src),
      maskSrc ? loadTexture(maskSrc) : Promise.resolve(null),
    ]);
    if (this.disposed) {
      image.dispose();
      mask?.dispose();
      return;
    }
    prepTexture(image);
    this.image = image;
    // three 0.186 타입에서 Texture.image 가 unknown 이라 로더가 돌려준 이미지 타입을 밝혀 준다
    this.sampler = new MaskSampler(
      (mask ?? image).image as CanvasImageSource & { width: number; height: number },
      !!mask,
    );
    mask?.dispose();
    this.m.display.uniforms.uImage.value = image;
    this.m.display.uniforms.uTexW.value = (image.image as { width: number }).width || 2560;
    this.ready = true;
    this.resize();
    this.opts.onReady?.();
    if (this.p.drift > 0.01) this.start();
  }

  private applyParams() {
    const p = this.p;
    this.m.splat.uniforms.uSigma.value = p.interactionRadius / 2.5;
    this.m.advect.uniforms.uViscosity.value = p.viscosity;
    this.m.advect.uniforms.uMaxSpeed.value = p.maxPointerSpeed;
    this.m.vort.uniforms.uMaxSpeed.value = p.maxPointerSpeed;
    this.m.disp.uniforms.uMaxAbs.value = p.maxDisplacement;
    this.m.display.uniforms.uEdgeLock.value = p.edgeLock;
    this.m.display.uniforms.uSheen.value = p.sheen;
    this.m.display.uniforms.uDriftSpeed.value = p.driftSpeed;
    this.m.display.uniforms.uDriftScale.value = p.driftScale;
    this.m.display.uniforms.uEdgeSoft.value = p.edgeSoftness;
    this.m.display.uniforms.uEdgeRough.value = p.edgeRoughness;
    this.m.display.uniforms.uDebug.value = p.debug ? 1 : 0;
  }

  private disposeTargets() {
    this.vel?.dispose();
    this.disp?.dispose();
    this.pressure?.dispose();
    this.divergence?.dispose();
    this.curlRT?.dispose();
  }

  private resize() {
    const r = this.container.getBoundingClientRect();
    this.iw = Math.max(1, r.width);
    this.ih = Math.max(1, r.height);
    this.w = this.iw + this.bx * 2;
    this.h = this.ih + this.bt + this.bb;
    this.renderer.setSize(this.w, this.h, false);
    this.m.display.uniforms.uImgOffset.value.set(this.bx, this.bb);
    this.m.display.uniforms.uImgSize.value.set(this.iw, this.ih);

    const fw = Math.max(16, Math.round(this.w / 4));
    const fh = Math.max(16, Math.round(this.h / 4));
    if (fw !== this.fw || fh !== this.fh) {
      this.fw = fw;
      this.fh = fh;
      this.disposeTargets();
      const mk = () =>
        new WebGLRenderTarget(fw, fh, {
          type: HalfFloatType,
          format: RGBAFormat,
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          wrapS: ClampToEdgeWrapping,
          wrapT: ClampToEdgeWrapping,
          depthBuffer: false,
          stencilBuffer: false,
          generateMipmaps: false,
        });
      this.vel = new PingPong(mk);
      this.disp = new PingPong(mk);
      this.pressure = new PingPong(mk);
      this.divergence = mk();
      this.curlRT = mk();
      this.clearAll();
    }
    const res = new Vector2(this.w, this.h);
    const texel = new Vector2(1 / fw, 1 / fh);
    for (const m of Object.values(this.m)) {
      m.uniforms.uTexel.value.copy(texel);
      if (m.uniforms.uRes) m.uniforms.uRes.value.copy(res);
    }
    this.m.display.uniforms.uDispTexel.value.copy(texel);
    if (this.ready) this.renderDisplay();
  }

  private clearAll() {
    if (!this.vel) return;
    const prev = this.renderer.getRenderTarget();
    this.renderer.setClearColor(0x000000, 0);
    for (const rt of [
      this.vel.read,
      this.vel.write,
      this.disp!.read,
      this.disp!.write,
      this.pressure!.read,
      this.pressure!.write,
      this.divergence!,
      this.curlRT!,
    ]) {
      this.renderer.setRenderTarget(rt);
      this.renderer.clear();
    }
    this.renderer.setRenderTarget(prev);
    this.eVel = 0;
    this.eDisp = 0;
  }

  private pass(mat: ShaderMaterial, target: RT | null) {
    this.quad.material = mat;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private renderDisplay() {
    if (!this.ready || !this.disp) return;
    this.m.display.uniforms.uDisp.value = this.disp.read.texture;
    this.pass(this.m.display, null);
  }

  private start() {
    if (this.raf || !this.ready || !this.visible || this.disposed) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (!this.vel || !this.disp || !this.pressure || !this.divergence || !this.curlRT) return;
    const p = this.p;
    const m = this.m;
    const dt = Math.min(1 / 20, Math.max(1 / 240, (now - this.last) / 1000));
    this.last = now;
    const f = dt * 60;

    // --- 입력: 속도 제한 + 관성 보간 ------------------------------------
    const raw = new Vector2();
    if (this.inside) {
      raw.copy(this.accum).divideScalar(f);
      const len = raw.length();
      if (len > p.maxPointerSpeed) raw.multiplyScalar(p.maxPointerSpeed / len);
    }
    this.accum.set(0, 0);
    const stopped = now - this.lastMove > 50;
    this.velIn.lerp(raw, 1 - Math.pow(p.damping, stopped ? f * 2 : f));
    this.pos.lerp(this.target, 1 - Math.pow(1 - p.pointerSmoothing, f));
    this.press += ((this.pressed ? 1 : 0) - this.press) * (1 - Math.pow(0.85, f));

    const near = this.sampler
      ? this.sampler.near(
          this.pos.x - this.bx,
          this.pos.y - this.bb,
          p.interactionRadius * p.reach,
          this.iw,
          this.ih,
        )
      : 1;
    this.gate += ((this.inside ? smoothstep(0.15, 0.7, near) : 0) - this.gate) * (1 - Math.pow(0.8, f));

    const strength = p.hoverStrength + (p.pressedStrength - p.hoverStrength) * this.press;
    const cap = p.hoverMaxDisplacement + (p.maxDisplacement - p.hoverMaxDisplacement) * this.press;
    const amount = Math.min(1, strength * STRENGTH_SCALE * this.gate) * Math.min(1, f);
    const speedIn = this.velIn.length();

    if (this.fluidActive) {
      // --- 1. 속도 이류 ---------------------------------------------------
      m.advect.uniforms.uVel.value = this.vel.read.texture;
      m.advect.uniforms.uDt.value = f;
      m.advect.uniforms.uDissipation.value = Math.pow(p.flow, f);
      this.pass(m.advect, this.vel.write);
      this.vel.swap();

      // --- 2. 손가락 드래그 -------------------------------------------------
      if (amount > 1e-4 && speedIn > 1e-3) {
        m.splat.uniforms.uVel.value = this.vel.read.texture;
        m.splat.uniforms.uPointer.value.copy(this.pos);
        m.splat.uniforms.uPointerVel.value.copy(this.velIn);
        m.splat.uniforms.uAmount.value = amount;
        this.pass(m.splat, this.vel.write);
        this.vel.swap();
      }

      // --- 3. 컬 ------------------------------------------------------------
      if (p.curl > 0.001) {
        m.curl.uniforms.uVel.value = this.vel.read.texture;
        this.pass(m.curl, this.curlRT);
        m.vort.uniforms.uVel.value = this.vel.read.texture;
        m.vort.uniforms.uCurl.value = this.curlRT.texture;
        m.vort.uniforms.uCurlStrength.value = p.curl;
        m.vort.uniforms.uDt.value = f;
        this.pass(m.vort, this.vel.write);
        this.vel.swap();
      }

      // --- 4. 비압축 투영 -----------------------------------------------------
      m.div.uniforms.uVel.value = this.vel.read.texture;
      this.pass(m.div, this.divergence);
      m.scale.uniforms.uSrc.value = this.pressure.read.texture;
      this.pass(m.scale, this.pressure.write);
      this.pressure.swap();
      m.press.uniforms.uDivergence.value = this.divergence.texture;
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        m.press.uniforms.uPressure.value = this.pressure.read.texture;
        this.pass(m.press, this.pressure.write);
        this.pressure.swap();
      }
      m.grad.uniforms.uPressure.value = this.pressure.read.texture;
      m.grad.uniforms.uVel.value = this.vel.read.texture;
      this.pass(m.grad, this.vel.write);
      this.vel.swap();

      // --- 5. 변위 누적 + 복귀 --------------------------------------------------
      const decay = Math.pow(1 - p.returnSpeed, f);
      m.disp.uniforms.uDisp.value = this.disp.read.texture;
      m.disp.uniforms.uVel.value = this.vel.read.texture;
      m.disp.uniforms.uDt.value = f;
      m.disp.uniforms.uDecay.value = decay;
      m.disp.uniforms.uCap.value = Math.min(cap, p.maxDisplacement);
      this.pass(m.disp, this.disp.write);
      this.disp.swap();

      // --- 정지 판단 (CPU 근사) --------------------------------------------------
      this.eVel *= Math.pow(p.flow, f);
      if (speedIn > this.eVel) this.eVel += (speedIn - this.eVel) * amount;
      this.eDisp *= decay;
      this.eDisp += this.eVel * f * Math.max(0, 1 - this.eDisp / Math.max(cap, 1e-3));
      this.eDisp = Math.min(this.eDisp, p.maxDisplacement);

      if (stopped && speedIn < 0.02 && this.eVel < 0.02 && this.eDisp < 0.03) {
        this.clearAll(); // 변위장 0 → 원본과 동일
        this.fluidActive = false;
      }
    }

    // --- 앰비언트 흐름 (오른쪽으로 아주 천천히) ------------------------------
    this.time += dt;
    this.driftRamp = Math.min(1, this.driftRamp + dt / 2); // 로드 직후 2초에 걸쳐 서서히 시작
    const d = this.m.display.uniforms;
    d.uTime.value = this.time;
    d.uDrift.value = p.drift * smoothstep(0, 1, this.driftRamp);

    this.renderDisplay();

    if (this.fluidActive || p.drift > 0.01) this.raf = requestAnimationFrame(this.tick);
  };

  private local(e: PointerEvent, out: Vector2) {
    const r = this.canvas.getBoundingClientRect();
    return out.set(e.clientX - r.left, r.height - (e.clientY - r.top));
  }

  private hit(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  private onWinMove = (e: PointerEvent) => {
    const inRect = this.hit(e);
    if (inRect) this.onMove(e);
    else if (this.inside) this.onLeave();
  };

  private onWinDown = (e: PointerEvent) => {
    if (this.hit(e)) this.onDown(e);
  };

  private onEnter = (e: PointerEvent) => {
    this.inside = true;
    this.local(e, this.target);
    this.pos.copy(this.target);
    this.prev.copy(this.target);
  };

  private onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.pressed = true;
    this.fluidActive = true;
    if (!this.inside || e.pointerType !== "mouse") this.onEnter(e);
    this.start();
  };

  private onMove = (e: PointerEvent) => {
    if (!this.inside) this.onEnter(e);
    this.local(e, this.target);
    this.accum.add(new Vector2().subVectors(this.target, this.prev));
    this.prev.copy(this.target);
    this.lastMove = performance.now();
    this.fluidActive = true;
    this.start();
  };

  private onUp = () => {
    this.pressed = false;
  };

  private onCancel = () => {
    this.pressed = false;
    this.inside = false;
  };

  private onLeave = () => {
    this.inside = false;
    this.pressed = false;
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else if (this.fluidActive || this.p.drift > 0.01) this.start();
  };

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.stop();
    this.opts.onError?.(new Error("WebGL context lost"));
  };
}

export function isWebGLAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}
