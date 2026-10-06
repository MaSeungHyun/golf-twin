import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { EquirectangularReflectionMapping, Euler, SRGBColorSpace } from "three";
import { SKYBOX_ROTATION } from "../constants/skybox";
import { getSkyOpacity } from "./skyFade";

const HDRI_URL = "/hdri/japan_fuji.png";

export default function Skybox() {
  const source = useTexture(HDRI_URL);
  const texture = useMemo(() => {
    const map = source.clone();
    map.mapping = EquirectangularReflectionMapping;
    map.colorSpace = SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [source]);
  const rotation = useMemo(() => new Euler(...SKYBOX_ROTATION), []);

  useFrame((state) => {
    state.scene.backgroundIntensity = getSkyOpacity();
  });

  return (
    <>
      <primitive attach="background" object={texture} />
      <primitive attach="environment" object={texture} />
      <primitive attach="backgroundRotation" object={rotation} />
      <primitive attach="environmentRotation" object={rotation} />
    </>
  );
}
