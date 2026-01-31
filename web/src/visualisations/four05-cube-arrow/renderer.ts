import type { Vec4, RotationState } from "./math4d";
import type { Edge } from "./cube";
import { applyRotations, rotateXZ } from "./math4d";

type RenderOptions = {
  stereoHalfAngle: number;
  scaleX: number;
  scaleY: number;
  edgeColor: string;
  arrowColor: string;
  centerDotColor: string;
  background: string;
  lineWidth: number;
};

export function renderStereo(
  ctx: CanvasRenderingContext2D,
  vertices: Vec4[],
  edges: Edge[],
  arrow: Vec4,
  rotationState: RotationState,
  options: RenderOptions,
): void {
  const {
    stereoHalfAngle,
    scaleX,
    scaleY,
    edgeColor,
    arrowColor,
    centerDotColor,
    background,
    lineWidth,
  } = options;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Apply 4D rotations to all vertices
  const rotatedVertices = vertices.map((v) => applyRotations(v, rotationState));

  // Apply 4D rotations to arrow
  const rotatedArrow = applyRotations(arrow, rotationState);

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

    // Project arrow with stereo rotation
    const arrowStereo = rotateXZ(
      { x: rotatedArrow.x, z: rotatedArrow.z },
      stereoAngle,
    );
    const arrowProjected = {
      x: arrowStereo.x * scaleX + shiftX,
      y: rotatedArrow.y * scaleY + shiftY,
    };

    // Draw edges (all visible, monochrome)
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = lineWidth;
    for (const edge of edges) {
      const from = projected[edge.from];
      const to = projected[edge.to];

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }

    // Draw arrow from center to arrow tip
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(shiftX, shiftY);
    ctx.lineTo(arrowProjected.x, arrowProjected.y);
    ctx.stroke();

    // Draw center dot (simple round dot)
    ctx.fillStyle = centerDotColor;
    const dotRadius = Math.max(2, Math.floor(width / 240));
    ctx.beginPath();
    ctx.arc(shiftX, shiftY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
