const ko = {
  "language.ko": "한국어",
  "language.jp": "일본어",
  "nav.home": "메인",
  "home.club": "클럽운영",
  "home.game": "경기운영",
  "club.title": "클럽운영",
  "game.title": "경기운영",
} as const;

const jp = {
  "language.ko": "韓国語",
  "language.jp": "日本語",
  "nav.home": "ホーム",
  "home.club": "クラブ運営",
  "home.game": "競技運営",
  "club.title": "クラブ運営",
  "game.title": "競技運営",
} satisfies Record<keyof typeof ko, string>;

export const locales = ["ko", "jp"] as const;

export type Locale = (typeof locales)[number];

export type MessageKey = keyof typeof ko;

export const messages = { ko, jp };
