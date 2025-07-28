import { VertexBuffer } from '../../engine/graphics/VertexBuffer.js'

// const outerPoints = Array.from({ length: 5 }, (_, index) => {
//   const angle = -Math.PI / 2 + index / 5 * Math.PI * 2
//   return [Math.cos(angle), Math.sin(angle), 0]
// })
// const innerPoints = Array.from({ length: 5 }, (_, index) => {
//   const angle = -Math.PI / 2 + (index + 0.5) / 5 * Math.PI * 2
//   const innerRadius = 0.5
//   return [innerRadius * Math.cos(angle), innerRadius * Math.sin(angle), 0]
// })
//
// console.log([
//   ...outerPoints[0],
//   ...innerPoints[0],
//   ...innerPoints[4],
//
//   ...outerPoints[1],
//   ...innerPoints[1],
//   ...innerPoints[0],
//
//   ...outerPoints[2],
//   ...innerPoints[2],
//   ...innerPoints[1],
//
//   ...outerPoints[3],
//   ...innerPoints[3],
//   ...innerPoints[2],
//
//   ...outerPoints[4],
//   ...innerPoints[4],
//   ...innerPoints[3],
//
//   ...innerPoints[0],
//   ...innerPoints[1],
//   ...innerPoints[2],
//
//   ...innerPoints[0],
//   ...innerPoints[2],
//   ...innerPoints[4],
//
//   ...innerPoints[2],
//   ...innerPoints[4],
//   ...innerPoints[3],
// ].map(p => p.toFixed(2)).join(','))

export const star = new VertexBuffer()
star.vertexLayout([3])
star.vertexData(new Float32Array([
  0.00, -1.00, 0.00,
  0.29, -0.40, 0.00,
  -0.29,-0.40,0.00,
  0.95,-0.31,0.00,
  0.48,0.15,0.00,
  0.29,-0.40,0.00,
  0.59,0.81,0.00,
  0.00,0.50,0.00,
  0.48,0.15,0.00,
  -0.59,0.81,0.00,
  -0.48,0.15,0.00,
  0.00,0.50,0.00,
  -0.95,-0.31,0.00,
  -0.29,-0.40,0.00,
  -0.48,0.15,0.00,
  0.29,-0.40,0.00,
  0.48,0.15,0.00,
  0.00,0.50,0.00,
  0.29,-0.40,0.00,
  0.00,0.50,0.00,
  -0.29,-0.40,0.00,
  0.00,0.50,0.00,
  -0.29,-0.40,0.00,
  -0.48,0.15,0.00
]))
