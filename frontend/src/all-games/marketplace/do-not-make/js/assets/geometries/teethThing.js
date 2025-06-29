import { VertexBuffer } from '../../engine/graphics/VertexBuffer.js'
import { VIEW_HEIGHT } from '../../engine.js'

const points = [
  -200, VIEW_HEIGHT / 2, 0,
  -200, 0, 0
]
for (let i = 0; i <= 40; i++) {
  const x = i % 2 === 0 ? 0 : 9
  const y = i / 40 * VIEW_HEIGHT
  points.push(x, y, 0)
}
points.push(-200, VIEW_HEIGHT, 0)

export const teethThing = new VertexBuffer()
teethThing.vertexLayout([3])
teethThing.vertexData(new Float32Array(points))
