import { deltaTime } from '../engine.js'
import { vec3, vec3Lerp } from '../math/vec3.js'
import { smoothstep } from '../math/math.js'

export function randomMovement() {
  let offset = vec3()
  let offsetFrom = vec3()
  let offsetTo = vec3([3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), 0])
  let offsetTime = 0
  let offsetTimeVel = Math.random() + 1
  return {
    update(scale) {
      offsetTime += deltaTime * offsetTimeVel
      vec3Lerp(offset, offsetFrom, offsetTo, smoothstep(0, 1, offsetTime))
      if (offsetTime >= 1) {
        offsetTime -= 1
        offsetFrom.set(offset)
        offsetTo = vec3([scale * (Math.random() - 0.5), scale * (Math.random() - 0.5), 0])
        offsetTimeVel = Math.random() + 1
      }
    },
    offset
  }
}
