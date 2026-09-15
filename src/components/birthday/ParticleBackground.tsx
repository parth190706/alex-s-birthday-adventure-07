import { motion } from "motion/react";

const stars = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 96}%`,
  size: 1 + (index % 3),
  delay: (index % 9) * 0.35,
}));

export function ParticleBackground({ festive = false }: { festive?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-scene-glow" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-starlight"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 0.95, 0.2], scale: [1, 1.7, 1] }}
          transition={{ duration: 3 + (star.id % 4), repeat: Infinity, delay: star.delay }}
        />
      ))}
      {festive && ["♥", "✦", "·", "✧", "♥", "✦"].map((shape, index) => (
        <motion.span
          key={`${shape}-${index}`}
          className="absolute text-glow-soft"
          style={{ left: `${8 + index * 17}%`, bottom: "-8%" }}
          animate={{ y: [0, -900], opacity: [0, 0.65, 0], rotate: [0, 30] }}
          transition={{ duration: 9 + index, repeat: Infinity, delay: index * 1.2 }}
        >{shape}</motion.span>
      ))}
    </div>
  );
}