import { Flag } from "lucide-react";
import Indicator from "../../components/Indicator";
import type { MessageKey } from "../../i18n/messages";
import { useLocale, useTranslate } from "../../i18n/store";
import { caddieSelf } from "../../mock/caddie";
import { findHole, holeName, tee, type HoleInfo } from "../../mock/course";
import { holePlay } from "../../mock/play";
import { useCourseView } from "../../Viewport/courseView";

export function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

const doglegKey = {
  straight: "hud.dogleg.straight",
  left: "hud.dogleg.left",
  right: "hud.dogleg.right",
} as const satisfies Record<HoleInfo["dogleg"], MessageKey>;

function holeStatus(hole: HoleInfo, translate: (key: MessageKey) => string) {
  const status = [translate(doglegKey[hole.dogleg])];

  if (hole.water) status.push(translate("hud.water"));
  if (hole.bunkers) status.push(`${translate("hud.bunker")} ${hole.bunkers}`);
  if (hole.elevation > 0)
    status.push(`${translate("hud.uphill")} ${hole.elevation}m`);
  if (hole.elevation < 0)
    status.push(`${translate("hud.downhill")} ${Math.abs(hole.elevation)}m`);

  return status.join(" · ");
}

function TeeIndicators({ hole }: { hole: HoleInfo }) {
  return (
    <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
      <Indicator color="blue">{tee(hole, "blue").yards}</Indicator>
      <Indicator color="white">{tee(hole, "white").yards}</Indicator>
      <Indicator color="red">{tee(hole, "red").yards}</Indicator>
    </div>
  );
}

export default function HoleInformation() {
  const hole = useCourseView((state) => state.hole);
  const single = useCourseView((state) => state.mode === "single");
  const locale = useLocale((state) => state.locale);
  const translate = useTranslate();

  if (!single) return null;

  const current = findHole(hole);
  const otherGroup = holePlay.find(
    (play) => play.hole === current.number,
  )?.group;
  const inUseByOther =
    otherGroup != null && otherGroup.ko !== caddieSelf.group.ko;

  return (
    <div className="relative mt-5 left-4 pointer-events-none border-none bg-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 font-bold">
        <p className="inline-flex items-center gap-2 text-md">
          <Flag className="size-5 text-accent" />
          {holeLabel(current.number)}
        </p>
        <p className="text-md text-white/80">{holeName(current, locale)}</p>
      </div>
      {inUseByOther && otherGroup ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-maintenance">
          <span className="size-1.5 rounded-full bg-maintenance" />
          {otherGroup[locale]} · {translate("hole.inUse")}
        </p>
      ) : null}
      <div className="mt-2">
        <TeeIndicators hole={current} />
        <div className="mt-1.5 flex items-center gap-6 text-sm text-white/70">
          <span>PAR {current.par}</span>
          <span>HDCP {current.handicap}</span>
        </div>
        <p className="mt-1.5 text-sm leading-snug text-white/70">
          {holeStatus(current, translate)}
        </p>
      </div>
    </div>
  );
}
