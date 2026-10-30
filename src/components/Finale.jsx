import React from "react";
import { GIFT } from "../config.js";

export default function Finale({ onReplay }) {
  return (
    <>
      <p className="eyebrow">All love to {GIFT.to}</p>
      <div className="name">{GIFT.to}</div>
      <p className="final">{GIFT.final}</p>
      <p className="from">{GIFT.from}</p>
      <button className="btn" onClick={onReplay}>
        Replay
      </button>
    </>
  );
}
