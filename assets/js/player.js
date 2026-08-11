/* ============================================================
   SolHarmonic — recorded-audio player
   ============================================================ */
(function () {
  "use strict";

  var MODES = SH.data.MODES;
  var mode = 3, idx = 0, playing = false, mixer, cover, thumb, duration = 0;
  var $ = function (id) { return document.getElementById(id); };

  function fmt(seconds) {
    seconds = isFinite(seconds) ? Math.max(0, seconds) : 0;
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = Math.floor(seconds % 60);
    return h ? h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
             : m + ":" + String(s).padStart(2, "0");
  }

  function titleFromPath(path) {
    var file = decodeURIComponent(path.split("/").pop() || "Untitled track");
    return file
      .replace(/\.[^.]+$/, "")
      .replace(/[_]+/g, " ")
      .replace(/\s*-\s*(short\s*format|full\s*format)\s*$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function durationLabel(seconds) {
    if (!seconds) return "Audio track";
    if (seconds >= 3600) {
      var hours = seconds / 3600;
      return (Math.round(hours * 10) / 10) + " hour track";
    }
    return Math.ceil(seconds / 60) + " minute track";
  }

  function setIcon(id, name, width) {
    var el = $(id); if (el) el.innerHTML = SH.icon(name, width);
  }

  function updateProgress() {
    var elapsed = mixer.currentTime();
    var pct = duration ? elapsed / duration * 100 : 0;
    $("elapsed").textContent = fmt(elapsed);
    $("fill").style.width = pct + "%";
    $("knob").style.left = pct + "%";
  }

  function setPlaying(on) {
    if (on) {
      mixer.play().then(function () {
        playing = true;
        updatePlayIcons();
      }).catch(function (error) {
        playing = false;
        updatePlayIcons();
        console.error("[SolHarmonic] Could not play audio", error);
      });
    } else {
      playing = false;
      mixer.pause();
      updatePlayIcons();
    }
  }

  function updatePlayIcons() {
    setIcon("play", playing ? "pause" : "play", 1.6);
    setIcon("play-mini", playing ? "pause" : "play");
    $("play").setAttribute("aria-label", playing ? "Pause" : "Play");
    $("play-mini").setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function configureLayers() {
    [].forEach.call(document.querySelectorAll("[data-layer]"), function (input) {
      var name = input.getAttribute("data-layer");
      var available = mixer.hasLayer(name);
      var value = $(input.id + "V");
      input.disabled = !available;
      value.textContent = available ? input.value + "%" : "Not added";
    });
  }

  function loadTrack(nextIndex, autoplay) {
    if (mixer) mixer.pause();
    idx = (nextIndex + SH.tracks.length) % SH.tracks.length;
    var track = SH.tracks[idx];
    mixer = new SH.RecordedMixer(track);
    duration = 0;
    playing = false;

    var title = titleFromPath(track.main);
    $("title").textContent = title;
    $("mini-title").textContent = title;
    $("mix-title").textContent = title;
    $("duration").textContent = "Loading audio…";
    $("total").textContent = "0:00";
    $("mini-sub").textContent = MODES[mode].label + " · audio track";
    document.title = title + " — SolHarmonic Player";
    location.hash = track.id;
    updateProgress();
    updatePlayIcons();
    configureLayers();

    function refreshMetadata() {
      duration = mixer.duration();
      $("duration").textContent = durationLabel(duration);
      $("total").textContent = fmt(duration);
      $("mini-sub").textContent = MODES[mode].label + " · " + durationLabel(duration).replace(" track", "");
    }
    mixer.on("loadedmetadata", refreshMetadata);
    mixer.on("timeupdate", updateProgress);
    mixer.onended = function () { playing = false; updatePlayIcons(); updateProgress(); };
    if (mixer.audio.main.readyState >= 1) refreshMetadata();
    if (autoplay) setPlaying(true);
  }

  function boot() {
    SH.mountIcons();
    if (!SH.tracks || !SH.tracks.length || !SH.tracks[0].main) {
      $("title").textContent = "No track configured";
      $("duration").textContent = "Add a main audio file";
      return;
    }

    cover = new SH.WaveField($("cover"), { amp: 72, warm: 0.58, tex: 64, bright: 34 });
    thumb = new SH.WaveField($("thumb"), { small: true, speed: 0.16, discR: 0.14 });
    cover.start(); thumb.start();

    var host = $("modes");
    MODES.forEach(function (m, i) {
      var button = document.createElement("button");
      button.className = "mode-tile";
      button.setAttribute("aria-pressed", String(i === mode));
      button.innerHTML = '<span data-icon="' + m.icon + '"></span><span>' + m.label + "</span>";
      button.addEventListener("click", function () {
        mode = i;
        [].forEach.call(host.children, function (child, j) {
          child.setAttribute("aria-pressed", String(j === i));
        });
        $("eyebrow").textContent = "Now playing · " + m.label;
        $("mini-sub").textContent = m.label + " · " + durationLabel(duration).replace(" track", "");
        if (m.id === "sleep") SH.theme.apply(true);
      });
      host.appendChild(button);
    });
    SH.mountIcons(host);

    setIcon("prev", "prev"); setIcon("next", "next");
    setIcon("fav", "heart"); setIcon("share", "share");
    setIcon("download", "download"); setIcon("expand", "expand");
    setIcon("prev-mini", "prev"); setIcon("next-mini", "next");
    setIcon("vol-icon", "volume"); setIcon("cast", "screen");
    updatePlayIcons();

    ["play", "play-mini"].forEach(function (id) {
      $(id).addEventListener("click", function () { setPlaying(!playing); });
    });
    $("prev").addEventListener("click", function () { loadTrack(idx - 1, playing); });
    $("next").addEventListener("click", function () { loadTrack(idx + 1, playing); });
    $("prev-mini").addEventListener("click", function () { loadTrack(idx - 1, playing); });
    $("next-mini").addEventListener("click", function () { loadTrack(idx + 1, playing); });

    $("fav").addEventListener("click", function (event) {
      var on = event.currentTarget.getAttribute("aria-pressed") !== "true";
      event.currentTarget.setAttribute("aria-pressed", String(on));
    });

    $("track").addEventListener("click", function (event) {
      if (!duration) return;
      var bounds = event.currentTarget.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      mixer.seek(pct * duration);
      updateProgress();
    });

    $("volume").addEventListener("input", function () {
      mixer.setMasterVolume($("volume").value / 100);
    });
    [].forEach.call(document.querySelectorAll("[data-layer]"), function (input) {
      input.addEventListener("input", function () {
        var name = input.getAttribute("data-layer");
        mixer.setLayerVolume(name, input.value / 100);
        $(input.id + "V").textContent = input.value + "%";
      });
    });

    function ceiling(on) { document.body.classList.toggle("ceiling", on); }
    $("expand").addEventListener("click", function () { ceiling(true); });
    $("ceiling-exit").addEventListener("click", function () { ceiling(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") ceiling(false);
      if (event.key === " " && event.target === document.body) {
        event.preventDefault(); setPlaying(!playing);
      }
    });

    document.addEventListener("sh:theme", function () { cover.draw(cover.t); thumb.draw(thumb.t); });
    window.addEventListener("resize", function () { cover.draw(cover.t); thumb.draw(thumb.t); });

    var requested = location.hash.replace("#", "");
    var requestedIndex = SH.tracks.findIndex(function (track) { return track.id === requested; });
    loadTrack(requestedIndex >= 0 ? requestedIndex : 0, false);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
