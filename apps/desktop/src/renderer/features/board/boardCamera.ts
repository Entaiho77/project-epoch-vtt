/**
 * Pure 2D camera math for the board's pan/zoom viewport. The mapping is:
 *   screen = world * zoom + offset
 * where `offset` is (x, y). Keeping this separate from the canvas component makes the
 * coordinate transforms unit-testable (they're the easy thing to get subtly wrong).
 */
export interface Camera {
  zoom: number;
  x: number;
  y: number;
}

export function worldToScreen(cam: Camera, wx: number, wy: number): { x: number; y: number } {
  return { x: wx * cam.zoom + cam.x, y: wy * cam.zoom + cam.y };
}

export function screenToWorld(cam: Camera, sx: number, sy: number): { x: number; y: number } {
  return { x: (sx - cam.x) / cam.zoom, y: (sy - cam.y) / cam.zoom };
}

/**
 * Zoom by `factor`, clamped to [min, max], while keeping the world point currently under
 * (sx, sy) fixed on screen. Returns the SAME object when the zoom is already clamped, so
 * callers can cheaply detect a no-op.
 */
export function zoomAt(
  cam: Camera,
  sx: number,
  sy: number,
  factor: number,
  min: number,
  max: number,
): Camera {
  const zoom = Math.min(max, Math.max(min, cam.zoom * factor));
  if (zoom === cam.zoom) return cam;
  const w = screenToWorld(cam, sx, sy);
  return { zoom, x: sx - w.x * zoom, y: sy - w.y * zoom };
}

/** Pan the camera by a screen-space drag delta. */
export function pan(cam: Camera, dx: number, dy: number): Camera {
  return { zoom: cam.zoom, x: cam.x + dx, y: cam.y + dy };
}

/** Where each map's view was left, per computer (a convenience; fine if storage is unavailable). */
const VIEW_KEY = (mapId: string) => `epoch.board.view.${mapId}`;

export function loadView(mapId: string): Camera | null {
  try {
    const raw = localStorage.getItem(VIEW_KEY(mapId));
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Camera>;
    if (![v.zoom, v.x, v.y].every((n) => typeof n === 'number' && Number.isFinite(n))) return null;
    if ((v.zoom as number) <= 0) return null;
    return { zoom: v.zoom as number, x: v.x as number, y: v.y as number };
  } catch {
    return null;
  }
}

export function saveView(mapId: string, cam: Camera): void {
  try {
    localStorage.setItem(VIEW_KEY(mapId), JSON.stringify({ zoom: cam.zoom, x: Math.round(cam.x), y: Math.round(cam.y) }));
  } catch {
    // Remembering the view is a nicety; ignore storage problems.
  }
}
