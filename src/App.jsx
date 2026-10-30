import React, { useCallback, useEffect, useRef, useState } from "react";
import { GIFT } from "./config.js";
import { music } from "./lib/music.js";
import Fx from "./components/Fx.jsx";
import Cover from "./components/Cover.jsx";
import Story from "./components/Story.jsx";
import Finale from "./components/Finale.jsx";
import MusicBar from "./components/MusicBar.jsx";

music.setSongFile(GIFT.songFile);

export default function App() {
  const [stage, setStage] = useState("cover"); // cover | story | end
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const fx = useRef(null);
  const last = GIFT.lines.length - 1;

  function openGift() {
    if (opened) return;
    setOpened(true);
    setPlaying(true);
    music.start();
    fx.current?.burst(46, "heart");
    setTimeout(() => {
      setIndex(0);
      setStage("story");
    }, 1600);
  }

  const next = useCallback(() => {
    if (index < last) {
      setIndex(index + 1);
    } else {
      setStage("end");
      fx.current?.burst(150, "conf");
    }
  }, [index, last]);

  function replay() {
    setIndex(0);
    setStage("story");
  }

  function toggleMusic() {
    if (playing) music.stop();
    else music.start();
    setPlaying(!playing);
  }


  useEffect(() => {
    if (stage !== "end") return;
    const t = setInterval(() => fx.current?.burst(40, "conf"), 2600);
    return () => clearInterval(t);
  }, [stage]);

  return (
    <div className="app">
      <Fx ref={fx} />
      {(stage !== "cover" || opened) && (
        <MusicBar playing={playing} onToggle={toggleMusic} />
      )}
      {stage === "cover" && <Cover opened={opened} onOpen={openGift} />}
      {stage === "story" && <Story index={index} onNext={next} />}
      {stage === "end" && <Finale onReplay={replay} />}
    </div>
  );
}
