import { X } from "lucide-react";
import { useState } from "react";
import Button from "../components/Button";
import Panel from "../components/Panel";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { useMachines } from "../machine/store";
import type { MachineStatus } from "../mock/machines";
import { useReports, type Report } from "../report/store";

const statusKey = {
  idle: "machine.status.idle",
  working: "machine.status.working",
  broken: "machine.status.broken",
} as const satisfies Record<MachineStatus, MessageKey>;

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

function jobLabel(
  report: Report | undefined,
  fallback: string,
) {
  if (!report) return fallback;
  return `${holeLabel(report.hole)} · ${report.note || fallback}`;
}

export default function MachineDesk({ onClose }: { onClose: () => void }) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const reports = useReports((state) => state.reports);
  const machines = useMachines((state) => state.machines);
  const assignNow = useMachines((state) => state.assignNow);
  const enqueue = useMachines((state) => state.enqueue);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const taken = new Set(
    machines.flatMap((machine) =>
      machine.currentId ? [machine.currentId, ...machine.queue] : machine.queue,
    ),
  );
  const pending = reports.filter(
    (report) =>
      report.kind === "maintenance" &&
      report.resolvedAt == null &&
      !taken.has(report.id),
  );
  const selected = pending.some((report) => report.id === selectedId)
    ? selectedId
    : null;

  return (
    <Panel className="pointer-events-auto absolute top-1/2 right-40 z-20 flex max-h-[min(36rem,calc(100dvh-8rem))] w-96 -translate-y-1/2 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 py-1.5 pr-1.5 pl-4">
        <p className="text-md font-bold">{translate("hud.machines")}</p>
        <Button
          size="sm"
          variant="ghost"
          className="size-8 p-0"
          aria-label={translate("report.close")}
          icon={<X className="size-4" />}
          onClick={onClose}
        />
      </div>

      <div className="scroll-thumb min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 pt-1.5 pb-3">
        <section>
          <p className="text-sm font-bold text-white/70">
            {translate("machine.reports")}
          </p>
          {pending.length === 0 ? (
            <p className="mt-2 text-sm text-white/50">{translate("machine.empty")}</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {pending.map((report) => {
                const active = selected === report.id;

                return (
                  <li key={report.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedId(report.id)}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2 text-left",
                        active
                          ? "border-accent bg-accent-surface"
                          : "border-white/10 bg-white/5",
                      )}
                    >
                      <p className="text-sm font-bold text-white">
                        {holeLabel(report.hole)}
                      </p>
                      <p className="text-sm text-white/60">
                        {report.note || translate("report.kind.maintenance")}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <p className="text-sm font-bold text-white/70">
            {translate("machine.list")}
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {machines.map((machine) => {
              const broken = machine.status === "broken";
              const working = machine.status === "working";
              const current = reports.find((report) => report.id === machine.currentId);
              const queued = machine.queue.map((id) =>
                reports.find((report) => report.id === id),
              );
              const maintenance = translate("report.kind.maintenance");

              return (
                <li
                  key={machine.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src="/image/pitchmark.webp"
                      alt=""
                      className="size-16 shrink-0 rounded-lg object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-md font-bold">{machine.name[locale]}</p>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold",
                            machine.status === "working" && "text-accent",
                            machine.status === "idle" && "text-amber-400",
                            broken && "text-[#ff0000]",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              machine.status === "working" && "bg-accent",
                              machine.status === "idle" && "bg-amber-400",
                              broken && "bg-[#ff0000]",
                            )}
                          />
                          {translate(statusKey[machine.status])}
                        </span>
                      </div>
                      {working ? (
                        <div className="mt-2 flex flex-col gap-2">
                          <div>
                            <p className="text-sm font-bold text-white/70">
                              {translate("machine.current")}
                            </p>
                            {current ? (
                              <p className="mt-1 rounded-lg bg-black/25 px-2 py-1.5 text-sm">
                                {jobLabel(current, maintenance)}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-white/45">
                                {translate("machine.currentEmpty")}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white/70">
                              {translate("machine.queue")}
                            </p>
                            {queued.length === 0 ? (
                              <p className="mt-1 text-sm text-white/45">
                                {translate("machine.queueEmpty")}
                              </p>
                            ) : (
                              <ol className="mt-1 flex flex-col gap-1">
                                {queued.map((report, index) => (
                                  <li
                                    key={machine.queue[index]}
                                    className="rounded-lg bg-black/25 px-2 py-1.5 text-sm"
                                  >
                                    {index + 1}. {jobLabel(report, maintenance)}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    disabled={!selected || broken}
                    onClick={() => {
                      if (!selected) return;
                      if (working) enqueue(machine.id, selected);
                      else if (machine.status === "idle") assignNow(machine.id, selected);
                    }}
                  >
                    {broken
                      ? translate("machine.unavailable")
                      : translate(working ? "machine.enqueue" : "machine.assignNow")}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
        </div>
      </div>
    </Panel>
  );
}
