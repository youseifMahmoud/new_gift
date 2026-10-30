// موسيقى الهدية: لحن هادئ مولَّد بـ WebAudio، أو ملف أغنية حقيقي
const CHORDS = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
const PATTERN = [0, 1, 2, 1, 2, 1, 2, 1];
const EIGHTH = 0.44;

const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function createMusic() {
  let ctx, master, delay, timer;
  let step = 0;
  let nextT = 0;
  let synthOn = false;
  let el = null;

  function note(m, t, dur, vol, type) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq(m);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g);
    g.connect(master);
    g.connect(delay);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function schedule() {
    while (nextT < ctx.currentTime + 0.5) {
      const bar = Math.floor(step / 8) % CHORDS.length;
      const k = step % 8;
      const c = CHORDS[bar];
      if (k === 0) {
        note(c[0] - 12, nextT, EIGHTH * 7, 0.16, "sine");
        note(c[1] + 12, nextT, EIGHTH * 8, 0.04, "triangle");
      }
      note(c[PATTERN[k]] + 12, nextT, EIGHTH * 2.6, 0.09, "triangle");
      step++;
      nextT += EIGHTH;
    }
  }

  function startSynth() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      delay = ctx.createDelay(1);
      delay.delayTime.value = 0.33;
      const fb = ctx.createGain();
      fb.gain.value = 0.38;
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(master);
    }
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2);
    if (!synthOn) {
      synthOn = true;
      nextT = ctx.currentTime + 0.1;
      timer = setInterval(schedule, 120);
    }
  }

  function stopSynth() {
    if (!synthOn) return;
    synthOn = false;
    clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }

  function useAudio(url) {
    stopSynth();
    if (el) el.pause();
    el = new Audio(url);
    el.loop = true;
    el.volume = 0.9;
    return el;
  }

  return {
    setSongFile(name) {
      if (!name) return;
      const path = name.startsWith("/") ? name.slice(1) : name;
      useAudio(import.meta.env.BASE_URL + path);
    },
    start() {
      try {
        const p = el ? el.play() : startSynth();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {
        /* بعض المتصفحات تمنع الصوت قبل الضغط */
      }
    },
    stop() {
      try {
        if (el) el.pause();
        stopSynth();
      } catch (e) {
        /* تجاهل */
      }
    },
  };
}

export const music = createMusic();
