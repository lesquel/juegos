import { audioContext } from '../engine.js'

export function createGain (gain = 1) {
  const result = audioContext.createGain()
  result.gain.value = gain
  return result
}

export function createBiquadFilter (type, frequency, Q, gain) {
  const result = audioContext.createBiquadFilter()

  result.type = type
  result.frequency.value = frequency
  result.Q.value = Q || 1
  result.gain.value = gain || 0

  return result
}
