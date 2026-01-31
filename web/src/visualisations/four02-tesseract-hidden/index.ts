import { getVertexArray, getEdges } from "./tesseract";
import { renderStereo } from "./renderer";
import type { RotationState } from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original rotation speeds from QBasic four02.bas (FAC = 0.01)
// DFXY=0.93, DFXZ=0.63, DFYZ=0.54, DFXW=0.37, DFYW=0.84, DFZW=0.48
// Scaled down for slower, smoother animation (matching four01 speed)
const FAC = 1;
const ROTATION_STEP: RotationState = {
  xy: 0.0093 * FAC,
  xz: 0.0063 * FAC,
  yz: 0.0054 * FAC,
  xw: 0.0037 * FAC,
  yw: 0.0084 * FAC,
  zw: 0.0048 * FAC,
};

const STEREO_HALF_ANGLE = 0.2 * 0.5; // FISTEREO = 0.2 from QBasic

// Original EGA palette from four02.bas:
// PALETTE 1, 18 (dark blue)
// PALETTE 2, 36 (green)
// PALETTE 3, 46 (yellow)
// PALETTE 4, 61 (bright yellow-white)
const PALETTE = [
  "#0000aa", // 1: EGA 18 = dark blue (X-edges)
  "#00aa00", // 2: EGA 36 = green (Y-edges)
  "#aaaa00", // 3: EGA 46 = yellow (Z-edges)
  "#ffff55", // 4: EGA 61 = bright yellow (W-edges)
];

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

  const vertices = getVertexArray();
  const edges = getEdges();

  // Cumulative rotation angles (matching QBasic F(M,N) array)
  const rotationState: RotationState = {
    xy: 0,
    xz: 0,
    yz: 0,
    xw: 0,
    yw: 0,
    zw: 0,
  };

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
  };

  const frame = () => {
    // Advance rotation angles (matching QBasic loop)
    rotationState.xy += ROTATION_STEP.xy;
    rotationState.xz += ROTATION_STEP.xz;
    rotationState.yz += ROTATION_STEP.yz;
    rotationState.xw += ROTATION_STEP.xw;
    rotationState.yw += ROTATION_STEP.yw;
    rotationState.zw += ROTATION_STEP.zw;

    // Wrap angles to [0, 2π)
    if (rotationState.xy > TWO_PI) rotationState.xy -= TWO_PI;
    if (rotationState.xz > TWO_PI) rotationState.xz -= TWO_PI;
    if (rotationState.yz > TWO_PI) rotationState.yz -= TWO_PI;
    if (rotationState.xw > TWO_PI) rotationState.xw -= TWO_PI;
    if (rotationState.yw > TWO_PI) rotationState.yw -= TWO_PI;
    if (rotationState.zw > TWO_PI) rotationState.zw -= TWO_PI;

    const scaleX = (canvas.width / 640) * 80;
    const scaleY = (canvas.height / 350) * 70;

    renderStereo(ctx, vertices, edges, rotationState, {
      stereoHalfAngle: STEREO_HALF_ANGLE,
      scaleX,
      scaleY,
      palette: PALETTE,
      background: "#080808",
      lineWidth: 1.5,
    });

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
