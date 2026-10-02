import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AppHud from "./Hud/AppHud";
import Viewport from "./Viewport/Viewport";

function ViewportLayout() {
  return (
    <main className="relative h-dvh w-full bg-black">
      <Suspense fallback={null}>
        <Viewport />
      </Suspense>
      <AppHud />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ViewportLayout />}>
          <Route index element={null} />
          <Route path="club" element={null} />
          <Route path="game" element={null} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
