import {
  applyEnvelope,
  createAudioBuffer,
  generateSound,
  getFrequencyDelta,
  sampleNoise,
  sampleSine
} from '../../audio/utils.js'
import { contextSampleRate } from '../../engine.js'
import { updateInitProgress } from '../../utils.js'
import { getFreq } from '../../generationUtils/audio.js'

const volumeEnvelope = [
  [0, 0],
  [0.01, 0.3, 0.9],
  [0.02, 0.15, 0.8],
  [0.99, 0.03],
  [1, 0]
]

const freqs = [
  getFreq(-7), // 0 = D0
  getFreq(-5), // 1 = E0
  getFreq(-3), // 2 = Fs0
  getFreq(-2), // 3 = G0
  getFreq(0), // 4 = A0
]

export const PadSounds = []

export function generatePadsSound (frequency, length) {
  let p1 = Math.random()
  let p2 = Math.random()
  let p3 = Math.random()
  let pN = Math.random()
  let prevY = 0
  let lastNoiseSample = sampleNoise()
  const yAlpha = 1 - Math.exp(-100 / contextSampleRate)

  let f1L = frequency * Math.pow(2, -0.1/12)
  let f2L = frequency * Math.pow(2, +0.06/12)
  let f1R = frequency * Math.pow(2, +0.1/12)
  let f2R = frequency * Math.pow(2, -0.06/12)

  function getSampleL (t) {
    p1 += getFrequencyDelta(f1L)
    p2 += getFrequencyDelta(f2L)
    p3 += getFrequencyDelta(frequency)
    pN += getFrequencyDelta(frequency * 0.25)
    if (pN >= 1) {
      pN -= 1
      lastNoiseSample = sampleNoise()
    }
    prevY = yAlpha * lastNoiseSample + (1 - yAlpha) * prevY
    return sampleSine(p1) + sampleSine(p2 * 2) * 0.25 + sampleSine(p3 * 4) * prevY
  }

  function getSampleR (t) {
    p1 += getFrequencyDelta(f1R)
    p2 += getFrequencyDelta(f2R)
    p3 += getFrequencyDelta(frequency)
    pN += getFrequencyDelta(frequency * 0.25)
    if (pN >= 1) {
      pN -= 1
      lastNoiseSample = sampleNoise()
    }
    prevY = yAlpha * lastNoiseSample + (1 - yAlpha) * prevY
    return sampleSine(p1) + sampleSine(p2 * 2) * 0.25 + sampleSine(p3 * 4) * prevY
  }

  return createAudioBuffer([
    applyEnvelope(generateSound(length, getSampleL), volumeEnvelope),
    applyEnvelope(generateSound(length, getSampleR), volumeEnvelope)
  ])
}

export async function generatePadsSounds() {
  for (const freq of freqs) {
    PadSounds.push(await generatePadsSound(freq, 2))
    await updateInitProgress()
  }
}
