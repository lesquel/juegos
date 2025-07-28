import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { add, distance, dot, length, project, scale, subtract, vec3, vec3Normalize } from '../math/vec3.js'
import {
  canvas,
  deltaTime,
  gl,
  pointerPosition,
  useMaterial,
  VIEW_HEIGHT,
  VIEW_WIDTH
} from '../engine.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { elements, HANDLE_SIZE, levelState, STATE_PLAYING } from './shared.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { setPosition } from './dynamicMusic.js'
import { clamp } from '../math/math.js'
import { Spline } from './spline.js'
import { rotate } from '../math/vec2.js'

function debug(points) {
  let debugDiv = document.querySelector('.debug')
  if (!debugDiv) {
    debugDiv = document.createElement('div')
    debugDiv.className = 'debug'
    debugDiv.style.position = 'fixed'
    debugDiv.style.top = '0'
    debugDiv.style.left = '0'
    debugDiv.style.fontSize = '16px'
    debugDiv.style.pointerEvents = 'none'
    debugDiv.style.zIndex = '1000'
    debugDiv.style.color = '#fff'
    document.body.append(debugDiv)
  }
  debugDiv.innerHTML = ''
  for (let i = points.length - 1; i >= 0; i--) {
    const row = document.createElement('div')
    row.textContent = [...points[i]].map(x => x.toFixed(3)).join(';')
    debugDiv.appendChild(row)
  }
}

export class Strand {
  constructor(y) {
    const startPosition = vec3([10, y, 0])
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(new Float32Array(3 * 10 * 1024))

    this.startPosition = startPosition
    this.strandPositions = [
      vec3([-1000, startPosition[1], 0]),
      vec3(startPosition),
      vec3(startPosition)
    ]

    this.handlePosition = vec3(startPosition)

    this.dragStart = undefined

    this.vertexBuffer.updateVertexData(
      new Float32Array([
        -1000, startPosition[1], 0,
        ...startPosition,
        ...startPosition
      ]),
      0
    )

    this.recalculateBuffer()

    this.renderAlpha = 1
  }

  startDrag() {
    this.dragStart = vec3(pointerPosition)
  }

  stopDrag() {
    this.dragStart = undefined
  }

  move(delta, collisionCheck = true) {
    let deltaLength = length(delta)
    const deltaNormalized = vec3Normalize(vec3(), delta)

    while (deltaLength > 0) {
      if (this.moveStep(scale(vec3(), deltaNormalized, Math.min(HANDLE_SIZE, deltaLength)), collisionCheck)) {
        return
      }
      deltaLength -= HANDLE_SIZE
    }
  }

  moveAndResolveCollisions(delta, result) {
    if (!this.collides(add(result, this.handlePosition, delta))) {
      return false
    }

    let newDelta = vec3()
    for (let i = 0.1; i < 1; i += 0.1) {
      rotate(newDelta, delta, i)
      if (!this.collides(add(result, this.handlePosition, newDelta))) {
        return false
      }
      rotate(newDelta, delta, -i)
      if (!this.collides(add(result, this.handlePosition, newDelta))) {
        return false
      }
    }

    return true
  }

  collides(point) {
    if (elements.some(element => {
      return Math.abs(point[0] - element.pos[0]) < element.width && Math.abs(point[1] - element.pos[1]) < element.height
    })) {
      return true
    }

    for (let i = 0; i < this.strandPositions.length - 3; i++) {
      if (distance(this.strandPositions[i], point) <= HANDLE_SIZE) {
        if (i > this.strandPositions.length - 5) {
          this.removePointsAfter(i)
        }
        return true
      }
    }
    return false
  }

