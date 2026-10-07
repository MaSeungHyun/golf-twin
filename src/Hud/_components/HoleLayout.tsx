import type { ReactNode } from "react";
import HoleInformation from "./HoleInformation";

export default function HoleLayout({ score }: { score?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute top-23 right-5 left-5 z-30 flex items-start gap-16">
      <div className="mr-auto w-max shrink-0 pl-28">
        <HoleInformation />
      </div>
      {score ? <div className="w-full min-w-0 max-w-[52rem]">{score}</div> : null}
    </div>
  );
}
