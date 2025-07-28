export function clamp (x, min, max) {
  return Math.min(Math.max(x, min), max)
}

export function saturate (x) {
  return clamp(x, 0, 1)
}

export function smoothstep(edge0, edge1, x) {
  x = saturate((x - edge0) / (edge1 - edge0))
  return x * x * (3.0 - 2.0 * x)
}

export const DEG2RAD = 0.017453292519943295
