import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useLocation } from "react-router";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { DoubleSide } from "three";
import { useLocale, useTranslate } from "../i18n/store";
import { caddieSelf, caddies, liveProgress } from "../mock/caddie";
import { useReports } from "../report/store";
import { useCourseView } from "./courseView";
import { holeSurfacePoint } from "./Hole";

const pinColor = {
  emergency: "#ff5d6c",
  maintenance: "#ffb020",
} as const;

function CaddieMarker({
  hole,
  baseProgress,
  speed,
  phase,
  color,
  title,
  name,
  visible,
}: {
  hole: number;
  baseProgress: number;
  speed: number;
  phase: number;
  color: string;
  title: string;
  name: string;
  visible: boolean;
}) {
  const group = useRef<Group>(null);
  const disc = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const pulseMat = useRef<MeshBasicMaterial>(null);
  const [shown, setShown] = useState(false);

  useFrame(({ camera, clock }) => {
    const target = group.current;
    const point = holeSurfacePoint(
      hole,
      liveProgress(baseProgress, speed, phase, clock.elapsedTime),
    );
    const next = Boolean(point) && visible;

    if (target) target.visible = next;
    if (point && target && disc.current && ring.current && pulse.current) {
      target.position.copy(point.position);
      const distance = camera.position.distanceTo(point.position);
      const radius = Math.min(Math.max(distance * 0.022, 1.8), 11);
      disc.current.scale.setScalar(radius);
      ring.current.scale.setScalar(radius);
      const wave = (clock.elapsedTime % 1.6) / 1.6;
      pulse.current.scale.setScalar(radius * (1 + wave * 0.7));
      if (pulseMat.current) pulseMat.current.opacity = 0.5 * (1 - wave);
    }

    setShown((current) => (current === next ? current : next));
  });

  return (
    <group ref={group} visible={false}>
      <mesh
        ref={disc}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={20}
        raycast={() => null}
      >
        <circleGeometry args={[0.36, 32]} />
        <meshBasicMaterial
          color={color}
          side={DoubleSide}
          transparent
          opacity={1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={21}
        raycast={() => null}
      >
        <ringGeometry args={[0.48, 0.78, 40]} />
        <meshBasicMaterial
          color={color}
          side={DoubleSide}
          transparent
          opacity={1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={pulse}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={19}
        raycast={() => null}
      >
        <ringGeometry args={[0.9, 1, 40]} />
        <meshBasicMaterial
          ref={pulseMat}
          color={color}
          side={DoubleSide}
          transparent
          opacity={0.45}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      {shown ? (
        <Html zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
          <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center pb-2">
            <div className="rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-xs whitespace-nowrap text-white backdrop-blur-md">
              {title ? (
                <span className="mr-1.5 font-bold text-accent">{title}</span>
              ) : null}
              {name}
            </div>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Pin({
  hole,
  progress,
  color,
  label,
  visible,
}: {
  hole: number;
  progress: number;
  color: string;
  label: string;
  visible: boolean;
}) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const post = useRef<Mesh>(null);
  const head = useRef<Mesh>(null);
  const labelAnchor = useRef<Group>(null);
  const [shown, setShown] = useState(false);

  useFrame(() => {
    const target = group.current;
    const point = holeSurfacePoint(hole, progress);
    const next = Boolean(point) && visible;

    if (target) target.visible = next;
    if (point && target && ring.current && post.current && head.current) {
      const radius = point.radius;
      target.position.copy(point.position);
      ring.current.scale.setScalar(radius);
      post.current.scale.set(radius * 0.08, radius * 2.4, radius * 0.08);
      post.current.position.y = radius * 1.2;
      head.current.scale.setScalar(radius * 0.28);
      head.current.position.y = radius * 2.45;
      if (labelAnchor.current) labelAnchor.current.position.y = radius * 3.1;
    }

    setShown((current) => (current === next ? current : next));
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.62, 1, 40]} />
        <meshBasicMaterial
          color={color}
          side={DoubleSide}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={post} raycast={() => null}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={head} raycast={() => null}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group ref={labelAnchor}>
        {shown ? (
          <Html center zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
            <div className="rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-sm whitespace-nowrap text-white">
              {label}
            </div>
          </Html>
        ) : null}
      </group>
    </group>
  );
}

export default function Markers() {
  const location = useLocation();
  const locale = useLocale((state) => state.locale);
  const translate = useTranslate();
  const mode = useCourseView((state) => state.mode);
  const hole = useCourseView((state) => state.hole);
  const reports = useReports((state) => state.reports);
  const game = location.pathname.startsWith("/game");
  const onHole = (number: number) => mode === "all" || hole === number;

  const visibleCaddies = game ? [caddieSelf] : caddies;

  return (
    <>
      {visibleCaddies.map((caddie) => (
        <CaddieMarker
          key={caddie.id}
          hole={caddie.hole}
          baseProgress={caddie.progress}
          speed={caddie.speed}
          phase={caddie.phase}
          color={caddie.color}
          title={
            game && caddie.id === caddieSelf.id ? translate("caddie.self") : ""
          }
          name={caddie.name[locale]}
          visible={onHole(caddie.hole)}
        />
      ))}
      {!game
        ? reports.map((report, index) => {
          const overlap = reports
            .slice(0, index)
            .filter((item) => item.hole === report.hole).length;

          return (
            <Pin
              key={report.id}
              hole={report.hole}
              progress={Math.min(0.92, report.progress + overlap * 0.08)}
              color={pinColor[report.kind]}
              label={translate(
                report.kind === "emergency"
                  ? "report.kind.emergency"
                  : "report.kind.maintenance",
              )}
              visible={onHole(report.hole)}
            />
          );
        })
        : null}
    </>
  );
}
