import type { Vec4, RotationState } from "./math4d";
import type { Edge } from "./tesseract";
import { applyRotations, rotateXZ } from "./math4d";
import { NDOT, WSCALE } from "./tesseract";

type RenderOptions = {
  stereoHalfAngle: number;
  scaleX: number;
  scaleY: number;
  background: string;
  dotRadius: number;
};

// Generate grayscale color from brightness level (0-15)
function getGrayscaleColor(level: number): string {
  // Clamp level to 0-15 range
  const clamped = Math.max(0, Math.min(15, Math.round(level)));
  // Map to brightness (original palette: 65793 * values from 0 to 63)
  const brightness = Math.round((clamped / 15) * 255);
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  vertices: Vec4[],
  edges: Edge[],
  rotationState: RotationState,
  options: RenderOptions,
): void {
  const { stereoHalfAngle, scaleX, scaleY, background, dotRadius } = options;

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

    // Stereo angle: left eye = +half, right eye = -half
    const stereoAngle = stereoIdx === 0 ? stereoHalfAngle : -stereoHalfAngle;

    // Project vertices with stereo rotation
    const projected = rotatedVertices.map((v) => {
      const stereoRotated = rotateXZ({ x: v.x, z: v.z }, stereoAngle);
      return {
        x: stereoRotated.x * scaleX + shiftX,
        y: v.y * scaleY + shiftY,
      };
    });

    // Draw each edge as a dotted line with W-depth shading
    for (const edge of edges) {
      const fromProj = projected[edge.from];
      const toProj = projected[edge.to];
      const fromW = rotatedVertices[edge.from].w;
      const toW = rotatedVertices[edge.to].w;

      const dx = (toProj.x - fromProj.x) / NDOT;
      const dy = (toProj.y - fromProj.y) / NDOT;
      const dw = (toW - fromW) / NDOT;

      let x = fromProj.x;
      let y = fromProj.y;
      let w = fromW;

      for (let n = 1; n <= NDOT; n++) {
        x += dx;
        y += dy;
        w += dw;

        // Calculate brightness based on W coordinate
        // Original: IW = -W * WSCALE + 8 (note negative sign - farther in W = dimmer)
        const brightness = -w * WSCALE + 8;
        const color = getGrayscaleColor(brightness);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
