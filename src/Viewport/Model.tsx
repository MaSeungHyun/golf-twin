import { useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect } from "react";
import type { Object3D, PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { bindCourse, focusHole, hoverHole, isCourseSingle, pickHole } from "./Hole";

const MODEL_URL = "/model/scene.glb";

let pressed: Object3D | null = null;
let pressX = 0;
let pressY = 0;
let courseBound = false;

export default function Model() {
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((state) => state.camera);
  const get = useThree((state) => state.get);

  useFrame(() => {
    if (courseBound) return;

    const controls = get().controls as OrbitControlsImpl | null;
    if (!controls) return;

    bindCourse(scene, camera as PerspectiveCamera, controls);
    courseBound = true;
  });

  useEffect(() => {
    const clear = () => {
      hoverHole(null);
      document.body.style.cursor = "";
    };

    window.addEventListener("pointerleave", clear);
    return () => window.removeEventListener("pointerleave", clear);
  }, []);

  return (
    <primitive
      object={scene}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        pressed = pickHole(event.intersections);
        pressX = event.nativeEvent.offsetX;
        pressY = event.nativeEvent.offsetY;
      }}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        if (isCourseSingle()) {
          document.body.style.cursor = "";
          return;
        }

        const hole = pickHole(event.intersections);
        hoverHole(hole);
        document.body.style.cursor = hole ? "pointer" : "";
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        if (isCourseSingle()) return;

        const hole = pickHole(event.intersections);
        const dx = event.nativeEvent.offsetX - pressX;
        const dy = event.nativeEvent.offsetY - pressY;
        const controls = get().controls as OrbitControlsImpl | null;
        if (!hole || hole !== pressed || !controls || dx * dx + dy * dy > 16) {
          pressed = null;
          return;
        }

        pressed = null;
        document.body.style.cursor = "";
        event.stopPropagation();
        focusHole(hole, camera as PerspectiveCamera, controls);
      }}
    />
  );
}

useGLTF.preload(MODEL_URL);
