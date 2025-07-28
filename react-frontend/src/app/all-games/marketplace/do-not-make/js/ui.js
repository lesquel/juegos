import { classNames } from './classNames.js'

// <dev-only>
for (let key in classNames) {
  classNames[key] = key
}
// </dev-only>

function getElement (name) {
  return document.querySelector('.' + name)
}

export const loading = getElement(classNames.loading)
export const restartButton = getElement(classNames.restartButton)

export function showRestartButton() {
  restartButton.style.right = 0
}
export function hideRestartButton() {
  restartButton.style.right = '-10em'
}
