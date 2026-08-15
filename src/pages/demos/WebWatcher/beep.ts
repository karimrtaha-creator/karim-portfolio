let sharedContext: AudioContext | null = null

/** Short synthesized alert tone — no audio assets needed. Fails silently if
 *  the browser blocks audio before a user gesture has occurred. */
export function playAlertBeep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    if (!sharedContext) sharedContext = new Ctx()
    const context = sharedContext
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.setValueAtTime(0.001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.15, context.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.32)
  } catch {
    // audio not available in this environment — visual + toast alert still fires
  }
}
