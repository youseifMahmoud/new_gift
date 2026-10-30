import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const COLORS = ["#ff8fa6", "#ffd89c", "#c9a7ff", "#ffffff", "#8fd3ff"];
const reduce =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function drawHeart(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.35);
  c.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.5, -s * 0.9, 0, -s * 0.4);
  c.bezierCurveTo(s * 0.5, -s * 0.9, s * 0.9, -s * 0.2, 0, s * 0.35);
  c.fill();
}

const Fx = forwardRef(function Fx(_, ref) {
  const canvasRef = useRef(null);
  const burstRef = useRef(() => {});

  useImperativeHandle(ref, () => ({
    burst: (n, kind) => burstRef.current(n, kind),
  }));

  useEffect(() => {
    const cv = canvasRef.current;
    const c = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf;
    let last = 0;
    let acc = 0;
    let parts = [];
    let stars = [];

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        p: Math.random() * 6.28,
      }));
    }

    function spawn(kind, x, y) {
      const conf = kind === "conf";
      parts.push({
        kind,
        x,
        y,
        vx: conf ? (Math.random() - 0.5) * 9 : (Math.random() - 0.5) * 0.6,
        vy: conf ? -Math.random() * 11 - 3 : -(Math.random() * 0.9 + 0.5),
        s: conf ? Math.random() * 6 + 4 : Math.random() * 12 + 8,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.2,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: 1,
        ph: Math.random() * 6.28,
      });
    }

    burstRef.current = (n, kind) => {
      for (let i = 0; i < n; i++) {
        const conf = kind === "conf";
        spawn(kind, conf ? Math.random() * W : W / 2 + (Math.random() - 0.5) * 60, conf ? H * 0.9 : H * 0.55);
        if (!conf) {
          const p = parts[parts.length - 1];
          p.vx = (Math.random() - 0.5) * 7;
          p.vy = -Math.random() * 6 - 2;
        }
      }
    };

    function frame(t) {
      const dt = Math.min((t - last) / 16.7 || 1, 3);
      last = t;
      c.clearRect(0, 0, W, H);

      c.fillStyle = "#fff";
      for (const s of stars) {
        c.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t / 1400 + s.p));
        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, 6.28);
        c.fill();
      }

      acc += dt * (reduce ? 0.2 : 1);
      if (acc > 38) {
        acc = 0;
        spawn("heart", Math.random() * W, H + 20);
      }

      for (let j = parts.length - 1; j >= 0; j--) {
        const q = parts[j];
        if (q.kind === "conf") {
          q.vy += 0.22 * dt;
          q.vx *= 0.99;
          q.a -= 0.003 * dt;
        } else {
          q.x += Math.sin(t / 700 + q.ph) * 0.5;
          q.a -= 0.0006 * dt;
          if (q.vy < -1.4) q.vy *= 0.97;
        }
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.rot += q.vr * dt;
        if (q.a <= 0 || q.y > H + 30 || q.y < -40) {
          parts.splice(j, 1);
          continue;
        }
        c.save();
        c.translate(q.x, q.y);
        c.rotate(q.kind === "conf" ? q.rot : Math.sin(q.ph + t / 900) * 0.3);
        c.globalAlpha = Math.max(0, Math.min(1, q.a)) * (q.kind === "heart" ? 0.75 : 1);
        c.fillStyle = q.col;
        if (q.kind === "conf") c.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2);
        else drawHeart(c, q.s);
        c.restore();
      }
      c.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="fx" ref={canvasRef} aria-hidden="true" />;
});

export default Fx;
