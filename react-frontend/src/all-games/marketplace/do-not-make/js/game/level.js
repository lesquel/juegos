import {
  deltaTime, lastPointerPosition,
  pointerPosition,
  VIEW_HEIGHT, VIEW_MARGIN_X,
  VIEW_WIDTH
} from '../engine.js'
import { addScaled, distance, subtract, vec3, vec3Lerp } from '../math/vec3.js'
import { saturate, smoothstep } from '../math/math.js'
import { getEquations } from './getEquations.js'
import { nextLevel, restart } from './currentLevel.js'
import { SymbolElement } from './symbolElement.js'
import {
  HANDLE_SIZE,
  introTime,
  partitions,
  resetIntroTime,
  resetShowingEquationsTime,
  setElements,
  setFillEffectRadius,
  setGoal,
  setLevelState,
  setPartitions,
  setStrand,
  showingEquationsTime,
  levelState,
  STATE_FINISH_ANIMATION,
  STATE_INTRO,
  STATE_MAKE_EQUATION,
  STATE_PLAYING,
  STATE_UNDO_FINISH,
  updateIntroTime,
  updateShowingEquationsTime,
  resetUndoFinishTime,
  updateUndoFinishTime,
  undoFinishTime, STATE_FINISH_EQUATION, setShowingEquationsTimeScale, STATE_LEVEL_COMPLETE
} from './shared.js'
import { Strand } from './strand.js'
import { Goal } from './goal.js'
import { Partitioner } from './partitioner.js'
import { Title } from './title.js'
import { StartArrow } from './startArrow.js'
import { Tutorial } from './tutorial.js'
import { playSample } from './audio.js'
import { ErrorSound } from '../assets/audio/ErrorSound.js'
import { playVictorySound } from './playVictorySound.js'
import { fadeMaterial } from '../assets/materials/fadeMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { Stars } from './stars.js'
import { hideRestartButton, restartButton, showRestartButton } from '../ui.js'

function pluck(array, condition) {
  const index = array.findIndex(condition)
  if (index < 0) {
    return
  }
  return array.splice(index, 1)[0]
}

const CHAR_WIDTH = 70
const CHAR_HEIGHT = 80

