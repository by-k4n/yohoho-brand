/**
 * @schema 2.11
 * @input state: enum("rest", "record") = "rest"
 * @input grid: boolean = true
 */
const COLS = 7, ROWS = 9;
const W = pencil.width, H = pencil.height;
const cell = Math.min(W / COLS, H / ROWS);
const dot = cell * 0.6;
const gridW = cell * COLS, gridH = cell * ROWS;
const ox = (W - gridW) / 2;
const oy = (H - gridH) / 2;

const key = (c, r) => c + "," + r;

const yDots = [
  [0, 0], [1, 1], [2, 2], [3, 3],
  [6, 0], [5, 1], [4, 2],
  [3, 4], [3, 5], [3, 6], [3, 7]
];
const rec = [3, 8];
const peaks = new Set([key(0, 0), key(6, 0), key(3, 3)]);

const wave = [
  [1, 8], [1, 7],
  [2, 8], [2, 7], [2, 6],
  [4, 8], [4, 7], [4, 6], [4, 5],
  [5, 8], [5, 7]
];
const wavePeaks = new Set([key(2, 6), key(4, 5)]);

const nodes = [];

function dotNode(c, r, opts) {
  const cx = ox + c * cell + cell / 2;
  const cy = oy + r * cell + cell / 2;
  const d = opts.size || dot;
  const node = {
    type: "ellipse",
    name: opts.name || ("dot " + c + "," + r),
    x: cx - d / 2,
    y: cy - d / 2,
    width: d,
    height: d,
    fill: opts.fill
  };
  if (opts.effect) node.effect = opts.effect;
  return node;
}

const glow = (color) => ({ type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: dot * 0.95, spread: dot * 0.1, color });

const recording = pencil.input.state === "record";

if (pencil.input.grid) {
  const lit = new Set([...yDots.map(([c, r]) => key(c, r)), key(rec[0], rec[1])]);
  const liveWave = recording ? new Set(wave.map(([c, r]) => key(c, r))) : new Set();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (lit.has(key(c, r)) || liveWave.has(key(c, r))) continue;
      nodes.push(dotNode(c, r, { name: "off", fill: "$dot-off" }));
    }
  }
}

if (recording) {
  for (const [c, r] of wave) {
    const peak = wavePeaks.has(key(c, r));
    nodes.push(dotNode(c, r, { name: "wave", fill: peak ? "$cyan-peak" : "$cyan-dim", effect: peak ? glow("#7DE8EDAA") : undefined }));
  }
}

for (const [c, r] of yDots) {
  const peak = peaks.has(key(c, r));
  nodes.push(dotNode(c, r, { name: "y", fill: peak ? "$cyan-peak" : "$cyan", effect: peak ? glow("#39BFC6AA") : undefined }));
}

nodes.push(dotNode(rec[0], rec[1], { name: "rec", fill: "$rec-red", effect: glow("#ff5454BB") }));

return nodes;
