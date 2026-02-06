import { RefObject } from "react";

export type ClickOutsideOptions = {
  eventTypes?: Array<"mousedown" | "touchstart">;
  enabled?: boolean;
};

export function onClickOutside(
  target: HTMLElement | RefObject<HTMLElement | null> | null,
  handler: (e: MouseEvent | TouchEvent) => void,
  options?: ClickOutsideOptions
) {
  const types = options?.eventTypes ?? ["mousedown"];
  const enabled = options?.enabled ?? true;

  if (typeof document === "undefined") {
    return () => {};
  }

  const listener = (event: Event) => {
    const el = target && "current" in target ? target.current : target;
    if (!el || !enabled) return;

    const node = event.target as Node;
    if (!el.contains(node)) {
      handler(event as any);
    }
  };

  types.forEach((t) => document.addEventListener(t, listener as any));

  return () => {
    types.forEach((t) => document.removeEventListener(t, listener as any));
  };
}
