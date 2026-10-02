const ko = {
  "language.ko": "한국어",
  "language.jp": "일본어",
  "nav.home": "메인",
  "nav.back": "뒤로",
  "home.club": "클럽운영",
  "home.game": "경기운영",
  "club.title": "클럽운영",
  "game.title": "경기운영",
  "hud.overview": "전체보기",
  "hud.currentHole": "현재 홀",
  "hud.view3d": "3D 뷰",
  "hud.resetCamera": "카메라 리셋",
  "hud.weather": "맑음 14°C",
  "hud.more": "더보기",
  "hud.poi": "POI",
  "hud.measure": "거리 측정",
  "hud.nextHole": "다음 홀",
  "hud.lastHole": "마지막 홀입니다",
  "hud.dogleg.straight": "직진",
  "hud.dogleg.left": "좌도그렉",
  "hud.dogleg.right": "우도그렉",
  "hud.water": "워터",
  "hud.bunker": "벙커",
  "hud.uphill": "오르막",
  "hud.downhill": "내리막",
} as const;

const jp = {
  "language.ko": "韓国語",
  "language.jp": "日本語",
  "nav.home": "ホーム",
  "nav.back": "戻る",
  "home.club": "クラブ運営",
  "home.game": "競技運営",
  "club.title": "クラブ運営",
  "game.title": "競技運営",
  "hud.overview": "全体表示",
  "hud.currentHole": "現在のホール",
  "hud.view3d": "3Dビュー",
  "hud.resetCamera": "カメラリセット",
  "hud.weather": "晴れ 14°C",
  "hud.more": "もっと見る",
  "hud.poi": "POI",
  "hud.measure": "距離測定",
  "hud.nextHole": "次のホール",
  "hud.lastHole": "最終ホールです",
  "hud.dogleg.straight": "ストレート",
  "hud.dogleg.left": "レフト",
  "hud.dogleg.right": "ライト",
  "hud.water": "ウォーター",
  "hud.bunker": "バンカー",
  "hud.uphill": "上り",
  "hud.downhill": "下り",
} satisfies Record<keyof typeof ko, string>;

export const locales = ["ko", "jp"] as const;

export type Locale = (typeof locales)[number];

export type MessageKey = keyof typeof ko;

export const messages = { ko, jp };
