import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Header from "./_components/Header";
import ViewRail from "./_components/ViewRail";
import ClubStage from "./club/Stage";
import GameStage from "./game/Stage";

function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const covered = window.innerHeight - viewport.offsetTop - viewport.height;
      setInset(covered > 120 ? covered : 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}

export default function AppHud() {
  const location = useLocation();
  const game = location.pathname.startsWith("/game");
  const keyboardInset = useKeyboardInset();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-white"
      style={
        keyboardInset > 0 ? { paddingBottom: 20 + keyboardInset } : undefined
      }
    >
      <Header />
      <div className="pointer-events-none absolute top-1/2 left-5 z-40 -translate-y-1/2">
        <ViewRail />
      </div>
      <div className={game ? "contents" : "hidden"}>
        <GameStage />
      </div>
      <div className={game ? "hidden" : "contents"}>
        <ClubStage />
      </div>
    </div>
  );
}
