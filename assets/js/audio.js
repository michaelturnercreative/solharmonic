/* ============================================================
   SolHarmonic — synchronized recorded-audio mixer
   ============================================================ */
(function (root) {
  "use strict";

  function RecordedMixer(track) {
    this.track = track;
    this.master = 0.58;
    this.volumes = { main: 1, nature: 0.7, emotion: 0.7, support: 0.7, body: 0.7, mind: 0.7 };
    this.audio = {};
    this.ready = false;
    this.build();
  }

  RecordedMixer.prototype.build = function () {
    var self = this;
    var sources = Object.assign({ main: this.track.main }, this.track.layers || {});
    Object.keys(sources).forEach(function (name) {
      if (!sources[name]) return;
      var el = new Audio(sources[name]);
      el.preload = "metadata";
      el.loop = false;
      el.addEventListener("ended", function () {
        if (name === "main" && self.onended) self.onended();
      });
      self.audio[name] = el;
    });
    this.ready = Boolean(this.audio.main);
    this.applyVolumes();
  };

  RecordedMixer.prototype.applyVolumes = function () {
    var self = this;
    Object.keys(this.audio).forEach(function (name) {
      self.audio[name].volume = Math.min(1, self.master * self.volumes[name]);
    });
  };

  RecordedMixer.prototype.play = function () {
    var self = this, main = this.audio.main;
    if (!main) return Promise.reject(new Error("No main audio file configured"));
    var start = main.currentTime;
    Object.keys(this.audio).forEach(function (name) {
      if (name !== "main") self.audio[name].currentTime = start;
    });
    return Promise.all(Object.keys(this.audio).map(function (name) {
      return self.audio[name].play();
    }));
  };

  RecordedMixer.prototype.pause = function () {
    Object.keys(this.audio).forEach(function (name) { this.audio[name].pause(); }, this);
  };

  RecordedMixer.prototype.seek = function (seconds) {
    Object.keys(this.audio).forEach(function (name) {
      var el = this.audio[name];
      el.currentTime = Math.min(seconds, isFinite(el.duration) ? el.duration : seconds);
    }, this);
  };

  RecordedMixer.prototype.setMasterVolume = function (value) {
    this.master = value;
    this.applyVolumes();
  };

  RecordedMixer.prototype.setLayerVolume = function (name, value) {
    this.volumes[name] = value;
    this.applyVolumes();
  };

  RecordedMixer.prototype.hasLayer = function (name) { return Boolean(this.audio[name]); };
  RecordedMixer.prototype.currentTime = function () { return this.audio.main ? this.audio.main.currentTime : 0; };
  RecordedMixer.prototype.duration = function () { return this.audio.main ? this.audio.main.duration : 0; };
  RecordedMixer.prototype.on = function (event, fn) {
    if (this.audio.main) this.audio.main.addEventListener(event, fn);
  };

  root.SH = root.SH || {};
  root.SH.RecordedMixer = RecordedMixer;
})(window);
