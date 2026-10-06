import gsap from "gsap";
import type { Object3D, PerspectiveCamera } from "three";
import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  Sphere,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  CAMERA_RESET_POSITION,
  CAMERA_RESET_QUATERNION,
  CAMERA_RESET_TARGET,
} from "../constants/camera";
import { useCourseView, type CourseMode } from "./courseView";
import { getSkyOpacity, setSkyOpacity } from "./skyFade";

const HOLE_NAME = /^Hole\d+$/;
const HOLE_GROUP = /^(Hole\d+)_Group$/;
const HIGHLIGHT = "#2f6bff";
const SURFACE_GAP = 2;

const box = new Box3();
const center = new Vector3();
const sphere = new Sphere();
const overviewPosition = new Vector3();
const overviewTarget = new Vector3();
const singlePosition = new Vector3();
const singleTarget = new Vector3();
const focusPosition = new Vector3();

type FadeOriginal = {
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
};

let hovered: Object3D | null = null;
let courseRoot: Object3D | null = null;
let activeCamera: PerspectiveCamera | null = null;
let activeControls: OrbitControlsImpl | null = null;
let focusedGroupName = "";
let focusedHole = 1;
let transition: gsap.core.Timeline | null = null;
let transitionId = 0;
let courseMode: CourseMode = "all";

export function isCourseSingle() {
  return courseMode === "single";
}

type OriginalMaterial = {
  emissive: number;
  emissiveIntensity: number;
};

export function findHole(object: Object3D | null) {
  let current = object;

  while (current) {
    if (HOLE_NAME.test(current.name)) return current;

    const match = HOLE_GROUP.exec(current.name);
    if (match) {
      return current.children.find((child) => child.name === match[1]) ?? null;
    }

    current = current.parent;
  }

  return null;
}

export function pickHole(
  intersections: { object: Object3D; distance: number }[],
) {
  const nearest = intersections[0];
  if (!nearest) return null;

  for (const hit of intersections) {
    const hole = findHole(hit.object);
    if (!hole) continue;
    if (hit.distance - nearest.distance > SURFACE_GAP) return null;
    return hole;
  }

  return null;
}

function holeMaterials(hole: Object3D) {
  const materials: MeshStandardMaterial[] = [];

  hole.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    if (!child.userData.holeMaterialsReady) {
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
      child.userData.holeMaterialsReady = true;
    }

    const unique = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of unique) {
      if (material instanceof MeshStandardMaterial) materials.push(material);
    }
  });

  return materials;
}

function remember(material: MeshStandardMaterial) {
  if (material.userData.holeOriginal) return material.userData.holeOriginal as OriginalMaterial;

  const original: OriginalMaterial = {
    emissive: material.emissive.getHex(),
    emissiveIntensity: material.emissiveIntensity,
  };
  material.userData.holeOriginal = original;
  return original;
}

export function hoverHole(object: Object3D | null) {
  if (courseMode === "single") return;

  const next = findHole(object);
  if (next === hovered) return;

  if (hovered) setHighlight(hovered, false);
  hovered = next;
  if (hovered) setHighlight(hovered, true);
}

function setHighlight(hole: Object3D, active: boolean) {
  for (const material of holeMaterials(hole)) {
    const original = remember(material);

    if (active) {
      material.emissive.set(HIGHLIGHT);
      material.emissiveIntensity = 1;
    } else {
      material.emissive.setHex(original.emissive);
      material.emissiveIntensity = original.emissiveIntensity;
    }
  }
}

function holeGroup(hole: Object3D) {
  let current: Object3D | null = hole;

  while (current) {
    if (HOLE_GROUP.test(current.name)) return current;
    current = current.parent;
  }

  return hole;
}

function fadeMaterials(object: Object3D) {
  const materials: MeshStandardMaterial[] = [];

  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    if (!child.userData.fadeReady) {
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
      child.userData.fadeReady = true;
    }

    const list = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of list) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      if (!material.userData.fadeOriginal) {
        material.userData.fadeOriginal = {
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        } satisfies FadeOriginal;
      }
      materials.push(material);
    }
  });

  return materials;
}

