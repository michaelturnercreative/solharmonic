/* ============================================================
   SolHarmonic — content
   Placeholder library data. Swap for an API response later; the
   shape is what the player and the browse grid both read.
   ============================================================ */
(function (root) {
  "use strict";

  var ATMOSPHERES = [
    { id:"forest-stillness", name:"Forest Stillness", hours:8,  hz:98.0,  warm:0.58,
      icon:"tree",     night:false, blurb:"Low, slow and evenly lit. The default for most rooms." },
    { id:"ocean-drift",      name:"Ocean Drift",      hours:10, hz:87.3,  warm:0.24,
      icon:"waves",    night:false, blurb:"Wide and cool, with long swells and no detail to catch on." },
    { id:"morning-light",    name:"Morning Light",    hours:6,  hz:110.0, warm:0.86,
      icon:"sun",      night:false, blurb:"Brighter and more present. Built for arrival and reception." },
    { id:"deep-meditation",  name:"Deep Meditation",  hours:8,  hz:73.4,  warm:0.42,
      icon:"ripple",   night:true,  blurb:"Very little movement. For treatment and recovery rooms." },
    { id:"evening-calm",     name:"Evening Calm",     hours:8,  hz:82.4,  warm:0.40,
      icon:"moon",     night:true,  blurb:"Warm and dim. Opens the lunar theme automatically." },
    { id:"water-flow",       name:"Water Flow",       hours:10, hz:92.5,  warm:0.34,
      icon:"drop",     night:false, blurb:"Continuous and unmetred. Good under conversation." },
    { id:"piano-horizon",    name:"Piano Horizon",    hours:6,  hz:103.8, warm:0.72,
      icon:"mountain", night:false, blurb:"Sparse tonal figures over a still bed." },
    { id:"rain-and-clouds",  name:"Rain & Clouds",    hours:10, hz:69.3,  warm:0.30,
      icon:"rain",     night:true,  blurb:"Textured and masking. The most effective at covering noise." }
  ];

  var MODES = [
    { id:"focus",   label:"Focus",        icon:"focus",
      blurb:"Reduces detail and movement so the music stays behind the work." },
    { id:"spa",     label:"Spa",          icon:"spa",
      blurb:"Warmer, more spacious, slower to change. Built for treatment rooms." },
    { id:"sleep",   label:"Sleep",        icon:"sleep",
      blurb:"Slow-evolving beds for recovery, infusion and overnight suites." },
    { id:"waiting", label:"Waiting room", icon:"waiting",
      blurb:"A little brighter and more present, so arrival feels welcoming." }
  ];

  var TRUST = [
    ["Commercial use included","No PRO fees, no claims"],
    ["Safe for every environment","No lyrics, no surprises"],
    ["Long-form music","3–10 hour tracks"],
    ["New music monthly","Library keeps growing"],
    ["Dedicated support","A person, not a form"]
  ];

  var DEVICES = [
    ["Web player","Chrome, Safari, Edge"],
    ["iOS app","iPhone & iPad"],
    ["Android app","Phone & tablet"],
    ["Apple TV","4K experience"],
    ["Android TV","Large screen"],
    ["Fire TV","Coming soon"]
  ];

  root.SH = root.SH || {};
  root.SH.data = { ATMOSPHERES: ATMOSPHERES, MODES: MODES, TRUST: TRUST, DEVICES: DEVICES };
})(window);
