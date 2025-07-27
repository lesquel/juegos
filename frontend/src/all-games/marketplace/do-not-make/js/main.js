import { loading } from './ui.js'
import { initAssets } from './initAssets.js'
import { audioContext, startGame } from './engine.js'
import { onResize, init, render, update } from './game/main.js'
import { startMusic } from './game/dynamicMusic.js'

await initAssets()

init()

loading.remove()

startGame(update, render, onResize)

document.addEventListener('pointerdown', async () => {
  await audioContext.resume()
  startMusic()
})
