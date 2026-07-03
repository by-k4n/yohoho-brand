# yohoho — brand assets

Every file here is generated from one parametric spec. **Don't hand-edit the
outputs — edit `generate.py` and re-run:**

```sh
uv run --with pillow brand/generate.py
```

## The mark

A fixed **9×9 dot field** (circular, r ≤ 4.3) with a lit subset that reads
left-to-right as the product doing its one job:

| part | dots | meaning |
|---|---|---|
| **RECORD** | one red dot | press record — the *"yo"* |
| **THE LAUGH** | cyan body + two brighter peaks (`ho·ho`) | speak — a center-out voiceprint (Brook's *yohoho*) |
| **DONE** | one neutral dot | the transcript landed |

Column heights `1·3·5·3·7·3·1`. **Exactly one red, ever.** It's the same
language as the live status panel — frozen here, it animates there.

## Palette

| role | dark (on `#0a0b0c`) | light (on `#e8edef`) |
|---|---|---|
| field (unlit) | `#cdd6da` @ 12% | `#CFD7DA` |
| wave (body) | `#39BFC6` | `#39BFC6` *(soft accent)* |
| peak (`ho`) | `#7DE8ED` | `#0A5F67` |
| **record** | `#ff5454` | `#D62F39` |
| done | `#cdd6da` | `#1F2327` |
| wordmark | `#cdd6da` | `#1A1D1F` |

The hero cyan `#39BFC6` is constant in both modes; only the **peak** flips
(bright on dark → deep teal on light) so the figure stays legible (≥3:1) where
the cyan goes soft. Wordmark is **Doto**, weight 700, tracking +2.

## Files

```
generate.py              the spec (source of truth)
mark-{dark,light}.svg          icon-only, no tile, transparent
tile-{dark,light}.svg          rounded-square app tile + mark
figure-only-{dark,light}.svg   lit dots only (lightest lockup)
lockup-{dark,light}.svg        free mark + Doto wordmark
icon/
  icon-{1024…16}-{dark,light}.png   app-icon ramp (full field → 4-dot bar)
  mark-{512,128}-{dark,light}.png   transparent marks (lockups / README)
  lockup-{dark,light}.png           rasterized Doto lockup (822×240)
  favicon.ico                       16·32·48
  icon.ico                          16·24·32·48·64·128·256  (Windows)
  icon.icns                         macOS app icon
  menubar-template{,@2x}.png        mono, for system tinting
contact-sheet.png        proof sheet
```

## Lockup rule

With the wordmark the mark **stands free** — dots straight on the surface, no
tile (mark height ≈ wordmark cap-height; clear space ≈ ½ the mark width). The
rounded-square tile is **only** for standalone icon use (app icon, favicon,
menu-bar). Match the palette to the surface — never the dark mark on a light
ground or vice-versa.
