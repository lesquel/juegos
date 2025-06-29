export function getPolygonIntersections(rayOrigin, rayDir, polygon) {
  let intersections = 0
  const n = polygon.length
  for (let i = 0; i < n; i++) {
    const p1 = polygon[i]
    const p2 = polygon[(i + 1) % n]

    if (doesIntersect(rayOrigin, rayDir, p1, p2)) {
      intersections += 1
    }
  }
  return intersections
}

function doesIntersect(rayOrigin, rayDir, p1, p2) {
  const edge = [p2[0] - p1[0], p2[1] - p1[1]]
  const edgePerp = [-edge[1], edge[0]]

  const det = rayDir[0] * edgePerp[0] + rayDir[1] * edgePerp[1]
  if (Math.abs(det) < 1e-10) {
    return false
  }

  const t = ((p1[0] - rayOrigin[0]) * edgePerp[0] + (p1[1] - rayOrigin[1]) * edgePerp[1]) / det
  if (t < 0) {
    return false
  }

  const edgeDir = rayDir[0] * edge[1] - rayDir[1] * edge[0]
  const u = ((p1[0] - rayOrigin[0]) * rayDir[1] - (p1[1] - rayOrigin[1]) * rayDir[0]) / edgeDir

  return u >= 0 && u <= 1
}
