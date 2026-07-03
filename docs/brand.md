# yohoho brand

The design system and brand source of truth for yohoho, a free, fully local
voice-to-text tool for developers.

## Identity

yohoho is dictation that runs entirely on your machine. Hotkey, speak, and the
transcript lands in the focused app. No subscription, no cloud.

The brand personality is **refined utilitarianism** - designer turned developer.
Everything should feel crafted, minimal, and functional in more than one way.

The name carries an anime-pirate wink: it is Brook's *yohoho* laugh from *One
Piece* crossed with the "yo ho ho" sea shanty. That wink stays in the name and
the mark; it never turns into costume. The product itself is quiet and precise.

## Voice

Plain, exact, a little dry. Short sentences. Say what the tool does and get out
of the way. The wink lives in the name, not in the copy. No hype, no exclamation
marks in the interface, no em dashes.

## Color

The palette is deliberately narrow.

| Role | Dark | Light |
|---|---|---|
| Brand cyan (wave body) | `#39BFC6` | `#39BFC6` |
| REC / record dot | `#ff5454` | `#D62F39` |
| Voiceprint peak (ho-ho) | `#7DE8ED` | `#0A5F67` |
| Done dot (neutral) | `#cdd6da` | `#1F2327` |
| Field (unlit dots) | `#cdd6da` @ 12% | `#CFD7DA` |
| Wordmark | `#cdd6da` | `#1A1D1F` |
| Page / tile | `#0a0b0c` / `#181b1f` | `#e8edef` |
| Status panel | `#000000` (pitch black) | - |

Two rules hold the palette together:

1. **Cyan `#39BFC6` is the brand and it is constant** in both modes. It is the
   wave body of the voiceprint and the only accent color in functional UI, where
   it appears solely in the ring.
2. **Red is reserved for the REC dot only.** There is exactly one red dot, ever.
   It is the *"yo"* - press record. Red never appears anywhere else.

The hero cyan stays fixed across modes; only the **peak** flips (bright on dark,
deep teal on light) so the figure keeps a legibility margin of at least 3:1 where
the cyan goes soft. Match the palette to the surface: never the dark mark on a
light ground or the reverse.

## Type

The wordmark is set in **Doto**, a dot-matrix typeface, at weight **450** with
roundness **ROND 100** and tracking +2. This weight-and-roundness pairing is for
the **wordmark only**.

Doto is never used for functional UI text. Interface copy uses native-macOS
system type. The dot-matrix feeling comes from the mark and the panel, not from
running text.

## The dot-matrix language

Everything is built from one idea: a lit dot on a field of unlit dots.

**The mark** is a fixed 9x9 dot field (circular, radius 4.3 grid units). A lit
subset reads left to right as the product doing its one job:

- **RECORD** - one red dot - press record, the *"yo"*.
- **THE LAUGH** - a cyan body with two brighter peaks (`ho-ho`) - speak; a
  center-out voiceprint, Brook's *yohoho*.
- **DONE** - one neutral dot - the transcript landed.

The lit figure is a voiceprint glyph with column heights **1-3-5-3-7-3-1**,
centered on row 4. Odd heights center cleanly. The two `ho` peaks sit at columns
3 and 5. This is the same language as the live status panel: frozen in the mark,
animated in the app, where the recording bloom, the transcribing bar, and the
done fill all live inside a circular dot-matrix ring on a pitch-black panel.

Functional chrome around the ring is native-macOS. Cyan only ever enters through
the ring.

## Asset inventory

Everything under `assets/` is generated from one parametric spec. Do not
hand-edit the outputs. Edit `assets/generate.py` and re-run:

```sh
uv run --with pillow assets/generate.py
```

```
assets/
  generate.py                     the spec (source of truth, Pillow generator)
  mark-{dark,light}.svg           icon-only mark, no tile, transparent
  tile-{dark,light}.svg           rounded-square app tile + mark
  figure-only-{dark,light}.svg    lit dots only (lightest lockup)
  lockup-{dark,light}.svg         free mark + Doto wordmark
  Yohoho.icon/                    Icon Composer bundle (layered app icon)
  icon-layers/                    the icon's composited layers
  icon/
    icon-{1024..16}-{dark,light}.png   app-icon ramp (full field to 4-dot bar)
    mark-{512,128}-{dark,light}.png    transparent marks for lockups / README
    lockup-{dark,light}.png            rasterized Doto lockup
    favicon.ico                        16, 32, 48
    icon.ico                           Windows, 16 to 256
    icon.icns                          macOS app icon
    menubar-template{,@2x}.png         mono, for system tinting
  contact-sheet.png               a single proof sheet
```

## Usage rules

- **Lockup:** with the wordmark, the mark stands free - dots straight on the
  surface, no tile. Mark height is about the wordmark cap-height; clear space is
  about half the mark width.
- **Tile:** the rounded-square tile is only for standalone icon use (app icon,
  favicon, menu bar).
- **Surface match:** always match the palette to the surface. Never place the
  dark mark on a light ground or the light mark on a dark ground.
- **One red:** exactly one red dot, ever, and only as the record dot.
- **Cyan discipline:** in functional UI, cyan appears only in the ring.
- **Doto is the wordmark:** never set functional UI text in Doto.
- **Small-scale collapse:** below the full field, the mark collapses to a 4-dot
  bar (record, ho, ho, done) for favicon and menu-bar sizes.
