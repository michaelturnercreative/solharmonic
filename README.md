# SolHarmonic — website + player

A complete static site. No build step, no dependencies, no server required.
Open `index.html` in a browser and it runs.

---

## Run it

**Simplest — double-click `index.html`.** Everything works from `file://`,
including the player and its audio. The scripts are plain classic scripts
sharing a `window.SH` namespace rather than ES modules, specifically so that
opening the files directly doesn't trip the browser's module CORS rules.

**Better — serve it locally.** Some browsers restrict `localStorage` on
`file://`, which is only used to remember your theme choice:

```bash
cd "SolHarmonic Site"
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server works — `npx serve`, `php -S localhost:8080`, VS Code's
Live Server extension.

**Deploy it** by uploading the folder as-is to Netlify, Vercel, GitHub Pages,
S3, or any static host. There is nothing to compile.

---

## Record sleeve version

The separate [Record sleeve player](experiments/record-sleeve/README.md) lives in
`experiments/record-sleeve/`. This is the focus of ongoing Record sleeve design work.
It is self-contained, uses local audio, and includes static scenic backgrounds.
Open its `index.html` or run `python3 experiments/record-sleeve/start.py`.

## Pages

| File | What it is |
|---|---|
| `index.html` | Marketing home — hero, trust bar, library preview, modes, live mixer, licensing, devices, close |
| `atmospheres.html` | The full library, with blurbs |
| `licensing.html` | Six licence clauses in the buyer's language |
| `pricing.html` | Three tiers |
| `preview.html` | Public sample player for visitors |
| `login.html` / `signup.html` | Public-to-member access points (concept flow; authentication is not connected yet) |
| `app-persistent/index.html` | Primary member app — continuous player, library, favorites, zones, and account |
| `app/index.html` | Earlier multi-page member-player concept retained for comparison |
| `app/library.html` | Full member atmosphere library |
| `app/zones.html` | Member rooms, schedules, and playback status |
| `app/account.html` | Member licence, plan, billing, and account |

### Public site and member app

The public site explains and sells SolHarmonic. It contains the home page, public library preview,
licensing, pricing, and a short sample. Members enter through `login.html` and then stay inside the
`app-persistent/` experience. Its player remains mounted while members move among the library,
favorites, zones, and account views, so playback continues without a page reload.

`player.html` and `app/` are retained as earlier concepts, but new member flows use
`app-persistent/index.html`.

---

## Assets

```
assets/
  css/
    tokens.css       palette, type, spacing — every value in one place
    base.css         reset, typography, layout primitives
    components.css   wordmark, buttons, square icon buttons, nav, cards, footer
    site.css         marketing page layouts
    player.css       player application shell
  js/
    icons.js         28-icon set as SVG paths + SH.icon() / SH.mountIcons()
    artwork.js       SH.WaveField — the generative visual language
    audio.js         SH.RecordedMixer — synchronized recorded-audio layers
    tracks.js        track folders and audio-file paths
    data.js          library content, modes, trust points, devices
    theme.js         solar / lunar switching and its trigger rules
    site.js          marketing page wiring
    player.js        player application wiring
  img/
    favicon.svg
```

---

## How the system fits together

**One artwork function.** Every image on the site — hero, all eight atmosphere
thumbnails, the mixer, the player cover, the bottom-bar thumbnail — is
`SH.WaveField` with different parameters. Nothing is a photograph or an
exported image. It is resolution-independent and weighs nothing.

**Four numbers drive sound and image together.** Depth, Warmth, Texture and
Brightness feed the artwork and the audio engine from the same values, so the
picture and the tone are the same fact drawn two ways.

**Two themes, one system.** Add `class="lunar"` to `<body>` and every token
swaps. Solar Gold stays for the primary call to action in both — it's the
thread that ties them to one brand.

**Contrast rules that reverse.** Solar Gold on Cloud is 1.95:1 — a fill
colour, never type. Use `--amber-text` (#8F5A00, 5.6:1) for gold-coloured text
in daylight. On Nocturne the same gold measures ~9:1, so at night it *can* be
text; `--accent-text` handles the switch automatically.

**Icons are one weight, one grid.** 24-unit grid, 2-unit margin, 1.4 stroke
(1.55 in lunar, because light strokes on dark grounds optically thin out).
The circle container is reserved for player modes so containment carries
meaning rather than decoration.

---

## Try these

- Press play on the player to hear the main recording in `audio/tracks/`.
- Add synchronized Nature, Emotion, Support, Body, and Mind files to a track
  folder and enable their paths in `assets/js/tracks.js` to mix their levels.
- Select **Sleep** mode. The lunar theme opens automatically.
- Play **Evening Calm** — a night atmosphere always opens lunar, whatever the
  clock says.
- Click the expand icon under the transport for **ceiling view**: chrome-free
  full screen for the display above a treatment chair. Esc to leave.
- Spacebar toggles playback.
- `player.html#ocean-drift` deep-links straight to a title.

---

## Known placeholders

- **Pricing** ($29 / $99) is layout-only. It needs real cost-per-location.
- **Licence language** describes the intended commitment, including the
  indemnity. None of it should go live before an IP attorney drafts the actual
  terms. Nothing in this repo is legal advice.
- **Audio layers** other than the main recording have not been added yet.
- **Photography** doesn't exist yet. The four categories in Brand Book 1.0 —
  Welcome, Care, Restore, Nature — belong in the hero and the atmosphere
  thumbnails once the shoot happens. The generative field carries the site
  until then, and indefinitely if the shoot slips.
- **Fonts** load from Google Fonts, so the first paint offline falls back to
  the system stack. Self-host Inter Tight and Inter for production.
- **Ceiling luminance** is uncapped in the browser at full contrast. Above a
  reclined patient the field needs its brightness clamped — see
  `artwork.js`, `THEMES.lunar.cap`.

---

*v0.1 — built on Brand Book 1.0 plus the lunar theme extension.*
