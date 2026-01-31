import { getVertexArray, getEdges, getFaces } from "./cube";
import { renderStereo } from "./renderer";
import type { RotationState } from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original rotation speeds from QBasic four06.bas
// DFXY=0.05, DFXZ=0.35, DFYZ=-0.79, DFXW=0.42, DFYW=-0.52, DFZW=0
// FAC = -0.01 (negative = reverse rotation direction, slower than four05)
// Scaled for smoother animation
const FAC = 0.5;
const ROTATION_STEP: RotationState = {
  xy: -0.05 * 0.01 * FAC,
  xz: -0.35 * 0.01 * FAC,
  yz: 0.79 * 0.01 * FAC, // Double negative = positive
  xw: -0.42 * 0.01 * FAC,
  yw: 0.52 * 0.01 * FAC, // Double negative = positive
  zw: 0, // No ZW rotation in original
};

const STEREO_HALF_ANGLE = 0.2 * 0.5; // FISTEREO = 0.2 from QBasic

// Original EGA palette from four06.bas:
// PALETTE 1, 63 (bright white) - edge dots
// PALETTE 2, 36 (green) - first face
// PALETTE 3, 10 (bright green) - second face (interpreted as red for contrast)
const EDGE_DOT_COLOR = "#ffffff"; // EGA 63 = bright white
const FACE_COLORS: [string, string] = [
  "#00aa00", // Green (face k=0, Z=AP)
  "#ff5555", // Red (face k=1, Z=AM)
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
  const faces = getFaces();

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
    const dotRadius = Math.max(0.8, (canvas.width / 640) * 0.9);

    renderStereo(ctx, vertices, edges, faces, rotationState, {
      stereoHalfAngle: STEREO_HALF_ANGLE,
      scaleX,
      scaleY,
      edgeDotColor: EDGE_DOT_COLOR,
      faceColors: FACE_COLORS,
      background: "#080808",
      dotRadius,
    });

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
