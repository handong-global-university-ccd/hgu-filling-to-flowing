import type { FieldKey, Work } from "./types";
import media from "./media-manifest.json" with { type: "json" };

/**
 * 작품 내용 — '2026 졸업전시 웹사이트 정보 취합' 시트(시각·제품 탭) 기준.
 * - cardTitle: 'work 메인 페이지' 작품명 (Works 카드) / title·subtitle·description: 'work 상세 페이지'
 * - 시트의 강제 줄바꿈(PDF 폭에 맞춘 줄)은 풀고, 빈 줄(문단)과 문장 끝 줄바꿈만 남겼다
 * - teamName 이 있으면 팀 작품, 없으면 개인 작품 (Works 왼쪽 칸의 전시 구분 — data/projects.ts)
 * - 동명이인 김시은·김지민·김하경은 학번으로 구분했다 (designers.ts 참고)
 * TODO: 시트 미작성 — 김현진·이예찬·이윤서·한영찬 개인 작품, 딛 '영덕 복숭아 장터' 소개글
 *       (비어 있으면 제목은 디자이너 이름, 설명은 비워 둔다)
 * TODO: 이미지(thumbnails·pages)는 아직 더미. 실제 작품이 들어오면 /media/works/<slug>/... 로 바꿀 것
 */
type WorkText = Omit<Work, "thumbnails" | "pages" | "photo">;

