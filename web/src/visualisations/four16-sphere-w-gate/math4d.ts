export type Vec4 = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export function normalize4(v: Vec4): Vec4 {
  const len = Math.hypot(v.x, v.y, v.z, v.w);
  if (len === 0) {
    return { x: 0, y: 0, z: 0, w: 0 };
  }
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len,
    w: v.w / len,
  };
}

function rotateInPlane(v: Vec4, a: keyof Vec4, b: keyof Vec4, angle: number): Vec4 {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const va = v[a];
  const vb = v[b];
  return {
    ...v,
    [a]: va * c - vb * s,
    [b]: va * s + vb * c,
  } as Vec4;
}

export function rotateXY(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "x", "y", angle);
}

export function rotateXZ(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "x", "z", angle);
}

export function rotateYZ(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "y", "z", angle);
}

export function rotateXW(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "x", "w", angle);
}

export function rotateYW(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "y", "w", angle);
}

export function rotateZW(v: Vec4, angle: number): Vec4 {
  return rotateInPlane(v, "z", "w", angle);
}
