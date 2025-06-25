import { getLevel } from './level.js'
import { vec3 } from '../math/vec3.js'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { fadeIn } from './fade.js'
import { StartArrow } from './startArrow.js'
import { finalScreen } from './finalScreen.js'
import { SymbolElement } from './symbolElement.js'
import { Title } from './title.js'
import { Strand } from './strand.js'
import { Goal } from './goal.js'
import { Tutorial } from './tutorial.js'
import { Partitioner } from './partitioner.js'

export const levels = [
  () => getLevel([
    new Goal(VIEW_HEIGHT / 2 + 70),
    new Strand(VIEW_HEIGHT / 2 + 70),
    new SymbolElement(1, 50, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
    new SymbolElement(3, 50, vec3([VIEW_WIDTH / 2 + 40, 180, 0])),
    new SymbolElement('+', 25, vec3([VIEW_WIDTH / 2 - 180, 160, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
    new SymbolElement('+', 15, vec3([VIEW_WIDTH / 2 + 40, 330, 0])),
    new Title(),
    new StartArrow(),
    new Tutorial(),
    new Partitioner()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(VIEW_HEIGHT / 2),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 30, 100, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 30, 100, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 30, 250, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 30, 260, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 170, 200, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(VIEW_HEIGHT / 2),
    new SymbolElement(1, 25, vec3([VIEW_WIDTH / 2 - 35, 110, 0])),
    new SymbolElement(3, 35, vec3([VIEW_WIDTH / 2 + 30, 110, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 - 30, 250, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 + 35, 260, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 - 170, 120, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 + 150, 200, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(VIEW_HEIGHT / 2),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 40, 170, 0])),
    new SymbolElement(1, 25, vec3([VIEW_WIDTH / 2 + 140, 65, 0])),
    new SymbolElement(3, 15, vec3([VIEW_WIDTH / 2 + 120, 160, 0])),
    new SymbolElement(1, 15, vec3([VIEW_WIDTH / 2 + 140, 220, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 + 40, 230, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 - 120, 250, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 170, 320, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(VIEW_HEIGHT / 2),
    new SymbolElement(1, 25, vec3([VIEW_WIDTH / 2 - 160, 70, 0])),
    new SymbolElement(1, 20, vec3([VIEW_WIDTH / 2 - 75, 60, 0])),
    new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 + 25, 90, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 + 150, 50, 0])),
    new SymbolElement('+', 20, vec3([140, 130, 0])),
    new SymbolElement('+', 20, vec3([350, 140, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2, 270, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 100, 265, 0])),
    new SymbolElement(3, 45, vec3([VIEW_WIDTH / 2 - 100, 250, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(VIEW_HEIGHT / 2),
    new SymbolElement(1, 35, vec3([VIEW_WIDTH / 2 - 90, 200, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 20, 130, 0])),
    new SymbolElement(2, 20, vec3([VIEW_WIDTH / 2 - 160, 260, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2, 200, 0])),
    new SymbolElement(1, 35, vec3([VIEW_WIDTH / 2 + 90, 220, 0])),
    new SymbolElement(1, 35, vec3([VIEW_WIDTH / 2 + 15, 130, 0])),
    new SymbolElement(2, 25, vec3([VIEW_WIDTH / 2 + 160, 260, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2, 20, 0])),
    new SymbolElement(2, 20, vec3([VIEW_WIDTH / 2 + 30, 20, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 - 20, 300, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 100, 300, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2 + 80),
    new Strand(50),
    new SymbolElement('+', 20, vec3([140, 130, 0])),
    new SymbolElement(2, 20, vec3([165, 130, 0])),
    new SymbolElement('+', 50, vec3([240, 130, 0])),
    new SymbolElement(3, 50, vec3([240+70, 130, 0])),
    new SymbolElement('+', 45, vec3([VIEW_WIDTH / 2 - 30, 240, 0])),
    new SymbolElement(5, 45, vec3([VIEW_WIDTH / 2 + 30, 240, 0])),
    new SymbolElement(1, 30, vec3([70, 270, 0])),
    new SymbolElement(1, 30, vec3([240+140+20, 200, 0])),
    new SymbolElement(1, 20, vec3([85, 50, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2 - 100),
    new Strand(300),
    new SymbolElement(3, 20, vec3([60, 130, 0])),
    new SymbolElement(2, 25, vec3([80, 310, 0])),
    new SymbolElement(3, 20, vec3([144, 218, 0])),
    new SymbolElement(3, 30, vec3([344, 200, 0])),
    new SymbolElement(2, 20, vec3([198, 124, 0])),
    new SymbolElement(2, 40, vec3([268, 51, 0])),
    new SymbolElement(2, 20, vec3([387, 74, 0])),
    new SymbolElement(3, 20, vec3([393, 314, 0])),
    new SymbolElement(2, 25, vec3([204, 330, 0])),

    new SymbolElement('+', 25, vec3([62, 44, 0])),
    new SymbolElement('+', 30, vec3([170, 122, 0])),
    new SymbolElement('+', 25, vec3([170, 333, 0])),
    new SymbolElement('+', 20, vec3([323, 301, 0])),
    new SymbolElement('+', 20, vec3([278, 290, 0])),
    new SymbolElement('+', 25, vec3([430, 155, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2),
    new Strand(300),
    new SymbolElement(1, 20, vec3([60, 130, 0])),
    new SymbolElement(2, 30, vec3([160, 130, 0])),
    new SymbolElement(3, 25, vec3([60, 220, 0])),
    new SymbolElement(4, 20, vec3([400, 180, 0])),
    new SymbolElement(5, 25, vec3([360, 330, 0])),
    new SymbolElement(6, 25, vec3([VIEW_WIDTH / 2, 330, 0])),
    new SymbolElement(6, 30, vec3([VIEW_WIDTH / 2 + 10, 80, 0])),
    new SymbolElement('+', 30, vec3([160, 330, 0])),
    new SymbolElement('+', 40, vec3([VIEW_WIDTH - 80, 80, 0])),
    new SymbolElement('+', 40, vec3([VIEW_WIDTH - 80, VIEW_HEIGHT - 80, 0])),

    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(100),
    new Strand(100),
    new SymbolElement(2, 25, vec3([71, 50, 0])),
    new SymbolElement(5, 25, vec3([229, 30, 0])),
    new SymbolElement(3, 25, vec3([402, 38, 0])),
    new SymbolElement(3, 25, vec3([216, 216, 0])),
    new SymbolElement(4, 25, vec3([372, 151, 0])),
    new SymbolElement(4, 25, vec3([405, 184, 0])),
    new SymbolElement(2, 25, vec3([102, 318, 0])),
    new SymbolElement(5, 25, vec3([400, 300, 0])),
    new SymbolElement('-', 20, vec3([60, 130, 0])),
    new SymbolElement('-', 20, vec3([190, 230, 0])),
    new SymbolElement('+', 20, vec3([260, 130, 0])),
    new SymbolElement('-', 20, vec3([260, 330, 0])),

    new Partitioner(),
    fadeIn()
  ]),

  () => getLevel([
    new Goal(VIEW_HEIGHT / 2 + 80),
    new Strand(50),
    new SymbolElement('+', 20, vec3([140, 130, 0])),
    new SymbolElement('+', 20, vec3([400, 50, 0])),
    new SymbolElement(2, 20, vec3([165, 130, 0])),
    new SymbolElement('+', 40, vec3([240, 130, 0])),
    new SymbolElement(1, 50, vec3([240+57, 130, 0])),
    new SymbolElement('-', 40, vec3([VIEW_WIDTH / 2 - 40, 240, 0])),
    new SymbolElement('f', 40, vec3([VIEW_WIDTH / 2 - 37, 245, 0])),
    new SymbolElement(5, 45, vec3([VIEW_WIDTH / 2 + 23, 240, 0])),
    new SymbolElement(1, 30, vec3([70, 270, 0])),
    new SymbolElement(1, 30, vec3([240+140+20, 200, 0])),
    new SymbolElement(1, 20, vec3([85, 50, 0])),
    new Partitioner(),
    fadeIn()
  ]),

  () => {
    const elements = []
    for (let i = 0; i < 20; i++) {
      let value
      if (i % 3 === 0) value = 1
      else if (i % 4 === 0) value = 2
      else if (i % 5 === 0) value = 3
      else value = '+'
      elements.push(new SymbolElement(value, 20, vec3([i % 5 * 75 + 90, Math.floor(i / 5) * 75 + 70, 0])))
    }
    return getLevel([
      new Goal(VIEW_HEIGHT / 2 + 80),
      new Strand(50),
        ...elements,
      new Partitioner(),
      fadeIn()
    ])
  },

  () => finalScreen()
]
