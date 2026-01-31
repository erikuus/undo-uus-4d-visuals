import type { Vec4, RotationState } from "./math4d";
import type { Edge, Face } from "./cube";
import { applyRotations, rotateXZ } from "./math4d";
import { NDOT } from "./cube";

type RenderOptions = {
  stereoHalfAngle: number;
  scaleX: number;
  scaleY: number;
  edgeDotColor: string;
  faceColors: [string, string]; // Two colors for the two opposite faces
  background: string;
  dotRadius: number;
};

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  vertices: Vec4[],
  edges: Edge[],
  faces: Face[],
  rotationState: RotationState,
  options: RenderOptions,
): void {
  const {
    stereoHalfAngle,
    scaleX,
    scaleY,
    edgeDotColor,
    faceColors,
    background,
    dotRadius,
  } = options;

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

    // Draw face dots (grid of points on two opposite faces)
    for (const face of faces) {
      const p11 = projected[face.v11];
      const p12 = projected[face.v12];
      const p21 = projected[face.v21];

      // Calculate step vectors for the grid
      const dxx = (p21.x - p11.x) / NDOT;
      const dyx = (p21.y - p11.y) / NDOT;
      const dxy = (p12.x - p11.x) / NDOT;
      const dyy = (p12.y - p11.y) / NDOT;

      ctx.fillStyle = faceColors[face.colorIndex];

      // Draw interior grid points (excluding edges)
      for (let ix = 1; ix < NDOT; ix++) {
        for (let iy = 1; iy < NDOT; iy++) {
          const x = p11.x + dxx * ix + dxy * iy;
          const y = p11.y + dyx * ix + dyy * iy;

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw edge dots (dotted lines along edges)
    ctx.fillStyle = edgeDotColor;
    for (const edge of edges) {
      const from = projected[edge.from];
      const to = projected[edge.to];

      const dx = (to.x - from.x) / NDOT;
      const dy = (to.y - from.y) / NDOT;

      // Draw dots along the edge (starting from first step, not origin)
      for (let n = 1; n <= NDOT; n++) {
        const x = from.x + dx * n;
        const y = from.y + dy * n;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw the first vertex as a dot (matching QBasic PSET at end)
    ctx.fillStyle = edgeDotColor;
    ctx.beginPath();
    ctx.arc(projected[0].x, projected[0].y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
