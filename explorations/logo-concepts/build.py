#!/usr/bin/env python3
"""Assemble the logo-concepts gallery from the workflow output JSON."""
import json, re, sys, html
from pathlib import Path

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "designs.output")
HERE = Path(__file__).parent

raw = json.loads(OUT.read_text())
res = raw.get("result", raw)
designs = res["designs"]
curation = res.get("curation", "")

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

CSS = """
:root{--bg:#0a0b0c;--cyan:#39BFC6;--red:#ff5454;--ink:#cdd6da;--dim:#6b757a;--line:#1b1e20;}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px 40px 96px}
.wrap{max-width:1200px;margin:0 auto}
header{margin-bottom:8px}
.brand{font-family:'Doto',monospace;font-weight:900;font-size:46px;letter-spacing:2px;color:var(--cyan)}
.sub{color:var(--dim);font-size:15px;margin-top:6px;max-width:640px;line-height:1.5}
.rec{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:9px;vertical-align:middle;box-shadow:0 0 10px var(--red)}
.curate{margin:30px 0 44px;padding:20px 24px;border:1px solid var(--line);border-radius:14px;background:#0d0f10;font-size:14px;line-height:1.65;white-space:pre-wrap;color:#aeb7bb}
.curate b{color:var(--cyan)}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.card{border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,#0e1011,#0a0b0c);overflow:hidden}
.head{display:flex;align-items:center;gap:22px;padding:26px 26px 18px}
.tile{width:128px;height:128px;flex:none;border-radius:28px;background:radial-gradient(120% 120% at 30% 20%,#15191b,#070808);border:1px solid #20262a;box-shadow:inset 0 1px 0 #ffffff0a,0 8px 24px #0008;display:flex;align-items:center;justify-content:center;position:relative}
.tile .mark{width:96px;height:96px}
.mark svg{width:100%;height:100%;display:block;overflow:visible}
.meta{flex:1;min-width:0}
.num{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--cyan);letter-spacing:1px}
.name{font-size:21px;font-weight:600;color:#eef3f4;margin:3px 0 7px;letter-spacing:.2px}
.thread{font-size:12.5px;color:var(--dim);line-height:1.5}
.body{padding:4px 26px 24px}
.concept{font-size:14.5px;line-height:1.6;color:#c2cbcf;margin-bottom:16px}
.row{display:flex;align-items:center;gap:20px;padding:14px 0;border-top:1px solid var(--line)}
.sizes{display:flex;align-items:flex-end;gap:18px}
.sz{display:flex;flex-direction:column;align-items:center;gap:6px}
.sz .mark{display:block}
.sz span{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--dim)}
.s96{width:64px;height:64px}.s48{width:40px;height:40px}.s32{width:28px;height:28px}.s16{width:16px;height:16px}
.lockup{display:flex;align-items:center;gap:14px;padding:16px 0 2px;border-top:1px solid var(--line)}
.lockup .mark{width:38px;height:38px;flex:none}
.word{font-family:'Doto',monospace;font-weight:900;font-size:34px;letter-spacing:1px;color:var(--ink)}
.menubar{margin-left:auto;display:flex;align-items:center;gap:8px;background:#16191b;border:1px solid #23292d;border-radius:8px;padding:5px 10px}
.menubar .mark{width:16px;height:16px}
.menubar span{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dim)}
.note{font-size:12.5px;line-height:1.55;color:#8b9498}
.note b{color:#b9c2c6;font-weight:600}
.risk{color:var(--cyan)}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
"""

cards = []
for i, d in enumerate(designs, 1):
    mark = d["mark_svg"]
    name = html.escape(d["direction_name"])
    thread = html.escape(d.get("thread", ""))
    concept = html.escape(d.get("concept", ""))
    risk = html.escape(d.get("risk", ""))
    scales = html.escape(d.get("scales_note", ""))
    seed = html.escape(d.get("_seed", ""))
    card = f"""
    <div class="card" id="{slug(d['direction_name'])}">
      <div class="head">
        <div class="tile"><div class="mark">{mark}</div></div>
        <div class="meta">
          <div class="num">DIRECTION {i:02d} · {seed}</div>
          <div class="name">{name}</div>
          <div class="thread">{thread}</div>
        </div>
      </div>
      <div class="body">
        <div class="concept">{concept}</div>
        <div class="row sizes">
          <div class="sz"><div class="mark s96">{mark}</div><span>64</span></div>
          <div class="sz"><div class="mark s48">{mark}</div><span>40</span></div>
          <div class="sz"><div class="mark s32">{mark}</div><span>28</span></div>
          <div class="sz"><div class="mark s16">{mark}</div><span>16</span></div>
          <div class="menubar"><div class="mark">{mark}</div><span>menu bar</span></div>
        </div>
        <div class="lockup"><div class="mark">{mark}</div><div class="word">yohoho</div></div>
        <div class="row"><div class="note"><b>The risk &middot;</b> <span class="risk">{risk}</span><br><b>Scales &middot;</b> {scales}</div></div>
      </div>
    </div>"""
    cards.append(card)

doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>yohoho — logo directions</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}</style></head>
<body><div class="wrap">
<header>
  <div class="brand">yohoho</div>
  <div class="sub"><span class="rec"></span>Logo directions — concepts to react to, not finals. Each mark shown as a 96px app icon, scaled down to a 16px menu-bar glyph, and locked up with the Doto wordmark. Cyan <code>#39BFC6</code> on black; red <code>#ff5454</code> reserved for the REC accent.</div>
</header>
<div class="curate"><b>Design-lead read &middot;</b> {html.escape(curation)}</div>
<div class="grid">
{''.join(cards)}
</div>
</div></body></html>"""

(HERE / "index.html").write_text(doc)
print(f"WROTE {HERE/'index.html'}  ({len(designs)} directions)\n")
print("=== DIRECTIONS ===")
for i, d in enumerate(designs, 1):
    print(f"{i:02d}. {d['direction_name']}  [{d.get('_seed','')}]")
print("\n=== CURATION ===\n" + curation)
