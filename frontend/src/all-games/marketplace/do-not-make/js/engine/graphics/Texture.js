import { gl } from '../../engine.js'

export class Texture {
  constructor ({ data, width, height, wrap = gl.CLAMP_TO_EDGE, filter = gl.LINEAR }) {
    this.texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    if (width) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height || width, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data)
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  }

  bind (slot = 0) {
    gl.activeTexture(gl.TEXTURE0 + slot)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
  }
}
