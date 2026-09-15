import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { birthdayConfig } from "@/config/birthday";
import { ChapterShell, ProgressPill } from "./ChapterShell";

export function BalloonGame({ onComplete, playSound }: { onComplete: () => void; playSound: () => void }) {
  const [popped, setPopped] = useState<number[]>([]);
  const balloons = useMemo(() => birthdayConfig.memories.map((message, index) => ({
    message,
    left: 8 + ((index * 29) % 78),
    duration: 7.5 + (index % 4) * 0.7,
    delay: (index % 5) * 0.8,
    color: ["bg-pink", "bg-lavender", "bg-gold", "bg-accent"][index % 4] ?? "bg-pink",
  })), []);
  const last = popped.at(-1);
  const complete = popped.length === balloons.length;

  const pop = (index: number) => {
    if (popped.includes(index)) return;
    playSound();
    setPopped((items) => [...items, index]);
  };

  return (
    <ChapterShell chapter="Chapter One" title="A Sky Full of Little Memories" subtitle="Pop the balloons. Every one is hiding something for you." complete={complete} onNext={onComplete}>
      <div className="relative mx-auto h-full max-h-[58dvh] w-full max-w-lg overflow-hidden rounded-lg border border-glass bg-glass/30 touch-none select-none">
        {balloons.map((balloon, index) => !popped.includes(index) && (
          <motion.button
            key={index}
            type="button"
            aria-label={`Pop balloon ${index + 1}`}
            onClick={() => pop(index)}
            className="absolute bottom-[8%] z-10 h-24 w-20 touch-manipulation"
            style={{ left: `${balloon.left}%` }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -520 }}
            transition={{ duration: balloon.duration, delay: balloon.delay, repeat: Infinity, ease: "linear" }}
          >
            <span className={`block h-16 w-14 rounded-[50%_50%_46%_46%] ${balloon.color} opacity-95 shadow-[inset_-8px_-8px_16px_oklch(0_0_0/.16)]`} />
            <span className="mx-auto block h-16 w-px bg-foreground/30" />
          </motion.button>
        ))}

        <AnimatePresence mode="wait">
          {last !== undefined && !complete && (
            <motion.div key={last} className="pointer-events-none glass-card absolute left-1/2 top-1/2 z-20 w-[82%] -translate-x-1/2 -translate-y-1/2 p-5 text-center text-sm leading-relaxed" initial={{ opacity: 0, scale: .75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}>
              {balloons[last]?.message}
            </motion.div>
          )}
        </AnimatePresence>

        {complete && <motion.div className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-center" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}><div className="glass-card px-7 py-5"><p className="font-display text-2xl text-gold">Memory collection complete ✨</p><p className="mt-2 text-xs text-muted-foreground">Every little memory is yours to keep.</p></div></motion.div>}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2"><ProgressPill current={popped.length} total={balloons.length} /></div>
      </div>
    </ChapterShell>
  );
}
