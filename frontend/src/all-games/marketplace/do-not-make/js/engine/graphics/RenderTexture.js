import { gl } from '../../engine.js'
import { Texture } from './Texture.js'

export class RenderTexture extends Texture {
  constructor(options) {
    super(options)

    this.framebuffer = gl.createFramebuffer()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }

  resize(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  }

  use() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
  }
}
