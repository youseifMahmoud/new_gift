import React from "react";

export default function MusicBar({ playing, onToggle }) {
  return (
    <div className="top">
      <button className="chip" onClick={onToggle}>
        {playing ? "stop music" : "play music"}
      </button>
    </div>
  );
}