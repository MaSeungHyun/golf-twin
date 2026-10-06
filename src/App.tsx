import { Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import AppHud from "./Hud/AppHud";
import { useCourseView } from "./Viewport/courseView";
import Viewport from "./Viewport/Viewport";

function ViewportLayout() {
  const mode = useCourseView((state) => state.mode);

  return (
    <main data-view={mode} className="relative h-dvh w-full bg-black">
      <Suspense fallback={null}>
        <Viewport />
      </Suspense>
      <AppHud />
      <Outlet />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ViewportLayout />}>
          <Route index element={<Navigate to="/club" replace />} />
          <Route path="club" element={null} />
          <Route path="game" element={null} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
