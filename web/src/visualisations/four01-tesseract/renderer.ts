import type { Vec4, RotationState } from "./math4d";
import { applyRotations, rotateXZ } from "./math4d";

type RenderOptions = {
  stereoHalfAngle: number;
  scaleX: number;
  scaleY: number;
  palette: string[];
  background: string;
  lineWidth: number;
};

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  vertices: Vec4[],
  edges: Array<{ from: number; to: number; color: number }>,
  rotationState: RotationState,
  options: RenderOptions,
): void {
  const { stereoHalfAngle, scaleX, scaleY, palette, background, lineWidth } =
    options;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Apply 4D rotations to all vertices
  const rotatedVertices = vertices.map((v) => applyRotations(v, rotationState));

  // Render for each stereo eye
  for (let stereoIdx = 0; stereoIdx < 2; stereoIdx++) {
    const shiftX = stereoIdx === 0 ? width / 4 : (width / 4) * 3;
    const shiftY = height / 2;

    // Stereo angle: left eye = +half, right eye = -half (2π - half in original)
    const stereoAngle = stereoIdx === 0 ? stereoHalfAngle : -stereoHalfAngle;

    // Project vertices to 2D with stereo XZ rotation
    const projected: Array<{ x: number; y: number }> = [];

    for (const v of rotatedVertices) {
      // Apply stereo XZ rotation for depth separation
      const stereoRotated = rotateXZ({ x: v.x, z: v.z }, stereoAngle);

      projected.push({
        x: stereoRotated.x * scaleX + shiftX,
        y: v.y * scaleY + shiftY,
      });
    }

    // Draw edges
    ctx.lineWidth = lineWidth;
    for (const edge of edges) {
      const from = projected[edge.from];
      const to = projected[edge.to];

      ctx.strokeStyle = palette[edge.color - 1] || palette[palette.length - 1];
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }
}
