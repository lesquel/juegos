export function triangulate(vertices) {
  const triangles = []
  let remainingVertices = vertices.map((point, index) => {
    return {
      point,
      index
    }
  })

  while (remainingVertices.length > 3) {
    let earFound = false

    for (let i = 0; i < remainingVertices.length; i++) {
      const p1 = remainingVertices[i]
      const p2 = remainingVertices[(i + 1) % remainingVertices.length]
      const p3 = remainingVertices[(i + 2) % remainingVertices.length]

      if (isEar(p1.point, p2.point, p3.point, remainingVertices.map(vertex => vertex.point))) {
        triangles.push(
          p1.index,
          p2.index,
          p3.index
        )
        remainingVertices.splice((i + 1) % remainingVertices.length, 1)
        earFound = true
        break
      }
    }
    if (!earFound) {
      throw {}
    }
  }

  triangles.push(...remainingVertices.map(vertex => vertex.index))
  return triangles
}

function isConvex(p1, p2, p3) {
  const crossProduct = (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0])
  return crossProduct < 0
}

function isPointInTriangle(p, p1, p2, p3) {
  function sign(p1, p2, p3) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
  }

  const d1 = sign(p, p1, p2)
  const d2 = sign(p, p2, p3)
  const d3 = sign(p, p3, p1)

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)

  return !(hasNeg && hasPos)
}

function isEar(p1, p2, p3, vertices) {
  if (!isConvex(p1, p2, p3)) return false
  for (let i = 0; i < vertices.length; i++) {
    if (vertices[i] !== p1 && vertices[i] !== p2 && vertices[i] !== p3) {
      if (isPointInTriangle(vertices[i], p1, p2, p3)) {
        return false
      }
    }
  }
  return true
}
