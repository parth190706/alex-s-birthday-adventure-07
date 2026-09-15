import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MusicToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <Button aria-label={enabled ? "Mute music" : "Play music"} title={enabled ? "Mute music" : "Play music"} variant="glass" size="iconLg" onClick={onToggle} className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-50">
      {enabled ? <Volume2 /> : <VolumeX />}
    </Button>
  );
}

export function ChapterShell({ chapter, title, subtitle, children, complete, onNext, nextLabel = "Next chapter" }: {
  chapter: string; title: string; subtitle: string; children: ReactNode; complete: boolean; onNext: () => void; nextLabel?: string;
}) {
  return (
    <motion.main className="scene" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.65 }}>
      <header className="scene-header">
        <p className="chapter-label">{chapter}</p>
        <h1 className="scene-title">{title}</h1>
        <p className="scene-subtitle">{subtitle}</p>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <motion.div className="mt-4 flex min-h-14 items-center justify-center pb-[max(1rem,env(safe-area-inset-bottom))]" animate={{ opacity: complete ? 1 : 0 }}>
        {complete && <Button variant="gift" size="lg" onClick={onNext}>{nextLabel}<ArrowRight /></Button>}
      </motion.div>
    </motion.main>
  );
}

export function ProgressPill({ current, total }: { current: number; total: number }) {
  return <div className="progress-pill" aria-label={`${current} of ${total} complete`}><span style={{ width: `${(current / total) * 100}%` }} /></div>;
}