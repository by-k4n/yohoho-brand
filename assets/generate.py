#!/usr/bin/env python3
"""
yohoho — brand asset generator.

Single source of truth for the logo, derived from the finalized construction spec
(see brand/BRAND.md / the Pencil "Logo Usage Guidelines"). Everything here is
parametric — re-run to regenerate every asset.

    uv run --with pillow brand/generate.py

Emits, under brand/:
  *.svg            scalable mark / tile / figure-only / lockup (dark + light)
  icon/*.png       app-icon ramp 1024->16 (dark + light), field-dropping <48px
  icon/favicon.ico  icon/icon.ico  icon/icon.icns  icon/menubar-template*.png
  contact-sheet.png a single proof sheet

The mark IS the product: RECORD (one red, "yo") -> the LAUGH (cyan ho·ho peaks) ->
DONE (neutral). Read left-to-right it diagrams the dictation flow and the name.
"""
from __future__ import annotations
import math, os, shutil, subprocess, sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ModuleNotFoundError:
    sys.exit("Pillow missing — run:  uv run --with pillow brand/generate.py")

LANCZOS = getattr(Image, "Resampling", Image).LANCZOS
HERE = Path(__file__).resolve().parent
ICON = HERE / "icon"

# ---------------------------------------------------------------- spec
GRID = 9
CENTER = 4.0
FIELD_R = 4.3                      # circular field radius, grid units

# figure columns (col, role, height) — centered on row 4. odd heights center cleanly.
# record · wave · PEAK · wave · PEAK · wave · done   ->   1 · 3 · 5 · 3 · 7 · 3 · 1
FIGURE = [
    (1, "record", 1),
    (2, "wave",   3),
    (3, "peak",   5),
    (4, "wave",   3),
    (5, "peak",   7),
    (6, "wave",   3),
    (7, "done",   1),
]
DIA = {"field": 0.42, "wave": 0.55, "peak": 0.55, "record": 0.70, "done": 0.70}  # × pitch

DARK = {
    "page":   "#0a0b0c",
    "tile":   "#181b1f",
    "border": (205, 214, 218, 0x14),
    "field":  ("#cdd6da", 0x1F),       # powered-but-unlit, ~12%
    "record": "#ff5454", "wave": "#39BFC6", "peak": "#7DE8ED", "done": "#cdd6da",
}
LIGHT = {
    "page":   "#e8edef",
    "tile":   "#e8edef",
    "border": (0, 0, 0, 0x18),
    "field":  ("#CFD7DA", 0xFF),       # gentle texture
    "record": "#D62F39", "wave": "#39BFC6", "peak": "#0A5F67", "done": "#1F2327",
}
TILE_RADIUS = 0.21875                  # 7/32 — matches the guideline tiles
MINI_ROLES = ["record", "peak", "peak", "done"]   # the 16px collapsed bar


def hx(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def figure_cells():
    cells = {}
    for col, role, h in FIGURE:
        half = (h - 1) // 2
        for row in range(int(CENTER) - half, int(CENTER) + half + 1):
            cells[(col, row)] = role
    return cells


def in_field(col, row):
    return math.hypot(col - CENTER, row - CENTER) <= FIELD_R + 1e-9


FIG = figure_cells()
# --- self-checks: the spec must not drift ---
assert sum(1 for r in FIG.values() if r == "record") == 1, "exactly one red"
assert len(FIG) == 23, f"23 lit figure dots, got {len(FIG)}"
assert sorted(c for c, r in FIG.items() if r == "peak") and \
    {col for (col, _), r in FIG.items() if r == "peak"} == {3, 5}, "two ho peaks at cols 3,5"


def field_tier(size: int) -> str:
    if size >= 48:
        return "full"
    if size >= 24:
        return "sparse"
    return "none"


# ---------------------------------------------------------------- raster (Pillow)
def _draw_dot(d, cx, cy, rad, fill):
    d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=fill)


def render(size: int, mode: dict, tile: bool = True) -> Image.Image:
    """Full 9×9 mark (tile optional). <=20px collapses to the 4-dot bar."""
    if size <= 20:
        return render_mini(size, mode, tile)
    ss = max(1, min(8, 2048 // size))
    S = size * ss
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if tile:
        r = round(TILE_RADIUS * S)
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, fill=hx(mode["tile"]) + (255,))
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, outline=mode["border"], width=max(1, ss))
    pad = round(size * 0.1) * ss
    pitch = (S - 2 * pad) / 8.0
    tier = field_tier(size)

    def cell(col, row, role):
        cx, cy = pad + col * pitch, pad + row * pitch
        rad = DIA[role] * pitch / 2
        if role == "field":
            name, a = mode["field"]
            _draw_dot(d, cx, cy, rad, hx(name) + (a,))
        else:
            _draw_dot(d, cx, cy, rad, hx(mode[role]) + (255,))

    if tier != "none":
        for col in range(GRID):
            for row in range(GRID):
                if (col, row) in FIG or not in_field(col, row):
                    continue
                if tier == "sparse" and not (col % 2 == 0 and row % 2 == 0):
                    continue
                cell(col, row, "field")
    for (col, row), role in FIG.items():
        cell(col, row, role)
    return img.resize((size, size), LANCZOS)


