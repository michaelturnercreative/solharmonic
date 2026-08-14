/* ============================================================
   SolHarmonic — theme switch (solar / lunar)

   Triggers, in the order they take precedence:
     1. Sleep mode          — always lunar
     2. A night atmosphere  — always lunar
     3. After local sunset  — lunar by default
     4. Manual override     — wins over all of the above, per zone
   ============================================================ */
(function (root) {
  "use strict";
  var KEY = "sh-theme";

  function isNight(date) {
    var h = (date || new Date()).getHours();
    return h >= 19 || h < 6;   /* stand-in for a real sunset lookup */
  }

  function apply(lunar) {
    document.body.classList.toggle("lunar", !!lunar);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      var ico = b.querySelector("[data-icon]") || b;
      if (ico.setAttribute) ico.setAttribute("data-icon", lunar ? "sun" : "moon");
      var lbl = b.querySelector(".lbl");
      if (lbl) lbl.textContent = lunar ? "Solar theme" : "Lunar theme";
      b.setAttribute("aria-pressed", String(!!lunar));
      b.setAttribute("aria-label", lunar ? "Switch to solar theme" : "Switch to lunar theme");
    });
    if (root.SH && root.SH.mountIcons) root.SH.mountIcons();
    document.dispatchEvent(new CustomEvent("sh:theme", { detail: { lunar: !!lunar } }));
  }

  function init() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { /* file:// or private mode */ }
    apply(stored ? stored === "lunar" : isNight());

    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = !document.body.classList.contains("lunar");
        apply(next);
        try { localStorage.setItem(KEY, next ? "lunar" : "solar"); } catch (e) {}
      });
    });
  }

  root.SH = root.SH || {};
  root.SH.theme = { apply: apply, isNight: isNight, init: init };
  document.addEventListener("DOMContentLoaded", init);
})(window);
