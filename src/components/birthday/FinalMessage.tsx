import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthdayConfig } from "@/config/birthday";

export function FinalMessage({ onReplay }: { onReplay: () => void }) {
  return <motion.main className="scene items-center justify-center overflow-y-auto py-20 text-center" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}}>
    <motion.p className="text-sm text-lavender" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>Happy Birthday,</motion.p>
    <motion.h1 className="mt-2 font-display text-7xl leading-none text-glow" initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.2,type:"spring"}}>{birthdayConfig.nickname.toUpperCase()} ✨</motion.h1>
    <p className="mt-2 font-display text-3xl text-gold">{birthdayConfig.birthdayName}</p>
    <motion.div className="glass-card my-8 max-w-sm p-6 text-sm leading-7 text-muted-foreground" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}}>
      <p>You popped the memories,<br/>aimed for the dreams,<br/>caught the sweet moments,<br/>connected the stars,<br/>and made your own birthday cake.</p>
      <p className="mt-5 text-foreground">But this was only a little digital adventure…</p>
      <p className="mt-5 font-display text-xl text-pink">{birthdayConfig.finalMessage}</p>
    </motion.div>
    <p className="mb-7 font-display text-2xl">Happy Birthday, Alex. ❤️</p>
    <Button variant="gift" size="lg" onClick={onReplay}>Play the adventure again <RotateCcw/></Button>
  </motion.main>;
}