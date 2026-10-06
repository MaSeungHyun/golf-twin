import { Activity, Inbox, Wrench } from "lucide-react";
import Button from "../../components/Button";
import { useTranslate } from "../../i18n/store";

export default function ClubRail({
  courseOpen,
  historyOpen,
  machineOpen,
  reportCount,
  onOpenCourse,
  onToggleHistory,
  onToggleMachines,
}: {
  courseOpen: boolean;
  historyOpen: boolean;
  machineOpen: boolean;
  reportCount: number;
  onOpenCourse: () => void;
  onToggleHistory: () => void;
  onToggleMachines: () => void;
}) {
  const translate = useTranslate();

  return (
    <>
      <Button
        size="rail"
        variant="outline"
        active={courseOpen}
        icon={<Activity className="size-6" />}
        onClick={onOpenCourse}
      >
        {translate("hud.courseStatus")}
      </Button>
      <Button
        size="rail"
        variant="outline"
        active={historyOpen}
        className="relative"
        icon={<Inbox className="size-6" />}
        onClick={onToggleHistory}
      >
        {translate("hud.reportHistory")}
        {reportCount > 0 ? (
          <span className="absolute top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff5d6c] px-1 text-xs leading-none text-white">
            {reportCount}
          </span>
        ) : null}
      </Button>
      <Button
        size="rail"
        variant="outline"
        active={machineOpen}
        icon={<Wrench className="size-6" />}
        onClick={onToggleMachines}
      >
        {translate("hud.machines")}
      </Button>
    </>
  );
}