const TEXTS: WorkText[] = [
  // ───── Communication Design ─────
  {
    slug: "communication-01",
    field: "communication",
    cardTitle: "Dorothy: AI 단편 영화 프로젝트",
    title: "Dorothy",
    subtitle: "AI 단편영화 제작 프로젝트",
    description:
      "<오즈의 마법사, 1939> 그 이후의 이야기를 각색하고 재해석해, 생성형 AI로 제작한 단편영화입니다. 이 프로젝트는 대본 설계부터 장면 이미지, 영상 생성에 이르는 창작에 생성형 AI를 적극적으로 활용하여 현 시점 AI가 가진 표현의 가능성을 깊이 탐구했습니다. 또한 완성된 영화의 제작 과정을 함께 공유하고, 관람자가 생성형 AI가 넓혀 가는 창작의 가능성을 직접 경험할 수 있도록 작품의 장면들을 구성하였습니다.",
    designerSlugs: ["jaehyeon-ko"],
  },
  {
    slug: "communication-14",
    field: "communication",
    cardTitle: "Aukake: 8월 32일의 여름 맥주",
    title: "Aukake",
    subtitle: "8월 32일의 여름 맥주",
    description:
      "Aukake(아우카케)는 영원한 여름의 섬 하와이의 ‘8월'을 뜻합니다. 일상의 반복에서 잠시 벗어나 걱정은 31일에 두고 가는 하루, 달력에 없는 8월 32일을 위한 가상의 여름 맥주 브랜드입니다. 여름의 낮(11:00), 일몰(18:00), 여름밤(21:00) 세 챕터로 그 하루를 설계했습니다.",
    designerSlugs: ["gang-kim"],
  },
  {
    slug: "communication-15",
    field: "communication",
    cardTitle: "sosiego : yoga & meditation",
    title: "sosiego",
    subtitle: "yoga & meditation",
    description:
      "〈sosiego〉는 호흡과 신체 움직임의 자연스러운 흐름, 그리고 그 끝에 도달하는 평온을 중심 가치로 삼은 요가·명상 웰니스 오브제 브랜딩 프로젝트입니다. 유기적인 선의 흐름과 구조적 조형미를 특징으로 하는 아르누보의 조형 언어를 차분하고 절제된 형태로 재해석했습니다. 요가의 신체 움직임과 호흡의 리듬을 시각적 요소에 접목하여, 몸과 마음이 평온에 이르는 과정을 웰니스 오브제와 브랜드 경험에 담아내고자 했습니다.",
    designerSlugs: ["min-kim"],
  },
  {
    slug: "communication-16",
    field: "communication",
    cardTitle: "Romene: 빈티지 샵 브랜드",
    title: "Romene",
    subtitle: "낙서와 빈티지로 만들어낸 작은 도피처",
    description:
      "Romene은 어린 시절의 기억과 상상에서 출발한 여성 빈티지 패션 브랜드이다. 낯선 환경에서 느꼈던 고립감 속에서 낙서와 빈티지 의류는 현실을 벗어나 자유롭게 자신을 표현할 수 있는 작은 도피처가 되었다.\n\n이러한 개인적 서사를 바탕으로 석류나무와 쥐, 자유로운 낙서를 브랜드의 시각적 모티브로 재해석했다. 석류의 붉은색과 거칠고 유희적인 드로잉을 중심으로 BI를 구축하고, 가오픈 포스터, 쇼핑백, 패키지, 웹사이트까지 일관된 브랜드 경험으로 확장했다. 특히 웹사이트는 어린 시절의 집을 모티브로, 방문자가 낯선 공간을 탐색하며 빈티지 의류를 발견하는 인터랙티브 경험을 제공한다.\n\nRomene은 단순히 오래된 옷을 판매하는 공간을 넘어, 누군가에게는 평범한 옷이 또 다른 누군가에게는 새로운 취향과 기억, 자신만의 세계를 발견하는 계기가 될 수 있다는 이야기를 전한다.",
    designerSlugs: ["sieun-kim"],
  },
  {
    slug: "communication-17",
    field: "communication",
    cardTitle: "평리재 : 평리의 봉제를 잇는 공공브랜딩",
    title: "평리재",
    subtitle: "평리의 봉제를 잇는 공공브랜딩",
    description:
      "평리재는 대구 평리동 곳곳에 흩어진 봉제산업의 존재감을 지역 전체로 확장하고, 오랜 시간 축적된 평리동의 고유한 기술과 산업적 가치를 알리기 위한 공공브랜딩 프로젝트입니다. 봉제산업 고유의 물성과 조형적 특성을 현대적인 시각 언어로 재해석하여, 지역의 산업적 특색과 연결성을 하나의 브랜드 정체성으로 담아냈습니다.",
    designerSlugs: ["sieun-kim-2"],
  },
  {
    slug: "communication-18",
    field: "communication",
    cardTitle: "Seasonal Waves: wave to earth NYC Pop-up",
    title: "Seasonal Waves",
    subtitle: "wave to earth NYC Pop-up",
    description:
      "음악은 때로 한 계절의 풍경이나 특정한 순간으로 기억됩니다. ‘Seasonal Waves’는 wave to earth의 음악을 뉴욕의 일상에 전하는 홍보 팝업 스토어 프로젝트입니다. 계절을 주제로 밴드의 음악을 소개하고, 한국적인 색감과 오브제를 통해 한국 밴드로서의 정체성을 함께 전합니다. 오랜 팬에게는 새 기억을, 밴드를 처음 만나는 이에게는 오래 듣고 싶은 음악을 전하며, 음악이 한 계절로 남는 경험을 제안합니다.",
    designerSlugs: ["yehui-kim"],
  },
  {
    slug: "communication-19",
    field: "communication",
    cardTitle: "요구한 순간: 2029 hy 창립 60주년 기념 레트로 팝업스토어",
    title: "요구한 순간",
    subtitle: "2029 hy 창립 60주년 기념 레트로 팝업스토어",
    description:
      "본 프로젝트는 hy(한국야쿠르트) 창립 60주년을 기념하는 가상의 레트로 팝업스토어로, hy의 제품인 요쿠르트가 오랜 시간 여러 세대의 일상에 남긴 소중한 추억을 되돌아보고자 합니다. 요구르트를 떠올리면 당신은 어떤 순간이 그리워지나요?",
    designerSlugs: ["yuna-kim"],
  },
  {
    slug: "communication-20",
    field: "communication",
    cardTitle: "Feelower: 평범한 하루도 특별하게",
    title: "Feelower",
    subtitle: "평범한 하루도 특별하게",
    description:
      "〈Feelower〉는 지나치기 쉬운 평범한 날들을 위해 존재합니다. 특별한 날을 기념할 때만 건네던 꽃을 일상으로 가져와, 사소하게 여겨졌던 감정들을 다시 돌아보고, 더 풍부하게 하고, 풀어낼 수 있도록 돕는 하나의 솔루션이 되고자 합니다.",
    designerSlugs: ["jimin-kim"],
  },
  {
    slug: "communication-21",
    field: "communication",
    cardTitle: "름드리 주간보호센터: 빛나는 오늘을 위해",
    title: "름드리 주간보호센터",
    subtitle: "오늘도 청춘 진행 중",
    description:
      "본 작품은 어르신들의 일상을 새로운 시선으로 바라보고, 그 안에 담긴 즐거움과 가능성을 표현한 브랜드 디자인 프로젝트입니다. 세월 속에서도 변함없이 이어지는 삶의 활력과 개성에 주목하며, 어르신 한 분 한 분이 일상의 주인공으로 빛나는 순간을 담았습니다. 브랜드의 시각 요소와 매체를 통해 름드리 주간보호센터가 추구하는 일상의 가치를 전달하고자 했습니다.",
    designerSlugs: ["jimin-kim-2"],
  },
  {
    slug: "communication-22",
    field: "communication",
    title: "김현진",
    description: "",
    designerSlugs: ["hyeonjin-kim"],
  },
  {
    slug: "communication-23",
    field: "communication",
    cardTitle: "NJF : 노들 재즈 페스티벌 브랜딩",
    title: "Nodeul Jazz Festival",
    subtitle: "노들 재즈 페스티벌 브랜딩",
    description:
      "노들 재즈 페스티벌 NJF는 한강 위 노들섬을 배경으로, 재즈를 보다 자유롭고 친근하게 즐길 수 있도록 기획한 가상의 야외 음악 페스티벌 브랜딩 프로젝트입니다. 음악을 감상하는 것을 넘어, 각자의 방식으로 재즈를 발견하고 즐기는 경험을 통해 일상 속에서 재즈가 더욱 가까워지기를 바랍니다.",
    designerSlugs: ["huiwon-kim"],
  },
  {
    slug: "communication-24",
    field: "communication",
    cardTitle: "차곡차곡: 일상의 나를 관찰하는 기록용품 브랜드",
    title: "차곡차곡",
    subtitle: "일상의 나를 관찰하는 기록용품 브랜드",
    description:
      "개인의 성향과 기록 방식에 맞는 도구를 제안하는 가상의 기록 도구 브랜드 ‘차곡차곡’의 팝업 행사 포스터이다. 하루하루의 기록을 점으로 묘사하여 온전히 나를 담아내는 모습을 시각적으로 표현하고자 했다.",
    designerSlugs: ["seou-park"],
  },
  {
    slug: "communication-25",
    field: "communication",
    cardTitle: "NOTA : 향으로 나를 만들어가는 경험",
    title: "NOTA",
    subtitle: "향으로 나를 만들어가는 경험",
    description:
      "향을 통해 자신의 성향을 발견하고 정체성을 탐색하는 프로젝트입니다. 다양한 향을 선택하고 조합하는 과정을 통해 자신을 이루는 고유한 특성을 발견하고, 이를 하나의 향으로 표현하고자 했습니다. 향의 조합과 시각적 요소를 통해 눈에 보이지 않는 개인의 성향을 감각적으로 표현했습니다. 관람자가 향을 매개로 자신의 내면을 탐색하고, 자신만의 정체성을 새롭게 정의할 수 있도록 구성했습니다.",
    designerSlugs: ["seohan-park"],
  },
  {
    slug: "communication-26",
    field: "communication",
    cardTitle: "민족의 소리: presented by RELLAiZE",
    title: "민족의 소리",
    subtitle: "presented by RELLAiZE",
    description:
      "세종 26년, 서기 1444년. 글자를 지키려는 자와 인멸하려는 자의 소리 없는 전쟁이 시작되었다. 군주의 가장 그림자 같은 신하가 되어, 암약하는 방해꾼을 밝혀내라. 그대의 활약이 곧 민족의 소리가 될지니.",
    designerSlugs: ["sihyeon-park"],
  },
  {
    slug: "communication-27",
    field: "communication",
    cardTitle: "RYUL: BAND",
    title: "RYUL",
    subtitle: "BAND",
    description:
      "RYUL은 한국 전통음악과 영국 록 밴드의 감성을 결합한 가상의 국악 밴드입니다. 전통의 멋과 풍류를 동시대의 감각으로 새롭게 풀어내고, 서로 다른 문화와 시대의 미학을 음악과 비주얼에 담아 기존의 틀을 벗어난 새로운 밴드 이미지를 제안합니다.",
    designerSlugs: ["yerim-park"],
  },
  {
    slug: "communication-28",
    field: "communication",
    cardTitle: "Oh! my plant: 나만의 식물 가꾸기 팝업스토어",
    title: "Oh! my plant",
    subtitle: "오늘의 집, 나만의 식물 가꾸기 팝업스토어",
    description:
      "식물을 키우는 일은 공간을 꾸미고 직접 수확하며 일상의 변화를 발견하는 경험이 될 수 있습니다. ‘Oh! my Plant’는 취향과 생활 방식에 맞는 식물을 선택하고, 키우는 과정 자체를 즐기도록 제안하는 플랜트 라이프스타일 브랜드입니다.\n식물마다 다른 매력을 통해 공간을 꾸미고 돌보는 즐거움을 제안합니다. 식물을 어렵게 관리해야 하는 대상이 아닌, 나의 일상과 함께 천천히 성장하는 존재로 경험해보세요.",
    designerSlugs: ["juhyeon-park"],
  },
  {
    slug: "communication-29",
    field: "communication",
    cardTitle: "Khushi: 크리스천을 위한 팬시용품 브랜드",
    title: "Khushi",
    subtitle: "크리스천을 위한 팬시용품 브랜드",
    description:
      "Khushi는 힌디어로 행복, 기쁨을 뜻하는 말입니다. 예수님과 일상 중 동행하며 느끼는 기쁨을 팬시용품에 담았습니다.",
    designerSlugs: ["jiu-park"],
  },
  {
    slug: "communication-30",
    field: "communication",
    title: "FIRENZE 1221 × SEOUL 2027",
    subtitle: "산타마리아노벨라 사계절 향수 컬렉션",
    description:
      "산타마리아노벨라의 오랜 향수 전통과 한국의 사계절에서 영감을 받아 기획한 향수 컬렉션입니다. 피렌체에서 시작된 브랜드의 역사와 한국의 계절별 식물과 풍경을 조화롭게 재해석하여, 피렌체와 서울 두 도시의 감각을 담은 새로운 향수 컬렉션을 제안합니다.",
    designerSlugs: ["chanmi-park"],
  },
  {
    slug: "communication-31",
    field: "communication",
    cardTitle: "개인 전시 프로젝트: SAFE HERE, 온실",
    title: "SAFE HERE: 온실",
    subtitle: "그래픽 아트 개인 전시 프로젝트",
    description:
      "《Safe Here: 온실》은 미술관에서 열리는 가상의 개인 전시 프로젝트입니다. 외부로부터 보호받으며 자라는 온실을 통해, 누구에게나 잠시 머물 수 있는 안전한 공간이 필요하다는 이야기를 전합니다. 동시에 그 안전함에서 벗어나 바람을 맞고 흔들리는 과정 또한 성장의 일부이며, 결국 문을 열고 밖으로 나아가는 것은 자신의 선택이라는 메시지를 담고 있습니다.",
    designerSlugs: ["yewon-bang"],
  },
  {
    slug: "communication-32",
    field: "communication",
    title: "감각의 재구성: The Shapes of Senses",
    subtitle: "TAMBURINS, 향기의 시각 아카이브",
    description:
      "우리는 향기를 코로 맡지만, 뇌는 그것을 형상으로  기억합니다. 어떤 향은 따뜻하고, 어떤 향은 무겁고,  어떤 향은 특정한 색으로 떠오릅니다. ‘감각의 재구성’은 향을 직접 맡지 않고도 그 향의 온도와 무게, 색채를  느낄 수 있도록 설계한 시각 경험이자, 탬버린즈의 향기를  저만의 시선으로 수집하고 다시 짠 감각의 아카이브입니다.",
    designerSlugs: ["usang-song"],
  },
  {
    slug: "communication-33",
    field: "communication",
    title: "TIMESLIP: Personal Album Creation Pop-up",
    subtitle: "SPOTIFY, 개인 맞춤형 앨범 제작 팝업",
    description:
      "하나의 음악이 잊고 있던 순간을 떠올리게 하듯, 우리는 음악을 통해 과거의 기억을 다시 마주하고 현재의 순간을 기록하며 다가올 미래를 상상합니다. TIMESLIP은 이러한 경험을 CD라는 물리적 매체에 담아, 흘러가는 시간 속 소중한 순간을 오래도록 간직할 수 있도록 제안합니다.",
    designerSlugs: ["juhui-song"],
  },
  {
    slug: "communication-34",
    field: "communication",
    title: "에버랜드 페스티벌 : Ever Journey",
    subtitle: "에버랜드 하루 여행 페스티벌",
    description:
      "에버랜드에서의 하루를 하나의 여행으로 재해석한 여행형 페스티벌입니다. 에버랜드의 다양한 즐길 거리를 어트랙션, 정원, 동물원이라는 세 가지 테마로 나누고, 각 테마를 대표하는 캐릭터를 여행 가이드로 설정했습니다.어트랙션 가이드 레니, 정원 가이드 도나, 동물원 가이드 베이글과 함께 에버랜드에서의 하루를 자신만의 특별한 여행으로 기억할 수 있도록 기획했습니다.",
    designerSlugs: ["hayeon-song"],
  },
  {
    slug: "communication-35",
    field: "communication",
    title: "Ready Korea Action",
    description:
      "〈READY KOREA ACTION〉은 옛이야기 속 무섭고도 엉뚱했던 호랑이 캐릭터와 함께 한국의 과거와 현재를 잇는 새로운 여행 경험을 제안합니다.\n촬영 신호 “Ready, Action!”처럼 한국 전체를 하나의 생생한 무대로 바라봅니다. 영화적 연출과 위트 있는 디자인으로 문화를 친근하게 전하고, 이야기 속 호기심을 실제 여행과 일상의 즐거움으로 이어지게 합니다.",
    designerSlugs: ["yein-ahn"],
  },
  {
    slug: "communication-36",
    field: "communication",
    cardTitle: "2028 서울국제도서전 브랜딩",
    title: "손끝에 닿는 세계",
    subtitle: "2028 서울국제도서전",
    description:
      "「손끝에 닿는 세계」는 책의 물리적 특성에 주목하여, 책을 통해 만나는 다양한 세계를 시각적으로 표현한 리브랜딩 프로젝트이다.\n\n‘종이’를 핵심 그래픽 모티프로 활용하여 종이가 접히고, 휘어지고, 겹쳐지며 만들어내는 입체적인 형태를 통해 책 속에 담긴 다양한 세계를 표현했다.",
    designerSlugs: ["huiwon-oh"],
  },
  {
    slug: "communication-37",
    field: "communication",
    cardTitle: "CONVERSE KOREA: 움직임을 쓰다",
    title: "움직임을 쓰다",
    subtitle: "Converse Korea Pop-up in Seongsu",
    description:
      "우리는 움직이는 순간마다 자신만의 흔적을 남깁니다.\n‘움직임을 쓰다’는 각자의 속도와 리듬이 담긴 농구의 움직임을 하나의 표현 방식으로 바라보는 데서 시작했습니다.\nJUMP, SHOOT, DUNK, DRIBBLE, RUN 다섯 가지 동작의 궤적을 거친 붓의 획으로 재해석하여, 순간적으로 사라지는 움직임을 각기 다른 형태의 그래픽으로 기록했습니다.",
    designerSlugs: ["goeun-yoon"],
  },
  {
    slug: "communication-38",
    field: "communication",
    title: "BPS: Body Pit Stop",
    subtitle: "다음 일상을 위한 짧은 정비",
    description:
      "BPS(Body Pit Stop)는 레이싱의 빠르고 정교한 정비에서 영감을 받은 가상의 배쓰 라이프스타일 브랜드입니다. 목욕을 몸과 기분을 정돈하는 짧은 피트스톱으로 제안합니다. 빠르게 몸 컨디션을 리셋하여 다음 일상을 준비하도록 돕습니다.",
    designerSlugs: ["dagyeong-lee"],
  },
  {
    slug: "communication-39",
    field: "communication",
    cardTitle: "KiiiKiii x TiiiKiii 팬클럽 멤버십 브랜딩",
    title: "TiiiKiii Party",
    subtitle: "KiiiKiii x TiiiKiii 팬클럽 멤버십 브랜딩",
    description:
      "본 작품은 KiiiKiii 멤버들의 개성과 분위기를 오리지널 캐릭터로 재해석해, 팬클럽 멤버십 키트로 확장한 프로젝트입니다. KiiiKiii와 팬덤 TiiKii가 친구처럼 편안하게 어울리는 모습을 ‘파자마 파티’라는 콘셉트에 담았습니다. 멤버별 매력을 살린 캐릭터와 키트 구성품을 통해 멤버십에 가입한 팬들이 KiiiKiii만의 세계관과 분위기를 일상에서도 경험할 수 있도록 기획했습니다.",
    designerSlugs: ["saehui-lee"],
  },
  {
    slug: "communication-40",
    field: "communication",
    cardTitle: "MUKOONG: 조선 문화 전시 브랜딩",
    title: "MUKOONG",
    subtitle: "무궁: 다함이 없는 품과 격",
    description:
      "전통과 질서 속에서 삶과 고유한 미학을 빚어낸 조선시대부터 자유와 다양성 속에서 새로운 문화와 정체성을 만들어가는 대한민국까지, 다함이 없는 전시의 브랜딩 프로젝트입니다. 메인 오브젝트를 중심으로 과거와 현대의 대비와 조화를 표현하였습니다.",
    designerSlugs: ["seungjin-lee"],
  },
  {
    slug: "communication-41",
    field: "communication",
    title: "Trader Joe's 한국 론칭 리브랜딩",
    subtitle: "장보는 즐거움!",
    description:
      "어렸을 때, 우리의 놀이터는 마트였습니다. 천장 끝까지 닿아있는 진열대에 놓인 물건들이 어린 우리에겐 새로운 세상이었습니다. 트레이더조스는 우리에게 놀이터와도 같은 즐거운 장보기를 선사합니다. 이곳에서 장을 보는 모든 사람들이 다시 어린 아이로 돌아가 놀이터를 누비듯, 물건을 사는 것 이상의 그 즐거움을 찾았으면 합니다.",
    designerSlugs: ["yein-lee"],
  },
  {
    slug: "communication-42",
    field: "communication",
    title: "이예찬",
    description: "",
    designerSlugs: ["yechan-lee"],
  },
  {
    slug: "communication-43",
    field: "communication",
    cardTitle: "초로담: 부모님의 삶을 기록하는 디자인 에이전시",
    title: "초로담",
    subtitle: "Archive · Biography · Memoir",
    description:
      "초로담은 시간이 지나도 사라지지 않는 가족의 기억 아카이브를 제공하는 디자인 에이전시입니다. 단순한 선물이 아닌 부모의 삶을 기록하고 보존하는 새로운 문화를 만듭니다.",
    designerSlugs: ["eunhye-lee"],
  },
  {
    slug: "communication-44",
    field: "communication",
    title: "YEOUN(여운)",
    subtitle: "향은 감정을 잇고 연결은 여운으로 남는다",
    description:
      "YEOUN(여운)은 사라진 뒤에도 남는 감각, 여운을 향으로 만드는 향수 브랜드입니다. 순간의 향이 아닌, 향이 지나간 자리에 남는 감정의 흔적에 집중합니다.\n이번 컬렉션은 한국인의 정서를 기반으로 합니다. 한 · 정 · 흥, 세 가지 정서를 각각 하나의 향으로 풀어낸 세 가지 향수로 구성됩니다. 이 정서들은 한국 문화 안에서 따로 존재하지 않고 서로 스며들며 이어집니다.",
    designerSlugs: ["junhui-lee"],
  },
  {
    slug: "communication-45",
    field: "communication",
    cardTitle: "hint finder: 자연 속 힌트의 발견",
    title: "자연 속 힌트의 발견",
    subtitle: "Open in Finder",
    description:
      "hint finder는 자연에서 발견한 형태와 색, 질감을 새로운 시각으로 해석하고, 다양한 소재와 표현 방식을 통해 낯설고 감각적인 일상의 오브제로 재구성하는 리빙 브랜드입니다.",
    designerSlugs: ["jisu-lee"],
  },
  {
    slug: "communication-46",
    field: "communication",
    cardTitle: "SEASONAL PIECES : 당신의 감각을 채우는 계절 한 조각",
    title: "SEASONAL PIECES 27",
    subtitle: "29CM, Accessory Curation",
    description:
      "계절 전체를 소유할 수는 없지만, 작은 조각 하나로 그 계절의 분위기를 몸에 남길 수 있습니다.\n반지 하나, 목걸이 하나는 작지만 그 계절의 빛과 온도, 색과 질감을 담아내는 가장 섬세한 매개체가 됩니다.\n\nSeasonal Pieces는 계절의 감각을 닮은 액세서리를 선별해당신에게 한 조각의 계절을 건네는 29CM의 액세서리 큐레이션입니다.",
    designerSlugs: ["jina-lee"],
  },
  {
    slug: "communication-47",
    field: "communication",
    cardTitle: "곶(The goj) : 상주 곶감 브랜딩",
    title: "곶(The goj)",
    subtitle: "곶, 한국의 전통이 깃든 상주의 결실",
    description:
      "‘곶’은 바다를 향해 뻗은 육지를 뜻하는 말이자, 옛말로 꽃을 의미하기도 합니다.\n\n곶감 브랜드 ‘곶’은 우리말과 한국의 자연에 깃든 의미에서 출발합니다. 땅에 뿌리를 내리고 계절을 지나 꽃을 피우듯, 상주의 땅에서 자란 감은 자연의 바람과 시간, 사람의 정성을 거쳐 곶감이라는 결실로 완성됩니다.\n‘곶’은 이러한 결실에 담긴 의미를 이어받아, 한국의 땅과 언어, 전통에 뿌리를 두고 곶감의 가치와 우리 자연이 선사하는 깊은 아름다움을 전합니다.",
    designerSlugs: ["haram-lee"],
  },
  {
    slug: "communication-48",
    field: "communication",
    cardTitle: "POHANG PACER",
    title: "POHANG PACER : THE STEELWAVE BASECAMP",
    subtitle: "PACER in POHANG",
    description:
      "PACER는 러닝을 매개로 전국의 로컬 도시와 사람들의 페이스를 기록하고 연결하는 노마드 라이프스타일 브랜드입니다. 우리는 달리는 순간을 넘어, 도시를 살아가는 방식과 러닝 이후의 문화를 어패럴·콘텐츠·커뮤니티로 확장합니다. PACER의 두번째 챕터는 포항입니다. 파도처럼 거칠고, 쇳물처럼 뜨거운 도시, 동해의 파도와 철강의 열기, 그 사이에서 자신만의 문화를 만들어가는 사람들. 포항페이서는 이 도시를 관광지나 산업 도시라는 틀에 가두지 않고, 그 안에 살아 숨 쉬는 사람들의 리듬과 에너지를 기록합니다.",
    designerSlugs: ["hanbin-lee"],
  },
  {
    slug: "communication-49",
    field: "communication",
    cardTitle: "MMCA : 안톤그라고비치 - 무결한 와해",
    title: "무결한 와해",
    subtitle: "동유럽 현대작가 한국 개인전",
    description:
      "《무결한 와해》는 발전을 무조건적으로 긍정하거나 부정하는 대신, 멈출 수 없는 변화 속에서 인간이 무엇을 선택하고 어떠한 의미를 만들어갈 수 있는지 사유하도록 제안합니다. 본 프로젝트는 이러한 질문을 단순한 작품 감상에 그치지 않고, 온라인 전시를 통해 데이터로 전환된 안톤과 대화하며 이해와 대면, 성찰로 이어지는 하나의 전시 경험으로 확장합니다.",
    designerSlugs: ["haebin-lee"],
  },
  {
    slug: "communication-50",
    field: "communication",
    cardTitle: "한상 (HANSANG)",
    title: "한상 — 계절을 담은 한 상의 이야기",
    subtitle: "ONE TABLE, COUNTLESS STORIES.",
    description:
      "한상(HANSANG)은 한국의 사계절과 자연의 풍요로움을 담아 전통 한상차림을 현대적으로 재해석한 프리미엄 한정식 브랜드입니다. 계절마다 달라지는 신선한 식재료와 한국 고유의 상차림 문화를 바탕으로, 전통 민화의 조형미와 다채로운 색채를 활용해 브랜드 아이덴티티를 구축했습니다. 이를 패키지, 식기, 인쇄물, 디지털 디자인 등 다양한 매체에 적용하여 한식이 지닌 정성과 아름다움을 표현했습니다.",
    designerSlugs: ["hyewon-lee"],
  },
  {
    slug: "communication-51",
    field: "communication",
    title: "U.O : Unidentified office-mate",
    subtitle: "직장인을 위한 애착인형",
    description:
      "U.O(Unidentified Office-mate)는 직장인의 심신안정을 위한 애착인형 브랜드입니다. U.O는 직장인의 심신안정을 위해 존재하는 비밀 부서로, 바쁜 직장인의 책상 위로 인형 요원을 몰래 파견한다는 세계관을 담은 브랜드입니다.\n인형과 다양한 굿즈를 통해, 반복되는 업무 속에서도 잠시 쉬어갈 수 있는 소소한 즐거움을 제안합니다.",
    designerSlugs: ["jiin-lim"],
  },
  {
    slug: "communication-52",
    field: "communication",
    cardTitle: "Sweet excuse",
    title: "달콤할 구실",
    subtitle: "무비랜드 발렌타인데이 특별 상영전",
    description:
      "‘Sweet Excuse’는 좋아하는 사람에게 선뜻 마음을 전하지 못하는 이들을 위한 무비랜드의 발렌타인데이 특별 상영전 프로젝트입니다. 차마 고백할 용기는 없어도, 영화를 핑계로 서로의 마음을 확인할 수 있는 ‘달콤할 구실’을 만들고자 했습니다. 좋아하는 마음 앞에서 찌질해지고 서툴러지는 인물들의 이야기를 담은 두 편의 영화를 선정하고, 이를 바탕으로 포스터와 패키지, 웹사이트를 디자인했습니다.",
    designerSlugs: ["minhui-jang"],
  },
  {
    slug: "communication-53",
    field: "communication",
    title: "2027 뛰멍쉬멍 in 포항",
    subtitle: "댕댕이랑 마라톤하고 바다 앞 캠프닉도 하는 뛰멍쉬멍 in 포항",
    description:
      "뛰멍쉬멍 in 포항은 반려견과 보호자가 함께 달리고 쉬며 특별한 하루를 보내는 러닝·캠프닉 페스티벌입니다. 포항의 영일대와 환호공원을 배경으로, 반려견과 함께 각자의 속도로 달리는 즐거움과 자연 속에서 쉬어가는 여유를 선사합니다. 달리기부터 캠프닉까지 이어지는 다채로운 프로그램을 통해 반려견과 보호자가 함께 소중한 추억을 만들어가는 시간을 제안합니다.",
    designerSlugs: ["huiwon-jang"],
  },
  {
    slug: "communication-54",
    field: "communication",
    cardTitle: "흐르는 결, 머무는 향: Memo Paris Korea Collection",
    title: "흐르는 결, 머무는 향",
    subtitle: "Traces Archive - Korea Collection",
    description:
      "‘흐르는 결, 머무는 향’은 여행지의 기억을 향으로 기록하는 Memo Paris의 세계관에서 출발한 가상의 챕터, ‘Traces Archive’의 첫 번째 컬렉션입니다.\n한국의 다섯 지역이 지닌 고유한 풍경과 분위기를 다섯 가지 향으로 풀어내고, 한국 특유의 따뜻한 정서를 일러스트에 담았습니다. 풍경에 깃든 이야기와 여행의 여운을 따라, 스쳐 지나간 순간이 향으로 오래도록 머무는 경험을 만나보세요.",
    designerSlugs: ["seohyeon-jeon"],
  },
  {
    slug: "communication-55",
    field: "communication",
    cardTitle: "100세 상담원 : 한국 근현대 단편소설 팟캐스트",
    title: "100세 상담원",
    subtitle: "A Podcast based on Stories from a Century ago",
    description:
      "〈100세 상담원〉은 한국 근현대 단편소설 속 인물들의 이야기를 전화 상담원이 들려주는 형식으로 풀어낸 문학 팟캐스트 프로젝트입니다. 전수화기를 들면, 백 년의 시간을 건너온 이야기가 시작됩니다. 낯설게 느껴졌던 옛 문학을 누군가의 사연처럼 친근하게 만나고, 그들의 삶을 통해 오늘의 우리를 다시 들여다봅니다.",
    designerSlugs: ["jueun-jung"],
  },
  {
    slug: "communication-56",
    field: "communication",
    cardTitle: "DAY OFF CLUB: EASY SUMMER DAYS",
    title: "DAY OFF CLUB",
    subtitle: "크록스 여름 라이프스타일 팝업",
    description:
      "좋은 휴일에 특별한 계획이 필요한 것은 아닙니다.  편안한 신발로 나서는 산책, 자전거 타기, 바닷가 거닐기, 여유로운 피크닉처럼 작은 외출로 하루는 새로워집니다. DAY OFF CLUB은 크록스의 편안함과 개성을 담아, 밖에서 즐기는 여름 휴일을 위한 팝업스토어입니다. 기분에 맞는 코스와 나만의 지비츠, 외출 아이템으로 가볍게 나서며 각자의 휴일을 완성합니다.",
    designerSlugs: ["seohyeon-cho"],
  },
  {
    slug: "communication-57",
    field: "communication",
    cardTitle: "야금야금 : 현대적으로 재해석한 한과 브랜드",
    title: "야금야금",
    subtitle: "전통을 새롭게, 맛있게",
    description:
      "야금야금'은 한국의 전통 과자인 약과를 현대적인 감각으로 재해석한 디저트 브랜드입니다. 전통의 익숙한 달콤함을 유지하면서 새로운 맛과 색을 더해 오늘날의 취향에 맞게 선보입니다.",
    designerSlugs: ["seoeun-chae"],
  },
  {
    slug: "communication-58",
    field: "communication",
    cardTitle: "TEUMTEUM: 북클럽 틈틈",
    title: "북클럽 틈틈",
    subtitle: "「오, 달콤한 인생이여!」",
    description:
      "삶은 여러가지 맛을 가지고 있습니다.  기쁨과 상실, 오해와 다정함처럼 서로 다른 순간들이 겹쳐  하나의 삶을 만듭니다. 북클럽 틈틈은 매년 하나의 주제를  중심으로 책을 큐레이션하며, 2027년에는 열두 권의 책을 통해 삶의 다양한 맛을 들여다봅니다. 각 책은 케이크의  한 조각이자 삶의 한 장면이 되어, 책과 책 사이의 ‘틈’에서  새로운 이야기와 시선을 이어갑니다.",
    designerSlugs: ["yunha-choi"],
  },
  {
    slug: "communication-59",
    field: "communication",
    cardTitle: "HWAN: 한국 전통 하이엔드 브랜드",
    title: "HWAN",
    subtitle: "HWAN",
    description:
      "HWAN은 조각보와 퀼트의 장인 기법으로 제품을 만드는 한국의 하이엔드 브랜드입니다. 조각보는 옷을 짓고 남은 천 조각을 이어 만든 한국의 전통 보자기로, 사각형과 삼각형, 면과 선만으로 완성되는 구성이 예술이 되는 한국 전통 작품입니다. HWAN은 조각보의 미학을 브랜드의 언어로 옮기기 위해 현대적인 서구의 디자인 스타일 데 스테일의 방법을 빌려, 면분할과 기본 도형만 가지고 한국적인 디자인으로 재구성한 브랜드입니다.",
    designerSlugs: ["jueun-choi"],
  },
  {
    slug: "communication-60",
    field: "communication",
    cardTitle: "Bonyun(본연): Grounding in the Present",
    title: "Grounding in the Present",
    subtitle: "Bonyun(본연), 감각 리추얼 커뮤니티",
    description:
      "Grounding in the Present'는 학교폭력 트라우마를 겪은 청년들을 위해 이솝의 철학을 바탕으로 기획된 감각 리추얼 커뮤니티이다. 과거의 상흔에 휩쓸리지 않고 다시 현재에 머무를 수 있도록 섬세한 리추얼을 통해 흩어진 일상의 감각을 '지금, 여기'로 뿌리내리게 한다. 이 여정을 함께하는 이들이 외부의 소음에서 벗어나 가장 온전한 스스로의 모습인 본연으로 서서히 회복해 가도록 돕는다.",
    designerSlugs: ["jihyeon-ham"],
  },
  {
    slug: "communication-61",
    field: "communication",
    title: "기억의 발효: 남겨진 것들",
    subtitle: "도시의 기억을 재해석하는 전시 브랜딩",
    description:
      "〈기억의 발효: 남겨진 것들〉은 빠르게 변화하는 도시에서 사라지는 장소와 기억에 주목한 전시 브랜딩 프로젝트입니다. 분당 구미동 하수처리장에 남겨진 시간과 흔적을 바탕으로, 기억이 축적되고 새로운 해석을 만나 변화하는 과정을 ‘발효’의 개념으로 바라봅니다. 쓰임을 다한 장소에 어떤 기억이 남아 있는지 살피고, 그 기억의 층위가 현재와 만나 만들어낼 새로운 의미와 가능성을 탐구합니다.",
    designerSlugs: ["gyusang-hwang"],
  },
  {
    slug: "communication-62",
    field: "communication",
    cardTitle: "생각이 머무는 곳, 공중지대",
    title: "공중지대",
    subtitle: "생각이 머무는 상담카페",
    description:
      "우리는 사유가 가진 힘을 믿습니다. 그 어느 때보다 자신을 이해하고 싶어 하는 시대이지만, 정작 자신의 생각과 감정을 편히 꺼내고 들여다볼 기회는 많지 않습니다. 공중지대는 일상과 상담 사이, 어디에도 완전히 속하지 않은 채 오롯이 자신에게 집중할 수 있는 공간입니다. 차 한 잔과 함께 이야기를 나누고, 흩어진 생각을 정리하며, 미처 알지 못했던 자신을 발견하는 곳입니다. 상담의 부담은 덜고 대화의 가치를 더해, 스스로를 알아가는 시간이 일상의 자연스러운 문화가 되기를 바랍니다.",
    designerSlugs: ["hyeonsu-hwang"],
  },
  {
    slug: "communication-02",
    field: "communication",
    title: "포항스틸아트페스티벌 굿즈 디자인",
    subtitle: "열기, 파도 그리고 철",
    description:
      "철을 빛과 형태에 따라 변화하는 감각적 매체로 재해석하여 견고한 철과 역동적인 파도의 상반된 특성을 하나의 그래픽 모티프로 결합하고, 이를 다양한 접점으로 확장하였습니다. 소장하고 공유하며 직접 경험할 수 있는 디자인을 통해 포항의 지역성과 철의 이미지를 친근하고 현대적으로 전달하고자 합니다. 철과 바다, 산업과 예술이 만나는 이 프로젝트가 포항의 새로운 매력을 발견하는 계기가 되기를 기대합니다.",
    teamName: "유니콘",
    designerSlugs: ["min-kim", "huiwon-kim", "seohyeon-jeon", "jueun-choi"],
  },
  {
    slug: "communication-03",
    field: "communication",
    cardTitle: "울릉올림: 울릉이 당신에게 전하는 진심어린 편지",
    title: "울릉올림",
    subtitle: "울릉이 당신에게 전하는 진심어린 편지",
    description:
      "울릉도의 학생들이 주도하는 울릉 민심회복 캠페인, 울릉올림입니다. 울릉에서 보낸 엽서에 울릉에서 경험한 감정을 적어 보내주세요. 추첨을 통해 울릉 학생기자단 인스타그램에 게재 및 ESG 울릉올림 상품이 증정됩니다.",
    teamName: "쩜오",
    designerSlugs: ["sieun-kim", "chanmi-park", "jiu-park", "yechan-lee"],
  },
  {
    slug: "communication-04",
    field: "communication",
    title: "영덕 자연이 키운 참두릅, 산채드림",
    subtitle: "영덕 참두릅 브랜딩",
    description:
      "산채드림은 영덕의 자연에서 자란 참두릅을 생산자의 오랜 경험과 엄선된 기준으로 전하는 로컬 농산물 브랜드입니다.\n20년 이상 참두릅을 직접 재배하고 품종을 개발해 온 생산자의 전문성을 바탕으로, 믿고 선택할 수 있는 참두릅의 품질과 가치를 브랜드의 핵심에 담았습니다. 이를 통해 소비자에게 산채드림만의 차별화된 품질과 가치 및 신뢰를 전달하고자 합니다.",
    teamName: "이응부자",
    designerSlugs: ["sieun-kim-2", "yuna-kim", "hyewon-lee", "goeun-yoon"],
  },
  {
    slug: "communication-05",
    field: "communication",
    cardTitle: "포항시립미술관 스틸아트 뮤지엄굿즈 디자인",
    title: "POMA GOODS",
    subtitle: "포항시립미술관 스틸아트 뮤지엄굿즈 디자인",
    description:
      "철은 시간과 환경에 따라 표면과 형태가 변하지만, 그 안의 단단한 본질은 쉽게 사라지지 않습니다. ‘POMA GOODS’는 이러한 철의 특성을 포항시립미술관의 스틸아트 정체성과 연결해, 일상 속 오브제로 확장한 굿즈 디자인 프로젝트입니다. 변화 속에서도 유지되는 철의 견고함과 조형미를 다양한 굿즈에 담아, 미술관에서의 예술적 경험이 일상에서도 자연스럽게 이어지도록 제안합니다.",
    teamName: "온감",
    designerSlugs: ["jimin-kim-2", "jihyeon-ham", "huiwon-jang", "juhyeon-park"],
  },
  {
    slug: "communication-06",
    field: "communication",
    title: "울릉 수채화마을 브랜딩",
    subtitle: "울릉 수채화마을 브랜딩",
    description:
      "풍경이 스며, 마음이 물드는 마을\n\n울릉 수채화마을은 울릉도의 산과 바다, 몽돌과 마을 풍경을 수채화의 감성으로 재해석한 지역 브랜딩 프로젝트입니다.울릉의 풍경은 한 장면으로 머무르지 않습니다. 산을 지나 바다를 만나고, 몽돌을 따라 걷다 보면 마을의 색과 빛이 겹겹이 쌓이며 동화같은 풍경이 완성됩니다.울릉도의 서로 다른 풍경을 하나의 장면처럼 연결하고, 투명하게 겹쳐지는 색과 레이어를 통해 자연이 천천히 번지고 스며드는 모습을 표현했습니다. 방문자가 마을을 걸으며 각자의 시선으로 풍경을 발견하고, 그 경험이 오래 마음에 머물 수 있도록 ‘풍경이 스며, 마음이 물드는 마을’을 제안합니다.",
    teamName: "디와와",
    designerSlugs: ["seou-park", "hyeonsu-hwang", "seoeun-chae", "jisu-lee"],
  },
  {
    slug: "communication-07",
    field: "communication",
    cardTitle: "포항 국제불빛축제 홍보물 디자인",
    title: "Beyond Light, beyond Pohang",
    subtitle: "포항 국제불빛축제 홍보물 디자인",
    description:
      "포항에서 열리는 포항국제불빛축제의 포스터 및 굿즈를 디자인하였습니다. 포항의 산업적 에너지가 하늘로 솟아올라 화려한 불꽃으로 피어나는 모습을 시각화하였습니다. 불꽃과 빛을 통해 포항의 산업적 정체성과 축제의 역동적인 분위기를 표현하였습니다.",
    teamName: "디어",
    designerSlugs: ["yein-ahn", "yewon-bang", "junhui-lee", "seohan-park", "sihyeon-park"],
  },
  {
    slug: "communication-08",
    field: "communication",
    title: "HIM: 저동초등학교 울릉독도 HIM 브랜딩",
    subtitle: "Health, Interaction, Marine",
    description:
      "울릉도 저동초등학교의 특색 교육 프로그램인 HIM(Health X Interaction X Marine)의 아이덴티티를 리브랜딩하였습니다. 아이들의 교육과 성장과정을 '항해'에 대입하여 '종이배'를 모티프로 한 디자인 프로젝트입니다.",
    teamName: "ALLDP",
    designerSlugs: ["juhui-song", "gyusang-hwang", "seungjin-lee", "jina-lee"],
  },
  {
    slug: "communication-09",
    field: "communication",
    title: "영덕 복숭아 장터",
    description: "",
    teamName: "딛",
    designerSlugs: ["gang-kim", "hyeonjin-kim", "eunhye-lee", "jiin-lim"],
  },
  {
    slug: "communication-10",
    field: "communication",
    cardTitle: "다시 오고 싶은 울릉도 캠페인: 또올랭",
    title: "또올랭",
    subtitle: "다시 오고 싶은 울릉도",
    description:
      "울릉도의 따뜻한 가치와 진정성을 담은 가게들을 발굴하고, 이를 인증하는 엠블럼을 부여하는 지역 상생 프로젝트\n\n단순히 유명한 관광지를 소개하는 것을 넘어, 울릉도만의 정직한 서비스와 지역을 향한 애정을 실천하는 가게들을 선정하여 방문객들에게 더욱 신뢰할 수 있는 여행 경험을 제공합니다.",
    teamName: "섭이스",
    designerSlugs: ["jimin-kim", "minhui-jang", "hanbin-lee", "huiwon-oh"],
  },
  {
    slug: "communication-11",
    field: "communication",
    cardTitle: "솔잎 향을 머금다 : 영덕송이",
    title: "영덕송이",
    subtitle: "영덕송이 프리미엄 브랜딩",
    description:
      "본 작품은 영덕의 깊은 산속에서 소나무와 함께 자라나는 송이의 고유한 가치를 담은 프리미엄 브랜딩 프로젝트입니다. 영덕의 자연환경이 빚어낸 송이의 특별함을 ‘솔잎 향’이라는 감각적 언어로 풀어내고, 산과 소나무의 분위기가 제품을 마주하는 순간부터 맛보는 경험까지 이어지도록 기획했습니다. 익숙한 지역 특산물의 이미지를 넘어, 영덕송이만의 자연과 이야기를 담은 브랜드 아이덴티티를 제안합니다.",
    teamName: "SUPLY",
    designerSlugs: ["jaehyeon-ko", "yehui-kim", "hayeon-song", "saehui-lee"],
  },
  {
    slug: "communication-12",
    field: "communication",
    cardTitle: "포항스틸아트페스티벌 아트투어 브랜딩: 스틸샷",
    title: "STEELSHOT",
    subtitle: "Capture the moment, Feel the art",
    description:
      "Steelshot은 포항의 철과 예술, 도시의 풍경을 ‘사진을 찍는 행위’로 연결합니다. 익숙했던 도시를 새로운 시선으로 발견하고, 각자가 포착한 장면들이 모여 또 다른 포항의 모습을 만들어가는 것.이를 통해 스틸아트를 매개로 도시를 걷고, 발견하고, 촬영하고, 간직하는 새로운 아트투어 경험을 제안합니다.",
    teamName: "케샤!",
    designerSlugs: ["jueun-jung", "haebin-lee", "yunha-choi", "yein-lee"],
  },
  {
    slug: "communication-13",
    field: "communication",
    title: "포항 중앙아트홀 경관디자인",
    subtitle: "다양한 시선이 모이는 곳",
    description:
      "포항 육거리 구도심의 중앙아트홀은 오랫동안 시민의 일상  가까이에서 문화를 전해 온 장소지만, 지금은 시선이 스쳐  지나는 곳이 되었습니다. 이번 제안은 파사드와 가로시설물을 하나의 풍경으로 엮어, 오가는 사람들의 다양한 시선이  다시 이곳에 모이고 머무는 거리를 그립니다.",
    teamName: "오감자",
    designerSlugs: ["usang-song", "seohyeon-cho", "dagyeong-lee", "haram-lee", "yerim-park"],
  },
  // ───── Service Design ─────
  {
    slug: "service-01",
    field: "service",
    cardTitle: "바로봄: 요양병원 간호・간병 돌봄 공유 서비스",
    title: "바로봄",
    subtitle: "요양병원 간호・간병 돌봄 공유 서비스",
    description:
      "바로봄은 환자의 최신 상태 정보와 돌봄 지시 및 수행 여부를 어디서든 실시간으로 바로 봄(확인함)으로, 필요한 돌봄으로 바로 이어질 수 있도록 돕는다는 의미를 담은 서비스이다.\n간호사와 간병사가 앱을 통해 같은 정보를 함께 확인함으로써 반복 확인과 불필요한 이동을 줄이고, 지시와 재확인 과정에서 발생하던 관계적 부담을 완화하며, 서로 협업하는 돌봄 관계가 더 원활하게 이어지도록 돕는다.",
    teamName: "유니콘",
    designerSlugs: ["min-kim", "huiwon-kim", "seohyeon-jeon", "jueun-choi"],
  },
  {
    slug: "service-02",
    field: "service",
    cardTitle: "룰루(RULE:U): 시설보호아동의 인성개발을 위한 자율성 증진 서비스",
    title: "룰루(RULE:U)",
    subtitle: "시설보호아동의 인성개발을 위한 자율성 증진 서비스",
    description:
      "과도한 통제, 자율성을 발휘할 경험의 부족, 낮은 추론 능력, 어릴적부터 익숙해진 위계질서로 인해 인성교육을 통해 배운 것을 내면화하여 실행하지 못하는 시설보호아동을 위한 자율성 증진 서비스, 룰루(RULE:U)입니다.",
    teamName: "쩜오",
    designerSlugs: ["sieun-kim", "chanmi-park", "jiu-park", "yechan-lee"],
  },
  {
    slug: "service-03",
    field: "service",
    cardTitle: "안심ON: 요양병원 돌봄 확신 및 의료진 업무 부담 완화 서비스",
    title: "안심ON",
    subtitle: "요양병원 돌봄 확신 및 의료진 업무 부담 완화",
    description:
      "안심ON은 요양병원 보호자의 돌봄 불안과 의료진의 소통 부담을 줄이기 위한 서비스입니다. 환자의 일상과 돌봄 과정을 기록하고 공유하여 보호자가 보이지 않는 시간에도 돌봄이 이어지고 있음을 확인할 수 있도록 돕습니다. 또한 보호자의 문의를 체계적으로 관리해 반복적인 확인과 설명 업무를 줄이고, 보호자와 의료진이 함께 안심할 수 있는 돌봄 환경을 만들어갑니다.",
    teamName: "이응부자",
    designerSlugs: ["sieun-kim-2", "yuna-kim", "hyewon-lee", "goeun-yoon"],
  },
  {
    slug: "service-04",
    field: "service",
    cardTitle: "sálvate: 미등록 라티노 이주민을 위한 초밀착 도움 연결 서비스",
    title: "sálvate",
    subtitle: "미등록 라티노 이주민을 위한 도움 연결 서비스",
    description:
      "sálvate[쌀바떼]는 미국의 강화된 이민 정책 속에서 신분 노출의 두려움으로 고립된 미등록 라티노 이주민을 위한 도움 연결 서비스입니다. 검증된 지인의 초대로 형성된 안전한 네트워크를 통해 심리적 장벽을 낮추고, 체류 신분 노출에 대한 걱정 없이 필요한 자원을 주고받을 수 있도록 돕습니다.",
    teamName: "온감",
    designerSlugs: ["jimin-kim-2", "jihyeon-ham", "huiwon-jang", "juhyeon-park"],
  },
  {
    slug: "service-05",
    field: "service",
    cardTitle: "tutú: 라티노 청소년의 학업 공백 복구를 돕는 서비스",
    title: "tutú",
    subtitle: "라티노 청소년의 학업 공백 복구를 돕는 서비스",
    description:
      "tutú[투투]는 미국의 이민 단속 강화로 인한 예측 불가능한 결석으로 학업 공백을 겪는 라티노 이민자 청소년을 위한 학습 회복 서비스입니다. 실제 수업 내용을 최소 단위의 핵심 개념으로 압축하여, 각 과목에 맞는 강의 형태로 제공합니다. 이를 통해 불안정한 상황과 제약 속에서도 놓친 학습을 효율적으로 회복하여, 학업에 복귀할 수 있도록 돕습니다.",
    teamName: "디와와",
    designerSlugs: ["seou-park", "hyeonsu-hwang", "seoeun-chae", "jisu-lee"],
  },
  {
    slug: "service-06",
    field: "service",
    cardTitle: "옆자리: 자립준비청년의 안정적인 사회 정착을 위한 자립 동료 연결 서비스",
    title: "옆자리, 내 옆자리 모임",
    subtitle: "자립준비청년의 안정적 정착을 위한 서비스",
    description:
      "보호시설을 떠나 홀로서기를 시작하는 자립준비청년들의 어려움을 분석하고, 안정적인 정착을 위한 자립 동료 연결 플랫폼을 기획하였습니다. 작은 불빛으로 서로의 존재를 느끼고, 동료와 경험을 나누며 자립 과정의 어려움을 함께 해결할 수 있도록 설계하였습니다. 이를 통해 낯선 도전에 대한 두려움을 줄이고, 자립의 첫걸음을 내딛도록 돕습니다.",
    teamName: "디어",
    designerSlugs: ["yein-ahn", "yewon-bang", "junhui-lee", "seohan-park", "sihyeon-park"],
  },
  {
    slug: "service-07",
    field: "service",
    cardTitle: "루틴: 아이 하교 후, 일정 관리 AI 에이전트 서비스",
    title: "루틴",
    subtitle: "아이 하교 후, 일정 관리 AI 에이전트 서비스",
    description:
      "초등학생의 하교 시간과 맞벌이 부모의 퇴근 시간 사이에는 아이의 돌봄 공백이 발생합니다. 이 시간 동안 아이는 스스로 일정을 수행하는 데 어려움을 겪고, 부모는 업무 중에 아이의 상황을 반복해서 확인해야 하는 부담이 있습니다. 루틴은 아이가 스스로 일정을 이어가도록 돕고, 부모는 도움이 필요한 순간에 대응할 수 있도록 하는 AI 에이전트 서비스입니다.",
    teamName: "ALLDP",
    designerSlugs: ["juhui-song", "gyusang-hwang", "seungjin-lee", "jina-lee"],
  },
  {
    slug: "service-08",
    field: "service",
    cardTitle: "헤매지 말고 주차각",
    title: "주차각",
    subtitle: "만차에도 곧 날 자리를 알려주는 AI 주차 안내 서비스",
    description:
      "AI가 차량별 주차 기록을 분석해 만차일 때도 언제 어디서 자리가 날지 예측하는 네이버 지도 인앱 서비스입니다.",
    teamName: "딛",
    designerSlugs: ["gang-kim", "hyeonjin-kim", "eunhye-lee", "jiin-lim"],
  },
  {
    slug: "service-09",
    field: "service",
    title: "씨,니어",
    subtitle: "은퇴자의 수평적 소통 경험을 위한 보드게임 서비스",
    description:
      "은퇴는 직장을 떠나는 것을 넘어, 그동안 익숙했던 사회적 관계가 변화하는 시기입니다. 특히 수직적 관계에 익숙한 은퇴자는 수평적 관계를 중심으로 형성되는 새로운 커뮤니티에 적응하는 데 어려움을 겪을 수 있습니다. '씨,니어'는 이러한 어려움에 주목한 은퇴자를 위한 보드게임 서비스입니다.",
    teamName: "섭이스",
    designerSlugs: ["jimin-kim", "minhui-jang", "hanbin-lee", "huiwon-oh"],
  },
  {
    slug: "service-10",
    field: "service",
    cardTitle: "바로매니저: AI 중간관리자 서비스",
    title: "바로매니저",
    subtitle: "고용주의 업무교육 부담완화를 위한 AI 중간관리자 서비스",
    description:
      "운영 효율을 위해 근무시간을 쪼개 여러 근무자를 고용한 고용주는, 잦은 근무자 교체로 업무 교육에 부담을 느낍니다. 하지만 24시간 매장에 상주하며 근무자의 질문에 답하고, 다음 업무를 지시하며, 모든 일을 고용주에게 보고하는 AI 매니저가 있다면 어떨까요? 바로 매니저는 매니저를 고용하지 못하는 매장에서 고용주를 보조하고 매장의 자립화에 기여하며, 근무자와 고용주 모두의 만족하는 서비스를 제공합니다.",
    teamName: "SUPLY",
    designerSlugs: ["jaehyeon-ko", "yehui-kim", "hayeon-song", "saehui-lee"],
  },
  {
    slug: "service-11",
    field: "service",
    cardTitle: "이음: 로컬 웨딩 서비스",
    title: "이음",
    subtitle: "지역의 인프라를 활용한 로컬 웨딩 서비스",
    description:
      "정해진 선택지 속에서 점점 비슷해지는 현대의 결혼식.\n‘이음’은 지역의 공간과 자원을 새롭게 연결하여, 예비부부가 원하는 결혼식을 자유롭게 만들어갈 수 있도록 돕는로컬 웨딩 조합 서비스입니다.\n\n동네의 숨은 맛집이 결혼식의 식사가 되고, 바다가 보이는 공간이 우리만의 예식장이 되는 경험.\n\n정해진 형식에서 벗어나, 취향에 맞는 공간과 서비스를 직접 발견하고 조합해 보세요.\n\n발견을 잇다, 우리다움을 짓다. 이음.",
    teamName: "케샤!",
    designerSlugs: ["jueun-jung", "haebin-lee", "yunha-choi", "yein-lee"],
  },
  {
    slug: "service-12",
    field: "service",
    cardTitle: "MIRI X: 2차 사고 예방 AI 기반 블랙박스 정보 공유 서비스",
    title: "MIRI X",
    subtitle: "2차 사고 예방 AI 기반 블랙박스 정보 공유 서비스",
    description:
      "고속도로에서 사고가 발생한 뒤, 뒤따르는 운전자가  이를 알기까지 ‘정보의 공백’이 생깁니다. MIRI X는 사고를  기록하던 블랙박스를 스스로 판단하는 AI 에이전트로 바꿔, 사고를 감지하는 즉시 뒤따르는 차에 위험을 알립니다.  사고 지점에 가까워질수록 음성·진동·화면으로 경고를  강화하고, 사고 운전자를 대신해 119 신고와 후속 조치를  맡아 하나의 사고가 다음 사고로 이어지지 않도록 돕습니다.",
    teamName: "오감자",
    designerSlugs: ["usang-song", "seohyeon-cho", "dagyeong-lee", "haram-lee", "yerim-park"],
  },
  // ───── AX Product ─────
  {
    slug: "industrial-01",
    field: "ax-product",
    cardTitle: "C#0: 수작업의 의미",
    title: "C#0",
    subtitle: "수작업의 의미",
    description:
      "AI와 기술이 빠르고 정교한 결과를 만들어내는 시대에도, 손으로 만드는 일에는 고유한 가치가 있습니다.\n작은 모서리를 다듬고 표면을 완성하는 반복 속에는 제작자의 판단과 시간, 그리고 손길이 남습니다.\nC#0은 그 흔적을 통해 오늘날 수작업이 지닌 의미를 다시 생각해 보고자 합니다.",
    teamName: "TETÉ",
    designerSlugs: ["sinyeong-kong"],
  },
  {
    slug: "industrial-02",
    field: "ax-product",
    cardTitle: "SOELLE: 스타일링의 새로운 곡선",
    title: "SOELLE",
    subtitle: "스타일링의 새로운 곡선",
    description:
      "SOELLE는 그래핀의 유연성과 발열 특성을 활용하여 저손상 스타일링을 제안하는 헤어 스타일링 기기입니다.\n나선형 그래핀 발열판 구조는 기존 단단한 열판의 스타일링에서 벗어나 머리카락을 감고 구부려 고정하는 새로운 형태를 구현했습니다. 두 가지 형태의 기기를 통해 일상 속에 스며든 다양한 방식의 스타일링 경험을 제안합니다.",
    teamName: "빵꾸떵꾸",
    designerSlugs: ["sojeong-kim", "juhyeon-bang"],
  },
  {
    slug: "industrial-03",
    field: "ax-product",
    cardTitle: "READYCOOK: Less Steps. Live More.",
    title: "READYCOOK",
    subtitle: "나의 취향과 일상에 맞추는 조리 경험",
    description:
      "READYCOOK은 하나의 소재로 세 가지 발열 방식을 구현하는 그래핀의 조리적 확장성을 바탕으로 탄생한 하이브리드 쿠커입니다. 두 개의 분리형 용기로 서로 다른 요리를 각자의 조건에 맞춰 동시에 조리하고, 비전 AI 기술로 음식의 상태를 인식해 최적의 조리 과정을 지원합니다. 개인의 취향과 생활 패턴에 맞춘 조리 경험을 통해 번거로운 준비 과정은 줄이고, 일상에 더 많은 여유를 선사합니다.",
    teamName: "READYCOOK",
    designerSlugs: ["yeongchae-kim", "yebin-park"],
  },
  {
    slug: "industrial-04",
    field: "ax-product",
    title: "Re:FIT",
    subtitle: "나의 몸과 일상에 맞춘 그래핀 웨어러블 패치",
    description:
      "RE:FIT은 운동 후의 회복부터 일상 속 관절 케어까지, 각자의 몸과 사용 상황에 맞는 관리를 제안하는 그래핀 웨어러블 패치입니다. 얇고 유연한 그래핀 발열층을 바탕으로 온열·피부 온도 센싱·저주파 기능을 하나의 패치에 담는 구조를 구상했습니다. 무릎·어깨·허리의 곡면을 고려한 세 가지 형태로, 운동을 즐기는 청년층과 일상적인 관절 관리가 필요한 중장년층의 사용을 함께 고려했습니다.",
    teamName: "SK한동닉스",
    designerSlugs: ["yebin-kim", "jeonghun-song"],
  },
  {
    slug: "industrial-05",
    field: "ax-product",
    cardTitle: "Tic:OFF | 틱 아이들의 매일을 조금 더 가볍고 자유롭게",
    title: "Tic:OFF",
    subtitle: "틱 아이들의 매일을 조금 더 가볍고 자유롭게",
    description:
      "틱을 경험하는 아이들이 일상 속에서 겪는 어려움을 긍정적인 경험으로 풀어내고자 기획한 프로젝트입니다. 틱에 대한 이해를 바탕으로 아이들이 부담 없이 자신의 증상을 인식하고 관리할 수 있도록 UX를 설계했습니다. 두 개의 솔루션을 통해 자신의 속도에 맞춰 틱을 관리하고 일상의 즐거움을 이어갈 수 있는 방법을 제안합니다.",
    teamName: "Tic:OFF",
    designerSlugs: ["chaeeun-kim", "seohyeon-lee"],
  },
  {
    slug: "industrial-06",
    field: "ax-product",
    cardTitle: "PACKOOK: 그래핀을 활용한 AI 모바일 쿠커",
    title: "PACKOOK",
    subtitle: "그래핀을 활용한 AI 모바일 쿠커",
    description:
      "‘PACKOOK’은 그래핀 발열 기술과 AI를 결합한 차세대 모바일 쿠커로, 휴대성과 기술적 편의성을 감각적인 디자인으로 구현하였습니다. 배터리 기반의 무선 구동 방식으로 원하는 공간에서 간편하게 조리할 수 있으며, 모듈형·접이식 구조를 통해 트레킹과 아웃도어 활동 속에서도 새로운 조리 경험을 제공합니다.",
    teamName: "Packook",
    designerSlugs: ["seyun-park", "hyeyeon-yoo"],
  },
  {
    slug: "industrial-07",
    field: "ax-product",
    cardTitle: "slodish: Slow Down, Dish Up.",
    title: "Slodish",
    subtitle: "slow down, dish up.",
    description:
      "Slodish는 기존에 볼 수 없던 투명 발열 소재라는 기술적 독창성을 차용하여, 일상에 스며드는 감각적인 디자인 오브제로 구현하였습니다. 전원선 없이 원하는 공간으로 이동해 음식과 음료의 적정 온도를 유지하고, 사용하지 않을 때는 무드 조명으로 활용할 수 있습니다.",
    teamName: "CHAYOO",
    designerSlugs: ["suyeon-cha", "haram-yoo"],
  },
  {
    slug: "industrial-08",
    field: "ax-product",
    cardTitle: "CoCare: 환자와 보호자를 연결하는 치료 연계 서비스",
    title: "CoCare",
    subtitle: "환자와 보호자를 연결하는 치료 연계 서비스",
    description:
      "CoCare는 Cogthera를 사용하는 MCI 환자의 치료 과정을 보호자가 함께 이해하고 돌볼 수 있도록 제안한 보호자용 케어 서비스입니다. 환자의 치료 현황과 변화를 한눈에 확인하고, 필요한 순간에는 응원과 참여로 이어질 수 있도록 구성했습니다. 환자 혼자 이어가던 치료 과정을 보호자와 연결해, 일상 속에서도 치료가 꾸준히 지속될 수 있도록 돕습니다.",
    teamName: "CoCare",
    designerSlugs: ["hagyeong-kim-2", "yunseo-lee", "jiwon-jang"],
  },
  {
    slug: "industrial-09",
    field: "ax-product",
    title: "NA:BOM",
    subtitle: "오롯이 나에게 맞춰지는 아름다움",
    description:
      "사용자의 감정과 컨디션을 이해하고, 일상에 맞춰 변화하는 AI·AX 기반 스마트 화장대입니다. 개인의 상태에 맞는 조명과 음악으로 분위기를 조성하고, 맞춤형 메이크업 가이드와 일상 기록 기능을 제공합니다. 단순히 나를 비추는 거울을 넘어, 나를 이해하고 돌보는 새로운 뷰티 경험을 제안합니다.",
    designerSlugs: ["sinyeong-kong"],
  },
  {
    slug: "industrial-10",
    field: "ax-product",
    cardTitle: "NUUM : 수면을 이해할수록 달라지는 아침",
    title: "NUUM",
    subtitle: "수면을 이해할수록 달라지는 아침",
    description:
      "NUUM은 하루를 마친 뒤에도 쉽게 잠들지 못하는 사람들을 위한 AX 수면 오브제입니다.\n달이 차고 기우는 모습을 따뜻하고 은은한 빛으로 담아내며, 실시간 레이더 감지를 통해 수면 상태에 따라 빛과 소리를 조절합니다. 수면 데이터 학습으로 개인화된 조절값과 환경 조성에 대한 피드백을 동반한 수면 점수를 제공하여 점진적으로 수면 패턴을 회복해 나갈 수 있는 경험을 설계했습니다.",
    designerSlugs: ["sojeong-kim"],
  },
  {
    slug: "industrial-11",
    field: "ax-product",
    cardTitle: "movi: The Future of Baby Care",
    title: "movi",
    subtitle: "움직이는 육아 공간, 여유로워지는 일상",
    description:
      "movi는 아이를 옮기는 대신, 아이의 공간이 부모를 따라 움직이는 새로운 육아 방식을 제안합니다. 아이가 머무는 안락한 공간이 부모의 일상을 따라 이동하고, movi가 직접 수면과 기저귀 상태를 스스로 살피며 필요한 순간에 부모에게 알려줍니다. 아이에게는 편안한 돌봄을, 부모에게는 일상의 여유를 더하는 새로운 형태의 AI 육아 공간입니다.",
    designerSlugs: ["yeongchae-kim"],
  },
  {
    slug: "industrial-12",
    field: "ax-product",
    cardTitle: "Pulse Grow : 식물 영양분 커스터마이징 스마트 공기청정기",
    title: "Pulse Grow",
    subtitle: "나를 읽는 숲, 나를 위한 숨.",
    description:
      "내 몸의 데이터를 읽고, 필요한 영양을 담은 식물을 길러내는 스마트 가드닝 공기청정기. Pulse Grow는 재배와 공기정화를 하나로 묶어, 일상 속에서 나를 돌보는 새로운 방식을 제안합니다.",
    designerSlugs: ["yebin-kim"],
  },
  {
    slug: "industrial-13",
    field: "ax-product",
    cardTitle: "Bleumier | Bedside AI Commerce Projector",
    title: "Bleumier",
    subtitle: "Bedside AI Commerce Projector",
    description:
      "잠들기 전에도 다음 날의 일정과 준비물을 신경 쓰며 여러 정보를 반복해서 확인하는 경험에서 출발한 프로젝트입니다. Bleumier는 여러 곳에 흩어진 정보와 선택의 번거로움을 줄이고, 내일의 준비부터 필요한 상품 탐색까지 연결하는 침실용 AI 프로젝터입니다. 사용자의 일정과 상황에 맞는 정보를 제공하고, 필요한 준비를 확인한 뒤 원하는 시점에 하루를 마무리할 수 있는 경험을 제안합니다.",
    designerSlugs: ["chaeeun-kim"],
  },
  {
    slug: "industrial-14",
    field: "ax-product",
    cardTitle: "Moobloom: 가드닝 동작으로 노인의 신체 활동을 돕는 웨어러블 서비스",
    title: "Moobloom",
    subtitle: "움직임이 건강을 피워내는 순간",
    description:
      "Moobloom은 가드닝을 닮은 움직임으로 시니어의 일상에 자연스러운 신체 활동을 더하는 홈 웨어러블 서비스입니다. 활동량이 줄어든 시니어가 운동을 하나의 과제로 느끼기보다, 익숙하고 즐거운 경험 속에서 몸을 움직일 수 있도록 기획했습니다. 씨앗을 심고, 물을 주고, 열매를 따는 가드닝 동작을 웨어러블과 TV 화면이 실시간으로 연결해 사용자의 움직임을 안내하며, 활동이 쌓일수록 화면 속 정원도 함께 변화합니다. Moobloom은 거창한 운동이 아닌 일상 속 작은 움직임에서 시작해, 몸을 움직이는 시간이 즐거운 습관으로 이어지는 경험을 제안합니다.",
    designerSlugs: ["hagyeong-kim-2"],
  },
  {
    slug: "industrial-15",
    field: "ax-product",
    cardTitle: "NUVEN: A Daily Recipe for Your Skin",
    title: "NUVEN",
    subtitle: "피부 분석부터 맞춤 처방까지, 스킨케어의 새로운 기준",
    description:
      "NUVEN은 사용자의 얼굴을 인식하고 피부 상태와 날씨, 계절 환경을 분석해 개인에게 최적화된 스킨케어 레시피를 제공하는 AI 기반 비접촉 스킨케어 솔루션입니다. 분석 결과에 따라 스킨케어 성분을 맞춤 배합하고, 비접촉 분사 기술을 통해 피부에 고르게 전달합니다. NUVEN과 함께하는 개인 맞춤형 스킨케어를 통해 사용자는 매일 변화하는 피부에 맞는 새로운 케어 경험을 만납니다.",
    designerSlugs: ["seyun-park"],
  },
  {
    slug: "industrial-16",
    field: "ax-product",
    cardTitle: "FORME: AI Make-up Coaching Mirror",
    title: "FORME",
    subtitle: "나만의 아름다움을 완성하는 메이크업 코칭 미러",
    description:
      "각자의 얼굴 특성과 취향, 숙련도에 맞춘 새로운 메이크업 경험을 제안합니다. 개인화된 AR 가이드와 스마트 트레이로 메이크업 과정의 신체적·인지적 부담을 줄이고, 자신에게 맞는 메이크업을 익히도록 돕습니다. 경험을 기록해 원하는 스타일을 자신만의 루틴으로 발전시키며, 각자가 지닌 고유한 아름다움을 더욱 돋보이게 합니다.",
    designerSlugs: ["yebin-park"],
  },
  {
    slug: "industrial-17",
    field: "ax-product",
    cardTitle: "UMGYEOL: 감각으로 건네는 초대",
    title: "UMGYEOL",
    subtitle: "감각으로 건네는 초대",
    description:
      "UM:GYEOL 은 무기력한 일상에 작은 움직임을 통해 다시 일상을 회복하게 도와주는 촉각 인터랙션 오브제입니다.\n사용자의 활동 데이터로 무기력을 감지하면, 행동유도적 호출과 함께 촉각 인터랙션을 하도록 연결합니다.\nUM:GYEOL 과 함께하는 감각 인터랙션을 통해 사용자는 자신의 속도로 일상을 다시 회복합니다.",
    designerSlugs: ["juhyeon-bang"],
  },
  {
    slug: "industrial-18",
    field: "ax-product",
    cardTitle: "Carepick : 스마트 워드로브 시스템 디자인",
    title: "Carepick",
    subtitle: "옷을 돌보고, 아침을 준비하는 새로운 경험",
    description:
      "Carepick은 한 번 입은 옷을 어떻게 관리하고, 내일은 무엇을 입을지 고민하는 일상에서 출발한 스마트 워드로브 시스템입니다. 에어케어 존과 One, 수납공간을 하나의 가구로 구성해 의류 관리와 보관, 코디 선택이 자연스럽게 이어지도록 했습니다. 부드러운 곡선과 차분한 색감은 침실 공간에 편안하게 어우러지며, 옷을 정리하는 저녁부터 하루를 준비하는  아침까지 함께합니다.",
    designerSlugs: ["jeonghun-song"],
  },
  {
    slug: "industrial-19",
    field: "ax-product",
    cardTitle: "Pawell : 반려견 스마트 샤워 케어 시스템",
    title: "Pawell",
    subtitle: "편안한 케어, 여유로운 일상",
    description:
      "PAWELL은 반려견의 상태에 맞는 목욕과 건조 환경을 제공하는 스마트 펫 케어 시스템입니다. 실시간 상태 감지와 자동 조절, 앱 기반 모니터링을 통해 반려견에게는 편안한 케어를 제공하고 보호자에게는 더 여유로운 시간을 만들어줍니다.",
    designerSlugs: ["haram-yoo"],
  },
  {
    slug: "industrial-20",
    field: "ax-product",
    cardTitle: "PÖRR: Composed, for Fluff",
    title: "PÖRR",
    subtitle: "반려견의 식사부터 건강까지, 맞춤형으로 관리하는 스마트 급식 시스템",
    description:
      "PÖRR는 식사 속도, 씹는 소리, 자세, 남긴 양을 분석해 건강 신호를 파악하고, 반려견의 상태에 맞춰 식단을 조합·배식하는 AI 스마트 급식기입니다. 보호자는 식사 데이터를 확인하고 식단을 조정할 수 있으며, 식기 높이 또한 개체별 특성에 맞춰집니다. PÖRR는 단순한 급여를 넘어, 보호자가 부재중에도 반려견의 건강을 살피는 맞춤형 케어를 제공합니다.",
    designerSlugs: ["hyeyeon-yoo"],
  },
  {
    slug: "industrial-21",
    field: "ax-product",
    cardTitle: "deepora: AX 스마트 샤워 시스템",
    title: "deepora",
    subtitle: "Moments For Your Thoughts",
    description:
      "deepora는 개인화된 샤워 경험과 환경을 통해 몸과 마음의 온전한 이완을 돕고, 일상 속에서 무심코 흘려보내기 쉬운 유레카와 같은 생각을 발견하고 기록할 수 있도록 설계한 AX 스마트 샤워부스입니다.\n이를 통해 일상적인 샤워를 단순한 씻는 행위를 넘어 하루의 생각을 정돈하고 자신에게 온전히 집중하는 시간으로 확장합니다.",
    designerSlugs: ["seohyeon-lee"],
  },
  {
    slug: "industrial-22",
    field: "ax-product",
    title: "이윤서",
    description: "",
    designerSlugs: ["yunseo-lee"],
  },
  {
    slug: "industrial-23",
    field: "ax-product",
    cardTitle: "IN:SYNC: 일상을 나누는 스마트 라디오",
    title: "IN:SYNC",
    subtitle: "일상을 나누는 스마트 라디오",
    description:
      "IN:SYNC는 가족, 연인, 친구가 각자의 일상을 살아가면서도 자연스럽게 연결될 수 있도록 돕는 라이프 쉐어링 라디오입니다. AX 기술을 통해 생활 패턴과 상황에 맞는 소통을 제안하고, 일상의 소리와 순간을 공유하며 물리적 거리를 넘어 서로의 일상에 함께하는 새로운 경험을 제공합니다.",
    designerSlugs: ["jiwon-jang"],
  },
  {
    slug: "industrial-24",
    field: "ax-product",
    cardTitle: "Node: 일상의 마디를 잇다",
    title: "Node",
    subtitle: "일상의 마디를 잇다",
    description:
      "Node는 성인 ADHD 사용자의 행동 시작과 전환을 돕는 AX 기반 라이팅 가이드 프로젝터입니다. 사용자의 움직임과 일상 속 행동 패턴을 분석하여 도움이 필요한 순간을 파악하고, 상황에 맞는 은은한 빛으로 다음 행동을 안내합니다. 대나무의 마디가 이어져 하나의 줄기를 이루듯, Node는 작은 행동과 행동 사이를 연결하여 일상의 흐름을 만들어갑니다.",
    designerSlugs: ["suyeon-cha"],
  },
  // ───── UX Product ─────
  {
    slug: "ux-01",
    field: "ux-product",
    cardTitle: "TUNE 세분화된 조작으로 최적 상태를 구현하는 통합 인터페이스",
    title: "TUNE: Fine-Tuned Optimization",
    subtitle: "AI 차량 미세조작 통합 인터페이스",
    description:
      "TUNE은 세분화된 조작 단위로 개인의 감각에 맞는 차량 환경을 조율하는 통합 조작 인터페이스입니다. AI와의 대화로 원하는 환경을 설정하고, 하나의 다이얼에서 선택한 구간을 더 작은 단위로 나누어 세밀하게 조절합니다. 말로 표현하기 어려운 섬세한 요구를 반영한 가장 최적의 차량 환경을 만들어갑니다.",
    teamName: "Forky",
    designerSlugs: ["eunjin-kim", "juhui-lee"],
  },
  {
    slug: "ux-22",
    field: "ux-product",
    cardTitle: "MOA: AI 자동차의 라이프 모더레이터",
    title: "MOA",
    subtitle: "AI 자동차의 라이프 모더레이터",
    description:
      "AI는 이제 사람처럼 대화하고, 사용자의 상황을 먼저 알아채고 제안하는 인격체로 발전하고 있습니다. 그러나 기존 AI는 주로 개인과의 상호작용에 집중되어 있어, 여러 사람이 함께하는 차 안에서의 관계까지 고려하지는 못하고 있습니다. 엇갈린 취향을 하나로 모을 수 있게 돕고, 가장 나은 선택으로 중재하며, 말하지 않아도 먼저 건네는 차 안의 다인승 라이프 모더레이터 'MOA'를 제안합니다.",
    teamName: "Young Forky",
    designerSlugs: ["damin-park", "jongbin-yoo"],
  },
  {
    slug: "ux-02",
    field: "ux-product",
    cardTitle: "Hop In: 윈도우 XR 너머로 인터랙션하는 Car SNS",
    title: "Hop in",
    subtitle: "Hop in to Connect",
    description:
      "HOPIN은 차량을 통해 나를 표현하고, 이동 중 새로운 만남과 함께하는 즐거움을 만드는 Car SNS입니다. AI와 함께 나만의 차량 스타일을 꾸미고, 취향과 상황을 바탕으로 다른 차량과의 접점을 발견합니다. 듀얼 디스플레이와 홀로그램, XR 윈도우를 통해 가볍게 반응을 주고받고, 각자의 공간에서도 콘텐츠와 여정을 함께 즐기는 새로운 이동 경험을 제안합니다.",
    teamName: "Hop",
    designerSlugs: ["juyeon-jung", "yehan-jung"],
  },
  {
    slug: "ux-23",
    field: "ux-product",
    cardTitle: "Masilo: 차에서 일상을 누리는 시니어를 위한 생활 공간",
    title: "Masilo : Close by, Further out",
    subtitle: "차에서 일상을 누리는 시니어를 위한 생활 공간",
    description:
      "자율주행으로 달라지는 차 안의 시간을 시니어의 일상을 채우는 시간으로. 마실로는 시니어가 생활에 필요한 정보와 활동을 차 안에서 이어갈 수 있는 두 번째 생활 공간을 제안합니다. Agent AI가 일정과 관심사, 주변 상황을 살펴 필요한 정보를 먼저 준비하고, 움직이는 OLED가 정보를 한눈에 파악할 수 있도록 펼쳐줍니다. 일상에 필요한 것을 확인하고 생활을 이어가기 위해 자연스럽게 다시 찾는 공간입니다.",
    teamName: "Fabulous",
    designerSlugs: ["minseo-byun", "juhyang-lee"],
  },
  {
    slug: "ux-03",
    field: "ux-product",
    cardTitle: "CONTINUUM : 일상 속 일을 대신 수행하는 Life Action Agent",
    title: "CONTINUUM",
    subtitle: "일상 속 일을 대신 수행하는 Life Action Agent",
    description:
      "CONTINUUM은 Hidden Cusp Tray를 통해 일상 속 일을 대신 수행하는 Life Action Agent 입니다.\nAI ‘CAI’가 사용자의 생활 패턴과 상황 맥락에 맞춰 필요한 일을 먼저 제안하고, 사용자의 선택에 따라 차량이 직접 실행합니다. 물품 수령부터 보관, 전달까지. 일상의 일을 대신하며 사용자가 자신의 시간에 집중하도록 돕습니다.",
    teamName: "J House",
    designerSlugs: ["suwon-choi", "yewon-han", "yeongeun-choi"],
  },
  {
    slug: "ux-05",
    field: "ux-product",
    cardTitle: "Puddy:Responsive AI Incarnation",
    title: "Puddy",
    subtitle: "Sentient한 존재감을 지닌 AI 주행 파트너",
    description:
      "Puddy는 변해가는 차량 내부 형태에 따라 사람 사이의 교감 방식을 Sentient Interaction으로 확장하고, 사용자의 제스처와 상황에 맞춰 시선과 움직임으로 호응하며 살아 있는 듯한 친밀감을 형성하는 AI 주행 파트너.",
    teamName: "푸딩그리",
    designerSlugs: ["hyeonho-lim", "sarang-kim", "daeun-park", "seongeun-jung"],
  },
  {
    slug: "ux-24",
    field: "ux-product",
    cardTitle: "CAR ESPERANTO : 도로 위 서로 다른 주체를 잇는 시각 공용어",
    title: "CAR ESPERANTO",
    subtitle: "도로 위 서로 다른 주체를 잇는 시각 공용어",
    description:
      "본 작품은 차량과 사람, 기계가 소통의 주체로 참여하는 미래를 그립니다. 우리는 도로 위 주체들이 가진 비전(Vision)을 활용한 새로운 커뮤니케이션의 가능성을 찾아, 공통의 문법으로 상태와 의도를 주고받는 시각 언어 체계를 설계했습니다. 서로의 뜻을 추측하는 데서 오는 불확실성을 줄이고, 다음 행동을 함께 조율하는 커뮤니케이션을 제안합니다.",
    teamName: "CEP",
    designerSlugs: ["chaewon-kim", "jaeeun-jung"],
  },
  {
    slug: "ux-06",
    field: "ux-product",
    cardTitle: "FRAMER : 능동형 AI 안전벨트 모듈",
    title: "FRAMER",
    subtitle: "능동형 AI 안전벨트 모듈",
    description:
      "FRAMER는 AI가 일상화된 모빌리티 환경을 배경으로, 차량 내 안전에 대한 새로운 사용자 경험을 제안하는 프로젝트입니다. 기존 3점식 안전벨트의 구조적 한계를 보완하고, 탑승자의 자세와 주행 상황에 맞춰 모듈이 능동적으로 이동하며 최적화된 맞춤형 안전을 제공합니다.",
    teamName: "FiveGuys_2",
    designerSlugs: ["noeun-ki"],
  },
  {
    slug: "ux-25",
    field: "ux-product",
    cardTitle: "MiMO : 나의 말과 행동에 움직여 호응하는 쿠션형 동반 로봇",
    title: "MiMO",
    subtitle: "말과 행동에 움직여 호응하는 쿠션형 동반 로봇",
    description:
      "MiMO는 사용자의 말과 행동에 움직임으로 호응하며, 일상 속에서 교감을 나누는 쿠션형 동반 로봇입니다. 말을 건네고, 쓰다듬고, 품에 안는 작은 행동에 반응하며 나의 행동이 상대에게 전해지고 있다는 감각을 만듭니다. 익숙한 쿠션에 반응하는 움직임을 더해, 곁에 두는 사물에서 함께하는 존재로 이어지는 경험을 제안합니다.",
    teamName: "MiMO",
    designerSlugs: ["hagyeong-kim", "jinhui-lee"],
  },
  {
    slug: "ux-07",
    field: "ux-product",
    cardTitle: "corner : 계획과 현장의 차이를 읽는 대형 전시 운영 서비스",
    title: "corner : 코너에 몰리기 전에",
    subtitle: "계획과 현장의 차이를 읽는 전시 운영 서비스",
    description:
      "corner는 현장 스태프가 받는 관람객의 질문을 데이터로 바꿔, 센서로는 보이지 않는 계획과 현장의 차이를 읽는 대형 전시 운영 서비스입니다. 총괄의 승인 한 번이면 스태프의 e-ink 배지와 현장 사이니지에 지시와 안내가 동시에 닿아, 현장이 코너에 몰리기 전에 함께 움직입니다.",
    designerSlugs: ["eunjin-kim"],
  },
  {
    slug: "ux-11",
    field: "ux-product",
    cardTitle: "Shelter: 귀중품의 보관 환경을 제어하는 스마트 온습도 관리 시스템",
    title: "Shelter",
    subtitle: "귀중품의 보관 환경을 제어하는 스마트 온습도 관리 시스템",
    description:
      "Shelter는 외부 환경 변화에 대응하여 온습도를 자동으로 조절함으로써 귀중품을 안정적으로 보호하고, 사용자의 관리 부담을 줄여 소중한 물건의 가치와 수명을 지속적으로 보존합니다.",
    designerSlugs: ["jongbin-yoo"],
  },
  {
    slug: "ux-12",
    field: "ux-product",
    cardTitle: "ON:DO 중증 지적장애인의 일상 자립을 지원하는 AI 동행 서비스",
    title: "ON:DO",
    subtitle: "그 순간, 혼자가 아니도록",
    description:
      "혼란의 순간을, 다시 세상과 맞닿는 따뜻한 온도로. ON:DO는 중증 지적장애인이 예상치 못한 상황을 마주했을 때, 익숙한 안내와 필요한 도움을 연결하는 AI 동행 서비스입니다. 판단이 필요한 순간 켜지는 연결 ‘ON’과 다시 스스로 해내는 움직임 ‘DO’를 통해, 오늘 멈춰 선 순간이 내일의 한 걸음이 되도록 일상 속 자립을 함께합니다.",
    designerSlugs: ["juhui-lee"],
  },
  {
    slug: "ux-13",
    field: "ux-product",
    cardTitle: "Z-zero: 운동성 근경련 예방 다이얼 레깅스",
    title: "Z-zero",
    subtitle: "운동성 근경련 예방 다이얼 레깅스",
    description:
      "경기 막바지, 종아리가 굳는 순간 플레이는 멈춥니다. 근경련은 늘 예고 없이 오는 것 같지만, 사실 근육은 그 전에 신호를 보냅니다. Z-zero는 그 신호를 먼저 읽습니다. 다이얼 바닥의 FMG 센서가 근육이 굳어가는 변화를 감지해 진동으로 알려줍니다. 다이얼을 돌리면 종아리가 단단히 조여지고, 다이얼 끝의 카메라는 발의 모든 순간을 기록합니다. 앱은 그 기록으로 내 몸이 언제 지치는지 보여줍니다.",
    designerSlugs: ["damin-park"],
  },
  {
    slug: "ux-14",
    field: "ux-product",
    cardTitle: "DOTS: Hospital Spatial UX Serivce Design",
    title: "Connecting your dots",
    subtitle: "공간이 환자를 알아보고, 진료 여정을 이어주는 공간 서비스",
    description:
      "Dots는 환자의 진료 단계와 위치, 현재 수행 상태를 이해하고, 병원 곳곳의 공간과 정보를 연결하는 지능형 공간 UX 서비스입니다. 디스플레이, 키오스크, 엘리베이터 등 병원 인프라를 통해 필요한 순간에 적절한 안내와 서비스를 제공하여, 환자가 다음 행동을 직접 찾고 판단해야 하는 부담을 줄입니다. 이를 통해 복잡하고 단절된 외래진료 여정을 하나의 자연스러운 흐름으로 이어줍니다.",
    designerSlugs: ["yehan-jung"],
  },
  {
    slug: "ux-15",
    field: "ux-product",
    cardTitle: "PIKT : 농장과 식탁을 잇는 농산물 직거래 메타버스",
    title: "PIKT : Pick Your Harvest",
    subtitle: "농장과 식탁을 잇는 농산물 직거래 메타버스",
    description:
      "실제 스마트팜의 가상 농장을 둘러보며 작물이 자라는 과정과 수확 기록을 확인하고, 마음에 드는 수확을 직접 골라보세요. 내가 선택한 수확은 농부의 수확과 포장, 배송을 거쳐 실제 식탁으로 이어집니다. PIKT는 가상 농장과 실제 농장을 연결해, 농부의 재배 과정과 소비자의 선택이 한 번의 수확으로 만나는 메타버스 농장 마켓입니다.",
    designerSlugs: ["minseo-byun"],
  },
  {
    slug: "ux-16",
    field: "ux-product",
    title: "한영찬",
    description: "",
    designerSlugs: ["yeongchan-han"],
  },
  {
    slug: "ux-17",
    field: "ux-product",
    cardTitle: "ROASTOA: 커피가 로스팅되는 순간을 하나의 공연으로 제공하는 로스터기",
    title: "ROASTOA",
    subtitle: "커피가 로스팅되는 순간을 하나의 공연으로 제공하는 로스터기",
    description:
      "ROASTOA는 카페에 방문하는 고객들이 로스팅의 장면을 하나의 공연으로 관람하고, 복잡한 로스팅의 내용들을 고객들이 쉽게 이해할 수 있는 채널로 전달하는 스마트 로스터기입니다.",
    designerSlugs: ["hyeonho-lim"],
  },
  {
    slug: "ux-18",
    field: "ux-product",
    cardTitle: "Wedge: Active Sitting Cushion",
    title: "Wedge",
    subtitle: "Active Sitting Cushion",
    description:
      '"가장 좋은 자세는 다음 자세다." Wedge는 착좌 상태를 감지하고 작은 움직임 넛지로 자세 전환을 유도하는 스마트 쿠션과 앱 서비스입니다',
    designerSlugs: ["daeun-park"],
  },
  {
    slug: "ux-19",
    field: "ux-product",
    cardTitle: "延理(연리) : 차향으로 이어지는 기억",
    title: "延理(연리)",
    subtitle: "찻잎 캡슐 기반 감각 아카이빙 서비스",
    description:
      "연리는 차의 향을 매개로 기억을 이어가는 감각 아카이빙 서비스입니다. 문득 스친 향이 잊고 있던 기억을 불러오듯, 그날의 장면과 이야기에 향이라는 감각을 더합니다. 캡슐을 발향기에 올리는 작은 행동으로 향과 함께 그날의 기록을 다시 꺼내는 경험을 제안합니다.",
    designerSlugs: ["chaewon-kim"],
  },
  {
    slug: "ux-20",
    field: "ux-product",
    cardTitle: "VIS-À-VIS : 청인 중심으로 설계된 세상에서 농인으로 온전히 살아가기 위해",
    title: "VIS-À-VIS",
    subtitle: "청인 중심으로 설계된 세상에서 농인으로 온전히 살아가기 위해",
    description:
      "본 작품은 청인 중심으로 설계된 세상을 농인의 언어와 감각에서 다시 바라봅니다. 초개인화 AI가 수많은 소리 가운데 사용자에게 필요한 신호를 선별해 촉각으로 전하고, 농인과 청인이 각자의 언어를 유지한 채 서로 마주하며 대화할 수 있도록 웨어러블 커뮤니케이션 경험을 설계했습니다. 농인이 자신의 고유한 언어와 정체성을 지닌 채, 세상과 온전히 마주하는 일상을 제안합니다.",
    designerSlugs: ["jaeeun-jung"],
  },
  {
    slug: "ux-21",
    field: "ux-product",
    cardTitle: "TIUM : 흔들리는 순간, 나를 위한 틈",
    title: "TIUM",
    subtitle: "생체신호 및 맥락 기반 번아웃 인지와 대응 설계",
    description:
      "TIUM은 일상 속 감정적으로 부담되는 순간, 자신의 상태를 알아차리고 대응을 선택할 틈을 제안하는 서비스입니다. 몸으로 느끼는 개인화된 신호를 통해 잠시 멈추고 자신에게 주의를 돌리는 경험을 설계했습니다. 패치·스트랩·말랑이형 디바이스와 앱을 연결해 순간의 알아차림부터 이후의 성찰까지 함께합니다. 사용자는 자신의 감정과 행동을 돌아보며, 다음 상황에서 자신에게 맞는 대처 방식을 찾아갑니다.",
    designerSlugs: ["jinhui-lee"],
  },
  // ───── UX Space ─────
  {
    slug: "ux-08",
    field: "ux-space",
    cardTitle: "Bysthm: Beside your Rhythm",
    title: "Bysthm",
    subtitle: "각자의 리듬을 속에서 경험하는 일상의 웰니스",
    description:
      "Bysthm은 천마지 HALO 리더스타운의 웰니스 공간 브랜드입니다. 각자의 생활 리듬을 존중하며, leader's town에서 온전히 자신에게 집중하고 타인과 편안하게 교류할 수 있는 공간을 제안합니다. 로비와 라운지에서의 자연스러운 만남부터 스파와 사우나에서의 깊은 휴식까지, 각자의 시간을 지키면서도 서로 느슨하게 연결되는 웰니스 경험을 만들어갑니다.",
    teamName: "OB",
    designerSlugs: ["noeun-ki", "juyeon-jung", "sarang-kim"],
  },
  {
    slug: "ux-09",
    field: "ux-space",
    cardTitle: "aside : New connections. A wider everyday.",
    title: "aside",
    subtitle: "일상이 연결되고, 경험이 쌓이는 주거 공간",
    description:
      "ASIDE는 HALO 리더스 타운 입주민의 지식과 경험을 연결하는 주거 커뮤니티 공간입니다. 각자의 생활 리듬을 존중하는 클럽하우스에서 다양한 프로그램을 통해 자연스러운 교류를 만듭니다. 함께한 경험이 기록으로 쌓여 다음 만남으로 이어지는 주거 커뮤니티를 그립니다.",
    teamName: "동그리",
    designerSlugs: ["suwon-choi", "seongeun-jung", "yeongeun-choi"],
  },
  {
    slug: "ux-10",
    field: "ux-space",
    cardTitle: "ORVET : We discover, create, and find where we belong.",
    title: "ORVET",
    subtitle: "서로의 생각과 삶을 교류하는 복합 문화상업 공간",
    description:
      "ORVET은 천마지 HALO 리더스타운의 복합 문화상업 공간입니다. 서로 다른 세대와 배경을 가진 사람들이 자연스럽게 마주치고, 각자의 취향과 경험을 나누며 관계를 만들어갑니다. 발견과 창작, 미식의 경험을 통해 서로를 알아가고, 만남이 깊은 연결로 이어집니다.",
    teamName: "03Z",
    designerSlugs: ["hagyeong-kim", "juhyang-lee", "yewon-han"],
  },
  {
    slug: "ux-26",
    field: "ux-space",
    cardTitle: "HALO: Leader's Town",
    title: "HALO",
    subtitle: "서로 다른 일상이 만나 관계로 이어지는 리더스 타운",
    description:
      "HALO는 포항시 북구 천마지 호수를 중심으로 주거와 문화, 상업공간이 어우러진 리더스 타운 안의 공간으로, 서로 다른 취향과 경험을 가진 사람들이 만나 일상의 가능성을 넓혀가는 곳입니다. 함께 머물고 활동하는 과정에서 자연스럽게 대화가 시작되고, 작은 만남과 교류가 관계로 이어집니다. 서로의 생각과 관점을 나누며 익숙한 삶을 새롭게 바라보고, 각자의 세계를 확장해갑니다.",
    teamName: "공드리",
    designerSlugs: [
      "noeun-ki",
      "juyeon-jung",
      "sarang-kim",
      "suwon-choi",
      "seongeun-jung",
      "yeongeun-choi",
      "hagyeong-kim",
      "juhyang-lee",
      "yewon-han",
    ],
  },
];

