import { create } from "zustand";
import { machines as seed, type MachineStatus } from "../mock/machines";

export type Machine = {
  id: string;
  name: { ko: string; jp: string };
  status: MachineStatus;
  currentId: string | null;
  queue: string[];
};

type MachineState = {
  machines: Machine[];
  assignNow: (machineId: string, reportId: string) => void;
  enqueue: (machineId: string, reportId: string) => void;
  release: (reportId: string) => void;
};

export const useMachines = create<MachineState>((set) => ({
  machines: seed.map((machine) => ({
    ...machine,
    currentId: null,
    queue: [],
  })),
  assignNow: (machineId, reportId) =>
    set((state) => ({
      machines: state.machines.map((machine) => {
        if (machine.id !== machineId || machine.status !== "idle") return machine;
        return { ...machine, status: "working", currentId: reportId };
      }),
    })),
  enqueue: (machineId, reportId) =>
    set((state) => ({
      machines: state.machines.map((machine) => {
        if (machine.id !== machineId || machine.status !== "working") return machine;
        if (machine.currentId === reportId || machine.queue.includes(reportId)) {
          return machine;
        }
        return { ...machine, queue: [...machine.queue, reportId] };
      }),
    })),
  release: (reportId) =>
    set((state) => ({
      machines: state.machines.map((machine) => {
        const queue = machine.queue.filter((id) => id !== reportId);
        if (machine.currentId !== reportId) return { ...machine, queue };
        const [next, ...rest] = queue;
        if (!next) {
          return {
            ...machine,
            currentId: null,
            queue: rest,
            status: machine.status === "working" ? "idle" : machine.status,
          };
        }
        return { ...machine, currentId: next, queue: rest };
      }),
    })),
}));
