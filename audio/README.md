# Audio library

Each track gets one folder inside `audio/tracks/`. The player reads the files
listed in `assets/js/tracks.js`.

```text
audio/tracks/track-folder/
  main/       complete mix (required)
  nature/     optional Nature layer
  emotion/    optional Emotion layer
  support/    optional Support layer
  body/       optional Body layer
  mind/       optional Mind layer
```

The visible player title is made from the filename in `main/`: the extension,
underscores, hyphens, and a trailing `Short Format` label are removed.

When a layer is ready, drop its audio file into the matching folder and add its
relative path to that layer in `assets/js/tracks.js`. All files for a track
should have the same length and start at the same point so they remain in sync.

