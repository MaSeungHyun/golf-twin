import { create } from "zustand";

export type CourseMode = "all" | "single";

type CourseViewState = {
  mode: CourseMode;
  hole: number;
  setView: (mode: CourseMode, hole: number) => void;
};

export const useCourseView = create<CourseViewState>((set) => ({
  mode: "all",
  hole: 10,
  setView: (mode, hole) => set({ mode, hole }),
}));
