import type { Vec4, RotationState } from "./math4d";
import { applyRotations, rotateXZ } from "./math4d";
import { NDOT, WSCALE } from "./line";

type RenderOptions = {
  stereoHalfAngle: number;
  scaleX: number;
  scaleY: number;
  background: string;
  dotRadius: number;
};

// Generate grayscale color from brightness level (0-15)
function getGrayscaleColor(level: number): string {
  // Clamp level to 1-15 range
  const clamped = Math.max(1, Math.min(15, Math.round(level)));
  // Map to brightness (original palette: 65793 * values from 10 to 63)
  const brightness = Math.round((clamped / 15) * 255);
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  endpoints: [Vec4, Vec4],
  rotationState: RotationState,
  options: RenderOptions,
): void {
  const { stereoHalfAngle, scaleX, scaleY, background, dotRadius } = options;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Apply 4D rotations to both endpoints
  const rotatedEndpoints = endpoints.map((v) =>
    applyRotations(v, rotationState),
  ) as [Vec4, Vec4];

  // Render for each stereo eye
  for (let stereoIdx = 0; stereoIdx < 2; stereoIdx++) {
    const shiftX = stereoIdx === 0 ? width / 4 : (width / 4) * 3;
    const shiftY = height / 2;

    // Stereo angle: left eye = +half, right eye = -half
    const stereoAngle = stereoIdx === 0 ? stereoHalfAngle : -stereoHalfAngle;
    const sinFi = Math.sin(stereoAngle);
    const cosFi = Math.cos(stereoAngle);

    // Project endpoints with stereo rotation
    const projected = rotatedEndpoints.map((v) => {
      const stereoRotated = rotateXZ({ x: v.x, z: v.z }, stereoAngle);
      return {
        x: stereoRotated.x * scaleX + shiftX,
        y: v.y * scaleY + shiftY,
      };
    });

    // Get W coordinates for depth shading
    const w1 = rotatedEndpoints[0].w;
    const w2 = rotatedEndpoints[1].w;

    // Draw dotted line with W-based brightness
    const dx = (projected[1].x - projected[0].x) / NDOT;
    const dy = (projected[1].y - projected[0].y) / NDOT;
    const dw = (w2 - w1) / NDOT;

    let x = projected[0].x;
    let y = projected[0].y;
    let w = w1;

    for (let n = 1; n <= NDOT; n++) {
      x += dx;
      y += dy;
      w += dw;

      // Calculate brightness based on W coordinate
      // IW = W * WSCALE + 8, clamped to 1-15
      const brightness = w * WSCALE + 8;
      const color = getGrayscaleColor(brightness);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
