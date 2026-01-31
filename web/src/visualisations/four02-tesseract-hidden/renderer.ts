import type { Vec4, RotationState } from "./math4d";
import type { Edge } from "./tesseract";
import { applyRotations, rotateXZ } from "./math4d";
import { findMinWVertex, isEdgeVisible } from "./tesseract";

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
  edges: Edge[],
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

  // Find vertex with minimum W for hidden edge calculation
  const minWIndices = findMinWVertex(rotatedVertices);

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

    // Draw edges (with hidden edge removal)
    ctx.lineWidth = lineWidth;
    for (const edge of edges) {
      // Check visibility based on minimum W vertex
      if (!isEdgeVisible(edge, minWIndices)) {
        continue;
      }

      const from = projected[edge.from];
      const to = projected[edge.to];

      // Color based on dimension (1-4 maps to palette index 0-3)
      ctx.strokeStyle = palette[edge.dimension - 1] || palette[0];
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }
}
