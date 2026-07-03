# yohoho — visual refresh brief (for Pencil)

Paste this into Pencil and attach every image in `current-ui/`. Ask for **multiple
exploratory concepts per direction**, not one polished answer.

---

## The product
**yohoho** is a free, fully-local voice-to-text tool for developers. You tap a global
hotkey, speak, and your words are transcribed **on your own machine** and pasted into
whatever app you're typing in. No cloud, no subscription, no account.

The only persistent UI is a **small always-on-top status panel** that appears while you
dictate. There's also a settings surface (today a terminal menu; soon a real window).

**Audience:** developers, vibe coders, designers-turned-developers.
**Personality:** *refined utilitarianism* — crafted, minimal, functional in more than one
way — with a light **anime-pirate wink** (the name is Brook's *One Piece* laugh + the
"yo ho ho" sea-shanty).

## Why we're refreshing
The current look (see `current-ui/`) is a **glowing dark capsule with an LED dot-matrix
waveform**. It's clean, but it's also the *default* of this whole category — Wispr Flow
and VoiceInk land in the same place. I want a visual language that's unmistakably **ours**
and rooted in the **physical world**, not another backlit pill.

### Hard "avoid" list
- The glowing capsule / pill silhouette.
- A dot-matrix or equalizer-bar waveform as the listening visual.
- Generic neon-on-black "AI product" gloss.

### Keep / honor
- The **REC red `#ff5454`** reserved for one thing only: the active-recording tell.
- The pirate wink — subtle, in the details, never costumey.
- Reads well at **tiny size** (the panel is ~410×60pt, floating above other windows) and in
  both light and dark desktop contexts.
- Brand cyan `#39BFC6` may stay, shift role, or go — your call per direction.

---

## Surfaces to design
1. **The status panel** — the hero. Design it in **all five states**:
   `idle` · `recording (listening)` · `transcribing` · `done` · `error`.
   Show how the **listening visual** responds to live mic level, and how **progress** reads.
   **Never look dead in silence:** while listening, even with no sound, the panel must show
   it's alive (a resting **noise floor** that rises with volume — the VU needle resting with
   a faint idle flutter, the typewriter carriage sitting *ready*). Quiet ≠ frozen.
2. **The wordmark / brand lockup** in the new language.
3. **A settings window** (forward-looking — replaces the terminal menu in `05`/`06`).
   Same fields: hotkey, recording mode, sounds, model, etc. A graphical panel.
4. *(optional)* a **menu-bar / tray icon** pair (idle vs recording).

---

## Direction A — Analog tape & VU
*The machine that listens.* A miniature tape-deck / dictaphone face.

- **Palette:** brushed aluminium + warm graphite + **amber readout `#E8A33D`**, red `#ff5454`
  reserved for the REC tally lamp. Backlit warm glass, not neon.
- **Type:** an engraved/industrial label face for the wordmark; a clean mono or humanist
  sans for readouts. Think gear labeling, not app UI.
- **Signature element:** a real **VU needle that swings to live mic level** — this *replaces*
  the dot waveform. Pair with subtly **rotating reel hubs** while recording.
- **State language:**
  - `recording` → REC **tally lamp** lit, reels turning, needle dancing.
  - `transcribing` → tape advances; progress as a **mechanical tape counter** (the current
    `00:05`-style counter is a gift here — make it a real odometer).
  - `done` → tally off, counter halts, a soft mechanical settle.
  - `error` → amber readout text (e.g. "no mic").
- **Texture:** knurled metal, screw heads, warm glass, faint VU graticule. Tactile, not flat.

## Direction B — Typewriter / letterpress
*The machine that writes.* Honors the actual output: **text, physically made.**

- **Palette:** paper cream `#F4F1EA` + ink `#14110E` + **one ink accent** (a ribbon color —
  try the brand cyan as the ribbon, or a classic typewriter red/black duo). REC red stays
  the active tell.
- **Type:** a refined typewriter/slab face for the transcript (a better-than-Courier mono);
  a **letterpressed wordmark** (debossed into the paper).
- **Signature element:** letters that **strike / emboss into the paper** as text arrives —
  typebars hammering, ink pressing in. The reveal *is* the brand moment.
- **State language:**
  - `recording` → carriage loaded, ribbon ready, a quiet margin-bell readiness.
  - `transcribing` → typebars strike; progress reads as the **carriage advancing toward the
    right margin** (margin bell = nearly done).
  - `done` → **carriage return** + ding; the line settles, pressed into paper.
  - `error` → a struck-over `xxxx` correction, very typewriter.
- **Texture:** paper grain, deboss/letterpress shadow, ink bite, platen rubber.

---

## What I want back
- For **each** direction: a few panel concepts (different silhouettes/compositions — it no
  longer has to be a horizontal capsule), the five states, the wordmark, and a settings
  window. Light + dark where it matters.
- Call out the **signature element** per concept and how it animates with real mic level.
- One **wildcard** is welcome — including a fusion of A+B (a desk dictation machine: tape in,
  type out), if it earns its place.

Reference the attached `current-ui/` shots only as the *thing we're moving away from* — match
the personality and the constraints, not the current visuals.
