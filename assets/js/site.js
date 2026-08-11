/* ============================================================
   SolHarmonic — marketing page behaviour
   ============================================================ */
(function () {
  "use strict";

  var WORDS = {
    depth:  ["Shallow", "Present", "Deep"],
    warmth: ["Cool", "Neutral", "Warm"],
    texture:["Smooth", "Soft", "Textured"],
    bright: ["Low", "Even", "Bright"]
  };
  function word(k, v) { return WORDS[k][v < 34 ? 0 : v < 67 ? 1 : 2]; }

  function boot() {
    SH.mountIcons();

    /* --- tablet / mobile navigation --- */
    var nav = document.querySelector(".nav");
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navLinks = document.getElementById("site-menu");
    if (nav && navToggle && navLinks) {
      function setMenu(open) {
        navLinks.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      navToggle.addEventListener("click", function () {
        setMenu(navToggle.getAttribute("aria-expanded") !== "true");
      });
      navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) setMenu(false);
      });
      document.addEventListener("click", function (event) {
        if (!nav.contains(event.target)) setMenu(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
          setMenu(false);
          navToggle.focus();
        }
      });
      window.addEventListener("resize", function () {
        if (window.innerWidth > 980) setMenu(false);
      });
    }

    /* --- hero artwork --- */
    var heroCv = document.getElementById("hero-art");
    var hero = null;
    if (heroCv) {
      hero = new SH.WaveField(heroCv, { amp: 60, warm: 0.78, tex: 40, bright: 62, discR: 0.13 });
      hero.start();
    }

    /* --- trust bar --- */
    var trust = document.getElementById("trust");
    if (trust) {
      trust.innerHTML = SH.data.TRUST.map(function (t) {
        return '<div><span class="dot"></span><div><b>' + t[0] + "</b><span>" + t[1] +
               "</span></div></div>";
      }).join("");
    }

    /* --- atmosphere cards --- */
    var grid = document.getElementById("atmos-grid");
    var fields = [];
    if (grid) {
      var limit = parseInt(grid.dataset.limit || "0", 10);
      var list = limit ? SH.data.ATMOSPHERES.slice(0, limit) : SH.data.ATMOSPHERES;
      list.forEach(function (a, i) {
        var el = document.createElement("a");
        el.className = "card";
        el.href = "player.html#" + a.id;
        el.innerHTML =
          '<div class="thumb"><canvas></canvas></div>' +
          '<div class="meta"><h3>' + a.name + "</h3>" +
          '<div class="dur">' + a.hours + " hours</div>" +
          (grid.dataset.blurb ? '<p style="font-size:13.5px;margin:8px 0 0">' + a.blurb + "</p>" : "") +
          "</div>";
        grid.appendChild(el);
        var f = new SH.WaveField(el.querySelector("canvas"), {
          amp: 30 + i * 4, warm: a.warm, tex: 30 + i * 6, bright: 44,
          disc: i % 3 === 0, discR: 0.1, small: true, speed: 0.14
        });
        f.start();
        fields.push(f);
      });
    }

    /* --- player modes --- */
    var modes = document.getElementById("mode-cards");
    if (modes) {
      modes.innerHTML = SH.data.MODES.map(function (m) {
        return '<div class="mode-card"><span data-icon="' + m.icon + '"></span>' +
               "<h3>" + m.label + "</h3><p>" + m.blurb + "</p></div>";
      }).join("");
      SH.mountIcons(modes);
    }

    /* --- devices --- */
    var dev = document.getElementById("devices");
    if (dev) {
      dev.innerHTML = SH.data.DEVICES.map(function (d) {
        return '<div class="device"><span data-icon="screen"></span><b>' + d[0] +
               "</b><span>" + d[1] + "</span></div>";
      }).join("");
      SH.mountIcons(dev);
    }

    /* --- the live mixer --- */
    var mixCv = document.getElementById("mix-art");
    if (mixCv) {
      var mix = new SH.WaveField(mixCv, { amp: 72, warm: 0.58, tex: 64, bright: 34, discR: 0.11 });
      mix.start();
      var ids = { depth: "depth", warmth: "warmth", texture: "texture", bright: "bright" };
      function sync() {
        var d = +document.getElementById(ids.depth).value,
            w = +document.getElementById(ids.warmth).value,
            t = +document.getElementById(ids.texture).value,
            b = +document.getElementById(ids.bright).value;
        document.getElementById("depthV").textContent   = word("depth", d);
        document.getElementById("warmthV").textContent  = word("warmth", w);
        document.getElementById("textureV").textContent = word("texture", t);
        document.getElementById("brightV").textContent  = word("bright", b);
        mix.set({ amp: d, warm: w / 100, tex: t, bright: b });
      }
      Object.keys(ids).forEach(function (k) {
        document.getElementById(ids[k]).addEventListener("input", sync);
      });
      sync();
    }

    /* artwork re-reads the theme on its next frame, so nothing else to do here */
    document.addEventListener("sh:theme", function () {
      if (hero) hero.draw(hero.t);
      fields.forEach(function (f) { f.draw(f.t); });
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
