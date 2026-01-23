import type { Vec4 } from "./math4d";

type RenderOptions = {
  stereoHalfAngle: number; // FISTEREO * 0.5 from original
  pointRadius: number;
  scaleX: number;
  scaleY: number;
  palette: string[];
  background: string;
};

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  points: Vec4[],
  precomputedY: number[],
  options: RenderOptions,
  xwAngle: number,
): void {
  const { stereoHalfAngle, pointRadius, scaleX, palette, background } = options;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Original viewport shifts
  const shiftXL = width / 2 - width / 4;
  const shiftXR = width / 2 + width / 4;

  // Stereo rotation (XZ plane)
  const stSin = Math.sin(stereoHalfAngle);
  const stCos = Math.cos(stereoHalfAngle);

  // XW rotation for this frame
  const xwSin = Math.sin(xwAngle);
  const xwCos = Math.cos(xwAngle);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];

    // Apply runtime XW rotation: W' = W*cos - X*sin, X' = W*sin + X*cos
    const w = p.w * xwCos - p.x * xwSin;

    // Perceptual gate: W < 0 is hidden
    if (w < 0) {
      continue;
    }

    const x = p.w * xwSin + p.x * xwCos;
    const z = p.z;

    // Stereo XZ rotation for left and right eyes
    const xL = x * stCos + z * stSin;
    const xR = x * stCos - z * stSin;

    const ixL = xL * scaleX + shiftXL;
    const ixR = xR * scaleX + shiftXR;
    const iy = precomputedY[i];

    ctx.fillStyle = palette[i % palette.length];

    ctx.beginPath();
    ctx.arc(ixL, iy, pointRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ixR, iy, pointRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
