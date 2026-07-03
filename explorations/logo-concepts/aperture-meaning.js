/**
 * @schema 2.11
 * @input concept: enum("iris", "porthole", "shutter") = "iris"
 * @input state: enum("open", "closed") = "open"
 * @input glow: boolean = true
 */

const cyan = "#39BFC6";
const peak = "#7DE8ED";
const off = "#cdd6da1F";
const red = "#ff5454";

const W = pencil.width;
const H = pencil.height;
const S = Math.min(W, H);
const cx = W / 2;
const cy = H / 2;

const concept = pencil.input.concept;
const open = pencil.input.state !== "closed";
const glow = pencil.input.glow;
const compact = S < 30;

function rad(d) { return (d * Math.PI) / 180; }
function px(a, r) { return [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]; }
function lerp(a, b, t) { return a + (b - a) * t; }
function dot(name, x, y, d, fill, glowColor, glowBlur, opacity) {
  const n = { type: "ellipse", name, x: x - d / 2, y: y - d / 2, width: d, height: d, fill };
  if (opacity != null) n.opacity = opacity;
  if (glowColor) n.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: glowBlur, spread: 0, color: glowColor };
  return n;
}

const nodes = [];
const gb = S * 0.05;

function core(bright) {
  const coreD = bright ? S * 0.125 : S * 0.07;
  if (bright) nodes.push(dot("Core Halo", cx, cy, coreD * 2.4, red, null, null, 0.14));
  nodes.push(dot("REC Core", cx, cy, coreD, red, glow && bright ? "#ff5454CC" : null, S * 0.07, bright ? 1 : 0.5));
}

if (concept === "iris") {
  // THE LISTENING IRIS — dilates open to listen, contracts shut after.
  const ringR = open ? S * 0.34 : S * 0.165;
  const dotD = open ? S * 0.05 : S * 0.06;
  const count = compact ? 9 : 20;
  for (let i = 0; i < count; i++) {
    const a = i * (360 / count);
    const [x, y] = px(a, ringR);
    const isPeak = i % 5 === 0;
    nodes.push(dot(isPeak ? "Iris Dot Peak" : "Iris Dot", x, y, isPeak ? dotD * 1.1 : dotD, isPeak ? peak : cyan, glow && isPeak ? "#7DE8ED66" : null, gb));
  }
  if (open && !compact) {
    const inner = count;
    for (let i = 0; i < inner; i++) {
      const a = i * (360 / inner) + (360 / inner) / 2;
      const [x, y] = px(a, ringR * 0.6);
      nodes.push(dot("Iris Striation", x, y, dotD * 0.5, cyan, null, null, 0.34));
    }
  }
  core(open);
} else if (concept === "porthole") {
  // THE PORTHOLE — a ship's porthole swinging open onto sound.
  const rimR = S * 0.33;
  const rimCount = compact ? 10 : 22;
  const rimD = S * 0.044;
  for (let i = 0; i < rimCount; i++) {
    const a = i * (360 / rimCount);
    const [x, y] = px(a, rimR);
    nodes.push(dot("Rim Dot", x, y, rimD, cyan, null, null, 0.92));
  }
  if (!compact) {
    const bolts = 8;
    const boltD = S * 0.05;
    for (let i = 0; i < bolts; i++) {
      const a = i * (360 / bolts) + 22.5;
      const [x, y] = px(a, S * 0.4);
      nodes.push(dot("Bolt", x, y, boltD, peak, glow ? "#7DE8ED55" : null, gb));
    }
  }
  if (!open) {
    const fillCount = compact ? 6 : 13;
    nodes.push(dot("Cover", cx, cy, S * 0.34, cyan, null, null, 0.06));
    for (let i = 0; i < fillCount; i++) {
      const a = i * (360 / fillCount);
      const [x, y] = px(a, S * 0.17);
      nodes.push(dot("Cover Dot", x, y, rimD * 0.82, cyan, null, null, 0.4));
    }
  }
  core(open);
} else {
  // THE CAPTURE SHUTTER — a camera diaphragm that stops down to capture the words.
  const vertexR = open ? S * 0.33 : S * 0.155;
  const rot = open ? 0 : 20;
  const blades = 6;
  const perEdge = compact ? 1 : 4;
  const dotD = S * 0.046;
  for (let v = 0; v < blades; v++) {
    const a1 = v * 60 + rot;
    const a2 = (v + 1) * 60 + rot;
    const [x1, y1] = px(a1, vertexR);
    const [x2, y2] = px(a2, vertexR);
    nodes.push(dot("Blade Vertex", x1, y1, dotD * 1.15, peak, glow ? "#7DE8ED55" : null, gb));
    for (let t = 1; t <= perEdge; t++) {
      const f = t / (perEdge + 1);
      nodes.push(dot("Blade Dot", lerp(x1, x2, f), lerp(y1, y2, f), dotD, cyan, null, null, 0.95));
    }
  }
  core(open);
}

return nodes;
