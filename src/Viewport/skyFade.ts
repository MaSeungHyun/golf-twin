type ApplySkyOpacity = (opacity: number) => void;

const listeners = new Set<ApplySkyOpacity>();
let opacity = 1;

export function getSkyOpacity() {
  return opacity;
}

export function setSkyOpacity(value: number) {
  opacity = value;
  for (const apply of listeners) apply(value);
}

export function bindSkyOpacity(apply: ApplySkyOpacity) {
  listeners.add(apply);
  apply(opacity);
  return () => listeners.delete(apply);
}
