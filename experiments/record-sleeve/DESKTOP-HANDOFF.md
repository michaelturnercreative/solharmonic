# Continue locally — SolHarmic Record sleeve

## Get the project onto your computer

Clone the existing repository and select the Record sleeve branch:

```sh
git clone --branch codex/record-sleeve-version https://github.com/michaelturnercreative/solharmonic.git
cd solharmonic
```

If you already have a clone, commit or save any local changes before switching:

```sh
git fetch origin
git switch codex/record-sleeve-version
```

Open this `solharmonic` folder as a local project in Codex Desktop (or any editor).
Use a new local chat if the existing chat remains attached to its cloud environment.
No new GitHub repository is needed. This document carries the working context.

Suggested first message:

> Work locally in experiments/record-sleeve. Read its AGENTS.md, README.md and
> DESKTOP-HANDOFF.md. Continue this player on codex/record-sleeve-version.
> Keep my music local and out of Git. Do not use cloud development or Sites hosting.

## Run the player

Open `experiments/record-sleeve/index.html` directly in a browser, or run:

```sh
python3 experiments/record-sleeve/start.py
```

On Windows use `py` instead of `python3`. The optional launcher uses only Python's
standard library, serves localhost only and prints its URL. No dependency install
or build is needed. The player runs without ChatGPT, Codex, an account or internet.
GitHub is for source synchronization, not runtime hosting.

## Current state

- Focus: `experiments/record-sleeve/`; retain the root site and member app separately.
- Branch: `codex/record-sleeve-version`.
- Draft PR: https://github.com/michaelturnercreative/solharmonic/pull/1
- Layout: Record sleeve, with Classic and Scenic views and Solar/Lunar themes.
- Seven illustrated landscapes; background movement has been removed.
- Cinzel Regular, gold sun (#F6A623), Ocean waves (#6D8FA8), black icons with
  small gold/blue accents. Lunar uses lighter strokes for legibility.
- Audio: local files or a user-selected folder; queue, seek, loop, volume, timer.
- Folder selection must be repeated after reload; there is no persistent cloud library.
- JavaScript/launcher syntax, relative asset links and SVG parsing were checked.
  Full browser playback and responsive QA are still outstanding.

## Ownership and backups

The source, fonts, icons and landscapes are ordinary files in this repository.
You can keep editing with any editor if you stop using ChatGPT or Codex. Codex AI
features themselves require their service; that is separate from running the player.
The Cinzel license is included under assets/fonts.

Use `experiments/record-sleeve/Music/` for your personal audio. Its contents are
ignored by Git except the instructions file. Do not force-add music. Back up this
folder separately to your own local/external drive: GitHub will not back it up.
The root repository may contain older audio assets belonging to the broader site;
those are separate from this player's personal Music folder.

Commit and push code changes to GitHub regularly. Keep a second local backup too.
A Git bundle can preserve the repository history offline:

```sh
git bundle create SolHarmic-backup.bundle --all
```

Restore a supplied bundle with:

```sh
git clone --branch codex/record-sleeve-version SolHarmic-Repository.bundle solharmonic
```

The existing Sites-hosted preview is independent and is not required by this build.
Moving locally does not delete that preview or migrate this chat's execution environment.
