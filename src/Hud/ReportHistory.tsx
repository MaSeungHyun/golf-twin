import { X } from "lucide-react";
import Button from "../components/Button";
import Panel from "../components/Panel";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { caddieSelf } from "../mock/caddie";
import { findHole, holeName } from "../mock/course";
import { useReports, type ReportKind } from "../report/store";

const kindKey = {
  emergency: "report.kind.emergency",
  maintenance: "report.kind.maintenance",
} as const satisfies Record<ReportKind, MessageKey>;

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

export default function ReportHistory({ onClose }: { onClose: () => void }) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const reports = useReports((state) => state.reports);

  return (
    <Panel className="pointer-events-auto absolute top-1/2 right-40 z-20 flex max-h-[min(32rem,calc(100dvh-8rem))] w-80 -translate-y-1/2 flex-col px-4 pt-1 pb-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-md font-bold">{translate("hud.reportHistory")}</p>
        <Button
          size="sm"
          variant="ghost"
          className="size-8 p-0"
          aria-label={translate("report.close")}
          icon={<X className="size-4" />}
          onClick={onClose}
        />
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-white/60">{translate("report.empty")}</p>
      ) : (
        <ul className="scroll-thumb mt-3 flex flex-col gap-2 overflow-y-auto pr-1">
          {reports.map((report) => {
            const hole = findHole(report.hole);
            const emergency = report.kind === "emergency";

            return (
              <li
                key={report.id}
                className={cn(
                  "rounded-xl border px-3 py-2.5",
                  emergency
                    ? "border-red-400/35 bg-red-500/10"
                    : "border-amber-300/35 bg-amber-400/10",
                )}
              >
                <p
                  className={cn(
                    "text-md font-bold",
                    emergency ? "text-red-100" : "text-amber-100",
                  )}
                >
                  {translate(kindKey[report.kind])}
                </p>
                <p className="mt-1 text-sm text-white/85">
                  {holeLabel(report.hole)}
                </p>
                <p className="text-sm text-white/70">{holeName(hole, locale)}</p>
                <p className="mt-1 text-sm text-white/60">
                  {caddieSelf.name[locale]} · {caddieSelf.group[locale]}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
