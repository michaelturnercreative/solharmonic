/* ============================================================
   SolHarmonic — icon set
   24-unit grid, 2-unit margin, 1.4 stroke, round cap and join.
   The circle container is reserved for player modes only.
   ============================================================ */
(function (root) {
  "use strict";

  var PATHS = {
    /* atmospheres */
    sun:'<circle cx="12" cy="12" r="4.6"/><path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4l-1.6 1.6M7 17l-1.6 1.6M18.6 18.6L17 17M7 7L5.4 5.4"/>',
    waves:'<path d="M2.6 8.4c2-2.4 4.1-2.4 6.1 0s4.1 2.4 6.1 0 4.1-2.4 6.6 0"/><path d="M2.6 13c2-2.4 4.1-2.4 6.1 0s4.1 2.4 6.1 0 4.1-2.4 6.6 0"/><path d="M2.6 17.6c2-2.4 4.1-2.4 6.1 0s4.1 2.4 6.1 0 4.1-2.4 6.6 0"/>',
    drop:'<path d="M12 2.8c0 0 6.2 6.9 6.2 10.9a6.2 6.2 0 0 1-12.4 0C5.8 9.7 12 2.8 12 2.8z"/>',
    tree:'<path d="M12 2.8L6.6 10.4h10.8z"/><path d="M12 8.2l-6.6 8.4h13.2z"/><path d="M12 16.6v4.6"/>',
    cloud:'<path d="M7.4 18.6h9.9a3.9 3.9 0 0 0 .5-7.8 5.6 5.6 0 0 0-10.7-1.1 3.6 3.6 0 0 0 .3 8.9z"/>',
    moon:'<path d="M20.4 15.2A8.6 8.6 0 0 1 9.1 3.9a8.6 8.6 0 1 0 11.3 11.3z"/>',
    mountain:'<path d="M2.6 19.4l6.2-9.6 4 5.6 2.6-3.6 6 7.6z"/><circle cx="17" cy="6.4" r="2.2"/>',
    leaf:'<path d="M4.6 19.4c0-8 5.4-13.2 14.8-14.6.8 9.6-4.4 15.2-14.8 14.6z"/><path d="M4.6 19.4C8 15.6 11.8 12.4 16.6 10"/>',
    rain:'<path d="M7.8 15.4h8.6a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5-1 3.2 3.2 0 0 0 .5 8z"/><path d="M9 18.4l-.9 2.4M13 18.4l-.9 2.4M17 18.4l-.9 2.4"/>',
    ripple:'<circle cx="12" cy="12" r="2"/><path d="M6.6 12a5.4 5.4 0 0 1 10.8 0"/><path d="M6.6 12a5.4 5.4 0 0 0 10.8 0"/><circle cx="12" cy="12" r="9.4"/>',
    fog:'<path d="M3.6 8.4h13M6.8 12h14M3.6 15.6h11M9 19.2h11"/>',
    stream:'<path d="M3 6.6c3 0 3 3.4 6 3.4s3-3.4 6-3.4 3 3.4 6 3.4"/><path d="M3 14c3 0 3 3.4 6 3.4s3-3.4 6-3.4 3 3.4 6 3.4"/>',

    /* player modes — the only enclosed icons */
    focus:'<circle cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1"/>',
    spa:'<circle cx="12" cy="12" r="9.4"/><path d="M12 6.4c2.4 2 2.4 5 0 7-2.4-2-2.4-5 0-7z"/><path d="M6.6 14.6c2.6-1.4 5.2-.6 6.4 1.6M17.4 14.6c-2.6-1.4-5.2-.6-6.4 1.6"/>',
    sleep:'<circle cx="12" cy="12" r="9.4"/><path d="M16.6 14.2a5.2 5.2 0 0 1-6.8-6.8 5.2 5.2 0 1 0 6.8 6.8z"/>',
    waiting:'<circle cx="12" cy="12" r="9.4"/><circle cx="9.6" cy="10.2" r="2.1"/><circle cx="15.4" cy="11" r="1.6"/><path d="M5.9 17.4c0-2.1 1.7-3.5 3.7-3.5s3.7 1.4 3.7 3.5"/><path d="M14 17.4c0-1.5 1-2.5 2.1-2.5s1.9.7 1.9 1.9"/>',

    /* interface + practice */
    play:'<path d="M8.4 5.6l10 6.4-10 6.4z"/>',
    pause:'<path d="M9.2 5.8v12.4M14.8 5.8v12.4"/>',
    next:'<path d="M6.6 5.8l8.6 6.2-8.6 6.2z"/><path d="M18 5.8v12.4"/>',
    prev:'<path d="M17.4 5.8l-8.6 6.2 8.6 6.2z"/><path d="M6 5.8v12.4"/>',
    heart:'<path d="M12 20.2S3.8 15.4 3.8 9.7A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 8.2 2.1c0 5.7-8.2 10.5-8.2 10.5z"/>',
    share:'<circle cx="17.6" cy="6.2" r="2.6"/><circle cx="6.4" cy="12" r="2.6"/><circle cx="17.6" cy="17.8" r="2.6"/><path d="M8.8 10.7l6.5-3.3M8.8 13.3l6.5 3.3"/>',
    mix:'<path d="M3.4 8h9.2M16.8 8h3.8M3.4 16h3.8M11.4 16h9.2"/><circle cx="14.7" cy="8" r="2.1"/><circle cx="9.3" cy="16" r="2.1"/>',
    volume:'<path d="M4.4 9.4h3.4L12 5.8v12.4L7.8 14.6H4.4z"/><path d="M15.6 9.6a3.6 3.6 0 0 1 0 4.8"/><path d="M18.2 7a7.2 7.2 0 0 1 0 10"/>',
    clock:'<circle cx="12" cy="12" r="9.2"/><path d="M12 6.8V12l3.4 2.1"/>',
    licence:'<path d="M6 3.4h9l3.6 3.6v9.4H6z"/><path d="M15 3.4V7h3.6"/><circle cx="12" cy="18.4" r="2.6"/><path d="M10.4 20.4l-.6 2.2 2.2-1.1 2.2 1.1-.6-2.2"/>',
    download:'<path d="M12 4v10.6"/><path d="M8 11l4 3.8 4-3.8"/><path d="M4.6 18.6h14.8"/>',
    screen:'<rect x="3.2" y="4.6" width="17.6" height="12.2" rx="1.8"/><path d="M9 20.6h6M12 16.8v3.8"/>',
    practice:'<path d="M4.2 20.4V9.6L12 4.2l7.8 5.4v10.8z"/><path d="M9.6 20.4v-6h4.8v6"/>',
    expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };

  /* stroke is 1.4 in daylight and 1.55 at night — light strokes on a dark
     ground optically thin out, so the night set is drawn one step heavier. */
  function weight(explicit) {
    if (explicit) return explicit;
    return document.body && document.body.classList.contains("lunar") ? 1.55 : 1.4;
  }

  function icon(name, w) {
    var d = PATHS[name];
    if (!d) { console.warn("[SolHarmonic] unknown icon:", name); return ""; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      weight(w) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      d + "</svg>";
  }

  /* fills every [data-icon] element on the page */
  function mount(scope) {
    (scope || document).querySelectorAll("[data-icon]").forEach(function (el) {
      el.innerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("data-icon-weight"));
    });
  }

  root.SH = root.SH || {};
  root.SH.ICONS = PATHS;
  root.SH.icon = icon;
  root.SH.mountIcons = mount;
})(window);
