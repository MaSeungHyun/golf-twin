import { Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import ClubHud from "./Hud/ClubHud";
import GameHud from "./Hud/GameHud";
import HomeHud from "./Hud/HomeHud";
import LanguageSwitch from "./i18n/LanguageSwitch";
import Viewport from "./Viewport/Viewport";

function ViewportLayout() {
  return (
    <main className="relative h-dvh w-full bg-black">
      <Suspense fallback={null}>
        <Viewport />
      </Suspense>
      <LanguageSwitch />
      <Outlet />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ViewportLayout />}>
          <Route index element={<HomeHud />} />
          <Route path="club" element={<ClubHud />} />
          <Route path="game" element={<GameHud />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
