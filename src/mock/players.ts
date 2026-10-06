export type Player = {
  id: string;
  name: { ko: string; jp: string };
};

export const groupPlayers: Player[] = [
  { id: "player-1", name: { ko: "김하늘", jp: "キム・ハヌル" } },
  { id: "player-2", name: { ko: "이도현", jp: "イ・ドヒョン" } },
  { id: "player-3", name: { ko: "박서준", jp: "パク・ソジュン" } },
  { id: "player-4", name: { ko: "최유진", jp: "チェ・ユジン" } },
];
