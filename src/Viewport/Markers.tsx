import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { TriangleAlert, Wrench } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "react-router";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { DoubleSide } from "three";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { caddieSelf, caddies, liveProgress } from "../mock/caddie";
import { useReports } from "../report/store";
import { useCourseView } from "./courseView";
import { holeSurfacePoint } from "./Hole";

function themeColor(token: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

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
  emergency,
  label,
  visible,
}: {
  hole: number;
  progress: number;
  emergency: boolean;
  label: string;
  visible: boolean;
}) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const pulseMat = useRef<MeshBasicMaterial>(null);
  const post = useRef<Mesh>(null);
  const dot = useRef<Mesh>(null);
  const labelAnchor = useRef<Group>(null);
  const [shown, setShown] = useState(false);
  const color = themeColor(emergency ? "--color-emergency" : "--color-maintenance");
  const tone = emergency ? "bg-emergency" : "bg-maintenance";

  useFrame(({ camera, clock }) => {
    const target = group.current;
    const point = holeSurfacePoint(hole, progress);
    const next = Boolean(point) && visible;

    if (target) target.visible = next;
    if (
      point &&
      target &&
      ring.current &&
      pulse.current &&
      post.current &&
      dot.current &&
      labelAnchor.current
    ) {
      target.position.copy(point.position);
      const distance = camera.position.distanceTo(point.position);
      const radius = Math.min(Math.max(distance * 0.012, 2.2), 9);
      ring.current.scale.setScalar(radius);
      const wave = (clock.elapsedTime % 1.6) / 1.6;
      pulse.current.scale.setScalar(radius * (1 + wave * 0.85));
      if (pulseMat.current) pulseMat.current.opacity = 0.55 * (1 - wave);
      post.current.scale.set(radius * 0.04, radius * 2.4, radius * 0.04);
      post.current.position.y = radius * 1.2;
      dot.current.scale.setScalar(radius);
      labelAnchor.current.position.y = radius * 2.45;
    }

    setShown((current) => (current === next ? current : next));
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.62, 1, 48]} />
        <meshBasicMaterial
          color={color}
          side={DoubleSide}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={pulse} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.92, 1.02, 48]} />
        <meshBasicMaterial
          ref={pulseMat}
          color={color}
          side={DoubleSide}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={dot} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial
          color={color}
          side={DoubleSide}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={post} raycast={() => null}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group ref={labelAnchor}>
        {shown ? (
          <Html zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
            <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center pb-1">
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold whitespace-nowrap text-white shadow-lg",
                  tone,
                )}
              >
                {emergency ? (
                  <TriangleAlert className="size-3.5" />
                ) : (
                  <Wrench className="size-3.5" />
                )}
                {label}
              </div>
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
        ? reports
            .filter((report) => report.resolvedAt == null)
            .map((report, index, open) => {
              const overlap = open
                .slice(0, index)
                .filter((item) => item.hole === report.hole).length;

              return (
                <Pin
                  key={report.id}
                  hole={report.hole}
                  progress={Math.min(0.92, report.progress + overlap * 0.08)}
                  emergency={report.kind === "emergency"}
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
