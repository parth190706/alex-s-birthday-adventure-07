import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChapterShell, ProgressPill } from "./ChapterShell";

export function BirthdayCake({ onComplete, playSound }: { onComplete: () => void; playSound: (sound: "light" | "wish" | "celebrate") => void }) {
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState(false);
  const [blown, setBlown] = useState(false);
  const startX = useRef(0);
  const swiping = useRef(false);

  const add = () => setStep((value) => Math.min(5, value + 1));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lit || blown) return;
    startX.current = e.clientX;
    swiping.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swiping.current || !lit || blown) return;
    swiping.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (Math.abs(e.clientX - startX.current) > 80) {
      setLit(false);
      setBlown(true);
      playSound("wish");
      window.setTimeout(() => playSound("celebrate"), 250);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    swiping.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <ChapterShell chapter="Chapter Six" title="Bake. Light. Wish." subtitle="One final little ritual…" complete={blown} onNext={onComplete} nextLabel="See your birthday surprise">
      <div
        className="relative mx-auto flex h-full max-h-[58dvh] w-full max-w-lg flex-col items-center justify-end overflow-hidden rounded-lg border border-glass bg-[radial-gradient(circle_at_50%_70%,oklch(.72_.12_70/.2),transparent_42%)] pb-14 touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center">
          <AnimatePresence>
            {step >= 5 && <motion.div className="relative z-20 mb-[-2px] h-16 w-3 rounded-t bg-pink" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{lit && <span className="absolute left-1/2 top-0 h-7 w-4 origin-bottom rounded-[50%_50%_45%_45%] bg-gold shadow-gold" style={{ animation: "flame .7s ease-in-out infinite" }} />}</motion.div>}
            {step >= 4 && <motion.div className="z-10 -mb-1 text-3xl" initial={{ scale: 0 }} animate={{ scale: 1 }}>🍓 ✨ 🍓</motion.div>}
            {step >= 3 && <motion.div className="h-11 w-36 rounded-lg border border-gold/30 bg-gold/80 shadow-glass" initial={{ x: 220, opacity: 0 }} animate={{ x: 0, opacity: 1 }} />}
            {step >= 2 && <motion.div className="-mt-1 h-12 w-48 rounded-lg border border-gold/30 bg-lavender/80 shadow-glass" initial={{ x: -220, opacity: 0 }} animate={{ x: 0, opacity: 1 }} />}
            {step >= 1 && <motion.div className="-mt-1 h-14 w-60 rounded-lg border border-gold/30 bg-pink/80 shadow-glass" initial={{ y: -240, opacity: 0 }} animate={{ y: 0, opacity: 1 }} />}
          </AnimatePresence>
        </div>

        {step < 4 && <Button variant="glass" size="lg" className="absolute top-7 z-30" onClick={add}>{["Add bottom layer", "Add middle layer", "Add top layer", "Add decorations"][step]}</Button>}
        {step === 4 && <Button variant="glass" size="lg" className="absolute top-7 z-30" onClick={add}>Place the candle 🕯️</Button>}
        {step === 5 && !lit && !blown && <Button variant="gift" size="lg" className="absolute top-7 z-30" onClick={() => { setLit(true); playSound("light"); }}>Light the candle 🔥</Button>}

        {lit && <motion.div className="pointer-events-none absolute top-6 z-20 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><p className="font-display text-2xl text-gold">Make a wish…</p><p className="mt-1 text-xs text-muted-foreground">Swipe across to blow it out 💨</p></motion.div>}
        {blown && <motion.div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-midnight/70 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div><p className="font-display text-3xl text-gold">Wish sent into the universe. ✨</p><p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">May every good thing you wished for find its way to you.</p></div></motion.div>}
        <div className="pointer-events-none absolute bottom-4"><ProgressPill current={step} total={5}/></div>
      </div>
    </ChapterShell>
  );
}
