export type CourseZone = "tee" | "fairway" | "green";

export type CaddieLocation = {
  id: string;
  name: { ko: string; jp: string };
  group: { ko: string; jp: string };
  hole: number;
  zone: CourseZone;
  progress: number;
  speed: number;
  phase: number;
  color: string;
};

export const caddieSelf: CaddieLocation = {
  id: "caddie-self",
  name: { ko: "박지훈", jp: "佐藤 蓮" },
  group: { ko: "A조", jp: "A組" },
  hole: 14,
  zone: "fairway",
  progress: 0.46,
  speed: 0.35,
  phase: 0.4,
  color: "#ff0000",
};

export const caddies: CaddieLocation[] = [
  caddieSelf,
  {
    id: "caddie-02",
    name: { ko: "이수민", jp: "鈴木 美咲" },
    group: { ko: "B조", jp: "B組" },
    hole: 17,
    zone: "tee",
    progress: 0.22,
    speed: 0.28,
    phase: 1.2,
    color: "#5dffb1",
  },
  {
    id: "caddie-03",
    name: { ko: "최민재", jp: "高橋 翔" },
    group: { ko: "C조", jp: "C組" },
    hole: 10,
    zone: "fairway",
    progress: 0.58,
    speed: 0.42,
    phase: 2.1,
    color: "#6cb6ff",
  },
  {
    id: "caddie-04",
    name: { ko: "정하은", jp: "田中 結衣" },
    group: { ko: "D조", jp: "D組" },
    hole: 12,
    zone: "fairway",
    progress: 0.37,
    speed: 0.31,
    phase: 3.4,
    color: "#ffd166",
  },
  {
    id: "caddie-05",
    name: { ko: "한도윤", jp: "伊藤 大輝" },
    group: { ko: "E조", jp: "E組" },
    hole: 18,
    zone: "green",
    progress: 0.81,
    speed: 0.24,
    phase: 4.6,
    color: "#c084fc",
  },
];

export function liveProgress(
  progress: number,
  speed: number,
  phase: number,
  time: number,
) {
  const drift = Math.sin(time * speed + phase) * 0.07;
  return Math.min(0.9, Math.max(0.12, progress + drift));
}
