import React from "react";
import { GIFT } from "../config.js";

export default function Cover({ opened, onOpen }) {
  return (
    <>
      <p className="eyebrow">To {GIFT.to}</p>
      <h1 className="title">{GIFT.cover}</h1>
      <button
        className={"gift" + (opened ? " open" : "")}
        onClick={onOpen}
        aria-label="Open Your Gift"
      >
        <span className="glow" />
        <span className="box" />
        <span className="lid" />
        <span className="bow" />
      </button>
      <p className="hint">{opened ? "" : GIFT.hint}</p>
    </>
  );
}
