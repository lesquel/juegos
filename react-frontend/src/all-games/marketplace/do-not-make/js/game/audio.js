import { audioContext, audioDestination } from '../engine.js'
import { ReverbIR } from '../assets/audio/reverbIR.js'
import { createBiquadFilter } from '../audio/context.js'

const eq1 = createBiquadFilter('peaking', 192, 2, 0)
const eq2 = createBiquadFilter('highshelf', 5000, 2, 0)
eq1.connect(eq2)
eq2.connect(audioDestination)

let reverbDestination
export function setReverbDestination() {
  const reverb = audioContext.createConvolver()
  reverb.buffer = ReverbIR
  reverbDestination = audioContext.createGain()
  reverbDestination.gain.value = 0.7
  reverbDestination.connect(reverb)
  reverb.connect(eq1)
}

export function playSample(sample, reverb = true) {
  if (!reverbDestination || audioContext.state !== 'running') return

  let source = audioContext.createBufferSource()
  source.buffer = sample
  if (reverb) {
    source.connect(reverbDestination)
  }
  source.connect(eq1)
  source.start()
}
