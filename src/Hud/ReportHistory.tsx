import {
  Check,
  List,
  MapPin,
  TriangleAlert,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Button from "../components/Button";
import Panel from "../components/Panel";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { useMachines } from "../machine/store";
import { caddieSelf } from "../mock/caddie";
import { showCourseHole } from "../Viewport/Hole";
import { useReports, type Report, type ReportKind } from "../report/store";

const kindKey = {
  emergency: "report.kind.emergency",
  maintenance: "report.kind.maintenance",
} as const satisfies Record<ReportKind, MessageKey>;

type Filter = "all" | ReportKind | "done";

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

function clockLabel(time: number) {
  const date = new Date(time);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}. ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function agoLabel(createdAt: number, now: number, locale: "ko" | "jp") {
  const minutes = Math.max(0, Math.floor((now - createdAt) / 60000));
  if (locale === "jp") {
    if (minutes < 1) return "たった今";
    if (minutes < 60) return `${minutes}分前`;
    return `${Math.floor(minutes / 60)}時間前`;
  }
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  return `${Math.floor(minutes / 60)}시간 전`;
}

export default function ReportHistory({ onClose }: { onClose: () => void }) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const reports = useReports((state) => state.reports);
  const resolve = useReports((state) => state.resolve);
  const release = useMachines((state) => state.release);
  const machines = useMachines((state) => state.machines);
  const [filter, setFilter] = useState<Filter>("all");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const taken = new Set(
    machines.flatMap((machine) =>
      machine.currentId ? [machine.currentId, ...machine.queue] : machine.queue,
    ),
  );
  const open = reports.filter((report) => report.resolvedAt == null);
  const emergencyCount = open.filter(
    (report) => report.kind === "emergency",
  ).length;
  const maintenanceCount = open.filter(
    (report) => report.kind === "maintenance",
  ).length;
  const doneCount = reports.length - open.length;
  const visible = reports.filter((report) => {
    if (filter === "done") return report.resolvedAt != null;
    if (report.resolvedAt != null) return false;
    if (filter === "all") return true;
    return report.kind === filter;
  });

  const finish = (report: Report) => {
    release(report.id);
    resolve(report.id);
  };

  return (
    <Panel className="pointer-events-auto absolute top-1/2 right-40 z-20 flex max-h-[min(44rem,calc(100dvh-6rem))] w-104 -translate-y-1/2 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 py-3 pr-1.5 pl-4">
        <div>
          <p className="text-lg font-bold">{translate("report.board.title")}</p>
          <p className="text-sm text-white/55">
            {translate("report.board.subtitle")}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="pt-0.5 text-right">
            <p className="inline-flex items-center gap-1.5 text-sm text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              {translate("report.board.live")}
            </p>
            <p className="text-sm text-white/45">{clockLabel(now)}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0"
            aria-label={translate("report.close")}
            icon={<X className="size-4" />}
            onClick={onClose}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4">
        <Summary
          label={translate("report.summary.all")}
          count={open.length}
          className="border-white/10 bg-[#1c2836]"
          icon={<List className="size-5 text-white/80" />}
        />
        <Summary
          label={translate("report.summary.emergency")}
          count={emergencyCount}
          className="border-[#ff4d4d]/40 bg-[linear-gradient(to_bottom_right,#5a1820_0%,#2a1218_25%,#2a1218_100%)]"
          valueClass="text-[#ff4d4d]"
          icon={<TriangleAlert className="size-5 text-[#ff4d4d]" />}
        />
        <Summary
          label={translate("report.summary.maintenance")}
          count={maintenanceCount}
          className="border-amber-400/40 bg-[linear-gradient(to_bottom_right,#4a3410_0%,#241c0e_25%,#241c0e_100%)]"
          valueClass="text-amber-400"
          icon={<Wrench className="size-5 text-amber-400" />}
        />
      </div>

      <div className="mt-3 flex gap-1.5 px-4">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`${translate("report.summary.all")} (${open.length})`}
        />
        <FilterChip
          active={filter === "emergency"}
          onClick={() => setFilter("emergency")}
          label={`${translate("report.summary.emergency")} (${emergencyCount})`}
          dot="bg-[#ff3b3b]"
        />
        <FilterChip
          active={filter === "maintenance"}
          onClick={() => setFilter("maintenance")}
          label={`${translate("report.summary.maintenance")} (${maintenanceCount})`}
          dot="bg-amber-400"
        />
        <FilterChip
          active={filter === "done"}
          onClick={() => setFilter("done")}
          label={`${translate("report.filter.done")} (${doneCount})`}
          dot="bg-white/40"
        />
      </div>

      {visible.length === 0 ? (
        <p className="px-4 py-4 text-sm text-white/60">
          {translate("report.empty")}
        </p>
      ) : (
        <div className="scroll-thumb mt-3 min-h-0 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1.5 px-4 pb-3">
            {visible.map((report) => {
              const emergency = report.kind === "emergency";
              const handling = taken.has(report.id);
              const done = report.resolvedAt != null;

              return (
                <li
                  key={report.id}
                  className={cn(
                    "rounded-xl border px-2.5 py-2",
                    emergency
                      ? "border-[#ff4d4d]/55 bg-[linear-gradient(to_bottom_right,#4a1520_0%,#121816_55%,#121816_100%)]"
                      : "border-amber-400/55 bg-[linear-gradient(to_bottom_right,#3d2c10_0%,#121816_35%,#121816_100%)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "inline-flex items-center gap-1 text-sm font-bold",
                        emergency ? "text-[#ff5a5a]" : "text-amber-400",
                      )}
                    >
                      {emergency ? (
                        <TriangleAlert className="size-3.5" />
                      ) : (
                        <Wrench className="size-3.5" />
                      )}
                      {translate(kindKey[report.kind])}
                    </p>
                    <span className="text-xs text-white/45">
                      {agoLabel(report.createdAt, now, locale)}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-bold tracking-tight">
                    {holeLabel(report.hole)}
                  </p>
                  <p className="text-xs text-white/75">
                    {report.note || translate(kindKey[report.kind])}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/70">
                    <User className="size-3" />
                    {caddieSelf.name[locale]} · {caddieSelf.group[locale]}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    {done || handling ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold",
                          done ? "text-white/55" : "text-amber-400",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            done ? "bg-white/40" : "bg-amber-400",
                          )}
                        />
                        {translate(
                          done
                            ? "report.filter.done"
                            : "report.status.handling",
                        )}
                      </span>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => showCourseHole(report.hole)}
                        className="inline-flex h-7 items-center gap-1 rounded-full border border-white/10 bg-[#2a2a2a] px-2.5 text-xs text-white"
                      >
                        <MapPin className="size-3.5" />
                        {translate("caddie.show")}
                      </button>
                      {done ? null : (
                        <button
                          type="button"
                          onClick={() => finish(report)}
                          className="inline-flex h-7 items-center gap-1 rounded-full bg-[#3dffc3] px-2.5 text-xs font-bold text-[#06281c]"
                        >
                          <Check className="size-3.5" />
                          {translate("report.resolve")}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}

function Summary({
  label,
  count,
  icon,
  valueClass,
  className,
}: {
  label: string;
  count: number;
  icon: ReactNode;
  valueClass?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border px-3 py-2.5", className)}>
      <p className="text-sm text-white/70">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className={cn("text-3xl leading-none font-bold", valueClass)}>
          {count}
        </p>
        {icon}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  dot,
  onClick,
}: {
  active: boolean;
  label: string;
  dot?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold",
        active ? "bg-[#3dffc3] text-[#06281c]" : "bg-[#24302c] text-white/80",
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", dot)} /> : null}
      {label}
    </button>
  );
}
