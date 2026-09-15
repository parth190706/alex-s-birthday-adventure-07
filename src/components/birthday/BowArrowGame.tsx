import { useRef, useState, type PointerEvent } from "react";
import { motion } from "motion/react";
import { birthdayConfig } from "@/config/birthday";
import { ChapterShell, ProgressPill } from "./ChapterShell";

const positions = [[68,12],[42,25],[73,39],[45,53],[70,66],[48,79]] as const;
const MAX_PULL = 100;
const MIN_PULL = 28;

export function BowArrowGame({ onComplete, playSound }: { onComplete: () => void; playSound: () => void }) {
  const arrowRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const pullRef = useRef(0);
  const hitRef = useRef(0);
  const [hit, setHit] = useState(0);
  const [shooting, setShooting] = useState(false);

  const updateArrow = (pull: number) => {
    if (!arrowRef.current) return;
    arrowRef.current.style.width = `${75 + pull}px`;
    arrowRef.current.style.transform = `translate3d(${-pull * .35}px,0,0)`;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (hitRef.current >= positions.length || shooting) return;
    draggingRef.current = true; startXRef.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); updateArrow(0);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const pull = Math.max(0, Math.min(MAX_PULL, startXRef.current - event.clientX));
    pullRef.current = pull; updateArrow(pull);
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const pull = pullRef.current; pullRef.current = 0;
    if (pull < MIN_PULL || hitRef.current >= positions.length) { updateArrow(0); return; }
    setShooting(true); playSound();
    window.setTimeout(() => { const next = Math.min(positions.length, hitRef.current + 1); hitRef.current = next; setHit(next); setShooting(false); updateArrow(0); }, 280);
  };

  return (
    <ChapterShell chapter="Chapter Two" title="Aim For The Stars" subtitle="Your dreams aren't targets. They're destinations. Let's practice aiming anyway." complete={hit === positions.length} onNext={onComplete}>
      <div className="relative mx-auto h-full max-h-[58dvh] w-full max-w-lg overflow-hidden rounded-lg border border-glass bg-[radial-gradient(circle_at_80%_30%,var(--glass-strong),transparent_45%)] touch-none select-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        {birthdayConfig.dreams.map((label, index) => { const pos = positions[index] ?? [60,50]; const done = index < hit; return <motion.div key={label} className={`pointer-events-none absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-[.62rem] ${done ? "border-gold bg-gold/30 text-gold" : "border-pink/60 bg-glass text-foreground"}`} style={{ left:`${pos[0]}%`, top:`${pos[1]}%` }} animate={done ? { scale:[1,1.35,.95], opacity:[1,.55,.75] } : { scale:1 }} transition={{ duration:.35 }}><span>{label}</span></motion.div>; })}
        <div className="pointer-events-none absolute bottom-10 left-5 h-40 w-20 rounded-r-full border-r-4 border-gold" />
        <div ref={arrowRef} className={`pointer-events-none absolute bottom-[7.4rem] left-8 h-px origin-left bg-starlight shadow-[0_0_8px_var(--starlight)] will-change-transform ${shooting ? "transition-transform duration-300 ease-out" : ""}`} style={{ width:75 }}><span className="absolute -right-1 -top-[3px] h-2 w-2 rotate-45 border-r border-t border-starlight" /></div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2"><ProgressPill current={hit} total={positions.length} /></div>
        <p className="pointer-events-none absolute bottom-20 left-28 text-xs text-muted-foreground">← drag back, then release</p>
        {hit > 0 && <motion.p key={hit} className="pointer-events-none absolute left-5 top-4 max-w-44 text-sm text-gold" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>{birthdayConfig.dreamMessages[hit-1]}</motion.p>}
      </div>
    </ChapterShell>
  );
}
