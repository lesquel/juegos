import { levels } from './levels.js'
import { restartButton } from '../ui.js'

export let currentLevelIndex = window.localStorage.getItem('donotmake13') || 0
export let currentLevel = levels[currentLevelIndex]()

export function restart() {
  currentLevel = levels[currentLevelIndex]()
}

document.addEventListener('keydown', e => {
  if (e.key === 'r') {
    restart()
  }
})

restartButton.onclick = restart

export function nextLevel() {
  currentLevelIndex++
  window.localStorage.setItem('donotmake13', currentLevelIndex === levels.length - 1 ? 0 : currentLevelIndex)
  currentLevel = levels[currentLevelIndex]()
}