function fadeAmount(materials: MeshStandardMaterial[]) {
  const material = materials[0];
  if (!material) return 1;

  const original = material.userData.fadeOriginal as FadeOriginal;
  if (!original.opacity) return material.opacity;
  return material.opacity / original.opacity;
}

function restoreObject(object: Object3D) {
  object.visible = true;

  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const list = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of list) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      const original = material.userData.fadeOriginal as FadeOriginal | undefined;
      if (!original) continue;

      material.opacity = original.opacity;
      material.transparent = original.transparent;
      material.depthWrite = original.depthWrite;
    }
  });
}

function restoreCourseObjects() {
  if (!courseRoot) return;

  for (const child of courseRoot.children) restoreObject(child);
}

function applyFade(materials: MeshStandardMaterial[], amount: number) {
  for (const material of materials) {
    const original = material.userData.fadeOriginal as FadeOriginal;
    material.opacity = original.opacity * amount;
  }
}

function frameGroup(group: Object3D, camera: PerspectiveCamera) {
  box.setFromObject(group);
  box.getCenter(center);
  box.getBoundingSphere(sphere);

  const fov = (camera.fov * Math.PI) / 180;
  const distance = (sphere.radius / Math.sin(fov / 2)) * 1.2;
  const elevation = Math.PI / 4;
  const azimuth = Math.PI / 4;
  const horizontal = distance * Math.cos(elevation);

  focusPosition.set(
    center.x + horizontal * Math.cos(azimuth),
    center.y + distance * Math.sin(elevation),
    center.z + horizontal * Math.sin(azimuth),
  );

  return { position: focusPosition.clone(), target: center.clone() };
}

function moveTogether(
  camera: PerspectiveCamera,
  controls: OrbitControlsImpl,
  toPosition: Vector3,
  toTarget: Vector3,
  others: Object3D[],
  reveal: boolean,
  incoming: Object3D[] = [],
) {
  transition?.kill();
  const id = ++transitionId;
  courseMode = reveal ? "all" : "single";

  const materials = reveal ? [] : others.flatMap(fadeMaterials);
  for (const material of materials) {
    if (material.transparent && !material.depthWrite) continue;
    material.transparent = true;
    material.depthWrite = false;
  }
  if (reveal) {
    restoreCourseObjects();
    setSkyOpacity(1);
  }

  const incomingMaterials = reveal
    ? []
    : incoming.flatMap((object) => {
        object.visible = true;
        return fadeMaterials(object);
      });
  for (const material of incomingMaterials) {
    material.transparent = true;
    material.depthWrite = false;
    material.opacity = 0;
  }
  const incomingFade = { amount: 0 };

  const fromPosition = camera.position.clone();
  const fromTarget = controls.target.clone();
  controls.update();
  camera.position.copy(fromPosition);
  controls.target.copy(fromTarget);
  controls.enabled = false;

  const pose = {
    px: fromPosition.x,
    py: fromPosition.y,
    pz: fromPosition.z,
    tx: fromTarget.x,
    ty: fromTarget.y,
    tz: fromTarget.z,
  };
  const fade = { amount: fadeAmount(materials) };
  const sky = { opacity: getSkyOpacity() };

  transition = gsap.timeline({
    onComplete: () => {
      if (id !== transitionId) return;

      transition = null;
      controls.enabled = true;
      controls.update();
      useCourseView.getState().setView(courseMode, focusedHole);

      if (reveal) {
        restoreCourseObjects();
        return;
      }

      for (const object of others) object.visible = false;
      for (const object of incoming) restoreObject(object);
    },
  });

  transition.to(
    pose,
    {
      px: toPosition.x,
      py: toPosition.y,
      pz: toPosition.z,
      tx: toTarget.x,
      ty: toTarget.y,
      tz: toTarget.z,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.set(pose.px, pose.py, pose.pz);
        controls.target.set(pose.tx, pose.ty, pose.tz);
        camera.lookAt(controls.target);
      },
    },
    0,
  );

  transition.to(
    fade,
    {
      amount: reveal ? 1 : 0,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => applyFade(materials, fade.amount),
    },
    0,
  );

  if (incomingMaterials.length) {
    transition.to(
      incomingFade,
      {
        amount: 1,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => applyFade(incomingMaterials, incomingFade.amount),
      },
      0,
    );
  }

  transition.to(
    sky,
    {
      opacity: reveal ? 1 : 0,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => setSkyOpacity(sky.opacity),
    },
    0,
  );
}

