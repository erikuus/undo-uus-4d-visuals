import { applyRotations, rotateXZ } from "../visualisations/four04-cube-in-4d/math4d";
import {
  getEdges as getFour01Edges,
  getVertexArray as getFour01Vertices,
} from "../visualisations/four01-tesseract/tesseract";
import {
  findMinWVertex,
  getEdges as getTesseractEdges,
  getVertexArray as getTesseractVertices,
  isEdgeVisible,
} from "../visualisations/four02-tesseract-hidden/tesseract";
import visionBackgroundUrl from "../background.jpg";
import type { RotationState, Vec4 } from "../visualisations/four04-cube-in-4d/math4d";
import type { AnimationController, ExplainerSlide } from "./types";

type Point2 = {
  x: number;
  y: number;
};

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

const LOOP_SECONDS = 10;
const BACKGROUND = "#080808";
const PANEL_BACKGROUND = "#111111";
const PANEL_BORDER = "rgba(230, 224, 216, 0.12)";
const PRIMARY_STROKE = "#dfd8ce";
const SECONDARY_STROKE = "rgba(223, 216, 206, 0.45)";
const MUTED_FILL = "rgba(223, 216, 206, 0.06)";
const ACCENT_A = "rgba(194, 207, 224, 0.82)";
const ACCENT_B = "rgba(188, 174, 151, 0.82)";
const ACCENT_C = "rgba(158, 186, 172, 0.8)";
const TESSERACT_PALETTE = [
  "rgba(170, 188, 214, 0.9)",
  "rgba(181, 214, 186, 0.9)",
  "rgba(219, 204, 155, 0.9)",
  "rgba(225, 178, 154, 0.9)",
];
const FOUR01_ROTATION_SPEED: RotationState = {
  xy: 0.0055 * 2,
  xz: 0.0027 * 2,
  yz: 0.0034 * 2,
  xw: 0.0002 * 2,
  yw: 0.0039 * 2,
  zw: 0.0091 * 2,
};
const FOUR01_STEREO_HALF_ANGLE = 0.15 * 0.5;

const questionQuote =
  "If the perceptual system can recognize a stable three-dimensional structure in dynamically changing two-dimensional projections, might it also—when supplied with genuine stereoscopic three-dimensional input—recognize a stable four-dimensional structure—so that what initially appears as a changing three-dimensional scene is instead experienced as a coherent four-dimensional form?";

const visionBackground = new Image();
visionBackground.src = visionBackgroundUrl;

const cubeVertices: Vec3[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

const cubeEdges: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const cubeFaces: Array<[number, number, number, number]> = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7],
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function sineRange(
  time: number,
  frequency: number,
  phase: number,
  min: number,
  max: number,
): number {
  return lerp(min, max, Math.sin(time * frequency + phase) * 0.5 + 0.5);
}

function smoothNoise(time: number, seed: number): number {
  return (
    Math.sin(time * 0.53 + seed) * 0.52 +
    Math.sin(time * 0.91 + seed * 1.7) * 0.31 +
    Math.sin(time * 1.37 + seed * 2.3) * 0.17
  );
}

function rotatePoint(point: Point2, angle: number): Point2 {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x: point.x * c - point.y * s,
    y: point.x * s + point.y * c,
  };
}

function strokePolygon(
  ctx: CanvasRenderingContext2D,
  points: Point2[],
  fillStyle: string,
  strokeStyle: string,
  lineWidth: number,
): void {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.12,
    width * 0.5,
    height * 0.5,
    width * 0.72,
  );
  gradient.addColorStop(0, "#1c1c1c");
  gradient.addColorStop(0.55, "#111111");
  gradient.addColorStop(1, "#090909");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  opacity: number,
): void {
  if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
    return;
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const drawX = (width - drawWidth) * 0.5;
  const drawY = (height - drawHeight) * 0.5;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function createCanvasAnimation(
  canvas: HTMLCanvasElement,
  drawFrame: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) => void,
  staticTime = LOOP_SECONDS * 0.28,
): AnimationController {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to acquire 2D rendering context.");
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let width = 1;
  let height = 1;
  let frameId = 0;
  let destroyed = false;
  const start = performance.now();

  const render = (time: number) => {
    context.save();
    drawFrame(context, width, height, time);
    context.restore();
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(bounds.width));
    const nextHeight = Math.max(1, Math.floor(bounds.height));
    const dpr = window.devicePixelRatio || 1;

    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.floor(nextWidth * dpr);
    canvas.height = Math.floor(nextHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    render(prefersReducedMotion ? staticTime : (performance.now() - start) / 1000);
  };

  const loop = (now: number) => {
    if (destroyed) return;
    render((now - start) / 1000);
    frameId = window.requestAnimationFrame(loop);
  };

  resize();
  if (!prefersReducedMotion) {
    frameId = window.requestAnimationFrame(loop);
  }

  return {
    resize,
    destroy: () => {
      destroyed = true;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    },
  };
}

