export type Vec4 = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type RotationState = {
  xy: number;
  xz: number;
  yz: number;
  xw: number;
  yw: number;
  zw: number;
};

// Rotation matrix that applies all 6 rotation planes in the same order as QBasic:
// M=2..4, N=1..M-1 => XY, XZ, YZ, XW, YW, ZW
export function applyRotations(v: Vec4, state: RotationState): Vec4 {
  let result = { ...v };

  // XY rotation (M=2, N=1)
  const xyS = Math.sin(state.xy);
  const xyC = Math.cos(state.xy);
  const x1 = result.x * xyC + result.y * xyS;
  const y1 = -result.x * xyS + result.y * xyC;
  result.x = x1;
  result.y = y1;

  // XZ rotation (M=3, N=1)
  const xzS = Math.sin(state.xz);
  const xzC = Math.cos(state.xz);
  const x2 = result.x * xzC + result.z * xzS;
  const z2 = -result.x * xzS + result.z * xzC;
  result.x = x2;
  result.z = z2;

  // YZ rotation (M=3, N=2)
  const yzS = Math.sin(state.yz);
  const yzC = Math.cos(state.yz);
  const y3 = result.y * yzC + result.z * yzS;
  const z3 = -result.y * yzS + result.z * yzC;
  result.y = y3;
  result.z = z3;

  // XW rotation (M=4, N=1)
  const xwS = Math.sin(state.xw);
  const xwC = Math.cos(state.xw);
  const x4 = result.x * xwC + result.w * xwS;
  const w4 = -result.x * xwS + result.w * xwC;
  result.x = x4;
  result.w = w4;

  // YW rotation (M=4, N=2)
  const ywS = Math.sin(state.yw);
  const ywC = Math.cos(state.yw);
  const y5 = result.y * ywC + result.w * ywS;
  const w5 = -result.y * ywS + result.w * ywC;
  result.y = y5;
  result.w = w5;

  // ZW rotation (M=4, N=3)
  const zwS = Math.sin(state.zw);
  const zwC = Math.cos(state.zw);
  const z6 = result.z * zwC + result.w * zwS;
  const w6 = -result.z * zwS + result.w * zwC;
  result.z = z6;
  result.w = w6;

  return result;
}

export function rotateXZ(
  v: { x: number; z: number },
  angle: number,
): { x: number; z: number } {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x: v.x * c - v.z * s,
    z: v.x * s + v.z * c,
  };
}
