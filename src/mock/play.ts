export type HoleScore = {
  name: { ko: string; jp: string };
  strokes: number | null;
  previous: number[];
};

export type HolePlay = {
  hole: number;
  group: { ko: string; jp: string } | null;
  scores: HoleScore[];
};

export const holePlay: HolePlay[] = [
  {
    hole: 10,
    group: { ko: "C조", jp: "C組" },
    scores: [
      { name: { ko: "강도윤", jp: "吉田 海斗" }, strokes: 4, previous: [] },
      { name: { ko: "문지호", jp: "山田 蒼" }, strokes: 3, previous: [] },
      { name: { ko: "서지우", jp: "佐々木 凛" }, strokes: null, previous: [] },
      { name: { ko: "오하늘", jp: "山口 葵" }, strokes: null, previous: [] },
    ],
  },
  {
    hole: 11,
    group: null,
    scores: [],
  },
  {
    hole: 12,
    group: { ko: "D조", jp: "D組" },
    scores: [
      { name: { ko: "안준서", jp: "松本 隼" }, strokes: 5, previous: [4, 5] },
      { name: { ko: "유하준", jp: "井上 大和" }, strokes: null, previous: [5, 6] },
      { name: { ko: "임서아", jp: "木村 心春" }, strokes: null, previous: [4, 5] },
      { name: { ko: "장민재", jp: "林 直樹" }, strokes: null, previous: [3, 6] },
    ],
  },
  {
    hole: 13,
    group: null,
    scores: [],
  },
  {
    hole: 14,
    group: { ko: "A조", jp: "A組" },
    scores: [
      { name: { ko: "김하늘", jp: "山本 陽菜" }, strokes: null, previous: [4, 5, 4, 3] },
      { name: { ko: "이도현", jp: "中村 健太" }, strokes: null, previous: [5, 5, 3, 4] },
      { name: { ko: "박서준", jp: "小林 悠真" }, strokes: null, previous: [4, 6, 4, 3] },
      { name: { ko: "최유진", jp: "加藤 咲良" }, strokes: null, previous: [4, 4, 5, 2] },
    ],
  },
  {
    hole: 15,
    group: null,
    scores: [],
  },
  {
    hole: 16,
    group: null,
    scores: [],
  },
  {
    hole: 17,
    group: { ko: "B조", jp: "B組" },
    scores: [
      { name: { ko: "윤재이", jp: "斎藤 莉子" }, strokes: null, previous: [4, 5, 4, 3, 4, 5, 4] },
      { name: { ko: "전민서", jp: "清水 湊" }, strokes: null, previous: [5, 5, 4, 3, 5, 6, 4] },
      { name: { ko: "정보름", jp: "森 楓" }, strokes: null, previous: [4, 6, 5, 2, 4, 5, 5] },
      { name: { ko: "지수호", jp: "池田 蒼太" }, strokes: null, previous: [3, 5, 4, 3, 4, 5, 4] },
    ],
  },
  {
    hole: 18,
    group: { ko: "E조", jp: "E組" },
    scores: [
      { name: { ko: "최라온", jp: "橋本 陽向" }, strokes: 4, previous: [4, 5, 4, 3, 4, 5, 4, 3] },
      { name: { ko: "표지한", jp: "石川 蓮司" }, strokes: 5, previous: [5, 6, 4, 3, 5, 5, 4, 4] },
      { name: { ko: "한여름", jp: "阿部 夏帆" }, strokes: 3, previous: [4, 5, 3, 3, 4, 5, 4, 2] },
      { name: { ko: "허민규", jp: "藤田 圭吾" }, strokes: null, previous: [4, 5, 4, 4, 5, 6, 4, 3] },
    ],
  },
];
