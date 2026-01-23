import { getVertexArray, getEdges } from "./tesseract";
import { renderStereo } from "./renderer";
import type { RotationState } from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original rotation speeds from QBasic (after FAC=5 scaling)
const FAC = 5;
const ROTATION_STEP: RotationState = {
  xy: 0.0055 * FAC,
  xz: 0.0027 * FAC,
  yz: 0.0034 * FAC,
  xw: 0.0002 * FAC,
  yw: 0.0039 * FAC,
  zw: 0.0091 * FAC,
};

const STEREO_HALF_ANGLE = 0.15 * 0.5; // FISTEREO * 0.5

// Original EGA palette mapping (indices 1-14 + default white)
// PALETTE 1=15, 2=18, 3=22, 4=27, 5=36, 6=37, 7=38, 8=39, 9=46, 10=47, 11=50, 12=52, 13=54, 14=62
const PALETTE = [
  "#ffffff", // 1: EGA 15 = bright white
  "#0000aa", // 2: EGA 18 = blue
  "#00aa00", // 3: EGA 22 = green
  "#005555", // 4: EGA 27 = dark cyan
  "#00aa00", // 5: EGA 36 = green
  "#00aa55", // 6: EGA 37 = green-cyan
  "#00aaaa", // 7: EGA 38 = cyan
  "#00aaff", // 8: EGA 39 = bright cyan
  "#aaaa00", // 9: EGA 46 = yellow
  "#aaaa55", // 10: EGA 47 = light yellow
  "#55ff55", // 11: EGA 50 = bright green
  "#55ffaa", // 12: EGA 52 = bright green-cyan
  "#55ffff", // 13: EGA 54 = bright cyan
  "#ffff55", // 14: EGA 62 = bright yellow
  "#ffffff", // 15: default white (for edges 28, 29)
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
      background: "#000000",
      lineWidth: 1.5,
    });

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
