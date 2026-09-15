import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion } from "motion/react";
import { ChapterShell, ProgressPill } from "./ChapterShell";

const points = [[50,18],[34,9],[20,22],[18,39],[27,55],[50,82],[73,55],[82,39],[80,22],[66,9]] as const;
const HIT_RADIUS = 48;

export function ConnectStarsGame({ onComplete, playSound }: { onComplete: () => void; playSound: () => void }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const liveLineRef = useRef<SVGLineElement>(null);
  const draggingRef = useRef(false);
  const currentRef = useRef(0);
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const complete = current === points.length;

  useEffect(() => { currentRef.current = current; }, [current]);

  const updateLiveLine = (clientX: number, clientY: number) => {
    const board = boardRef.current, line = liveLineRef.current;
    if (!board || !line) return;
    const rect = board.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    const from = points[Math.max(0, currentRef.current - 1)] ?? points[0];
    line.setAttribute("x1", String(from[0])); line.setAttribute("y1", String(from[1])); line.setAttribute("x2", String(x)); line.setAttribute("y2", String(y));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (complete) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const start = points[Math.min(currentRef.current, points.length - 1)];
    const radius = (HIT_RADIUS / Math.min(rect.width, rect.height)) * 100;
    if (!start || Math.hypot(x - start[0], y - start[1]) > radius) return;
    draggingRef.current = true; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateLiveLine(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateLiveLine(event.clientX, event.clientY);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const nextIndex = currentRef.current;
    if (nextIndex >= points.length) return;
    const target = points[nextIndex];
    const radius = (HIT_RADIUS / Math.min(rect.width, rect.height)) * 100;
    if (Math.hypot(x - target[0], y - target[1]) <= radius) {
      const next = nextIndex + 1;
      currentRef.current = next; setCurrent(next); playSound();
      if (next >= points.length) { draggingRef.current = false; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }
    }
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (liveLineRef.current) liveLineRef.current.style.opacity = "0";
  };

  return (
    <ChapterShell chapter="Chapter Five" title="Connect The Stars" subtitle="Drag through the stars. Watch a little heart appear." complete={complete} onNext={onComplete}>
      <div ref={boardRef} className="relative mx-auto h-full max-h-[58dvh] w-full max-w-lg overflow-hidden rounded-lg border border-glass bg-[radial-gradient(circle_at_center,var(--glass-strong),transparent_68%)] touch-none select-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          {points.slice(1, current + 1).map((point, index) => <motion.line key={`${index}-${current}`} x1={points[index][0]} y1={points[index][1]} x2={point[0]} y2={point[1]} stroke="var(--pink)" strokeWidth=".9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />)}
          {complete && <motion.line x1={points[points.length - 1][0]} y1={points[points.length - 1][1]} x2={points[0][0]} y2={points[0][1]} stroke="var(--pink)" strokeWidth=".9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          <line ref={liveLineRef} x1={points[0][0]} y1={points[0][1]} x2="0" y2="0" stroke="var(--gold)" strokeWidth=".65" strokeLinecap="round" opacity={dragging ? 0.9 : 0} />
        </svg>
        {points.map((point, index) => {
          const reached = index < current, active = index === current;
          return <div key={index} className={`pointer-events-none absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${active ? "text-gold drop-shadow-[0_0_16px_var(--gold)]" : reached ? "text-gold drop-shadow-[0_0_12px_var(--gold)]" : "text-foreground/40"}`} style={{ left: `${point[0]}%`, top: `${point[1]}%` }}><span className="text-2xl">★</span>{active && !complete && <span className="absolute inset-0 rounded-full border border-gold/40 animate-pulse" />}</div>;
        })}
        {complete && <motion.div className="pointer-events-none absolute inset-x-0 top-[42%] text-center" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: [1,1.04,1] }} transition={{ scale: { repeat: Infinity, duration: 1.4 } }}><p className="font-display text-2xl text-pink">Look what you made. 💗</p><p className="mt-2 text-xs text-muted-foreground">Beautiful things are built one little moment at a time.</p></motion.div>}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2"><ProgressPill current={current} total={points.length} /></div>
        {current === 0 && <p className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-xs text-muted-foreground">Touch the first star, then drag through each glowing star</p>}
      </div>
    </ChapterShell>
  );
}