function drawShapeStudy(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
): void {
  drawBackdrop(ctx, width, height);
  const shapes = [
    { x: 0.24, y: 0.28, seed: 0.4, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.035)" },
    { x: 0.52, y: 0.24, seed: 1.1, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.035)" },
    { x: 0.78, y: 0.34, seed: 2.2, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.035)" },
    { x: 0.28, y: 0.66, seed: 3.3, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.03)" },
    { x: 0.56, y: 0.62, seed: 4.1, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.03)" },
    { x: 0.78, y: 0.72, seed: 5.2, stroke: PRIMARY_STROKE, fill: "rgba(223, 216, 206, 0.03)" },
  ];
  const baseSize = Math.min(width, height);

  shapes.forEach((shape) => {
    const center = {
      x: width * shape.x + width * 0.02 * smoothNoise(time * 0.34, shape.seed),
      y:
        height * shape.y +
        height * 0.024 * smoothNoise(time * 0.29, shape.seed + 0.6),
    };
    const halfTopWidth =
      baseSize *
      sineRange(time, 0.81, shape.seed + 0.4, 0.016, 0.115);
    const halfBottomWidth =
      baseSize *
      sineRange(time, 0.67, shape.seed + 1.2, 0.016, 0.128);
    const halfLeftHeight =
      baseSize *
      sineRange(time, 0.73, shape.seed + 2, 0.014, 0.124);
    const halfRightHeight =
      baseSize *
      sineRange(time, 0.88, shape.seed + 2.8, 0.014, 0.136);
    const shearX = baseSize * smoothNoise(time * 0.58, shape.seed + 3.6) * 0.068;
    const shearY = baseSize * smoothNoise(time * 0.52, shape.seed + 4.4) * 0.046;
    const rotation = smoothNoise(time * 0.31, shape.seed + 5.1) * 0.9;

    const polygon = [
      { x: -halfTopWidth + shearX, y: -halfLeftHeight + shearY },
      { x: halfTopWidth + shearX, y: -halfRightHeight - shearY },
      { x: halfBottomWidth - shearX, y: halfRightHeight + shearY },
      { x: -halfBottomWidth - shearX, y: halfLeftHeight - shearY },
    ].map((point) => {
      const rotated = rotatePoint(point, rotation);
      return {
        x: center.x + rotated.x,
        y: center.y + rotated.y,
      };
    });

    strokePolygon(ctx, polygon, shape.fill, shape.stroke, 1.25);
  });
}

function rotateCubeVertex(vertex: Vec3, time: number): Vec3 {
  const angle = (time / LOOP_SECONDS) * Math.PI * 2;
  const yaw = angle * 0.92;
  const pitch = Math.sin(angle) * 0.38 + 0.45;
  const roll = Math.cos(angle * 0.5) * 0.18;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const cz = Math.cos(roll);
  const sz = Math.sin(roll);

  const y1 = vertex.y * cx - vertex.z * sx;
  const z1 = vertex.y * sx + vertex.z * cx;

  const x2 = vertex.x * cy + z1 * sy;
  const z2 = -vertex.x * sy + z1 * cy;

  return {
    x: x2 * cz - y1 * sz,
    y: x2 * sz + y1 * cz,
    z: z2,
  };
}

function rotateInvariantCubeVertex(vertex: Vec3, time: number): Vec3 {
  const angle = (time / LOOP_SECONDS) * Math.PI * 2;
  const yaw = angle * 0.72;
  const pitch = 0.64 + Math.sin(angle * 0.45) * 0.08;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);

  const y1 = vertex.y * cx - vertex.z * sx;
  const z1 = vertex.y * sx + vertex.z * cx;

  return {
    x: vertex.x * cy + z1 * sy,
    y: y1,
    z: -vertex.x * sy + z1 * cy,
  };
}

function projectPerspective(
  vertex: Vec3,
  scale: number,
  distance = 4.3,
): Point2 {
  const depth = 1 / (distance - vertex.z);
  return {
    x: vertex.x * depth * scale,
    y: vertex.y * depth * scale,
  };
}

function projectOrthographic(vertex: Vec3, scale: number): Point2 {
  return {
    x: vertex.x * scale,
    y: vertex.y * scale,
  };
}

