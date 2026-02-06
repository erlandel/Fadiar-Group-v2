export type ClickOutsideOptions = {
  eventTypes?: Array<"mousedown" | "touchstart">;
  enabled?: boolean;
};

export function onClickOutside(
  target: HTMLElement | null,
  handler: (e: MouseEvent | TouchEvent) => void,
  options?: ClickOutsideOptions
) {
  const types = options?.eventTypes ?? ["mousedown"];
  const enabled = options?.enabled ?? true;

  if (typeof document === "undefined") {
    return () => {};
  }
  if (!enabled || !target) {
    return () => {};
  }

  const listener = (event: Event) => {
    const node = event.target as Node;
    if (target && !target.contains(node)) {
      handler(event as any);
    }
  };

  types.forEach((t) => document.addEventListener(t, listener as any));

  return () => {
    types.forEach((t) => document.removeEventListener(t, listener as any));
  };
}
