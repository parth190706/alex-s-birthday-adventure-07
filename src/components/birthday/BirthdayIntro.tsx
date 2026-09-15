import { motion } from "motion/react";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthdayConfig } from "@/config/birthday";

export function BirthdayIntro({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.main className="scene items-center justify-center text-center" exit={{ opacity: 0, scale: 1.12, filter: "blur(12px)" }} transition={{ duration: .8 }}>
      <motion.div className="mb-8 text-pink" animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity }}>
        <div className="relative">
          <motion.div className="absolute inset-0 rounded-full bg-pink/30 blur-3xl" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.8, repeat: Infinity }} />
          <Gift className="relative h-28 w-28 stroke-[1.1] drop-shadow-[0_0_20px_var(--pink)]" />
          <Sparkles className="absolute -right-7 -top-5 h-8 w-8 text-gold" />
        </div>
      </motion.div>
      <motion.p className="mb-3 text-sm text-lavender" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>Hi, {birthdayConfig.nickname} ✨</motion.p>
      <motion.h1 className="font-display text-5xl leading-[.98] text-glow sm:text-6xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}>Happy Birthday,<br />{birthdayConfig.birthdayName}</motion.h1>
      <motion.p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>A tiny adventure has been prepared for you…</motion.p>
      <motion.div className="mt-9" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}>
        <Button variant="gift" size="lg" onClick={onOpen} className="h-14 px-7 uppercase tracking-wide">Tap to open your present 🎁</Button>
      </motion.div>
    </motion.main>
  );
}