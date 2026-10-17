// Synthesised XMB-style UI blips. No audio files; off by default (toggle in the nav).

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(v: boolean) {
  enabled = v;
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType, gain: number, slideTo?: number) {
  if (!enabled) return;
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  move: () => blip(1760, 0.05, 'sine', 0.05),
  select: () => {
    blip(880, 0.09, 'triangle', 0.07, 1320);
    setTimeout(() => blip(1320, 0.12, 'sine', 0.05), 60);
  },
  back: () => blip(660, 0.08, 'triangle', 0.06, 440),
  toggle: () => blip(1200, 0.04, 'square', 0.025),
};