function polygonCentroid(points: Point2[]): Point2 {
  const sum = points.reduce(
    (accumulator, point) => ({
      x: accumulator.x + point.x,
      y: accumulator.y + point.y,
    }),
    { x: 0, y: 0 },
  );
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

function normalForFace(face: [number, number, number, number], vertices: Vec3[]): Vec3 {
  const a = vertices[face[0]];
  const b = vertices[face[1]];
  const c = vertices[face[2]];
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  return {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x,
  };
}

function getCubeFacePolygons(
  width: number,
  height: number,
  time: number,
  scaleMultiplier = 0.95,
  distance = 4.3,
  centerYRatio = 0.53,
): Array<{ face: [number, number, number, number]; polygon: Point2[]; averageZ: number }> {
  const rotated = cubeVertices.map((vertex) => rotateCubeVertex(vertex, time));
  const scale = Math.min(width, height) * scaleMultiplier;
  const projected = rotated.map((vertex) =>
    projectPerspective(vertex, scale, distance),
  );
  const centerX = width * 0.5;
  const centerY = height * centerYRatio;

  return cubeFaces.map((face) => ({
    face,
    polygon: face.map((vertexIndex) => ({
      x: centerX + projected[vertexIndex].x,
      y: centerY + projected[vertexIndex].y,
    })),
    averageZ:
      (rotated[face[0]].z +
        rotated[face[1]].z +
        rotated[face[2]].z +
        rotated[face[3]].z) /
      4,
  }));
}

function drawInvariantCube(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
): void {
  drawBackdrop(ctx, width, height);

  const rotated = cubeVertices.map((vertex) => rotateInvariantCubeVertex(vertex, time));
  const scale = Math.min(width, height) * 0.19;
  const projected = rotated.map((vertex) => projectOrthographic(vertex, scale));
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const visibleFaces = cubeFaces
    .map((face) => ({
      face,
      polygon: face.map((vertexIndex) => ({
        x: centerX + projected[vertexIndex].x,
        y: centerY + projected[vertexIndex].y,
      })),
      normal: normalForFace(face, rotated),
      averageZ:
        (rotated[face[0]].z +
          rotated[face[1]].z +
          rotated[face[2]].z +
          rotated[face[3]].z) /
        4,
    }))
    .filter(({ normal }) => normal.z > 0);
  visibleFaces.sort((a, b) => a.averageZ - b.averageZ);

  visibleFaces.forEach(({ polygon }) => {
    strokePolygon(
      ctx,
      polygon,
      "rgba(223, 216, 206, 0)",
      PRIMARY_STROKE,
      1.2,
    );
  });

  ctx.strokeStyle = PRIMARY_STROKE;
  ctx.lineWidth = 1.2;
  for (const [from, to] of cubeEdges) {
    ctx.beginPath();
    ctx.moveTo(centerX + projected[from].x, centerY + projected[from].y);
    ctx.lineTo(centerX + projected[to].x, centerY + projected[to].y);
    ctx.stroke();
  }
}

function projectStereoCube(
  vertex: Vec3,
  eyeOffset: number,
  scale: number,
): Point2 {
  const distance = 4.6;
  const shiftedX = vertex.x - eyeOffset;
  const depth = 1 / (distance - vertex.z);
  return {
    x: shiftedX * depth * scale,
    y: vertex.y * depth * scale,
  };
}

function getFour01RotationState(time: number): RotationState {
  const frameEquivalent = time * 60;
  return {
    xy: frameEquivalent * FOUR01_ROTATION_SPEED.xy,
    xz: frameEquivalent * FOUR01_ROTATION_SPEED.xz,
    yz: frameEquivalent * FOUR01_ROTATION_SPEED.yz,
    xw: frameEquivalent * FOUR01_ROTATION_SPEED.xw,
    yw: frameEquivalent * FOUR01_ROTATION_SPEED.yw,
    zw: frameEquivalent * FOUR01_ROTATION_SPEED.zw,
  };
}

function drawStereoScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  mode: "cube" | "tesseract",
): void {
  drawBackdrop(ctx, width, height);

  if (mode === "cube") {
    drawCoverImage(ctx, visionBackground, width, height, 0.22);
    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, "rgba(9, 9, 9, 0.28)");
    overlay.addColorStop(1, "rgba(9, 9, 9, 0.5)");
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
  }

  const panelWidth = width * 0.37;
  const panelHeight = height * 0.72;
  const gap = width * 0.06;
  const top = height * 0.14;
  const left = (width - panelWidth * 2 - gap) * 0.5;

  for (let panelIndex = 0; panelIndex < 2; panelIndex += 1) {
    const panelX = left + panelIndex * (panelWidth + gap);
    const panelY = top;

    if (mode !== "cube") {
      ctx.fillStyle = PANEL_BACKGROUND;
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    }

    if (mode === "cube") {
      const rotationState = getFour01RotationState(time);
      const vertices = getFour01Vertices();
      const edges = getFour01Edges();
      const rotated = vertices.map((vertex) => applyRotations(vertex, rotationState));
      const stereoAngle =
        panelIndex === 0 ? FOUR01_STEREO_HALF_ANGLE : -FOUR01_STEREO_HALF_ANGLE;
      const centerX = panelX + panelWidth * 0.5;
      const centerY = panelY + panelHeight * 0.54;
      const scaleX = panelWidth * 0.16;
      const scaleY = panelHeight * 0.168;

      ctx.strokeStyle = PRIMARY_STROKE;
      ctx.lineWidth = 1.05;
      for (const edge of edges) {
        const fromVertex = rotateXZ(
          { x: rotated[edge.from].x, z: rotated[edge.from].z },
          stereoAngle,
        );
        const toVertex = rotateXZ(
          { x: rotated[edge.to].x, z: rotated[edge.to].z },
          stereoAngle,
        );
        ctx.beginPath();
        ctx.moveTo(centerX + fromVertex.x * scaleX, centerY + rotated[edge.from].y * scaleY);
        ctx.lineTo(centerX + toVertex.x * scaleX, centerY + rotated[edge.to].y * scaleY);
        ctx.stroke();
      }
    } else {
      const vertices = getTesseractVertices();
      const edges = getTesseractEdges();
      const phase = (time / LOOP_SECONDS) * Math.PI * 2;
      const rotationState: RotationState = {
        xy: phase * 0.23,
        xz: phase * 0.17,
        yz: phase * 0.15,
        xw: phase * 0.11,
        yw: phase * 0.19,
        zw: phase * 0.13,
      };
      const rotated = vertices.map((vertex) => applyRotations(vertex as Vec4, rotationState));
      const minWIndices = findMinWVertex(rotated);
      const centerX = panelX + panelWidth * 0.5;
      const centerY = panelY + panelHeight * 0.54;
      const scaleX = panelWidth * 0.28;
      const scaleY = panelHeight * 0.3;
      const stereoAngle = panelIndex === 0 ? 0.14 : -0.14;

      ctx.lineWidth = 1.05;
      for (const edge of edges) {
        if (!isEdgeVisible(edge, minWIndices)) {
          continue;
        }
        const fromVertex = rotateXZ(
          { x: rotated[edge.from].x, z: rotated[edge.from].z },
          stereoAngle,
        );
        const toVertex = rotateXZ(
          { x: rotated[edge.to].x, z: rotated[edge.to].z },
          stereoAngle,
        );
        ctx.strokeStyle = TESSERACT_PALETTE[edge.dimension - 1] || PRIMARY_STROKE;
        ctx.beginPath();
        ctx.moveTo(centerX + fromVertex.x * scaleX, centerY + rotated[edge.from].y * scaleY);
        ctx.lineTo(centerX + toVertex.x * scaleX, centerY + rotated[edge.to].y * scaleY);
        ctx.stroke();
      }
    }
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(230, 224, 216, 0.55)";
  ctx.font = `${Math.max(14, width * 0.024)}px Georgia, serif`;
}

