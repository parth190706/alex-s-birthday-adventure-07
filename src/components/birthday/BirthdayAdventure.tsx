import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BirthdayIntro } from "./BirthdayIntro";
import { BalloonGame } from "./BalloonGame";
import { BowArrowGame } from "./BowArrowGame";
import { WishWheel } from "./WishWheel";
import { IceCreamGame } from "./IceCreamGame";
import { ConnectStarsGame } from "./ConnectStarsGame";
import { BirthdayCake } from "./BirthdayCake";
import { FinalMessage } from "./FinalMessage";
import { MusicToggle } from "./ChapterShell";
import { ParticleBackground } from "./ParticleBackground";
import { useBirthdayAudio } from "@/hooks/use-birthday-audio";

const KEY="alex-birthday-chapter";

export function BirthdayAdventure() {
  const [chapter,setChapter]=useState(0); const [ready,setReady]=useState(false); const audio=useBirthdayAudio();
  useEffect(()=>{const saved=Number(sessionStorage.getItem(KEY)); if(Number.isFinite(saved)&&saved>=0&&saved<=7)setChapter(saved); setReady(true)},[]);
  const next=useCallback(()=>setChapter(c=>{const n=Math.min(7,c+1);sessionStorage.setItem(KEY,String(n));return n}),[]);
  const open=()=>{audio.start();audio.play("celebrate");next()};
  const replay=()=>{sessionStorage.removeItem(KEY);setChapter(0)};
  if(!ready)return null;
  return <div className="relative h-[100dvh] overflow-hidden bg-background"><ParticleBackground festive={chapter===0||chapter===7}/>{audio.started&&<MusicToggle enabled={audio.enabled} onToggle={()=>audio.setEnabled(v=>!v)}/>}<div className="fixed left-0 top-0 z-40 h-1 bg-gold/20" style={{width:`${chapter/7*100}%`}}><motion.div className="h-full bg-gold" animate={{width:"100%"}}/></div><AnimatePresence mode="wait">
    {chapter===0&&<BirthdayIntro key="intro" onOpen={open}/>} {chapter===1&&<BalloonGame key="balloons" onComplete={next} playSound={()=>audio.play("pop")}/>} {chapter===2&&<BowArrowGame key="bow" onComplete={next} playSound={()=>audio.play("hit")}/>} {chapter===3&&<WishWheel key="wheel" onComplete={next} playSound={()=>audio.play("spin")}/>} {chapter===4&&<IceCreamGame key="ice" onComplete={next} playSound={()=>audio.play("catch")}/>} {chapter===5&&<ConnectStarsGame key="stars" onComplete={next} playSound={()=>audio.play("star")}/>} {chapter===6&&<BirthdayCake key="cake" onComplete={next} playSound={audio.play}/>} {chapter===7&&<FinalMessage key="final" onReplay={replay}/>} 
  </AnimatePresence></div>;
}