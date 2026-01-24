import { generateSpherePoints } from "./sphere4d";
import { renderStereo } from "./renderer";

const POINT_COUNT = 1000;
const XW_ROTATION_STEP = 0.03; // Original DFXW
const STEREO_HALF_ANGLE = 0.15 * 0.5; // FISTEREO * 0.5

// Original QBasic palette colors (EGA indices 18, 36, 46, 61 approximated)
const PALETTE = ["#0000aa", "#00aa00", "#00aaaa", "#ffff55"];

export function createVisualization(canvas: HTMLCanvasElement): {
  resize: () => void;
} {
  const ctx = (() => {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to acquire 2D rendering context.");
    }
    return context;
  })();

  const points = generateSpherePoints(POINT_COUNT);
  let xwAngle = 0;

  // Precompute Y coordinates (they never change in the original)
  let precomputedY: number[] = [];

  const resize = () => {
    const container = canvas.parentElement;
    if (container) {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(320, Math.floor(bounds.width));
      const heightLimit = Math.floor(window.innerHeight * 0.65);
      const height = Math.max(
        240,
        Math.min(heightLimit, Math.floor(width * (350 / 640))),
      );
      canvas.width = width;
      canvas.height = height;
    } else {
      canvas.width = 640;
      canvas.height = 350;
    }

    // Recompute Y positions based on current canvas height
    const scaleY = (canvas.height / 350) * 70;
    const shiftY = canvas.height / 2;
    precomputedY = points.map((p) => p.y * scaleY + shiftY);
  };

  const frame = () => {
    xwAngle += XW_ROTATION_STEP;
    if (xwAngle >= Math.PI * 2) {
      xwAngle -= Math.PI * 2;
    }

    const scaleX = (canvas.width / 640) * 80;
    const scaleY = (canvas.height / 350) * 70;

    renderStereo(
      ctx,
      points,
      precomputedY,
      {
        stereoHalfAngle: STEREO_HALF_ANGLE,
        pointRadius: 2,
        scaleX,
        scaleY,
        palette: PALETTE,
        background: "#080808",
      },
      xwAngle,
    );

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