def render_mini(size: int, mode: dict, tile: bool = True) -> Image.Image:
    """The collapsed 4-dot bar used at favicon/menu-bar scale (record·ho·ho·done)."""
    ss = 8
    S = size * ss
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if tile:
        r = round(0.25 * S)
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, fill=hx(mode["tile"]) + (255,))
    rad = 0.0703 * S
    for i, role in enumerate(MINI_ROLES):
        cx = (3.5 + 3 * i) / 16 * S
        cy = 0.5 * S
        _draw_dot(d, cx, cy, rad, hx(mode[role]) + (255,))
    return img.resize((size, size), LANCZOS)


def render_template(size: int) -> Image.Image:
    mono = {**{k: "#000000" for k in ("record", "peak", "wave", "done", "tile")}}
    return render_mini(size, mono, tile=False)


# ---------------------------------------------------------------- vector (SVG)
def svg_mark(mode: dict, S=300, tile=False) -> str:
    pad = round(S * 0.1)
    pitch = (S - 2 * pad) / 8.0
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" '
           f'width="{S}" height="{S}">']
    if tile:
        r = round(TILE_RADIUS * S)
        out.append(f'<rect x="0" y="0" width="{S}" height="{S}" rx="{r}" ry="{r}" '
                   f'fill="{mode["tile"]}"/>')
    fname, fa = mode["field"]
    op = round(fa / 255, 3)
    for col in range(GRID):
        for row in range(GRID):
            if (col, row) in FIG or not in_field(col, row):
                continue
            cx, cy = pad + col * pitch, pad + row * pitch
            out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{DIA["field"]*pitch/2:.2f}" '
                       f'fill="{fname}" fill-opacity="{op}"/>')
    for (col, row), role in FIG.items():
        cx, cy = pad + col * pitch, pad + row * pitch
        out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{DIA[role]*pitch/2:.2f}" '
                   f'fill="{mode[role]}"/>')
    out.append("</svg>")
    return "\n".join(out)


def svg_figure_only(mode: dict, S=300) -> str:
    pad = round(S * 0.1)
    pitch = (S - 2 * pad) / 8.0
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" '
           f'width="{S}" height="{S}">']
    for (col, row), role in FIG.items():
        cx, cy = pad + col * pitch, pad + row * pitch
        out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{DIA[role]*pitch/2:.2f}" '
                   f'fill="{mode[role]}"/>')
    out.append("</svg>")
    return "\n".join(out)


def svg_lockup(mode: dict, M=120) -> str:
    """Free mark (no tile) + Doto wordmark. Mark stands beside the word."""
    pad = round(M * 0.1)
    pitch = (M - 2 * pad) / 8.0
    gap = round(M * 0.5)
    font_px = round(M * 0.52)
    text = "yohoho"
    word_w = round(font_px * 0.62 * len(text))     # Doto advance ≈ .62em
    W = M + gap + word_w
    H = M
    word = mode["wave"] if mode is LIGHT else "#cdd6da"
    word = "#1A1D1F" if mode is LIGHT else "#cdd6da"
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
           '<style>@import url(https://fonts.googleapis.com/css2?family=Doto:wght@700);'
           '.wm{font-family:"Doto",monospace;font-weight:700;letter-spacing:2px}</style>',
           f'<g>']
    fname, fa = mode["field"]
    op = round(fa / 255, 3)
    for col in range(GRID):
        for row in range(GRID):
            if (col, row) in FIG or not in_field(col, row):
                continue
            cx, cy = pad + col * pitch, pad + row * pitch
            out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{DIA["field"]*pitch/2:.2f}" '
                       f'fill="{fname}" fill-opacity="{op}"/>')
    for (col, row), role in FIG.items():
        cx, cy = pad + col * pitch, pad + row * pitch
        out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{DIA[role]*pitch/2:.2f}" '
                   f'fill="{mode[role]}"/>')
    out.append("</g>")
    out.append(f'<text class="wm" x="{M+gap}" y="{H*0.5}" dominant-baseline="central" '
               f'font-size="{font_px}" fill="{word}">{text}</text>')
    out.append("</svg>")
    return "\n".join(out)


