import { create } from "zustand";

type ScoreState = {
  strokes: Record<string, number>;
  setStrokes: (playerId: string, hole: number, strokes: number) => void;
};

function scoreKey(playerId: string, hole: number) {
  return `${playerId}:${hole}`;
}

export const useScores = create<ScoreState>((set) => ({
  strokes: {},
  setStrokes: (playerId, hole, strokes) =>
    set((state) => ({
      strokes: {
        ...state.strokes,
        [scoreKey(playerId, hole)]: strokes,
      },
    })),
}));

export function readStrokes(
  strokes: Record<string, number>,
  playerId: string,
  hole: number,
) {
  return strokes[scoreKey(playerId, hole)];
}
