/**
 * Marble footer shaders — v2 "liquid"
 * ------------------------------------------------------------------
 * 좌표계: 길이는 CSS px, y축은 위쪽(+). 속도 단위는 px / 60fps-frame.
 *
 * 저해상도 격자(요소의 1/4)에서 간단한 Stable Fluids를 돌린다.
 *   1. advect velocity      — 속도장이 스스로 흘러감 (액체의 관성)
 *   2. splat                — 커서 주변 Gaussian 영역의 유체를 손가락 속도로 끌고 감
 *   3. curl + vorticity     — 결이 살짝 말려 들어가는 액체 특유의 컬
 *   4. divergence → pressure(Jacobi) → gradient subtract
 *                           — 비압축성: 한쪽을 밀면 옆이 부풀어 오름
 *   5. displacement         — "이미지 픽셀이 실제로 얼마나 흘러갔는지"를 속도장으로 이류하며 누적,
 *                             동시에 지수 감쇠로 원위치 복귀 (튕김 없음)
 * DISPLAY: 이미지 전체(RGBA)를 uv - D 에서 샘플 → 외곽 실루엣까지 함께 흐른다.
 *          변위장의 압축/팽창에서 표면 노멀을 만들어 아주 약한 액체 광택을 얹는다(sheen).
 */

export const fullscreenVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const head = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uTexel;   // 격자 텍셀 (uv)
`;

/** 1. 속도 이류 + 점성 확산 + 감쇠 */
export const advectVelocityFrag = /* glsl */ `
${head}
uniform sampler2D uVel;
uniform vec2  uRes;        // CSS px
uniform float uDt;         // 60fps 프레임 수
uniform float uDissipation;
uniform float uViscosity;
uniform float uMaxSpeed;
void main() {
  vec2 v  = texture2D(uVel, vUv).xy;
  vec2 back = vUv - v * uDt / uRes;
  vec2 a = texture2D(uVel, back).xy;
  vec2 n = texture2D(uVel, back + vec2(uTexel.x, 0.0)).xy
         + texture2D(uVel, back - vec2(uTexel.x, 0.0)).xy
         + texture2D(uVel, back + vec2(0.0, uTexel.y)).xy
         + texture2D(uVel, back - vec2(0.0, uTexel.y)).xy;
  a = mix(a, n * 0.25, uViscosity);
  a *= uDissipation;
  float L = length(a);
  if (L > uMaxSpeed) a *= uMaxSpeed / L;
  gl_FragColor = vec4(a, 0.0, 1.0);
}
`;

/** 2. 손가락 드래그: 반경 안 유체 속도를 커서 속도 쪽으로 끌어당김 (커서보다 빨라지지 않음) */
export const splatFrag = /* glsl */ `
${head}
uniform sampler2D uVel;
uniform vec2  uRes;
uniform vec2  uPointer;    // px, y-up
uniform vec2  uPointerVel; // px/frame
uniform float uSigma;
uniform float uAmount;     // 0..1, 중심에서의 끌림 비율
void main() {
  vec2 v = texture2D(uVel, vUv).xy;
  vec2 q = vUv * uRes - uPointer;
  float g = exp(-dot(q, q) / (2.0 * uSigma * uSigma));
  v = mix(v, uPointerVel, clamp(g * uAmount, 0.0, 1.0));
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

export const curlFrag = /* glsl */ `
${head}
uniform sampler2D uVel;
void main() {
  float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).y;
  float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}
`;

export const vorticityFrag = /* glsl */ `
${head}
uniform sampler2D uVel;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;
uniform float uMaxSpeed;
void main() {
  float L = texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 1e-4;
  f *= uCurlStrength * C;
  f.y *= -1.0;
  vec2 v = texture2D(uVel, vUv).xy + f * uDt;
  float Lv = length(v);
  if (Lv > uMaxSpeed) v *= uMaxSpeed / Lv;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

export const divergenceFrag = /* glsl */ `
${head}
uniform sampler2D uVel;
void main() {
  float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}
`;

export const pressureFrag = /* glsl */ `
${head}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float d = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
}
`;

export const gradientSubtractFrag = /* glsl */ `
${head}
uniform sampler2D uPressure;
uniform sampler2D uVel;
void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 v = texture2D(uVel, vUv).xy - 0.5 * vec2(R - L, T - B);
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

