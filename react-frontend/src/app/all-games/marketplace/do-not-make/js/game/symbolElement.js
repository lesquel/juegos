import {
  digitTextures,
  minusTexture,
  plusTexture
} from '../assets/textures/textTextures.js'
import { textMaterial } from '../assets/materials/textMaterial.js'
import { add, vec3, vec3Lerp } from '../math/vec3.js'
import { mat4 } from '../math/mat4.js'
import { quad } from '../assets/geometries/quad.js'
import { fillEffectRadius } from './shared.js'
import { canvas, deltaTime, gl, useMaterial } from '../engine.js'
import { saturate, smoothstep } from '../math/math.js'
import { debugMaterial } from '../assets/materials/debugMaterial.js'
import { randomMovement } from './randomMovement.js'

const digitConfig = [
  [0.65, 0], // 0
  [0.55, 0.02], // 1
  [0.65, 0.05], // 2
  [0.67, 0.05], // 3
  [0.65, 0], // 4
  [0.65, 0], // 5
  [0.65, 0], // 6
  [0.65, 0], // 7
  [0.64, 0], // 8
  [0.65, 0], // 9
]

export class SymbolElement {
  constructor(value, size, position, rotation = 0) {
    this.renderOffset = vec3()
    this.rotation = rotation
    if (typeof value === 'number') {
      this.texture = digitTextures[value]
      this.width = size * digitConfig[value][0]
      this.height = size
      this.renderOffset[0] = digitConfig[value][1] * size
    }
    else {
      switch (value) {
        case '+':
          this.texture = plusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
        case 'f':
          value = '-'
          this.rotation = Math.PI / 2
          this.texture = minusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
        case '-':
          this.texture = minusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
      }
    }

    this.originalRotation = this.rotation
    this.value = value
    this.pos = position
    this.size = size
    this.originalSize = size
    this.originalPosition = vec3(position)
    this.initAnimationT = -size / 50
    this.randomMovement = randomMovement()
    this.colorMerge = 1
  }

  update() {
    this.initAnimationT += deltaTime * 2
    this.randomMovement.update(this.size * 0.1)
  }

  render() {
    const initScale = smoothstep(0, 1, saturate(this.initAnimationT))
    const sin = Math.sin(this.rotation) * this.size * initScale
    const cos = Math.cos(this.rotation) * this.size * initScale
    useMaterial(textMaterial)
      .set1f('uniformNegRadius', fillEffectRadius)
      .set3fv('uniformColor1', vec3([1,1,1]))
      .set3fv('uniformColor2', this.color || vec3([0,0,0]))
      .set1f('uniformAlpha', this.renderAlpha ?? 1)
      .set1f('uniformColorMerge', this.colorMerge)
      .set1f('uniformAspectRatio', canvas.width / canvas.height)
      .setModel(mat4([
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        ...add(vec3(), add(vec3(), this.pos, this.renderOffset), this.randomMovement.offset), 1
      ]))
    this.texture.bind()
    quad.draw()

    // Debugging
    // <dev-only>
    // useMaterial(debugMaterial)
    //   .setModel(mat4([
    //     this.width, 0, 0, 0,
    //     0, this.height, 0, 0,
    //     0, 0, 1, 0,
    //     ...this.pos, 1
    //   ]))
    // quad.draw(gl.LINE_STRIP)
    // </dev-only>
  }
}
