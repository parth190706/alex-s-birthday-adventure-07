# Alex’s Birthday Adventure

## Goal
Build a polished, portrait-first interactive birthday gift for Kriti (“Alex”) that progresses through an opening present, six distinct playable chapters, and an emotional finale.

## Experience
- Create a cinematic midnight-purple birthday universe with pink, lavender, champagne, and luminous white accents.
- Use distinct scenes for each chapter while maintaining one cohesive visual language.
- Add smooth transitions, stars, particles, restrained glass effects, large touch targets, and reduced-motion support.
- Keep all personal names, messages, wishes, and replaceable audio paths in one configuration file.

## Interactive flow
1. **Gift opening:** animated present, first-tap music start, confetti transition.
2. **Balloon memories:** floating tappable balloons, pop particles/messages, unlock after nine pops.
3. **Aim for the stars:** drag-and-release bow, six hittable labeled targets, success messages.
4. **Wish wheel:** animated eight-segment wheel, three spins, result reveal.
5. **Sweet moments:** finger-controlled cup, falling treats, twelve catches.
6. **Connect the stars:** ordered taps draw a glowing heart constellation.
7. **Birthday cake:** assemble layers, place/light candle, horizontal swipe to blow it out.
8. **Finale:** emotional recap, celebration effects, and full replay.

## Audio and state
- Include a quiet generated ambient birthday track and subtle synthesized interaction sounds, all user-initiated for mobile browser compatibility.
- Keep a persistent music toggle.
- Remember chapter progress for the current browser session and reset it on replay.

## Technical details
- Use React, TypeScript, Tailwind CSS tokens, Motion, and Lucide icons.
- Split the experience into focused reusable chapter and atmosphere components.
- Use pointer events for tap, drag, aim, movement, and swipe interactions.
- Keep gameplay geometry responsive and avoid hover-only behavior.
- Add page-specific metadata and update the shared document styling/fonts.

## Verification
- Exercise the complete flow in a mobile browser viewport.
- Confirm every chapter can complete, locks behave correctly, audio begins only after interaction, swipe detection works, replay resets, and no text or controls are clipped.