/** 압력장 감쇠 (다음 프레임 Jacobi 초기값) */
export const scaleFrag = /* glsl */ `
${head}
uniform sampler2D uSrc;
uniform float uScale;
void main() { gl_FragColor = vec4(texture2D(uSrc, vUv).xyz * uScale, 1.0); }
`;

/** 5. 변위장: 속도장으로 이류 + 이번 프레임 이동량 누적 + 지수 복귀 */
export const displacementFrag = /* glsl */ `
${head}
uniform sampler2D uDisp;
uniform sampler2D uVel;
uniform vec2  uRes;
uniform float uDt;
uniform float uDecay;  // 매 프레임 곱 (복귀)
uniform float uCap;    // 현재 상태 목표 최대 변위 px
uniform float uMaxAbs; // 절대 상한 px
void main() {
  vec2 v = texture2D(uVel, vUv).xy;
  vec2 step = v * uDt;
  vec2 D = texture2D(uDisp, vUv - step / uRes).xy;
  float sl = length(step);
  if (sl > 1e-5) {
    // 같은 방향으로 많이 흘렀으면 점점 덜 흐름 (점성 저항, 부드러운 포화)
    float room = clamp(1.0 - dot(D, step / sl) / max(uCap, 1e-3), 0.0, 1.0);
    D += step * room;
  }
  D *= uDecay;
  float L = length(D);
  if (L > uMaxAbs) D *= uMaxAbs / L;
  gl_FragColor = vec4(D, 0.0, 1.0);
}
`;

export const displayFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;

// 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/**
 * 앰비언트 흐름: 오른쪽으로 천천히 이동하는 저주파 노이즈가 결을 오른쪽으로 밀어낸다.
 * x 성분은 항상 0 이상(오른쪽으로만 밀림), y는 아주 약하게 출렁임.
 * 두 옥타브가 서로 다른 속도로 흘러 패턴이 고정된 채 미끄러지지 않고 계속 변한다.
 */
vec2 ambientDrift(vec2 px, float t, float amp, float speed, float scale) {
  vec2 q1 = (px - vec2(speed * t, 0.0)) / scale;
  vec2 q2 = (px - vec2(speed * 0.62 * t, -speed * 0.08 * t)) / (scale * 0.55);
  float n1 = snoise(q1 * vec2(0.7, 1.4));       // 가로로 길쭉한 결
  float n2 = snoise(q2 * vec2(0.8, 1.6) + 17.3);
  float nx = 0.5 + 0.5 * (0.7 * n1 + 0.3 * n2);
  float ny = 0.65 * n2 * 0.35 + 0.35 * n1 * 0.25;
  return amp * vec2(nx, ny);
}

uniform float uTime;
uniform float uDrift;       // px
uniform float uDriftSpeed;  // px/s
uniform float uDriftScale;  // px
uniform float uEdgeSoft;    // 외곽 페더 폭 (px)
uniform float uEdgeRough;   // 페더 폭의 불규칙함 (0..1)
uniform float uTexW;        // 이미지 텍스처 가로 픽셀 수


uniform sampler2D uImage;
uniform sampler2D uDisp;
uniform vec2  uRes;       // 캔버스 크기 (이미지 + 여백)
uniform vec2  uImgOffset; // 캔버스 안 이미지 좌하단 위치 px
uniform vec2  uImgSize;   // 이미지 크기 px
uniform vec2  uDispTexel;
uniform float uEdgeLock;  // 0 = 외곽도 자유롭게 흐름, 1 = 외곽 고정
uniform float uSheen;     // 액체 광택 세기
uniform float uDebug;

