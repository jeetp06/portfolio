import { useCallback, useEffect, useRef } from "react";

const STOPS = [
  [0.0, [14, 26, 54]],
  [0.32, [36, 96, 224]],
  [0.58, [92, 122, 168]],
  [0.8, [208, 108, 48]],
  [1.0, [244, 178, 86]],
];

function plasma(t) {
  const clamped = Math.max(0, Math.min(1, t));

  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i];
    const [b, cb] = STOPS[i + 1];

    if (clamped >= a && clamped <= b) {
      const f = (clamped - a) / (b - a || 1);
      return [
        Math.round(ca[0] + (cb[0] - ca[0]) * f),
        Math.round(ca[1] + (cb[1] - ca[1]) * f),
        Math.round(ca[2] + (cb[2] - ca[2]) * f),
      ];
    }
  }

  return STOPS[STOPS.length - 1][1];
}

export default function FloodCanvas({ mode, theme, onSeedChange }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(0);
  const modeRef = useRef(mode);
  const themeRef = useRef(theme);
  modeRef.current = mode;
  themeRef.current = theme;

  const CELL = 15;

  const seedAt = useCallback((cx, cy) => {
    const st = stateRef.current;
    if (!st) return;

    const { cols, rows } = st;
    st.visited.fill(0);
    st.order.fill(-1);
    st.alpha.fill(0);
    st.count = 0;
    st.maxOrder = cols * rows;
    st.frontier = [];

    const sx = Math.max(0, Math.min(cols - 1, cx));
    const sy = Math.max(0, Math.min(rows - 1, cy));
    const idx = sy * cols + sx;

    onSeedChange?.({
      x: sx / Math.max(1, cols - 1),
      y: sy / Math.max(1, rows - 1),
    });

    st.visited[idx] = 1;
    st.order[idx] = 0;
    st.count = 1;
    st.frontier.push(idx);
    st.head = 0;
  }, [onSeedChange]);

  const setup = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    stateRef.current = {
      ctx,
      w,
      h,
      cols,
      rows,
      visited: new Uint8Array(cols * rows),
      order: new Int32Array(cols * rows).fill(-1),
      alpha: new Float32Array(cols * rows),
      frontier: [],
      head: 0,
      count: 0,
      maxOrder: cols * rows,
    };

    seedAt(Math.floor(cols * 0.16), Math.floor(rows * 0.42));
  }, [seedAt]);

  useEffect(() => {
    setup();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const neighbors = (idx, cols, rows) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      const out = [];
      if (x + 1 < cols) out.push(idx + 1);
      if (y + 1 < rows) out.push(idx + cols);
      if (x - 1 >= 0) out.push(idx - 1);
      if (y - 1 >= 0) out.push(idx - cols);
      return out;
    };

    const step = (perFrame) => {
      const st = stateRef.current;
      if (!st) return;

      const { cols, rows } = st;
      let processed = 0;

      while (processed < perFrame) {
        let cur;

        if (modeRef.current === "DFS") {
          if (st.frontier.length === 0) break;
          cur = st.frontier.pop();
        } else {
          if (st.head >= st.frontier.length) break;
          cur = st.frontier[st.head++];
        }

        const nbs = neighbors(cur, cols, rows);
        if (modeRef.current === "DFS") {
          for (let i = nbs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nbs[i], nbs[j]] = [nbs[j], nbs[i]];
          }
        }

        for (const n of nbs) {
          if (!st.visited[n]) {
            st.visited[n] = 1;
            st.order[n] = st.count++;
            st.frontier.push(n);
          }
        }

        processed++;
      }
    };

    const draw = () => {
      const st = stateRef.current;
      if (!st) return;

      const { ctx, w, h, cols, rows, order, alpha } = st;
      const dark = themeRef.current === "dark";
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.05)" : "rgba(20,22,28,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = 0; x <= cols; x++) {
        const px = x * CELL + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }

      for (let y = 0; y <= rows; y++) {
        const py = y * CELL + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }

      ctx.stroke();
      const base = dark ? 0.74 : 0.88;

      for (let i = 0; i < order.length; i++) {
        if (order[i] < 0) continue;
        if (alpha[i] < 0.999) alpha[i] = Math.min(1, alpha[i] + 0.12);

        const t = order[i] / st.maxOrder;
        const [r, g, b] = plasma(Math.pow(t, 0.75));
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        const falloff = (dark ? 0.45 : 0.62) + (dark ? 0.55 : 0.38) * (x / w);
        ctx.fillStyle = `rgba(${r},${g},${b},${base * alpha[i] * falloff})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }
    };

    if (reduce) {
      const st = stateRef.current;
      const guard = st.cols * st.rows + 5;
      let g = 0;

      while ((st.head < st.frontier.length || st.frontier.length > 0) && g < guard) {
        step(st.cols * st.rows);
        g++;
        if (st.count >= st.cols * st.rows) break;
      }

      st.alpha.fill(1);
      draw();
      const id = setInterval(draw, 400);
      return () => clearInterval(id);
    }

    const loop = () => {
      step(36);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      setup();
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [setup]);

  const handleClick = (e) => {
    const st = stateRef.current;
    const canvas = canvasRef.current;
    if (!st || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor((e.clientX - rect.left) / CELL);
    const cy = Math.floor((e.clientY - rect.top) / CELL);
    seedAt(cx, cy);
  };

  return (
    <div className="floodWrap" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="floodCanvas"
        onClick={handleClick}
        aria-hidden="true"
      />
      <div className="floodVeil" />
    </div>
  );
}
