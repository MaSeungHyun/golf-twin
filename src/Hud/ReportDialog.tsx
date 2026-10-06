import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/Dialog";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { caddieSelf } from "../mock/caddie";
import { useReports, type ReportKind, type Severity } from "../report/store";

const kindKey = {
  emergency: "report.kind.emergency",
  maintenance: "report.kind.maintenance",
} as const satisfies Record<ReportKind, MessageKey>;

const severityKey = {
  low: "report.severity.low",
  medium: "report.severity.medium",
  high: "report.severity.high",
} as const satisfies Record<Severity, MessageKey>;

const severities = ["low", "medium", "high"] as const;

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

export default function ReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const submit = useReports((state) => state.submit);
  const [kind, setKind] = useState<ReportKind | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [note, setNote] = useState("");
  const ready = kind !== null && severity !== null;

  useEffect(() => {
    if (!open) return;
    setKind(null);
    setSeverity(null);
    setNote("");
  }, [open]);

  const send = () => {
    if (!kind || !severity) return;

    submit({
      kind,
      severity,
      hole: caddieSelf.hole,
      zone: caddieSelf.zone,
      progress: caddieSelf.progress,
      note: note.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="px-5 pt-4 pb-5"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between gap-3">
          <DialogTitle className="font-bold">
            {translate("report.title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              size="sm"
              variant="ghost"
              className="size-8 p-0"
              aria-label={translate("report.close")}
              icon={<X className="size-4" />}
            />
          </DialogClose>
        </div>
        <DialogDescription className="mt-1">
          {holeLabel(caddieSelf.hole)} · {caddieSelf.name[locale]}
        </DialogDescription>

        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <p className="text-sm text-white/60">{translate("report.kind")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["emergency", "maintenance"] as const).map((value) => (
              <Button
                key={value}
                variant="outline"
                className={cn(
                  "h-12",
                  kind === value &&
                    (value === "emergency"
                      ? "border-red-400/70 bg-red-500/15 text-red-100 hover:bg-red-500/20"
                      : "border-amber-300/70 bg-amber-400/15 text-amber-100 hover:bg-amber-400/20"),
                )}
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
              >
                {translate(kindKey[value])}
              </Button>
            ))}
          </div>

          <p className="mt-5 text-sm text-white/60">
            {translate("report.severity")}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {severities.map((value) => (
              <Button
                key={value}
                size="sm"
                variant="outline"
                className={cn(
                  severity === value && "border-accent text-accent",
                )}
                aria-pressed={severity === value}
                onClick={() => setSeverity(value)}
              >
                {translate(severityKey[value])}
              </Button>
            ))}
          </div>

          <label
            className="mt-5 block text-sm text-white/60"
            htmlFor="report-note"
          >
            {translate("report.note")}
          </label>
          <textarea
            id="report-note"
            value={note}
            maxLength={120}
            placeholder={translate("report.notePlaceholder")}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-md text-white outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/70"
          />

          <Button type="submit" className="mt-5 w-full" disabled={!ready}>
            {translate("report.send")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