  moveStep(delta, collisionCheck) {
    const newPosition = vec3()

    if (!collisionCheck) {
      add(newPosition, this.handlePosition, delta)
    }
    else if (this.moveAndResolveCollisions(delta, newPosition)) {
      return true
    }

    this.handlePosition.set(newPosition)

    if (collisionCheck) {
      this.handlePosition[0] = clamp(this.handlePosition[0], HANDLE_SIZE, VIEW_WIDTH - HANDLE_SIZE)
      this.handlePosition[1] = clamp(this.handlePosition[1], HANDLE_SIZE, VIEW_HEIGHT - HANDLE_SIZE)
    }

    const secondLastPoint = vec3(this.strandPositions.at(-2))
    const thirdLastPoint = vec3(this.strandPositions.at(-3))

    // Close enough to the third last point -> can remove the second last point
    if (distance(this.handlePosition, thirdLastPoint) < HANDLE_SIZE || distance(secondLastPoint, thirdLastPoint) < 2) {
      this.removePoint(-2)
      return
    }

    // Make sure angles are never smaller than 90 degrees by moving the second last point
    const dir1 = subtract(vec3(), this.handlePosition, secondLastPoint)
    const dir1Normalized = vec3Normalize(vec3(), dir1)
    const dir2 = subtract(vec3(), secondLastPoint, thirdLastPoint)
    const dir2Normalized = vec3Normalize(vec3(), dir2)
    if (dot(dir1Normalized, dir2Normalized) < 0) {
      const projected = add(vec3(), project(vec3(), dir1, dir2), secondLastPoint)
      this.updatePoint(-2, projected)

      // If this movement sets the second last point close enough to the fourth last point, we can remove the
      // third last point
      const fourthLastPoint = this.strandPositions.at(-4)
      if (fourthLastPoint && distance(projected, fourthLastPoint) < HANDLE_SIZE) {
        this.removePoint(-3)
      }
    }

    if (distance(this.handlePosition, this.strandPositions.at(-2)) > HANDLE_SIZE) {
      this.addPoint(this.handlePosition)
    }
    else {
      this.updatePoint(-1, this.handlePosition)
    }

    // debug(this.strandPositions)
  }

  addPoint(point) {
    this.strandPositions.push(vec3(point))
    this.recalculateBuffer()
  }

  updatePoint(index, point) {
    if (index < 0) {
      index = this.strandPositions.length + index
    }
    this.strandPositions.at(index).set(point)
    this.recalculateBuffer()
  }

  removePoint(index) {
    if (index < 0) {
      index = this.strandPositions.length + index
    }
    this.strandPositions.splice(index, 1)
    this.recalculateBuffer()
  }

  recalculateBuffer() {
    const bufferSize = Math.min(1024, this.strandPositions.length * 4)
    const spline = new Spline(this.strandPositions.slice(1))
    const data = new Float32Array(bufferSize * 3)
    for (let i = 0; i < bufferSize; i++) {
      const value = spline.evaluate(i / (bufferSize - 1))
      data[i * 3] = value[0]
      data[i * 3 + 1] = value[1]
    }
    this.vertexBuffer.vertexCount = bufferSize
    this.vertexBuffer.updateVertexData(data, 3 * 4)
  }

  removePointsAfter(index) {
    if (index < 0) {
      index = this.strandPositions.length + index
    }
    this.strandPositions.splice(index)
    this.addPoint(this.handlePosition)
  }

  rewind() {
    let speed = 100
    if (this.handlePosition[0] > VIEW_WIDTH) {
      speed += 3 * (this.handlePosition[0] - VIEW_WIDTH)
    }
    let todo = deltaTime * speed

    while (todo > 0) {
      const direction = subtract(vec3(), this.strandPositions.at(-2), this.handlePosition)
      const dirLength = length(direction)

      if (dirLength < todo) {
        this.handlePosition.set(this.strandPositions.at(-2))
        this.removePoint(-1)
        todo -= dirLength
      } else {
        scale(direction, vec3Normalize(direction), todo)
        add(this.handlePosition, this.handlePosition, direction)
        this.updatePoint(-1, this.handlePosition)
        return
      }
    }
  }

  update() {
    if (levelState === STATE_PLAYING) {
      setPosition(this.handlePosition)
    }
    else {
      setPosition(undefined)
    }
  }

  render() {
    useMaterial(strandMaterial)
      .setModel(mat4())
      .set1f('uniformAlpha', this.renderAlpha)
      .set1f('uniformAspectRatio', canvas.width / canvas.height)
    this.vertexBuffer.draw(gl.LINE_STRIP)

    useMaterial(handleMaterial)
      .setModel(mat4([
        HANDLE_SIZE, 0, 0, 0,
        0, HANDLE_SIZE, 0, 0,
        0, 0, 1, 0,
        ...add(vec3(), this.handlePosition, vec3([3, 3, 0])), 1
      ]))
      .set1f('uniformBrightness', 0)
    quad.draw()

    handleMaterial.shader
      .setModel(mat4([
        HANDLE_SIZE, 0, 0, 0,
        0, HANDLE_SIZE, 0, 0,
        0, 0, 1, 0,
        ...this.handlePosition, 1
      ]))
      .set1f('uniformBrightness', 1)
    quad.draw()

    // <dev-only>
    // for (let i = 0; i < this.strandPositions.length; i++) {
    //   const size = i < this.strandPositions.length - 3 ? 0.2 : 0.1
    //   handleMaterial.shader.setModel(mat4([
    //     HANDLE_SIZE * size, 0, 0, 0,
    //     0, HANDLE_SIZE * size, 0, 0,
    //     0, 0, 1, 0,
    //     ...this.strandPositions[i], 1
    //   ]))
    //   quad.draw()
    // }
    // </dev-only>
  }
}
