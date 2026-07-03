# yohoho — logo brief (for Pencil)

Paste this into Pencil. Optionally attach `logo-concepts/preview.png` (7 explored directions) and
`design-refresh/current-ui/` (the real dot-matrix panel) as visual reference.

---

## The product
**yohoho** is a free, **fully-local** voice-to-text (dictation) tool for developers: tap a hotkey,
speak, and your words are transcribed **on your own machine** and pasted into the focused app. No
cloud, no subscription, no account. I need a **logo** — an **icon mark** + a **wordmark lockup**.

## Brand language
- **Personality: "refined utilitarianism."** A designer-turned-developer's tool. Crafted, minimal,
  precise — and *functional in more than one way* (a mark that does real work, not decoration).
- **An anime-pirate WINK.** The name is Brook's *One Piece* laugh crossed with the "yo ho ho"
  sea-shanty — note the **three "ho"s** (a rhythm / a laugh). The pirate is yohoho's moat: lean into
  it as a knowing smirk, never gory, never costume-y.
- **Voice:** confident, dry, a little playful. The mark should feel like a flag stitched in lights.

## Visual system to carry over (non-negotiable)

### Palette
| Role | Hex | Rule |
|---|---|---|
| **Hero — cyan** | `#39BFC6` | the brand. Lit dots, the mark, the wordmark accents. |
| **Ground — near-black** | `#0a0b0c` | everything sits on this. |
| **REC — red** | `#ff5454` | **RARE.** Exactly one element may be red — the "recording" dot. Never decoration, never a second red. |
| **Neutral** | `#cdd6da` | dim greys for the unlit-LED texture / secondary marks. |

### Typography
- **Wordmark = Doto** (Google Fonts) — a **dot-matrix typeface**, heavy weight, slight letterspacing.
  The wordmark "yohoho" is set in Doto; the icon must feel like it's from the same world.
- Utility/captions: a clean monospace (e.g. JetBrains Mono / IBM Plex Mono).

### THE DOT-MATRIX STYLE (the core thing to carry over)
yohoho's whole UI is an **LED / dot-matrix display** — a regular grid of identical **circular dots**,
read like a stadium scoreboard / split-flap departure board. The figure is formed by *which dots are
lit*, not by strokes. Build the logo in this same language:

- **A regular square grid of circular dots** on a fixed pitch, generous spacing (the negative space
  between dots is part of the look). The mark = a constellation of lit dots (try 5×5, 7×7, or a denser
  field — whatever cleanly resolves the figure).
- **Three dot states:**
  1. **OFF (unlit)** — very dim grey (`#cdd6da` at ~12–16% on the black): the "powered-but-unlit LED"
     texture. The faint full grid often sits *behind* the lit mark and gives it authenticity.
  2. **LIT** — solid brand cyan `#39BFC6`: these dots draw the actual letterform/figure.
  3. **PEAK / ACTIVE** — the brightest cyan, optionally with a soft **cyan glow halo** (a larger,
     low-opacity cyan circle behind the dot) — echoes the "active peaks" of the mic waveform.
- **The REC dot** — exactly one dot may be **red `#ff5454`** with a soft red glow: the recording
  indicator, and the *only* red. Earn it (e.g. make it the foot of a letter, or an eye, or the source
  a waveform fires from).
- **No connecting strokes, no gradients-as-shape** — crisp circles only; the eye assembles the figure.
- **Motion (if animating):** dots light up / change brightness **in place** — never travel. A waveform
  is a column of dots changing height; "transcribing" is a shimmer; the REC dot pulses.

## What to design
1. **The icon mark** — the hero. Must read at **16px** (menu-bar / favicon) *and* as a **96px+ app
   icon** (and a macOS rounded-square tile). Bold silhouette, no hairlines that vanish small.
2. **The wordmark lockup** — the icon + "yohoho" in Doto, horizontal; plus an icon-only and a
   stacked variant.
3. Show it **on near-black**, and check it inverts / sits on a light tile too.

## Directions already explored (build on these — don't restart from zero)
From a first round (see `preview.png`), strongest → weakest:
1. **Dot-matrix Pirate** *(push hardest)* — a **Jolly Roger skull built from the LED dot grid**, where
   the teeth ARE a column-dot waveform and one eye is the red REC dot. The most ownable (pirate = moat)
   *and* system-native. **This is the one to develop first.**
2. **Living Y → Voiceprint** — a dot-matrix **"Y"** monogram at rest that resolves into a **voiceprint
   firing from the red REC dot** while recording, then settles. One identity encoding rest → listen →
   record. Great as an *animated* icon.
3. **Open Aperture** — a refined cyan aperture/lens **broken open** at one corner with escaping pings +
   a red REC core. Premium, minimal, scales well.
4. **Five-Ho Voiceprint** — the literal "yo-ho-ho-ho-ho" laugh drawn as a column-dot waveform; best as
   a wordmark underline / recording animation, weak as a standalone square.
- **Avoid / cut:** a generic radiating-arcs "sonar" rounded-square (most over-used motif in voice
  apps); abstract concentric rings (reads as rings, not a laugh); a literal microphone.

## Do / Avoid
- **Do:** keep the dot-matrix grid discipline; cyan hero on black; red used once and earned; a bold
  small-size silhouette; the pirate wink as *refined*, not literal-sticker.
- **Avoid:** a second red; hairline details; the microphone cliché; skeuomorphic gloss; anything that
  could be any other voice app.