export function getLevel(entities) {
  const elements = entities.filter(ent => ent instanceof SymbolElement)
  const strand = entities.find(ent => ent instanceof Strand)
  const goal = entities.find(ent => ent instanceof Goal)
  const startArrow = entities.find(ent => ent instanceof StartArrow)
  const tutorial = entities.find(ent => ent instanceof Tutorial)
  let title = entities.find(ent => ent instanceof Title)
  let star

  const partitioner = pluck(entities, ent => ent instanceof Partitioner)
  let equals13Elements = []
  let equations

  setStrand(strand)
  setGoal(goal)
  setElements(elements)
  resetIntroTime()
  resetShowingEquationsTime()
  setLevelState(STATE_INTRO)

  hideRestartButton()

  // Controls

  let finishAnimationT = 0
  let hasEquations = false

  async function startDrag() {
    strand.startDrag()
    startArrow?.handleDrag()

    if (title) {
      entities.splice(entities.indexOf(title), 1)
      title = undefined
    }
  }

  function stopDrag() {
    strand.stopDrag()
  }

  function setFinished() {
    startArrow?.handleFinish()

    setLevelState(STATE_FINISH_ANIMATION)
    finishAnimationT = 0

    hideRestartButton()
  }

  function introUpdate() {
    updateIntroTime()
    if (introTime >= 1) {
      setLevelState(STATE_PLAYING)
    }
  }

  function playingUpdate() {
    if (strand.dragStart) {
      if (!pointerPosition) {
        stopDrag()
      }
      else {
        if (lastPointerPosition) strand.move(subtract(vec3(), pointerPosition, lastPointerPosition))
        if (distance(strand.handlePosition, goal.pos) < HANDLE_SIZE && Math.abs(strand.handlePosition[1] - goal.pos[1]) < HANDLE_SIZE / 2) {
          setFinished()
        }
      }
    }
    else if (pointerPosition) {
      startDrag()
      showRestartButton()
    }
  }

  function finishUpdate() {
    const target = vec3([
      goal.pos[0] + (finishAnimationT + 1) * finishAnimationT * Math.max(100, VIEW_MARGIN_X),
      goal.pos[1],
      0
    ])
    if (distance(target, strand.handlePosition) > 2) {
      strand.move(subtract(vec3(), target, strand.handlePosition), false)
    }

    if (finishAnimationT === 0) {
      try {
        partitioner.createPartitions()
      }
      catch (e) {
        alert('Woops! You managed to draw a line that triggered an error! Restarting level...')
        restart()
        return
      }
    }

    finishAnimationT += deltaTime

    strand.renderAlpha = goal.renderAlpha = smoothstep(1, 0.9, finishAnimationT)

    if (finishAnimationT > 1) {
      if (elements[0].partition === elements[1].partition && tutorial) {
        tutorial.show = true
      }
      checkConditionMet()
    }
  }

  function checkConditionMet() {
    let partitionElements = partitions.map(() => [])
    for (const element of elements) {
      partitionElements[element.partition].push(element)
      element.targetSize = 0
      element.targetPosition = element.pos
    }
    equations = getEquations(partitionElements)
    hasEquations = equations.length > 0

    if (hasEquations) {
      playSample(ErrorSound)
      for (let i = 0; i < equations.length; i++) {
        for (let j = 0; j < equations[i].length; j++) {
          equations[i][j].targetSize = 40
          equations[i][j].targetPosition = vec3([
            VIEW_WIDTH / 2 + (-(equations[i].length - 1) / 2 + j) * CHAR_WIDTH,
            VIEW_HEIGHT / 2 + (-(equations.length - 1) / 2 + i) * CHAR_HEIGHT,
            0
          ])
        }
      }
      setShowingEquationsTimeScale(equations.some(eq => eq.length > 2) ? 4 : 2)
      resetShowingEquationsTime()
      setLevelState(STATE_MAKE_EQUATION)
    }
    else {
      setLevelState(STATE_LEVEL_COMPLETE)
    }
  }

  function getUsageRotation(element) {
    if (!element.useCase || element.useCase === element.value + '') {
      return 0
    }
    if (element.useCase === '6' || element.useCase === '9') {
      return Math.PI
    }
    else {
      // plus as multiply
      return 0.25 * Math.PI
    }
  }

  function makeEquationUpdate() {
    const t = smoothstep(0, 1, showingEquationsTime)
    for (const element of elements) {
      addScaled(element.pos, element.originalPosition, subtract(vec3(), element.targetPosition, element.originalPosition), t)
      addScaled(element.pos, element.pos, vec3([Math.random() * 4 - 2, 0, 0]), 1 - t)
      element.size = element.originalSize + (element.targetSize - element.originalSize) * t
      element.rotation = element.originalRotation + (getUsageRotation(element) - element.originalRotation) * t
    }

    if (showingEquationsTime > 1.2) {
      setLevelState(STATE_FINISH_EQUATION)
      initFinishEquation()
      return
    }

    updateShowingEquationsTime()
  }

  function setElementsAnimationPositionFrom() {
    for (const element of elements) {
      element.animationPositionFrom = vec3(element.pos)
    }
  }

  function initFinishEquation() {
    setElementsAnimationPositionFrom()
    equals13Elements = []
    for (const element of elements) {
      element.doMerge = false
    }
    for (const equation of equations) {
      const doMerge = equation.map(el => el.value).join('') !== '13'
      equation.forEach(element => element.doMerge = doMerge)
      if (doMerge) {
        const elements13 = [
          new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 - CHAR_WIDTH / 2, equation[0].pos[1], 0])),
          new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 + CHAR_WIDTH / 2, equation[0].pos[1], 0]))
        ]
        elements13.forEach(element => {
          element.color = equation[0].color
          element.initAnimationT = 1
          element.renderAlpha = 0
          equals13Elements.push(element)
        })
      }
    }
  }

  function finishEquationUpdate() {
    updateShowingEquationsTime()

    const t = smoothstep(1.7, 2.2, showingEquationsTime)
    const t2 = smoothstep(3.3, 5, showingEquationsTime)
    if (t2 === 0) {
      for (const element of elements) {
        if (element.doMerge) {
          vec3Lerp(element.pos, element.animationPositionFrom, vec3([VIEW_WIDTH / 2, element.pos[1], 0]), t)
          element.renderAlpha = (1 - t) ** 0.5
        }
      }

      equals13Elements.forEach(element => {
        element.renderAlpha = t ** 2
      })
    }
    else {
      for (const element of elements) {
        if (element.doMerge) {
          vec3Lerp(element.pos, vec3([VIEW_WIDTH / 2, element.pos[1], 0]), element.animationPositionFrom, t2)
          element.renderAlpha = saturate(3 * t2)
        }
      }
      equals13Elements.forEach(element => {
        element.renderAlpha = 1 - t2 * 3
      })
    }

    const duration = equals13Elements.length > 0 ? 6 : 2
    if (showingEquationsTime >= duration) {
      setElementsAnimationPositionFrom()
      resetUndoFinishTime()
      resetShowingEquationsTime()
      setPartitions(undefined)
      partitioner.slidePreviewStart()
      setLevelState(STATE_UNDO_FINISH)
      showRestartButton()
    }
  }

  function backToPlayingUpdate() {
    updateUndoFinishTime()

    const t = smoothstep(0, 1, undoFinishTime)
    for (const element of elements) {
      vec3Lerp(element.pos, element.animationPositionFrom, element.originalPosition, t)
      element.size = element.targetSize + (element.originalSize - element.targetSize) * t
      element.colorMerge = 1 - t
      element.rotation = element.originalRotation + (getUsageRotation(element) - element.originalRotation) * (1 - t)
    }

    strand.renderAlpha = undoFinishTime
    goal.renderAlpha = undoFinishTime

    strand.rewind()
    if (
      undoFinishTime >= 1 &&
      strand.handlePosition[0] <= goal.pos[0] &&
      distance(strand.handlePosition, goal.pos) > HANDLE_SIZE * 3
    ) {
      finishAnimationT = 0
      resetShowingEquationsTime()
      elements.forEach(element => {
        element.colorMerge = 1
        element.color = undefined
      })
      setLevelState(STATE_PLAYING)
    }
  }

  let levelCompleteTime = 0
  function levelCompleteUpdate() {
    if (levelCompleteTime === 0) {
      playVictorySound()
      star = new Stars()
    }

    levelCompleteTime += deltaTime

    const t = smoothstep(1, 0, levelCompleteTime * 1.2)
    for (const element of elements) {
      element.size = element.originalSize * t
    }

    if (levelCompleteTime > 1) {
      nextLevel()
    }
  }


  return {
    update() {
      switch (levelState) {
        case STATE_INTRO:
          introUpdate()
          break
        case STATE_PLAYING:
          playingUpdate()
          break
        case STATE_FINISH_ANIMATION:
          finishUpdate()
          break
        case STATE_MAKE_EQUATION:
          makeEquationUpdate()
          break
        case STATE_FINISH_EQUATION:
          finishEquationUpdate()
          break
        case STATE_UNDO_FINISH:
          backToPlayingUpdate()
          break
        case STATE_LEVEL_COMPLETE:
          levelCompleteUpdate()
          break
      }
      setFillEffectRadius(2 * finishAnimationT * finishAnimationT)
      entities.forEach(ent => ent.update?.())
      star?.update()
    },

    render() {
      partitioner.render()
      entities.forEach(entity => entity.render())
      equals13Elements.forEach(element => element.render())
      if (levelCompleteTime > 0) {
        const alpha = smoothstep(0.5, 1, levelCompleteTime)
        fadeMaterial.shader
          .bind()
          .set1f('uniformAlpha', alpha)
        quad.draw()
      }
      star?.render()
    }
  }
}
