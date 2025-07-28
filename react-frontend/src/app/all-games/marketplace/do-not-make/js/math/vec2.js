export function rotate(target, vec, theta) {
  target[0] = vec[0] * Math.cos(theta) - vec[1] * Math.sin(theta)
  target[1] = vec[0] * Math.sin(theta) + vec[1] * Math.cos(theta)
  return target
}
