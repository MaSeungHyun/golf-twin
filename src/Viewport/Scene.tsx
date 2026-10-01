import { Bounds } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";
import Skybox from "./Skybox";

export default function Scene() {
  return (
    <Suspense fallback={null}>
      <Skybox />
      <Bounds clip margin={1.2}>
        <Model />
      </Bounds>
    </Suspense>
  );
}
