import React, { useEffect } from "react";
import { GIFT } from "../config.js";

const STEP = 0.045; // الفاصل بين ظهور كل حرف (بالثواني)

function Letters({ text }) {
  let n = 0;
  return (
    <p className="line">
      {text.split(" ").map((word, wi) => (
        <span className="word" key={wi}>
          {[...word].map((ch, ci) => (
            <span className="ch" key={ci} style={{ animationDelay: `${n++ * STEP}s` }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}

export default function Story({ index, onNext }) {
  useEffect(() => {
    const chars = GIFT.lines[index].length;
    const t = setTimeout(onNext, (chars * STEP + 4) * 1000);
    return () => clearTimeout(t);
  }, [index, onNext]);

  return (
    <>
      <div className="story" onClick={onNext}>
        <Letters key={index} text={GIFT.lines[index]} />
      </div>
      <div className="tap">Tap to continue</div>
      <div className="dots">
        {GIFT.lines.map((_, k) => (
          <span key={k} className={"dot" + (k === index ? " on" : "")} />
        ))}
      </div>
    </>
  );
}