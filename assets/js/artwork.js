/* ============================================================
   SolHarmonic — generative visual language

   A field of fine flowing lines with an optional solar or lunar disc.
   Every image in the product comes from this one function; changing
   five numbers gives a different image in the same family.

   Parameters map directly onto the Atmosphere Mix:
     depth      -> amp          wave height
     warmth     -> warm         Ocean -> Solar Gold (or Deep Ocean -> Silver)
     texture    -> tex          line count and frequency
     brightness -> bright       opacity and disc size
   ============================================================ */
(function (root) {
  "use strict";

  var THEMES = {
    solar: { ground:["#FFFDF8","#F1ECE1"], cool:[0x6D,0x8F,0xA8], warm:[0xC8,0xA4,0x6A],
             disc:"#F6A623", halo:false, cap:1 },
    lunar: { ground:["#111A28","#0B111C"], cool:[0x2E,0x4A,0x63], warm:[0xA8,0xBD,0xD4],
             disc:"#D9E4F0", halo:true,  cap:0.72 }   /* ceiling luminance cap */
  };

  function theme() {
    return document.body.classList.contains("lunar") ? THEMES.lunar : THEMES.solar;
  }
  function mixHex(a, b, t) {
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function WaveField(canvas, opts) {
    this.cv = canvas;
    this.o = Object.assign({
      amp: 54, warm: 0.7, tex: 42, bright: 40,
      disc: true, discX: 0.72, discY: 0.28, discR: 0.115,
      variant: "horizon", small: false, speed: 0.22
    }, opts || {});
    this.t = 0; this.raf = null; this.t0 = null;
  }

  WaveField.prototype.set = function (patch) { Object.assign(this.o, patch); this.draw(this.t); };

  WaveField.prototype._fit = function () {
    var r = this.cv.getBoundingClientRect(),
        d = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width  = Math.max(1, Math.round(r.width  * d));
    this.cv.height = Math.max(1, Math.round(r.height * d));
    var ctx = this.cv.getContext("2d");
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  };

  WaveField.prototype.draw = function (t) {
    var f = this._fit(), ctx = f.ctx, w = f.w, h = f.h, T = theme(), o = this.o;
    if (w < 2 || h < 2) return;

    var g = ctx.createLinearGradient(0, 0, w * 0.4, h);
    g.addColorStop(0, T.ground[0]); g.addColorStop(1, T.ground[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    /* --- the disc: one per composition, or none --- */
    if (o.disc) {
      var dr = Math.min(w, h) * o.discR * (0.7 + o.bright * 0.006),
          dx = w * o.discX, dy = h * o.discY;
      if (T.halo) {
        /* halo is a fixed 1.6x the disc radius, 30% at the edge, falling to zero */
        var rg = ctx.createRadialGradient(dx, dy, dr * 0.6, dx, dy, dr * 2.6);
        rg.addColorStop(0, "rgba(217,228,240," + (0.28 * T.cap) + ")");
        rg.addColorStop(1, "rgba(217,228,240,0)");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(dx, dy, dr * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = (0.55 + o.bright * 0.0045) * T.cap;
      ctx.fillStyle = T.disc;
      ctx.beginPath(); ctx.arc(dx, dy, dr, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* --- the field --- */
    var n = o.small ? 12 : Math.round(14 + o.tex * 0.5),
        col = mixHex(T.cool, T.warm, o.warm),
        i, u, base, a, k, x, q, e, y;

    for (i = 0; i < n; i++) {
      u = i / (n - 1);
      base = h * (0.28 + 0.62 * u);
      a = (o.small ? o.amp * 0.30 : o.amp * 0.62) * (0.35 + 0.65 * Math.sin(Math.PI * u));
      k = (0.9 + o.tex * 0.02) * (1 + 0.28 * u);
      ctx.beginPath();
      for (x = 0; x <= w; x += 3) {
        q = x / w;
        e = Math.sin(Math.PI * q);          /* enveloped so lines resolve flat at both edges */
        y = base + a * e * Math.sin(k * q * Math.PI * 2 + t * 0.5 + u * 3.1)
                 + a * 0.28 * e * Math.sin(k * 1.9 * q * Math.PI * 2 - t * 0.33 + u * 1.7);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = (0.22 + 0.60 * Math.sin(Math.PI * u)) *
                        (0.45 + o.bright * 0.0075) * T.cap;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    this.t = t;
  };

  /* Drift is deliberately slow: a full phase cycle runs about three minutes.
     On a waiting-room screen anything faster pulls attention instead of
     releasing it. */
  WaveField.prototype.start = function () {
    var self = this;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.draw(2.2); return;
    }
    if (this.raf) return;
    (function loop(ts) {
      if (self.t0 === null || self.t0 === undefined) self.t0 = ts;
      self.draw((ts - self.t0) / 1000 * self.o.speed);
      self.raf = requestAnimationFrame(loop);
    })(performance.now());
  };
  WaveField.prototype.stop = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
  };

  root.SH = root.SH || {};
  root.SH.WaveField = WaveField;
  root.SH.artThemes = THEMES;
})(window);
