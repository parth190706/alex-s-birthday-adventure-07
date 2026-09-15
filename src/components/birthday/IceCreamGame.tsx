import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import { ChapterShell, ProgressPill } from "./ChapterShell";

type Treat = { x: number; y: number; speed: number; rotation: number };
const TARGET = 12;
const TREAT_COUNT = 7;
const TREATS = ["🍦", "🍨", "🍧"];

export function IceCreamGame({ onComplete, playSound }: { onComplete: () => void; playSound: () => void }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const treatElementsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const basketXRef = useRef(50);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const boardSizeRef = useRef({ width: 0, height: 0 });
  const runningRef = useRef(true);
  const caughtRef = useRef(0);
  const soundRef = useRef(playSound);
  const [caught, setCaught] = useState(0);

  useEffect(() => { soundRef.current = playSound; }, [playSound]);

  const applyBasketPosition = useCallback((clientX: number) => {
    const board = boardRef.current;
    const basket = basketRef.current;
    if (!board || !basket) return;
    const rect = board.getBoundingClientRect();
    if (!rect.width) return;
    const percentage = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    basketXRef.current = percentage;
    const xPx = (percentage / 100) * rect.width;
    basket.style.transform = `translate3d(${xPx - rect.width / 2}px, 0, 0)`;
  }, []);

  useEffect(() => {
    runningRef.current = true;
    lastFrameRef.current = null;
    const board = boardRef.current;
    if (!board) return;
    const updateSize = () => {
      const rect = board.getBoundingClientRect();
      boardSizeRef.current = { width: rect.width, height: rect.height };
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(board);

    const treats: Treat[] = Array.from({ length: TREAT_COUNT }, (_, index) => ({
      x: 10 + ((index * 17 + 11) % 80), y: -70 - index * 95,
      speed: 125 + (index % 3) * 24, rotation: -12 + index * 7,
    }));
    const frame = (time: number) => {
      if (!runningRef.current) return;
      const previous = lastFrameRef.current ?? time;
      const delta = Math.min((time - previous) / 1000, 0.032);
      lastFrameRef.current = time;
      const { width, height } = boardSizeRef.current;
      if (width && height) {
        const basketX = (basketXRef.current / 100) * width;
        const basketY = height - 62;
        treats.forEach((treat, index) => {
          treat.y += treat.speed * delta;
          const element = treatElementsRef.current[index];
          if (element) element.style.transform = `translate3d(0, ${treat.y}px, 0) rotate(${treat.rotation}deg)`;
          const caughtThisFrame = treat.y > basketY - 34 && treat.y < basketY + 32 && Math.abs((treat.x / 100) * width - basketX) < 62;
          if (caughtThisFrame) {
            treat.y = -90 - ((index * 83 + Math.random() * 80) % 180);
            treat.x = 8 + Math.random() * 84;
            treat.speed = 120 + Math.random() * 55;
            treat.rotation = -18 + Math.random() * 36;
            if (element) element.style.left = `${treat.x}%`;
            caughtRef.current += 1;
            const next = Math.min(TARGET, caughtRef.current);
            setCaught(next);
            soundRef.current();
            if (next >= TARGET) runningRef.current = false;
          } else if (treat.y > height + 70) {
            treat.y = -80 - Math.random() * 180;
            treat.x = 8 + Math.random() * 84;
            treat.speed = 120 + Math.random() * 55;
            treat.rotation = -18 + Math.random() * 36;
            if (element) element.style.left = `${treat.x}%`;
          }
        });
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    applyBasketPosition(event.clientX);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) applyBasketPosition(event.clientX);
  };

  return (
    <ChapterShell chapter="Chapter Four" title="Catch The Sweet Moments" subtitle="Some moments are too sweet to let fall." complete={caught === TARGET} onNext={onComplete}>
      <div ref={boardRef} className="relative mx-auto h-full max-h-[58dvh] w-full max-w-lg overflow-hidden rounded-lg border border-glass bg-glass/20 touch-none select-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)} onPointerCancel={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}>
        {TREATS.map((emoji, index) => (
          <span key={index} ref={(element) => { treatElementsRef.current[index] = element; }} className="pointer-events-none absolute left-0 top-0 text-3xl will-change-transform" style={{ left: `${10 + ((index * 17 + 11) % 80)}%` }}>{emoji}</span>
        ))}
        <div ref={basketRef} className="pointer-events-none absolute bottom-8 left-1/2 text-center will-change-transform"><div className="text-6xl leading-none">🥣</div><div className="mt-[-10px] text-xs font-semibold text-gold">{caught}/{TARGET}</div></div>
        <p className="pointer-events-none absolute inset-x-0 top-5 text-center text-sm text-lavender">{birthdayConfig.sweetMessages[Math.min(3, Math.floor(caught / 3))]}</p>
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2"><ProgressPill current={caught} total={TARGET} /></div>
        {caught === 0 && <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center text-xs text-muted-foreground">Drag the bowl with your finger</p>}
      </div>
    </ChapterShell>
  );
}