const DUMMY = (n: number) => `/placeholder/dummy/works/work-${(n % 4) + 1}.webp`;
const DUMMY_PAGE = (n: number) => `/placeholder/thumb-0${(n % 8) + 1}a.svg`;

const RAW_WORKS: Work[] = TEXTS.map((w, i) => ({
  ...w,
  thumbnails: [DUMMY(i + 1), DUMMY(i + 2)],
  // 팀 작품은 상세 타이틀 위에 팀 사진, 개인 작품은 디자이너 프로필 사진을 쓴다
  photo: w.teamName ? "/placeholder/dummy/works/team-photo.webp" : undefined,
  pages: [DUMMY_PAGE(i + 2), DUMMY_PAGE(i + 3), DUMMY_PAGE(i + 4)],
}));

/**
 * 구글 드라이브에서 받아 R2 로 올린 팀 사진(작품 상세 타이틀 위)이 있으면 그걸 쓴다.
 * media-manifest.json 은 `npm run pull:drive` 가 public/media 를 훑어 다시 쓴다 — 손으로 고치지 말 것.
 */
const MEDIA_WORKS = (media as { works: Record<string, string> }).works;
export const WORKS: Work[] = RAW_WORKS.map((x) => ({
  ...x,
  photo: MEDIA_WORKS[x.slug] ?? x.photo,
}));

const byTitle = (a: Work, b: Work) => a.title.localeCompare(b.title, "ko");

/** Works 목록: 타이틀 가나다순 */
export const getWorks = (field?: FieldKey) => WORKS.filter((w) => !field || w.field === field).sort(byTitle);

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);

/** 상세 하단 Others: 같은 분야에서 현재 작품 다음 순서부터 이어서 */
export function getOtherWorks(slug: string) {
  const current = getWork(slug);
  if (!current) return [];
  const list = getWorks(current.field);
  const i = list.findIndex((w) => w.slug === slug);
  return [...list.slice(i + 1), ...list.slice(0, i)];
}
