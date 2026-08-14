/* SolHarmonic audio library.
   Add one object per track folder. The main file is required; layers are optional. */
(function (root) {
  "use strict";

  root.SH = root.SH || {};
  var prefix = root.SH_ASSET_ROOT || "";
  root.SH.tracks = [
    {
      id: "soma-drone-key-f",
      main: prefix + "audio/tracks/soma-drone-key-f/main/Soma Drone Key F -Short Format.mp3",
      layers: {
        nature: null,
        emotion: null,
        support: null,
        body: null,
        mind: null
      }
    },
    {
      id: "solharmonic-track-1-rain",
      main: prefix + "audio/tracks/solharmonic-track-1-rain/main/SolHarmonic-Track 1 Rain.mp3",
      layers: {
        nature: null,
        emotion: null,
        support: null,
        body: null,
        mind: null
      }
    }
  ];
})(window);
