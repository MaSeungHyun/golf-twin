import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { EquirectangularReflectionMapping, Euler, SRGBColorSpace } from "three";
import { SKYBOX_ROTATION } from "../constants/skybox";
import { bindSkyOpacity } from "./skyFade";

const HDRI_URL = "/hdri/japan_fuji.png";

export default function Skybox() {
  const scene = useThree((state) => state.scene);
  const source = useTexture(HDRI_URL);
  const texture = useMemo(() => {
    const map = source.clone();
    map.mapping = EquirectangularReflectionMapping;
    map.colorSpace = SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [source]);
  const rotation = useMemo(() => new Euler(...SKYBOX_ROTATION), []);

  useLayoutEffect(() => bindSkyOpacity((opacity) => {
    scene.backgroundIntensity = opacity;
  }), [scene]);

  return (
    <>
      <primitive attach="background" object={texture} />
      <primitive attach="environment" object={texture} />
      <primitive attach="backgroundRotation" object={rotation} />
      <primitive attach="environmentRotation" object={rotation} />
    </>
  );
}
