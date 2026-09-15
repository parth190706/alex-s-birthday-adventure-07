import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthdayConfig } from "@/config/birthday";
import { ChapterShell, ProgressPill } from "./ChapterShell";

const FALLBACK_WISHES = [
  "More laughter",
  "A dream trip",
  "Peace of mind",
  "New adventures",
  "Unexpected happiness",
  "A brave new beginning",
  "Everything you deserve",
  "A year to remember",
];

export function WishWheel({ onComplete, playSound }: { onComplete: () => void; playSound: () => void }) {
  const wishes = Array.isArray(birthdayConfig.wishes) && birthdayConfig.wishes.length > 0
    ? birthdayConfig.wishes.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    : FALLBACK_WISHES;

  const [spins, setSpins] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [wish, setWish] = useState("");
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const spin = () => {
    if (spinning || spins >= 3 || wishes.length === 0) return;

    const chosen = (spins * 3 + 2) % wishes.length;
    const segmentAngle = 360 / wishes.length;
    const targetRotation = rotation + 1440 + (360 - chosen * segmentAngle) + segmentAngle / 2;

    setSpinning(true);
    playSound();
    setRotation(targetRotation);

    timerRef.current = window.setTimeout(() => {
      setWish(wishes[chosen] ?? FALLBACK_WISHES[chosen % FALLBACK_WISHES.length]);
      setSpins((value) => value + 1);
      setSpinning(false);
      timerRef.current = null;
    }, 2600);
  };

  const segment = 360 / wishes.length;

  return (
    <ChapterShell
      chapter="Chapter Three"
      title="The Wish Wheel"
      subtitle="Close your eyes for a second… pick a wish."
      complete={spins === 3}
      onNext={onComplete}
    >
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="absolute -top-5 left-1/2 z-30 -translate-x-1/2 text-3xl leading-none text-gold" aria-hidden="true">
            ▼
          </div>

          <motion.div
            className="relative grid aspect-square w-[min(72vw,20rem)] place-items-center overflow-hidden rounded-full border-4 border-gold/70 shadow-gold"
            style={{
              background: `conic-gradient(from -90deg, var(--pink) 0deg ${segment}deg, var(--secondary) ${segment}deg ${segment * 2}deg, var(--gold) ${segment * 2}deg ${segment * 3}deg, var(--accent) ${segment * 3}deg ${segment * 4}deg, var(--pink) ${segment * 4}deg ${segment * 5}deg, var(--secondary) ${segment * 5}deg ${segment * 6}deg, var(--gold) ${segment * 6}deg ${segment * 7}deg, var(--accent) ${segment * 7}deg 360deg)`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 2.6, ease: [0.12, 0.72, 0.2, 1] }}
          >
            <div className="pointer-events-none absolute inset-0">
              {wishes.map((label, index) => {
                const angle = index * segment + segment / 2 - 90;
                const radius = "35%";
                return (
                  <div
                    key={`${index}-${label}`}
                    className="absolute left-1/2 top-1/2 flex w-[30%] -translate-x-1/2 -translate-y-1/2 justify-center"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}) rotate(${-angle}deg)` }}
                  >
                    <span className="max-w-full text-center text-[9px] font-semibold leading-tight text-midnight drop-shadow-sm sm:text-[10px]">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 border-gold bg-midnight shadow-gold sm:h-16 sm:w-16">
              <Sparkles className="text-gold" />
            </div>
          </motion.div>
        </div>

        <div className="h-14 px-4 text-center">
          {wish && (
            <motion.p
              key={wish}
              className="font-display text-xl text-gold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✨ Your wish: {wish} ✨
              <span className="mt-1 block font-sans text-xs text-muted-foreground">Keep this one close.</span>
            </motion.p>
          )}
        </div>

        <Button variant="gift" size="lg" disabled={spinning || spins === 3} onClick={spin}>
          {spinning ? "The stars are choosing…" : "Spin the wish wheel ✨"}
        </Button>

        <ProgressPill current={spins} total={3} />
      </div>
    </ChapterShell>
  );
}
