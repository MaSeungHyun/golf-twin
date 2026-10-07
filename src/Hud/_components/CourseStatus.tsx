import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../../components/Dialog";
import Panel from "../../components/Panel";
import { useLocale, useTranslate } from "../../i18n/store";
import { cn } from "../../lib/style";
import { caddieSelf } from "../../mock/caddie";
import { findHole, holes } from "../../mock/course";
import { holePlay, type HoleScore } from "../../mock/play";
import { groupPlayers } from "../../mock/players";
import { readStrokes, useScores } from "../../score/store";

const holeNumbers = holes.map((hole) => hole.number);

function holeStrokes(
  score: HoleScore,
  playHole: number,
  playerId: string | null,
  live: Record<string, number>,
) {
  return holeNumbers.map((hole) => {
    if (playerId) {
      const entered = readStrokes(live, playerId, hole);
      if (entered != null) return entered;
    }
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
  const setStrokes = useScores((state) => state.setStrokes);
  const visiblePlay = holePlay.filter(
    (play) => play.group && (!group || play.group.ko === group.ko),
  );
  const activeHoles = new Set(visiblePlay.map((play) => play.hole));
  const rows = visiblePlay.flatMap((play) => {
    const own = play.group?.ko === caddieSelf.group.ko;
    return play.scores.map((score) => {
      const player = own
        ? groupPlayers.find((item) => item.name.ko === score.name.ko)
        : undefined;

      return {
        key: `${play.hole}-${score.name.ko}`,
        name: score.name,
        group: play.group,
        playHole: play.hole,
        playerId: player?.id ?? null,
        strokes: holeStrokes(score, play.hole, player?.id ?? null, live),
      };
    });
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
                        waiting ? "text-maintenance" : "text-accent",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          waiting ? "bg-maintenance" : "bg-accent",
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
      <Panel className="pointer-events-auto w-full overflow-hidden border-white/15 bg-[#161e1c]/70 backdrop-blur-md backdrop-brightness-100">
        <div className="scroll-thumb overflow-x-auto px-5 py-2">
          <Scorecard
            rows={rows}
            locale={locale}
            totalLabel={translate("course.total")}
            onChange={setStrokes}
          />
        </div>
      </Panel>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        overlayClassName="bg-black/25"
        className="inset-5 flex h-auto w-auto max-w-none translate-none flex-col overflow-hidden border-white/15 bg-neutral-800/50 p-0 shadow-lg backdrop-blur-xl"
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

function strokeTotal(strokes: (number | null)[]) {
  let total = 0;
  let any = false;

  for (const value of strokes) {
    if (value == null) continue;
    any = true;
    total += value;
  }

  return any ? total : null;
}

function scoreTone(value: number | null, par: number) {
  if (value == null) return "text-white/30";
  const diff = value - par;
  if (diff <= -1) return "bg-[#2f6dff] text-white";
  if (diff === 1) return "bg-[#d4a437] text-[#1c1404]";
  if (diff >= 2) return "bg-[#6f564c] text-white";
  return "text-white";
}

function commitDraft(draft: string, par: number) {
  const text = draft.trim();
  if (!text) return null;
  const next = Number(text);
  if (!Number.isInteger(next) || next < 1 || next > par + 6) return undefined;
  return next;
}

function ScoreCell({
  value,
  par,
  hole,
  editing,
  draft,
  onDraft,
  onOpen,
  onClose,
}: {
  value: number | null;
  par: number;
  hole: number;
  editing: boolean;
  draft: string;
  onDraft: (draft: string) => void;
  onOpen: () => void;
  onClose: (save: boolean) => void;
}) {
  const marked = value != null && value !== par;

  return (
    <td className="px-0 py-0.5 text-center">
      {editing ? (
        <input
          autoFocus
          inputMode="numeric"
          value={draft}
          aria-label={`HOLE ${hole}`}
          onChange={(event) =>
            onDraft(event.target.value.replace(/\D/g, "").slice(0, 2))
          }
          onBlur={() => onClose(true)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== "Escape") return;
            event.preventDefault();
            onClose(event.key === "Enter");
          }}
          className="h-6 w-7 rounded-md bg-white/10 text-center text-sm font-semibold text-white outline-none"
        />
      ) : (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onOpen}
          className={cn(
            "inline-flex h-6 w-7 items-center justify-center rounded-md text-sm font-semibold tabular-nums",
            scoreTone(value, par),
            !marked && "bg-transparent",
          )}
        >
          {value ?? "-"}
        </button>
      )}
    </td>
  );
}

function Scorecard({
  rows,
  locale,
  totalLabel,
  onChange,
}: {
  rows: {
    key: string;
    name: { ko: string; jp: string };
    playerId: string | null;
    strokes: (number | null)[];
  }[];
  locale: "ko" | "jp";
  totalLabel: string;
  onChange: (playerId: string, hole: number, strokes: number | null) => void;
}) {
  const pars = holeNumbers.map((hole) => findHole(hole).par);
  const parTotal = pars.reduce((sum, par) => sum + par, 0);
  const currentIndex = holeNumbers.indexOf(caddieSelf.hole);
  const nameWidth = "6.5rem";
  const rootRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLTableCellElement>(null);
  const [frame, setFrame] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [edit, setEdit] = useState<{
    key: string;
    hole: number;
    draft: string;
  } | null>(null);
  const editRef = useRef(edit);
  editRef.current = edit;

  const closeEdit = (save: boolean) => {
    const current = editRef.current;
    if (!current) return;
    editRef.current = null;
    setEdit(null);
    if (!save) return;
    const row = rows.find((item) => item.key === current.key);
    const par = pars[holeNumbers.indexOf(current.hole)];
    const next = row ? commitDraft(current.draft, par) : undefined;
    if (row?.playerId && next !== undefined) {
      onChange(row.playerId, current.hole, next);
    }
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const cell = currentRef.current;
    if (!root || !cell) return;

    const place = () => {
      const rootBox = root.getBoundingClientRect();
      const cellBox = cell.getBoundingClientRect();
      setFrame({
        left: cellBox.left - rootBox.left,
        width: cellBox.width,
      });
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    return () => observer.disconnect();
  }, [currentIndex, rows.length, locale]);

  return (
    <div ref={rootRef} className="relative w-full">
      {frame ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0.5 bottom-0.5 z-10 rounded-md border-2 border-accent"
          style={{ left: frame.left, width: frame.width }}
        />
      ) : null}
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <colgroup>
          <col style={{ width: nameWidth }} />
          {holeNumbers.map((hole) => (
            <col key={hole} />
          ))}
          <col style={{ width: "4rem" }} />
        </colgroup>
        <thead>
          <tr className="h-7 text-white/45">
            <th className="px-2 text-left font-medium tracking-wide">HOLE</th>
            {holeNumbers.map((hole) => (
              <th
                key={hole}
                ref={hole === caddieSelf.hole ? currentRef : undefined}
                className={cn(
                  "text-center font-medium",
                  hole === caddieSelf.hole ? "text-white" : "text-white/55",
                )}
              >
                {hole}
              </th>
            ))}
            <th className="text-center font-medium tracking-wide text-white/45">
              {totalLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-7">
            <th className="px-2 text-left font-medium tracking-wide text-white/45">
              PAR
            </th>
            {pars.map((par, index) => (
              <td
                key={holeNumbers[index]}
                className="text-center text-white/55 tabular-nums"
              >
                {par}
              </td>
            ))}
            <td className="text-center text-white/55 tabular-nums">{parTotal}</td>
          </tr>
          {rows.map((row) => {
            const total = strokeTotal(row.strokes);
            return (
              <tr key={row.key} className="h-7">
                <th className="px-2 text-left font-medium text-white">
                  {row.name[locale]}
                </th>
                {row.strokes.map((strokes, strokeIndex) => {
                  const hole = holeNumbers[strokeIndex];
                  const editing = edit?.key === row.key && edit.hole === hole;
                  return (
                    <ScoreCell
                      key={hole}
                      value={strokes}
                      par={pars[strokeIndex]}
                      hole={hole}
                      editing={editing}
                      draft={editing ? edit.draft : ""}
                      onDraft={(draft) =>
                        setEdit((current) =>
                          current &&
                          current.key === row.key &&
                          current.hole === hole
                            ? { ...current, draft }
                            : current,
                        )
                      }
                      onOpen={() => {
                        if (
                          editRef.current &&
                          (editRef.current.key !== row.key ||
                            editRef.current.hole !== hole)
                        ) {
                          closeEdit(true);
                        }
                        const next = {
                          key: row.key,
                          hole,
                          draft: strokes == null ? "" : String(strokes),
                        };
                        editRef.current = next;
                        setEdit(next);
                      }}
                      onClose={closeEdit}
                    />
                  );
                })}
                <td
                  className={cn(
                    "text-center font-medium tabular-nums",
                    total == null ? "text-white/30" : "text-white",
                  )}
                >
                  {total ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
