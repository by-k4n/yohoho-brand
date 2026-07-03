# yohoho-brand

The design system and brand source of truth for
[yohoho](https://github.com/by-k4n/yohoho), a free, fully local voice-to-text
tool for developers.

This repo holds the identity: the parametric mark generator and its outputs, the
brand documentation, a machine-readable token seed, and the design explorations
that led here.

## Structure

```
README.md                   what this repo is
tokens/yohoho.tokens.json   machine-readable token seed (DTCG format)
docs/brand.md               the brand documentation
assets/              the identity system - generator, icon sources, SVGs, ramps
explorations/        design-refresh mockups, logo concepts, sketches, history
```

- **assets/** is generated from one spec, `assets/generate.py`. Do not hand-edit
  the outputs; edit the spec and re-run it.
- **explorations/** keeps the process: the dot-matrix panel mockups
  (`design-refresh/`), the logo-concept gallery (`logo-concepts/`), the working
  `.pen` file, loose brand sketches (`sketches/`), and earlier renders
  (`history/`).

## Tokens

`tokens/yohoho.tokens.json` is a small, honest seed grounded in the real
generator constants, not a finished token system. It follows the DTCG (W3C
Design Tokens Community Group) draft format, so each token carries `$value`,
`$type`, and a documented `$description`. Colors use the hex-string form of the
color type for direct Style Dictionary v4 / Tokens Studio consumption.
Distribution tooling (Style Dictionary or similar, and platform exports) is
future work.