# ---------------------------------------------------------------- pipeline
RAMP = [1024, 512, 256, 192, 180, 128, 64, 48, 32, 16]
ICNS_MAP = [("16x16", 16), ("16x16@2x", 32), ("32x32", 32), ("32x32@2x", 64),
            ("128x128", 128), ("128x128@2x", 256), ("256x256", 256),
            ("256x256@2x", 512), ("512x512", 512), ("512x512@2x", 1024)]
ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]


def main():
    ICON.mkdir(parents=True, exist_ok=True)

    # SVGs (source of truth)
    (HERE / "mark-dark.svg").write_text(svg_mark(DARK))
    (HERE / "mark-light.svg").write_text(svg_mark(LIGHT))
    (HERE / "tile-dark.svg").write_text(svg_mark(DARK, tile=True))
    (HERE / "tile-light.svg").write_text(svg_mark(LIGHT, tile=True))
    (HERE / "figure-only-dark.svg").write_text(svg_figure_only(DARK))
    (HERE / "figure-only-light.svg").write_text(svg_figure_only(LIGHT))
    (HERE / "lockup-dark.svg").write_text(svg_lockup(DARK))
    (HERE / "lockup-light.svg").write_text(svg_lockup(LIGHT))

    # PNG ramps (tile)
    for size in RAMP:
        render(size, DARK).save(ICON / f"icon-{size}-dark.png")
        render(size, LIGHT).save(ICON / f"icon-{size}-light.png")
    # transparent marks for lockups / README
    for size in (512, 128):
        render(size, DARK, tile=False).save(ICON / f"mark-{size}-dark.png")
        render(size, LIGHT, tile=False).save(ICON / f"mark-{size}-light.png")

    # menu-bar template (mono, transparent)
    render_template(16).save(ICON / "menubar-template.png")
    render_template(32).save(ICON / "menubar-template@2x.png")

    # favicon.ico  +  windows icon.ico  (dark tiles)
    base = render(256, DARK)
    base.save(ICON / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    base.save(ICON / "icon.ico", sizes=[(s, s) for s in ICO_SIZES])

    # macOS .icns via iconutil
    iconset = ICON / "icon.iconset"
    if iconset.exists():
        shutil.rmtree(iconset)
    iconset.mkdir()
    for name, px in ICNS_MAP:
        render(px, DARK).save(iconset / f"icon_{name}.png")
    if shutil.which("iconutil"):
        subprocess.run(["iconutil", "-c", "icns", str(iconset), "-o", str(ICON / "icon.icns")],
                       check=True)
        shutil.rmtree(iconset)
        icns = "icon.icns"
    else:
        icns = "(.iconset only — no iconutil)"

    # contact sheet
    contact_sheet()

    n = len(list(ICON.glob("*"))) + len(list(HERE.glob("*.svg")))
    print(f"OK — wrote {n} files under brand/  (.icns: {icns})")
    print("    svg ×8 · png ramp ×20 · marks ×4 · template ×2 · favicon.ico · icon.ico · icon.icns")


def contact_sheet():
    pad, gap = 60, 40
    rows = []

    def strip(mode, sizes, label_bg):
        tiles = [render(s, mode) for s in sizes]
        w = sum(t.width for t in tiles) + gap * (len(tiles) - 1)
        h = max(t.height for t in tiles)
        strip_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        x = 0
        for t in tiles:
            strip_img.paste(t, (x, h - t.height), t)
            x += t.width + gap
        return strip_img

    sizes = [256, 128, 64, 48, 32, 16]
    dark_strip = strip(DARK, sizes, None)
    light_strip = strip(LIGHT, sizes, None)
    lock_dark = render(140, DARK, tile=False)
    lock_light = render(140, LIGHT, tile=False)

    W = pad * 2 + max(dark_strip.width, light_strip.width)
    H = pad * 2 + dark_strip.height + gap + light_strip.height
    sheet = Image.new("RGBA", (W, H), hx(DARK["page"]) + (255,))
    sheet.paste(dark_strip, (pad, pad), dark_strip)
    # light strip on a light band
    band = Image.new("RGBA", (W, light_strip.height + gap), hx(LIGHT["page"]) + (255,))
    band.paste(light_strip, (pad, gap // 2), light_strip)
    sheet.paste(band, (0, pad + dark_strip.height + gap))
    sheet.save(HERE / "contact-sheet.png")


if __name__ == "__main__":
    main()
