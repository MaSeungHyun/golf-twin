import { Minus, Plus, X } from "lucide-react";
import Button from "../components/Button";
import Panel from "../components/Panel";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { caddieSelf } from "../mock/caddie";
import { findHole } from "../mock/course";
import { groupPlayers } from "../mock/players";
import { readStrokes, useScores } from "../score/store";

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

function resultKey(strokes: number, par: number): MessageKey | null {
  const diff = strokes - par;
  if (diff === -2) return "score.eagle";
  if (diff === -1) return "score.birdie";
  if (diff === 0) return "score.parResult";
  if (diff === 1) return "score.bogey";
  if (diff === 2) return "score.double";
  return null;
}

export default function ScoreSheet({ onClose }: { onClose: () => void }) {
  const translate = useTranslate();
  const locale = useLocale((state) => state.locale);
  const hole = findHole(caddieSelf.hole);
  const strokes = useScores((state) => state.strokes);
  const setStrokes = useScores((state) => state.setStrokes);

  const change = (playerId: string, delta: number) => {
    const current = readStrokes(strokes, playerId, hole.number) ?? hole.par;
    setStrokes(
      playerId,
      hole.number,
      Math.min(hole.par + 6, Math.max(1, current + delta)),
    );
  };

  return (
    <Panel className="pointer-events-auto absolute top-1/2 right-40 z-20 flex max-h-[min(34rem,calc(100dvh-8rem))] w-80 -translate-y-1/2 flex-col px-4 pt-1 pb-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-md font-bold">{translate("hud.scoreManage")}</p>
        <Button
          size="sm"
          variant="ghost"
          className="size-8 p-0"
          aria-label={translate("report.close")}
          icon={<X className="size-4" />}
          onClick={onClose}
        />
      </div>
      <p className="mt-1 text-sm text-white/70">
        {holeLabel(hole.number)} · PAR {hole.par} · {caddieSelf.group[locale]}
      </p>
      <ul className="scroll-thumb mt-3 flex flex-col gap-2 overflow-y-auto pr-1">
        {groupPlayers.map((player) => {
          const value = readStrokes(strokes, player.id, hole.number);
          const result = value == null ? null : resultKey(value, hole.par);
          const diff = value == null ? 0 : value - hole.par;

          return (
            <li
              key={player.id}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-md font-bold">{player.name[locale]}</p>
                <p
                  className={cn(
                    "text-sm",
                    result === "score.parResult" ? "text-accent" : "text-white/70",
                  )}
                >
                  {value == null
                    ? translate("score.unset")
                    : result
                      ? translate(result)
                      : `${diff > 0 ? "+" : ""}${diff}`}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="size-10 p-0"
                  aria-label={translate("score.decrease")}
                  icon={<Minus className="size-4" />}
                  onClick={() => change(player.id, -1)}
                />
                <p className="w-8 text-center text-md font-bold tabular-nums">
                  {value ?? "–"}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="size-10 p-0"
                  aria-label={translate("score.increase")}
                  icon={<Plus className="size-4" />}
                  onClick={() => change(player.id, 1)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => setStrokes(player.id, hole.number, hole.par)}
                >
                  {translate("score.parResult")}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
