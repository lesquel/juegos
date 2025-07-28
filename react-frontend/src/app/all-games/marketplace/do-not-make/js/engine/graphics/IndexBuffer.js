import { gl } from '../../engine.js'

export class IndexBuffer {
  constructor () {
    this.buffer = gl.createBuffer()
  }

  setData (data) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    this.count = data.length
  }
}
