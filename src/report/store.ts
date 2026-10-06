import { create } from "zustand";
import type { CourseZone } from "../mock/caddie";

export type ReportKind = "emergency" | "maintenance";
export type Severity = "low" | "medium" | "high";

export type Report = {
  id: string;
  kind: ReportKind;
  severity: Severity;
  hole: number;
  zone: CourseZone;
  progress: number;
  note: string;
  createdAt: number;
};

type ReportDraft = Omit<Report, "id" | "createdAt">;

type ReportState = {
  reports: Report[];
  submit: (draft: ReportDraft) => void;
};

export const useReports = create<ReportState>((set) => ({
  reports: [],
  submit: (draft) =>
    set((state) => ({
      reports: [
        {
          ...draft,
          id: `report-${Date.now()}`,
          createdAt: Date.now(),
        },
        ...state.reports,
      ],
    })),
}));
