import { gl } from '../../engine.js'

export class VertexBuffer {
  constructor () {
    this.va = gl.createVertexArray()
    gl.bindVertexArray(this.va)

    this.vb = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

    this.stride = 0
    this.length = 0
    this.vertexCount = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)
  }

  vertexLayout (layout = [3, 2, 3]) {
    for (let i = 0; i < layout.length; i++) {
      this.stride += layout[i] * 4
    }

    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

    let istride = 0
    for (let i = 0; i < layout.length; i++) {
      gl.vertexAttribPointer(i, layout[i], gl.FLOAT, false, this.stride, istride)
      gl.enableVertexAttribArray(i)

      istride += layout[i] * 4
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)

    this.stride = this.stride / 4
    this.vertexCount = this.length / this.stride
  }

  vertexData (data) {
    this.length = data.length
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    this.vertexCount = this.length / this.stride
  }

  updateVertexData (data, offset = 0) {
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data)
  }

  draw (type = gl.TRIANGLES) {
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    if (this.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer)

      gl.drawElements(gl.TRIANGLES, this.indexBuffer.count, gl.UNSIGNED_SHORT, 0)
    }
    else {
      gl.bindVertexArray(this.va)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

      gl.drawArrays(type, 0, this.vertexCount)
    }
  }

  setIndexBuffer(indexBuffer) {
    this.indexBuffer = indexBuffer
  }
}
