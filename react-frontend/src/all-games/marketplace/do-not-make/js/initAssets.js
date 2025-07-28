import { generatePluckSounds } from './assets/audio/Pluck.js'
import { generateReverbIR } from './assets/audio/reverbIR.js'
import { generateErrorSound } from './assets/audio/ErrorSound.js'
import { generatePadsSounds } from './assets/audio/Pads.js'

export async function initAssets () {
  await generatePluckSounds()
  await generatePadsSounds()
  await generateReverbIR()
  await generateErrorSound()
}
