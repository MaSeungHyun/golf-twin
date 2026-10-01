import { useGLTF } from "@react-three/drei";

const MODEL_URL = "/model/scene.glb";

export default function Model() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_URL);
