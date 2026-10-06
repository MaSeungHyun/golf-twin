import data from "./course.json";

export type TeeName = "blue" | "white" | "red";
export type Dogleg = "straight" | "left" | "right";

export type Tee = {
  name: TeeName;
  yards: number;
  meters: number;
};

export type HoleName = {
  ko: string;
  jp: string;
};

export type HoleInfo = {
  number: number;
  name: HoleName;
  par: 3 | 4 | 5;
  handicap: number;
  dogleg: Dogleg;
  elevation: number;
  tees: Tee[];
  green: { depth: number; width: number };
  bunkers: number;
  water: boolean;
};

export type Course = {
  name: string;
  holes: HoleInfo[];
};

export const course = data as Course;
export const holes = course.holes;

export function findHole(number: number) {
  return holes.find((hole) => hole.number === number) ?? holes[0];
}

export function tee(hole: HoleInfo, name: TeeName) {
  return hole.tees.find((item) => item.name === name) ?? hole.tees[0];
}

export function holeName(hole: HoleInfo, locale: keyof HoleName) {
  return hole.name[locale];
}