export const explainerSlides: ExplainerSlide[] = [
  {
    id: "mere-change",
    title: "",
    body: "",
    prompt: "What do you see?",
    answer:
      "Just six disconnected changing two-dimensional shapes.",
    createAnimation: (canvas) => createCanvasAnimation(canvas, drawShapeStudy),
  },
  {
    id: "invariant-appears",
    title: "",
    body: "",
    prompt: "What are you seeing now?",
    answer:
      "Again, the raw input is only changing 2D shapes. But perception recognizes them as one solid cube rotating in space. In other words, a flat display can still be seen as a 3D cube when its changing 2D shapes are mathematically correct projections of one rigid 3D form.",
    createAnimation: (canvas) => createCanvasAnimation(canvas, drawInvariantCube),
  },
  {
    id: "why-stereo-matters",
    title: "",
    body: "",
    prompt:
      "If perception can recognize a stable 3D structure in changing 2D projections, what happens when it is given genuine stereoscopic 3D input that is the mathematically correct projection of a 4D form into 3D?",
    answer:
      "What initially appears as a changing 3D scene is suddenly experienced as a coherent 4D form?",
    createAnimation: (canvas) =>
      createCanvasAnimation(canvas, (ctx, width, height, time) =>
        drawStereoScene(ctx, width, height, time, "cube"),
      ),
  },
];
