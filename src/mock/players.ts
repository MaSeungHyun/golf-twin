export type Player = {
  id: string;
  name: { ko: string; jp: string };
};

export const groupPlayers: Player[] = [
  { id: "player-1", name: { ko: "김하늘", jp: "山本 陽菜" } },
  { id: "player-2", name: { ko: "이도현", jp: "中村 健太" } },
  { id: "player-3", name: { ko: "박서준", jp: "小林 悠真" } },
  { id: "player-4", name: { ko: "최유진", jp: "加藤 咲良" } },
];