export function bindCourse(
  root: Object3D,
  camera: PerspectiveCamera,
  controls: OrbitControlsImpl,
) {
  courseRoot = root;
  activeCamera = camera;
  activeControls = controls;
}

export function showCourseHole(number: number) {
  if (!courseRoot || !activeCamera || !activeControls) return;

  const group = courseRoot.children.find((child) => child.name === `Hole${number}_Group`);
  if (!group || (group.name === focusedGroupName && courseMode === "single")) return;

  hoverHole(null);
  const fromAll = courseMode !== "single";

  if (fromAll) {
    overviewPosition.copy(activeCamera.position);
    overviewTarget.copy(activeControls.target);
    const terrain = courseRoot.children.find((child) => child.name === "Terrain");
    if (terrain) terrain.visible = false;
  }

  focusedGroupName = group.name;
  focusedHole = number;
  useCourseView.getState().setView(useCourseView.getState().mode, number);

  const { position, target } = frameGroup(group, activeCamera);
  singlePosition.copy(position);
  singleTarget.copy(target);
  const terrain = courseRoot.children.find((child) => child.name === "Terrain");
  const others = courseRoot.children.filter(
    (child) => child !== terrain && child !== group,
  );

  moveTogether(
    activeCamera,
    activeControls,
    position,
    target,
    others,
    false,
    fromAll ? [] : [group],
  );
}

export function focusHole(
  object: Object3D,
  camera: PerspectiveCamera,
  controls: OrbitControlsImpl,
) {
  if (courseMode === "single") return;

  const hole = findHole(object);
  if (!hole) return;

  const group = holeGroup(hole);
  const scene = group.parent;
  if (!scene) return;

  bindCourse(scene, camera, controls);
  showCourseHole(Number(group.name.replace(/\D/g, "")));
}

function placeCamera(
  position: Vector3,
  target: Vector3,
  quaternion?: readonly [number, number, number, number],
) {
  if (!activeCamera || !activeControls) return;

  const camera = activeCamera;
  const controls = activeControls;
  const fromPosition = camera.position.clone();
  const fromTarget = controls.target.clone();
  controls.update();
  camera.position.copy(fromPosition);
  controls.target.copy(fromTarget);

  camera.position.copy(position);
  controls.target.copy(target);
  if (quaternion) camera.quaternion.set(...quaternion);
  else camera.lookAt(target);
  camera.scale.set(1, 1, 1);
  controls.enabled = true;
  controls.update();
}

export function resetCamera() {
  if (!activeCamera || !activeControls) return;

  transition?.kill();
  transition = null;

  if (courseMode === "single") {
    placeCamera(singlePosition, singleTarget);
    return;
  }

  overviewPosition.set(...CAMERA_RESET_POSITION);
  overviewTarget.set(...CAMERA_RESET_TARGET);
  placeCamera(overviewPosition, overviewTarget, CAMERA_RESET_QUATERNION);
}

export function restoreCourse() {
  if (!courseRoot || !activeCamera || !activeControls) return;
  if (courseMode !== "single") return;

  const terrain = courseRoot.children.find((child) => child.name === "Terrain");
  if (terrain) restoreObject(terrain);

  const others = courseRoot.children.filter(
    (child) => child !== terrain && child.name !== focusedGroupName,
  );

  moveTogether(
    activeCamera,
    activeControls,
    overviewPosition,
    overviewTarget,
    others,
    true,
  );
}