/** 디스크 모양으로 알파를 평균 (golden-angle 12탭 + 밉맵 프리블러) → 부드러운 거리감 */
float softAlpha(vec2 uv, float radiusPx) {
  vec2 r = radiusPx / uImgSize;
  // 화면 축소로 이미 고른 밉 레벨에 더해 얹는 bias
  float base = max(0.0, log2(uTexW / uImgSize.x));
  float texels = radiusPx * uTexW / uImgSize.x;
  float lod = max(0.0, log2(texels / 3.0) - base);
  float sum = texture2D(uImage, uv, lod).a;
  for (int i = 0; i < 12; i++) {
    float fi = float(i) + 0.5;
    float ang = fi * 2.39996323;
    float rad = sqrt(fi / 12.0);
    sum += texture2D(uImage, uv + vec2(cos(ang), sin(ang)) * r * rad, lod).a;
  }
  return sum / 13.0;
}

void main() {
  vec2 Df = texture2D(uDisp, vUv).xy;               // 손으로 민 유체 변위
  vec2 iuv = (vUv * uRes - uImgOffset) / uImgSize; // 이미지 uv (여백 영역은 0..1 밖)
  vec2 D = Df;
  if (uDrift > 0.001) D += ambientDrift(iuv * uImgSize, uTime, uDrift, uDriftSpeed, uDriftScale);

  // 화면 가장자리(좌·우·아래)는 바깥에서 끌어올 물감이 없으므로 변위를 서서히 0으로 → 늘어난 띠 방지
  vec2 ipx = iuv * uImgSize;
  float edgeFade = smoothstep(0.0, 72.0, ipx.x)
                 * smoothstep(0.0, 72.0, uImgSize.x - ipx.x)
                 * smoothstep(0.0, 48.0, ipx.y);
  D *= edgeFade;

  if (uEdgeLock > 0.001) {
    float a0 = texture2D(uImage, iuv, 3.5).a;
    D *= mix(1.0, smoothstep(0.55, 0.985, a0), uEdgeLock);
  }

  vec2 su = iuv - D / uImgSize;
  vec4 s = texture2D(uImage, su, -0.5);
  // 위쪽 여백: 이미지 맨 윗줄이 투명이라 clamp 샘플도 투명 → 정지 상태의 여백은 항상 비어 있음.
  // 좌우·아래: 물감이 화면 밖으로 이어지므로 가장자리 픽셀을 clamp (구멍이 생기지 않음).
  vec3 rgb = s.rgb;
  float a = s.a;

  // 자연스러운 외곽: 실루엣 안쪽으로 페더. 폭은 노이즈로 들쭉날쭉하게 → 오려낸 느낌 제거
  if (uEdgeSoft > 0.5 && a > 0.001) {
    vec2 spx = su * uImgSize;
    float rough = snoise(spx / 70.0) * 0.6 + snoise(spx / 23.0 + 9.1) * 0.4;
    float w = uEdgeSoft * (1.0 + uEdgeRough * 0.8 * rough);
    float b = softAlpha(su, max(w, 1.0));
    a *= smoothstep(0.5, 0.97, b);
  }

  if (uSheen > 0.001) {
    // 손으로 민 곳에만, 넓고 부드러운 반사. 흰색을 더하지 않고 물감 자신의 색을 살짝 밝힘
    vec3 n = normalize(vec3(-Df / 14.0, 1.0));
    vec3 h = normalize(normalize(vec3(-0.45, 0.6, 0.66)) + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, h), 0.0), 14.0);
    float base = pow(h.z, 14.0);
    float hl = smoothstep(0.0, 0.35, max(spec - base, 0.0));
    vec3 tint = mix(rgb, vec3(1.0), 0.35);
    rgb = mix(rgb, tint, hl * uSheen);
  }

  if (uDebug > 0.5) {
    float mag = clamp(length(Df) / 10.0, 0.0, 1.0);
    rgb = mix(rgb, vec3(1.0, 0.35, 0.2), mag * 0.8);
    a = max(a, mag * 0.8);
  }
  gl_FragColor = vec4(min(rgb, 1.0) * a, a);
}
`;
