import { getVertexArray, getEdges } from "./tesseract";
import { renderStereo } from "./renderer";
import type { RotationState } from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original rotation speeds from QBasic four03.bas
// DFXY=0.05, DFXZ=0.35, DFYZ=-0.79, DFXW=0.63, DFYW=-0.57, DFZW=0.47
// FAC = -0.02 (negative = reverse rotation direction)
// Scaled for smoother animation
const FAC = 0.5;
const ROTATION_STEP: RotationState = {
  xy: -0.05 * 0.02 * FAC,
  xz: -0.35 * 0.02 * FAC,
  yz: 0.79 * 0.02 * FAC, // Double negative = positive
  xw: -0.63 * 0.02 * FAC,
  yw: 0.57 * 0.02 * FAC, // Double negative = positive
  zw: -0.47 * 0.02 * FAC,
};

const STEREO_HALF_ANGLE = 0.2 * 0.5; // FISTEREO = 0.2 from QBasic

// Original EGA palette from four03.bas:
// PALETTE 1, 51 (bright cyan) - edges
// PALETTE 2, 45 (magenta/pink) - center dot
const EDGE_COLOR = "#55ffff"; // EGA 51 = bright cyan
const CENTER_DOT_COLOR = "#aa55aa"; // Darker magenta

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

  // Cumulative rotation angles
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
    // Advance rotation angles
    rotationState.xy += ROTATION_STEP.xy;
    rotationState.xz += ROTATION_STEP.xz;
    rotationState.yz += ROTATION_STEP.yz;
    rotationState.xw += ROTATION_STEP.xw;
    rotationState.yw += ROTATION_STEP.yw;
    rotationState.zw += ROTATION_STEP.zw;

    // Wrap angles to [0, 2π)
    if (rotationState.xy > TWO_PI) rotationState.xy -= TWO_PI;
    if (rotationState.xy < 0) rotationState.xy += TWO_PI;
    if (rotationState.xz > TWO_PI) rotationState.xz -= TWO_PI;
    if (rotationState.xz < 0) rotationState.xz += TWO_PI;
    if (rotationState.yz > TWO_PI) rotationState.yz -= TWO_PI;
    if (rotationState.yz < 0) rotationState.yz += TWO_PI;
    if (rotationState.xw > TWO_PI) rotationState.xw -= TWO_PI;
    if (rotationState.xw < 0) rotationState.xw += TWO_PI;
    if (rotationState.yw > TWO_PI) rotationState.yw -= TWO_PI;
    if (rotationState.yw < 0) rotationState.yw += TWO_PI;
    if (rotationState.zw > TWO_PI) rotationState.zw -= TWO_PI;
    if (rotationState.zw < 0) rotationState.zw += TWO_PI;

    const scaleX = (canvas.width / 640) * 80;
    const scaleY = (canvas.height / 350) * 68;

    renderStereo(ctx, vertices, edges, rotationState, {
      stereoHalfAngle: STEREO_HALF_ANGLE,
      scaleX,
      scaleY,
      edgeColor: EDGE_COLOR,
      centerDotColor: CENTER_DOT_COLOR,
      background: "#080808",
      lineWidth: 1.5,
    });

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
