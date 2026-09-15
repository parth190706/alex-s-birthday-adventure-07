import { useCallback, useEffect, useRef, useState } from "react";

type SoundName = "pop" | "hit" | "spin" | "catch" | "star" | "light" | "wish" | "celebrate";

const notes: Record<SoundName, [number, number]> = {
  pop: [520, 0.08], hit: [240, 0.2], spin: [680, 0.1], catch: [760, 0.12],
  star: [880, 0.25], light: [440, 0.35], wish: [330, 0.7], celebrate: [660, 0.8],
};

export function useBirthdayAudio() {
  const context = useRef<AudioContext | null>(null);
  const musicTimer = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [started, setStarted] = useState(false);

  const getContext = useCallback(() => {
    if (!context.current) context.current = new AudioContext();
    return context.current;
  }, []);

  const tone = useCallback((frequency: number, duration: number, volume = 0.035) => {
    if (!enabled) return;
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }, [enabled, getContext]);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const ctx = getContext();
    void ctx.resume();
    const melody = [261.6, 329.6, 392, 493.9, 392, 329.6, 293.7, 349.2];
    let i = 0;
    tone(melody[0] ?? 261.6, 1.8, 0.018);
    musicTimer.current = window.setInterval(() => {
      i = (i + 1) % melody.length;
      tone(melody[i] ?? 261.6, 1.8, 0.018);
    }, 1850);
  }, [getContext, started, tone]);

  const play = useCallback((name: SoundName) => {
    const [frequency, duration] = notes[name];
    tone(frequency, duration);
    if (name === "celebrate") window.setTimeout(() => tone(880, 0.9), 160);
  }, [tone]);

  useEffect(() => () => {
    if (musicTimer.current) window.clearInterval(musicTimer.current);
    void context.current?.close();
  }, []);

  return { enabled, setEnabled, started, start, play };
}