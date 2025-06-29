import {
  applyEnvelope,
  createAudioBuffer,
  generateSound,
  getFrequencyDelta,
  sampleTriangle
} from '../../audio/utils.js'
import { updateInitProgress } from '../../utils.js'
import { bandPassFilter } from '../../audio/filters.js'
import { getFreq } from '../../generationUtils/audio.js'

const freqs = [
  // Bass line notes
  getFreq(-7-12), // 0 = D0
  getFreq(-5-12), // 1 = E0
  getFreq(-3-12), // 2 = Fs0
  getFreq(-2-12), // 3 = G0
  getFreq(-12), // 4 = A0

  getFreq(-7), // 5 = D1
  getFreq(-5), // 6 = E1
  getFreq(-3), // 7 = Fs1
  getFreq(-2), // 8 = G1
  getFreq(0), // 9 = A1

  // Melody notes
  getFreq(4), // 10 = Cs2
  getFreq(7), // 11 = E2
  getFreq(9), // 12 = Fs2
  getFreq(10), // 13 = G2
  getFreq(12), // 14 = A2

  getFreq(4+12), // 15 = Cs3
  getFreq(7+12), // 16 = E3
  getFreq(9+12), // 17 = Fs3
  getFreq(10+12), // 18 = G3
  getFreq(12+12), // 19 = A3

  getFreq(4+24), // 20 = Cs4
  getFreq(7+24), // 21 = E4
]

export let PluckSounds = []

let volumeEnvelope = [
  [0, 0, 2],
  [0.01, 0.5, 0.5],
  [0.03, 0.4, 0.02],
  [1, 0]
]
function generatePluckSound(frequency) {
  let p = 0
  function getSample (t) {
    p += getFrequencyDelta(frequency)
    return sampleTriangle(p)
  }

  return createAudioBuffer(
    bandPassFilter(
      applyEnvelope(
        generateSound(2, getSample),
        volumeEnvelope
      ),
      [[0, 1000], [0.1, frequency / 4]]
    )
  )
}

export async function generatePluckSounds() {
  let progress = 0
  for (const freq of freqs) {
    PluckSounds.push(await generatePluckSound(freq))
    if (progress++ % 5 === 0) {
      await updateInitProgress()
    }
  }
}
