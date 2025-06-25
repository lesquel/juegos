import { fadeMaterial } from '../assets/materials/fadeMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { deltaTime } from '../engine.js'

export function fadeIn() {
  let fadeAlpha = 1
  return {
    update() {
      fadeAlpha -= deltaTime
    },
    render() {
      fadeMaterial.shader
        .bind()
        .set1f('uniformAlpha', fadeAlpha)
      quad.draw()
    }
  }
}
