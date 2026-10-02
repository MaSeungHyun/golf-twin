import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  CAMERA_POSITION,
  CAMERA_QUATERNION,
  CAMERA_TARGET,
} from "../constants/camera";
import Scene from "./Scene";

function logCamera(event?: unknown) {
  const controls = (event as { target?: OrbitControlsImpl } | undefined)
    ?.target;
  if (!controls?.object) return;

  const round = (value: number) => Number(value.toFixed(2));

  console.log("camera", {
    position: controls.object.position.toArray().map(round),

    quaternion: controls.object.quaternion.toArray().map(round),
    scale: controls.object.scale.toArray().map(round),

    target: controls.target.toArray().map(round),
  });
}

export default function Viewport() {
  return (
    <div className="h-dvh w-full">
      <Canvas
        camera={{
          position: CAMERA_POSITION,
          quaternion: CAMERA_QUATERNION,
          fov: 50,
          near: 0.1,
          far: 5000,
        }}
      >
        <Scene />
        <Environment preset="park" />
        <ambientLight intensity={3} />
        <OrbitControls
          makeDefault
          enableDamping={false}
          target={CAMERA_TARGET}
          onEnd={logCamera}
        />
      </Canvas>
    </div>
  );
}
