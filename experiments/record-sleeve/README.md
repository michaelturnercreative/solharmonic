# SolHarmic — Record sleeve

This is the independently maintained Record sleeve player developed in the design chat.
The broader public website and member app remain at the repository root and in
`app-persistent/`. This directory is the focus of ongoing Record sleeve work.

## Run

Open `index.html` directly, or use the included localhost-only launcher:

```sh
cd experiments/record-sleeve
python3 start.py
```

On Windows, use `py start.py`. The launcher prints a local URL and opens your browser.
No installation, build step, external service or API key is required.

When serving the whole repository, open `/experiments/record-sleeve/`.
All asset links are relative so the player also works under a GitHub Pages project URL.
Publishing this path requires merging this branch and deploying the repository.

## Files

- `index.html`: player markup and controls.
- `styles.css`: Record sleeve styling, responsive rules, themes and static landscapes.
- `player.js`: playback, queue, local folder selection and saved preferences.
- `assets/`: bundled Cinzel Regular, logo, icons and seven landscape SVGs.
- `Music/`: optional local location for your own audio; recordings are ignored by Git.
- `start.py`: optional Python standard-library launcher bound to `127.0.0.1`.

## Audio and privacy

Use **Add your audio**, drag files onto the upload area, or use **Open music folder**.
The folder picker works in supporting browsers such as Chrome and Edge. Files remain
on the listener's computer. There is no cloud upload, authentication or shared library.
Select files again after reloading. Folder contents are not automatically watched.
No recordings are included; use the `Music/` folder only for local files.

## Design baseline

Record sleeve is the only layout. Classic and Scenic views, Solar and Lunar themes,
Solar Gold `#F6A623`, Ocean logo waves `#6D8FA8`, Cinzel Regular lettering, and black
icons with small gold/blue accents are retained. Scenic backgrounds are static.
The Waves toggle controls only the decorative player waves during playback.

## Working on this version

Keep player-specific changes in this directory. Avoid coupling it to the root app's
CSS, JavaScript, audio catalog or account flows. Validate with:

```sh
node --check player.js
python3 -c "import ast; ast.parse(open('start.py').read())"
```

Then check Classic/Scenic, Solar/Lunar, mobile sizing, local audio playback, queue,
seeking, volume, loop and sleep timer in a browser. There is no generated build output.

## Desktop handoff

See [DESKTOP-HANDOFF.md](DESKTOP-HANDOFF.md) for cloning this branch, opening a
local desktop project, preserving ownership, and backing up code and music.
