import { X } from "lucide-react";
import Button from "../components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../components/Dialog";
import Panel from "../components/Panel";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { caddieSelf } from "../mock/caddie";
import { findHole, holes } from "../mock/course";
import { holePlay, type HoleScore } from "../mock/play";
import { groupPlayers } from "../mock/players";
import { readStrokes, useScores } from "../score/store";

const holeNumbers = holes.map((hole) => hole.number);

function withLiveScores(
  scores: HoleScore[],
  hole: number,
  live: Record<string, number>,
) {
  if (hole !== caddieSelf.hole) return scores;

  return scores.map((score, index) => {
    const player = groupPlayers[index];
    if (!player) return score;
    const entered = readStrokes(live, player.id, hole);
    return entered == null ? score : { ...score, strokes: entered };
  });
}

function holeStrokes(score: HoleScore, playHole: number) {
  return holeNumbers.map((hole) => {
    if (hole < playHole) return score.previous[hole - holeNumbers[0]] ?? null;
    if (hole > playHole) return null;
    return score.strokes;
  });
}

function totalToPar(strokes: (number | null)[]) {
  let total = 0;
  let any = false;

  strokes.forEach((value, index) => {
    if (value == null) return;
    any = true;
    total += value - findHole(holeNumbers[index]).par;
  });

  return any ? total : null;
}

function formatTotal(total: number) {
  if (total > 0) return `+${total}`;
  return String(total);
}

export default function CourseStatus({
  open,
  onOpenChange,
  group = null,
  dock = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: { ko: string; jp: string } | null;
  dock?: boolean;
}) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const live = useScores((state) => state.strokes);
  const visiblePlay = holePlay.filter(
    (play) => play.group && (!group || play.group.ko === group.ko),
  );
  const activeHoles = new Set(visiblePlay.map((play) => play.hole));
  const rows = visiblePlay.flatMap((play) => {
    return withLiveScores(play.scores, play.hole, live).map((score) => ({
      key: `${play.hole}-${score.name.ko}`,
      name: score.name,
      group: play.group,
      playHole: play.hole,
      strokes: holeStrokes(score, play.hole),
    }));
  });

  if (!open) return null;

  const title = translate(group ? "hud.scoreRecord" : "hud.courseStatus");
  const closeButton = (
    <Button
      size="sm"
      variant="ghost"
      className="size-8 p-0"
      aria-label={translate("report.close")}
      icon={<X className="size-4" />}
      onClick={() => onOpenChange(false)}
    />
  );
  const table = (
    <table className="w-full border-separate border-spacing-0 text-md">
      <thead>
        <tr className="text-sm text-white/55">
          <th className="sticky top-0 left-0 z-30 w-16 min-w-16 bg-[#0c1210] px-3 py-2.5 text-left font-medium">
            {translate("course.group")}
          </th>
          <th className="sticky top-0 left-16 z-30 w-28 min-w-28 bg-[#0c1210] px-3 py-2.5 text-left font-medium">
            {translate("course.player")}
          </th>
          {holeNumbers.map((hole) => (
            <th
              key={hole}
              className={cn(
                "sticky top-0 z-20 bg-[#0c1210] px-1 py-2.5 text-center font-medium",
                activeHoles.has(hole) ? "text-accent" : "text-white/45",
              )}
            >
              {hole}
            </th>
          ))}
          <th className="sticky top-0 z-20 bg-[#0c1210] px-3 py-2.5 text-center font-medium text-white/70">
            {translate("course.total")}
          </th>
          <th className="sticky top-0 z-20 bg-[#0c1210] px-3 py-2.5 text-center font-medium text-white/70">
            {translate("course.status")}
          </th>
        </tr>
      </thead>
      {visiblePlay.map((play, bundleIndex) => {
        const bundle = rows.filter((row) => row.playHole === play.hole);
        const columns = holeNumbers.length + 4;

        return (
          <tbody key={play.hole}>
            {bundleIndex > 0 ? (
              <tr aria-hidden="true">
                <td colSpan={columns} className="h-3 p-0" />
              </tr>
            ) : null}
            {bundle.map((row, index) => {
              const total = totalToPar(row.strokes);
              const waiting =
                row.strokes[holeNumbers.indexOf(row.playHole)] != null;
              const first = index === 0;
              const last = index === bundle.length - 1;
              const cell = index % 2 === 0 ? "bg-[#101816]" : "bg-[#1a2420]";
              const frame = cn(
                "border-white/20",
                first && "border-t",
                last && "border-b",
              );

              return (
                <tr key={row.key}>
                  {first ? (
                    <td
                      rowSpan={bundle.length}
                      className="sticky left-0 z-10 w-16 min-w-16 border-y border-l border-white/20 bg-[#101816] px-3 text-center align-middle text-white/70"
                    >
                      {row.group?.[locale]}
                    </td>
                  ) : null}
                  <td
                    className={cn(
                      cell,
                      frame,
                      "sticky left-16 z-10 w-28 min-w-28 px-3 py-2.5 font-medium text-white",
                    )}
                  >
                    {row.name[locale]}
                  </td>
                  {row.strokes.map((strokes, strokeIndex) => {
                    const hole = holeNumbers[strokeIndex];
                    const current = hole === row.playHole;

                    return (
                      <td
                        key={hole}
                        className={cn(cell, frame, "px-1 py-2 text-center")}
                      >
                        <span
                          className={cn(
                            "inline-flex min-w-8 items-center justify-center px-1.5 py-0.5 tabular-nums",
                            current && "rounded-md border border-accent",
                            strokes == null ? "text-white/35" : "text-white",
                          )}
                        >
                          {strokes ?? "—"}
                        </span>
                      </td>
                    );
                  })}
                  <td
                    className={cn(
                      cell,
                      frame,
                      "px-3 py-2.5 text-center font-semibold tabular-nums",
                      total == null
                        ? "text-white/35"
                        : total < 0
                          ? "text-accent"
                          : "text-white",
                    )}
                  >
                    {total == null ? "—" : formatTotal(total)}
                  </td>
                  <td
                    className={cn(
                      cell,
                      frame,
                      "border-r px-3 py-2.5 text-center",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold",
                        waiting ? "text-amber-400" : "text-accent",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          waiting ? "bg-amber-400" : "bg-accent",
                        )}
                      />
                      {translate(waiting ? "course.waiting" : "course.playing")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        );
      })}
    </table>
  );

  if (dock) {
    return (
      <Panel className="pointer-events-auto w-[min(72rem,calc(100vw-18rem))] overflow-hidden">
        <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-3">
          <p className="text-md font-bold">{title}</p>
          {closeButton}
        </div>
        <div className="scroll-thumb overflow-x-auto">
          <div className="px-3 pb-3">{table}</div>
        </div>
      </Panel>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        overlayClassName="bg-black/25"
        className="flex h-[calc(100dvh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-none flex-col overflow-hidden border-white/15 bg-neutral-800/50 p-0 shadow-lg backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-3 py-3 pr-2 pl-5">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogClose asChild>{closeButton}</DialogClose>
        </div>
        <div className="scroll-thumb min-h-0 flex-1 overflow-auto">
          <div className="px-5 pb-5">{table}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
