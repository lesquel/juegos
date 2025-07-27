import { VertexBuffer } from '../../engine/graphics/VertexBuffer.js'

export const quad = new VertexBuffer()
quad.vertexLayout([3])
quad.vertexData(new Float32Array([
  -1,  1, 0,
  -1, -1, 0,
  1, -1, 0,

  1,  1, 0,
  -1, 1, 0,
  1, -1, 0
]))
