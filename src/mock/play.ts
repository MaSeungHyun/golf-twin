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
      { name: { ko: "강도윤", jp: "カン・ドユン" }, strokes: 4, previous: [] },
      { name: { ko: "문지호", jp: "ムン・ジホ" }, strokes: 3, previous: [] },
      { name: { ko: "서지우", jp: "ソ・ジウ" }, strokes: null, previous: [] },
      { name: { ko: "오하늘", jp: "オ・ハヌル" }, strokes: null, previous: [] },
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
      { name: { ko: "안준서", jp: "アン・ジュンソ" }, strokes: 5, previous: [4, 5] },
      { name: { ko: "유하준", jp: "ユ・ハジュン" }, strokes: null, previous: [5, 6] },
      { name: { ko: "임서아", jp: "イム・ソア" }, strokes: null, previous: [4, 5] },
      { name: { ko: "장민재", jp: "チャン・ミンジェ" }, strokes: null, previous: [3, 6] },
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
      { name: { ko: "김하늘", jp: "キム・ハヌル" }, strokes: null, previous: [4, 5, 4, 3] },
      { name: { ko: "이도현", jp: "イ・ドヒョン" }, strokes: null, previous: [5, 5, 3, 4] },
      { name: { ko: "박서준", jp: "パク・ソジュン" }, strokes: null, previous: [4, 6, 4, 3] },
      { name: { ko: "최유진", jp: "チェ・ユジン" }, strokes: null, previous: [4, 4, 5, 2] },
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
      { name: { ko: "윤재이", jp: "ユン・ジェイ" }, strokes: null, previous: [4, 5, 4, 3, 4, 5, 4] },
      { name: { ko: "전민서", jp: "チョン・ミンソ" }, strokes: null, previous: [5, 5, 4, 3, 5, 6, 4] },
      { name: { ko: "정보름", jp: "チョン・ボルム" }, strokes: null, previous: [4, 6, 5, 2, 4, 5, 5] },
      { name: { ko: "지수호", jp: "ジ・スホ" }, strokes: null, previous: [3, 5, 4, 3, 4, 5, 4] },
    ],
  },
  {
    hole: 18,
    group: { ko: "E조", jp: "E組" },
    scores: [
      { name: { ko: "최라온", jp: "チェ・ラオン" }, strokes: 4, previous: [4, 5, 4, 3, 4, 5, 4, 3] },
      { name: { ko: "표지한", jp: "ピョ・ジハン" }, strokes: 5, previous: [5, 6, 4, 3, 5, 5, 4, 4] },
      { name: { ko: "한여름", jp: "ハン・ヨルム" }, strokes: 3, previous: [4, 5, 3, 3, 4, 5, 4, 2] },
      { name: { ko: "허민규", jp: "ホ・ミンギュ" }, strokes: null, previous: [4, 5, 4, 4, 5, 6, 4, 3] },
    ],
  },
];
