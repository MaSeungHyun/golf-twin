export type MachineStatus = "idle" | "working" | "broken";

export type MachineSeed = {
  id: string;
  name: { ko: string; jp: string };
  status: MachineStatus;
};

export const machines: MachineSeed[] = [
  { id: "pitch-1", name: { ko: "피치마크봇 1", jp: "ピッチマークボット 1" }, status: "idle" },
  { id: "pitch-2", name: { ko: "피치마크봇 2", jp: "ピッチマークボット 2" }, status: "working" },
  { id: "pitch-3", name: { ko: "피치마크봇 3", jp: "ピッチマークボット 3" }, status: "broken" },
  { id: "pitch-4", name: { ko: "피치마크봇 4", jp: "ピッチマークボット 4" }, status: "idle" },
];
