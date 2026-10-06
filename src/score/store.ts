import { create } from "zustand";

type ScoreState = {
  strokes: Record<string, number>;
  setStrokes: (playerId: string, hole: number, strokes: number | null) => void;
};

function scoreKey(playerId: string, hole: number) {
  return `${playerId}:${hole}`;
}

export const useScores = create<ScoreState>((set) => ({
  strokes: {},
  setStrokes: (playerId, hole, strokes) =>
    set((state) => {
      const key = scoreKey(playerId, hole);
      const next = { ...state.strokes };
      if (strokes == null) delete next[key];
      else next[key] = strokes;
      return { strokes: next };
    }),
}));

export function readStrokes(
  strokes: Record<string, number>,
  playerId: string,
  hole: number,
) {
  return strokes[scoreKey(playerId, hole)];
}
