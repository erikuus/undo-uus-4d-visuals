import { getVertexArray, getEdges } from "./tesseract";
import { renderStereo } from "./renderer";
import type { RotationState } from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original rotation speeds from QBasic four15.bas
// DFXY=0.17, DFXZ=0.35, DFYZ=-0.79, DFXW=0.42, DFYW=-0.52, DFZW=0.29
// FAC = -0.04
// Scaled for smoother animation
const FAC = 0.3;
const ROTATION_STEP: RotationState = {
  xy: -0.17 * 0.04 * FAC,
  xz: -0.35 * 0.04 * FAC,
  yz: 0.79 * 0.04 * FAC, // Double negative = positive
  xw: -0.42 * 0.04 * FAC,
  yw: 0.52 * 0.04 * FAC, // Double negative = positive
  zw: -0.29 * 0.04 * FAC,
};

const STEREO_HALF_ANGLE = 0.16 * 0.5; // FISTEREO = 0.16 from QBasic

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
      // four15 uses 640x480 aspect ratio
      const heightLimit = Math.floor(window.innerHeight * 0.65);
      const height = Math.max(
        240,
        Math.min(heightLimit, Math.floor(width * (480 / 640))),
      );
      canvas.width = width;
      canvas.height = height;
    } else {
      canvas.width = 640;
      canvas.height = 480;
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

    // Original uses XSCALE=100, YSCALE=99 for 640x480
    const scaleX = (canvas.width / 640) * 100;
    const scaleY = (canvas.height / 480) * 99;
    const dotRadius = Math.max(0.5, (canvas.width / 640) * 0.7);

    renderStereo(ctx, vertices, edges, rotationState, {
      stereoHalfAngle: STEREO_HALF_ANGLE,
      scaleX,
      scaleY,
      background: "#000000",
      dotRadius,
    });

    requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);

  return { resize };
}
