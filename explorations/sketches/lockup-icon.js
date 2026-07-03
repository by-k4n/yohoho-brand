/** @schema 2.11 */
const S = pencil.width;
const pad = Math.round(S * 0.1);
const pitch = (S - 2 * pad) / 8;
const X = (i) => pad + i * pitch;

const cyanD = pitch * 0.55;
const bigD = pitch * 0.7;
const fieldD = pitch * 0.42;

const cols = [
  { h: 1, color: "#ff5454", d: bigD },
  { h: 3, color: "#39BFC6", d: cyanD },
  { h: 5, color: "#7DE8ED", d: cyanD },
  { h: 3, color: "#39BFC6", d: cyanD },
  { h: 7, color: "#7DE8ED", d: cyanD },
  { h: 3, color: "#39BFC6", d: cyanD },
  { h: 1, color: "#cdd6da", d: bigD },
];

const nodes = [];
const figure = new Set();

cols.forEach((c, idx) => {
  const i = idx + 1;
  const half = (c.h - 1) / 2;
  for (let k = 0; k < c.h; k++) {
    const j = 4 - half + k;
    figure.add(i + "," + j);
    nodes.push({
      type: "ellipse",
      name: "lit " + i + "-" + j,
      x: X(i) - c.d / 2,
      y: X(j) - c.d / 2,
      width: c.d,
      height: c.d,
      fill: c.color,
    });
  }
});

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (figure.has(i + "," + j)) continue;
    const dist = Math.sqrt((i - 4) ** 2 + (j - 4) ** 2);
    if (dist <= 4.3) {
      nodes.push({
        type: "ellipse",
        name: "field " + i + "-" + j,
        x: X(i) - fieldD / 2,
        y: X(j) - fieldD / 2,
        width: fieldD,
        height: fieldD,
        fill: "#cdd6da1F",
      });
    }
  }
}

return nodes;
