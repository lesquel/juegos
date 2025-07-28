import { playSample } from './audio.js'
import { PluckSounds } from '../assets/audio/Pluck.js'

const notes = [14, 15, 16, 17, 19]
export function playVictorySound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playSample(PluckSounds[notes[i]])
    }, i * 100)
  }
}
