import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { distance, vec3 } from '../math/vec3.js'
import { IndexBuffer } from '../engine/graphics/IndexBuffer.js'
import { triangulate } from './triangulate.js'
import {
  elements,
  fillEffectRadius,
  goal, HANDLE_SIZE,
  partitions,
  setPartitions,
  showingEquationsTime,
  strand
} from './shared.js'
import { canvas, deltaTime, gl, useMaterial, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_MARGIN_Y, VIEW_WIDTH } from '../engine.js'
import { getPolygonIntersections } from './getPolygonIntersections.js'
import { partitionMaterial } from '../assets/materials/partitionMaterial.js'
import { smoothstep } from '../math/math.js'
import { previewColorsMaterial } from '../assets/materials/previewColorsMaterial.js'
import { teethThing } from '../assets/geometries/teethThing.js'
import { mat4 } from '../math/mat4.js'
import { currentLevelIndex } from './currentLevel.js'
import { Spline } from './spline.js'

const COLORS = [
  vec3([1, 0.2, 0.2]),
  vec3([0.1, 0.1, 1]),
  vec3([0.5, 1, 0.2]),
  vec3([0.1, 0.2, 1]),
  vec3([1, 1, 0.2])
]

function colors(index) {
  return [
    COLORS[(index * 2) % COLORS.length],
    COLORS[(index * 2 + 1) % COLORS.length]
  ]
}

export class Partitioner {
  constructor() {
    this.colors = colors(currentLevelIndex).map(c => vec3(c))
    this.previewOffset = 0
  }

  createPartitions() {
    const commonPoints = []
    const source = strand.strandPositions.slice(1)

    // Pull the last point a bit to the right so there is no sharp turn at the end
    source[source.length - 1] = vec3(source[source.length - 1])
    source[source.length - 1][0] += 10

    const spline = new Spline(source)
    let previousPoint
    let filterCount = 0
    for (let i = 0; i <= 480; i++) {
      const point = spline.evaluate(i / 480)

      // Sometimes weird clumps happen??
      if (previousPoint && distance(point, previousPoint) < 3) {
        filterCount++
        continue
      }
      previousPoint = point

      commonPoints.push(point)
    }

    commonPoints.push(
      vec3([
        goal.pos[0] + 500,
        goal.pos[1],
        goal.pos[2]
      ])
    )

    function getPartition(perimeterVertices, color, reverse) {
      const vertexBuffer = new VertexBuffer()
      const points = [...commonPoints, ...perimeterVertices]
      if (reverse) {
        points.reverse()
      }
      vertexBuffer.vertexLayout([3])
      const vertexData = new Float32Array(points.flatMap(x => [...x]))
      vertexBuffer.vertexData(vertexData)

      const indexBuffer1 = new IndexBuffer()
      const indices1 = triangulate(points)
      indexBuffer1.setData(new Uint16Array(indices1))

      vertexBuffer.setIndexBuffer(indexBuffer1)
      return {
        color,
        points,
        vertexBuffer
      }
    }

    setPartitions([
      getPartition([
        vec3([
          VIEW_WIDTH + VIEW_MARGIN_X,
          -VIEW_MARGIN_Y,
          0
        ]),
        vec3([
          -VIEW_MARGIN_X,
          -VIEW_MARGIN_Y,
          0
        ]),
        vec3([-VIEW_MARGIN_X, strand.startPosition[1], 0])
      ], this.colors[0]),

      getPartition([
        vec3([
          VIEW_WIDTH + VIEW_MARGIN_X,
          VIEW_HEIGHT + VIEW_MARGIN_Y,
          0
        ]),
        vec3([
          -VIEW_MARGIN_X,
          VIEW_HEIGHT + VIEW_MARGIN_Y,
          0
        ]),
        vec3([-VIEW_MARGIN_X, strand.startPosition[1], 0])
      ], this.colors[1], true)
    ])

    for (const element of elements) {
      element.partition = this.getElementPartition(element.pos)
      element.color = this.getElementPartitionColor(element.partition)
    }
  }

  getElementPartition(position) {
    for (let i = 0; i < partitions.length; i++) {
      const intersectionCount = getPolygonIntersections(position, vec3([Math.random(), 1, 0]), partitions[i].points)
      if (intersectionCount % 2 === 1) {
        return i
      }
    }
    return -1
  }

  getElementPartitionColor(partitionIndex) {
    if (partitionIndex === -1) {
      return vec3([0.5, 0.5, 0.5])
    }
    else {
      return this.colors[(partitionIndex + 1) % partitions.length]
    }
  }

  slidePreviewStart() {
    this.previewOffset = -VIEW_MARGIN_X
  }

  render() {
    if (partitions) {
      useMaterial(partitionMaterial)
        .set1f('uniformNegRadius', fillEffectRadius)
        .set1f('uniformFade', 1 - smoothstep(0, 1, showingEquationsTime))
        .set1f('uniformAspectRatio', canvas.width / canvas.height)
      partitions.forEach(partition => {
        partitionMaterial.shader.set3fv('uniformColor', partition.color)
        partition.vertexBuffer.draw()
      })
    }

    this.previewOffset *= Math.exp(-5 * deltaTime)

    useMaterial(previewColorsMaterial)
      .setModel(mat4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        this.previewOffset, 0, 0, 1
      ]))
      .set3fv('uniformColor1', this.colors[0])
      .set3fv('uniformColor2', this.colors[1])
      .set1f('uniformFade', 1 - smoothstep(0, 1, showingEquationsTime))
      .set1f('uniformSplitY', strand.strandPositions[0][1])
    teethThing.draw(gl.TRIANGLE_FAN)

    previewColorsMaterial.shader
      .setModel(mat4([
        -1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        goal.pos[0] + HANDLE_SIZE - this.previewOffset, 0, 0, 1
      ]))
      .set1f('uniformSplitY', goal.pos[1])
    teethThing.draw(gl.TRIANGLE_FAN)
  }
}
