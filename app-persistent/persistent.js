(function(){
  "use strict";
  var tracks=SH.tracks||[], current=0, audio=null, playing=false, duration=0, handoffTimer=null;
  var favoriteKey="sh-favorites-v1", offlineKey="sh-offline-tracks-v1", favorites=readFavorites(), offlineTracks=readList(offlineKey), fields=[];
  var byId=function(id){return document.getElementById(id);};

  function readList(key){try{return JSON.parse(localStorage.getItem(key)||"[]");}catch(e){return [];}}
  function readFavorites(){return readList(favoriteKey);}
  function saveFavorites(){try{localStorage.setItem(favoriteKey,JSON.stringify(favorites));}catch(e){}}
  function titleFromPath(path){return decodeURIComponent((path||"").split("/").pop()||"Untitled atmosphere").replace(/\.[^.]+$/,"").replace(/[_]+/g," ").replace(/\s*-\s*(short\s*format|full\s*format)\s*$/i,"").replace(/\s{2,}/g," ").trim();}
  function fmt(seconds){seconds=isFinite(seconds)?Math.max(0,seconds):0;var h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=Math.floor(seconds%60);return h?h+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"):m+":"+String(s).padStart(2,"0");}
  function trackTitle(track){return titleFromPath(track.main);}
  function isFavorite(){return tracks[current]&&favorites.indexOf(tracks[current].id)>=0;}
  function setIcon(el,name){if(el)el.innerHTML=SH.icon(name);}

  function showView(name){
    if(!document.querySelector('[data-view="'+name+'"]'))name="player";
    document.querySelectorAll("[data-view]").forEach(function(view){view.classList.toggle("is-active",view.getAttribute("data-view")===name);});
    document.querySelectorAll(".rail [data-view-target]").forEach(function(button){var active=button.getAttribute("data-view-target")===name;button.setAttribute("aria-current",active?"true":"false");});
    location.hash=name;document.title=(name==="player"?trackTitle(tracks[current]||{}):name.charAt(0).toUpperCase()+name.slice(1))+" — SolHarmonic";
    if(name==="favorites")renderFavorites();
  }

  function syncFavoriteButtons(){
    var on=isFavorite();document.querySelectorAll(".favorite-toggle").forEach(function(button){button.setAttribute("aria-pressed",String(on));button.setAttribute("aria-label",on?"Remove from favorites":"Add to favorites");setIcon(button,"heart");});
    document.querySelectorAll(".card-favorite").forEach(function(button){var onCard=favorites.indexOf(button.getAttribute("data-track-id"))>=0;button.setAttribute("aria-pressed",String(onCard));button.setAttribute("aria-label",onCard?"Remove from favorites":"Add to favorites");});
  }
  function toggleFavorite(id){var at=favorites.indexOf(id);if(at>=0)favorites.splice(at,1);else favorites.push(id);saveFavorites();syncFavoriteButtons();renderFavorites();}

  function setUtilityStatus(message){byId("utility-status").textContent=message||"";}
  function isDownloaded(){return tracks[current]&&offlineTracks.indexOf(tracks[current].id)>=0;}
  function syncDownload(){var button=byId("full-download"),on=isDownloaded();button.setAttribute("aria-pressed",String(on));button.setAttribute("aria-label",on?"Available offline":"Download for offline listening");button.innerHTML=on?'<span class="download-check" aria-hidden="true">✓</span>':SH.icon("download");if(on)setUtilityStatus("Available offline");}
  function downloadCurrent(){
    var track=tracks[current],button=byId("full-download");if(!track||isDownloaded())return;button.classList.add("is-downloading");setUtilityStatus("Downloading atmosphere…");
    var caching=("caches" in window&&location.protocol!=="file:")?caches.open("solharmonic-offline-audio-v1").then(function(cache){return fetch(track.main).then(function(response){if(!response.ok)throw new Error("download failed");return cache.put(track.main,response.clone());});}):Promise.resolve();
    caching.then(function(){if(offlineTracks.indexOf(track.id)<0)offlineTracks.push(track.id);try{localStorage.setItem(offlineKey,JSON.stringify(offlineTracks));}catch(e){}button.classList.remove("is-downloading");syncDownload();}).catch(function(){button.classList.remove("is-downloading");setUtilityStatus("Download could not finish · try again");});
  }

  function syncPlay(){setIcon(byId("full-play"),playing?"pause":"play");setIcon(byId("mini-play"),playing?"pause":"play");byId("full-play").setAttribute("aria-label",playing?"Pause":"Play");byId("mini-play").setAttribute("aria-label",playing?"Pause":"Play");byId("mini-status").textContent=playing?"Waiting room · playing":"Waiting room · paused";}
  function updateJourney(forceComplete){
    var elapsed=audio?audio.currentTime:0,pct=forceComplete?1:(duration?Math.max(0,Math.min(1,elapsed/duration)):0),x=8+pct*84,y=68-Math.sin(pct*Math.PI)*40,currentId=tracks[current]&&tracks[current].id;
    document.querySelectorAll("[data-track-card-id]").forEach(function(card){
      var active=card.getAttribute("data-track-card-id")===currentId;
      card.classList.toggle("is-current",active);card.style.setProperty("--journey-x",x+"%");card.style.setProperty("--journey-y",y+"%");
      var state=card.querySelector(".journey-state");if(state)state.textContent=active?(playing?"Playing · day passage":"Current · ready"):"Continuous composition";
    });
  }
  function syncProgress(){var elapsed=audio?audio.currentTime:0,pct=duration?elapsed/duration*100:0;byId("full-elapsed").textContent=fmt(elapsed);byId("full-total").textContent=fmt(duration);byId("full-progress-fill").style.width=pct+"%";byId("mini-progress-fill").style.width=pct+"%";updateJourney(false);}
  function loadTrack(index,autoplay){
    if(!tracks.length)return;if(handoffTimer){clearTimeout(handoffTimer);handoffTimer=null;}if(audio)audio.pause();current=(index+tracks.length)%tracks.length;var track=tracks[current],title=trackTitle(track);audio=new Audio(track.main);duration=0;playing=false;
    byId("now-title").textContent=title;byId("mini-title").textContent=title;document.querySelectorAll("[data-current-title]").forEach(function(el){el.textContent=title;});
    audio.volume=Number(byId("full-volume").value)/100;audio.addEventListener("loadedmetadata",function(){duration=audio.duration||0;byId("track-kind").textContent=duration>=3600?(Math.round(duration/360)/10)+" hour composition":Math.ceil(duration/60)+" minute composition";syncProgress();});audio.addEventListener("timeupdate",syncProgress);audio.addEventListener("ended",function(){playing=false;syncPlay();updateJourney(true);document.querySelectorAll('.track-card.is-current').forEach(function(card){card.classList.add('is-handing-off');});handoffTimer=setTimeout(function(){document.querySelectorAll('.track-card.is-handing-off').forEach(function(card){card.classList.remove('is-handing-off');});loadTrack(current+1,true);},700);});
    fields.forEach(function(field,i){field.set({amp:48+current*8,warm:.42+current*.18,tex:48+current*8,bright:38+current*8,disc:current%2===0});});syncFavoriteButtons();syncDownload();syncPlay();syncProgress();if(autoplay)playAudio();
  }
  function playAudio(){if(!audio)return;if(playing){audio.pause();playing=false;syncPlay();updateJourney(false);return;}audio.play().then(function(){playing=true;syncPlay();updateJourney(false);}).catch(function(){playing=false;syncPlay();updateJourney(false);});}

  function cardMarkup(track,index){var on=favorites.indexOf(track.id)>=0;return '<article class="track-card" data-track-card-id="'+track.id+'"><button class="track-card-button" data-play-index="'+index+'"><span class="track-art"><canvas></canvas><span class="celestial-orbit" aria-hidden="true"><i></i></span></span><span class="track-meta"><b>'+trackTitle(track)+'</b><small><i class="journey-dot"></i><span class="journey-state">Continuous composition</span></small></span></button><button class="card-favorite" data-track-id="'+track.id+'" aria-pressed="'+on+'" aria-label="'+(on?'Remove from favorites':'Add to favorites')+'">'+SH.icon("heart")+'</button></article>';}
  function wireGrid(grid){
    grid.querySelectorAll("[data-play-index]").forEach(function(button){button.addEventListener("click",function(){loadTrack(Number(button.getAttribute("data-play-index")),playing);showView("player");});});
    grid.querySelectorAll(".card-favorite").forEach(function(button){button.addEventListener("click",function(){toggleFavorite(button.getAttribute("data-track-id"));});});
    grid.querySelectorAll("canvas").forEach(function(canvas,i){var f=new SH.WaveField(canvas,{amp:34+i*7,warm:.4+i*.2,tex:40+i*12,bright:44,disc:false,small:true,speed:.14});f.start();});updateJourney(false);
  }
  function renderLibrary(){var grid=byId("library-grid");grid.innerHTML=tracks.map(cardMarkup).join("");wireGrid(grid);}
  function renderFavorites(){var grid=byId("favorites-grid"),saved=tracks.filter(function(track){return favorites.indexOf(track.id)>=0;});grid.innerHTML=saved.map(function(track){return cardMarkup(track,tracks.indexOf(track));}).join("");byId("favorites-empty").classList.toggle("is-visible",saved.length===0);if(saved.length)wireGrid(grid);}

  document.addEventListener("DOMContentLoaded",function(){
    if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register("service-worker.js").catch(function(){});
    SH.mountIcons();var mainField=new SH.WaveField(byId("full-cover"),{amp:58,warm:.58,tex:58,bright:42,disc:true,discR:.11}),miniField=new SH.WaveField(byId("mini-cover"),{amp:48,warm:.58,tex:58,bright:42,disc:true,small:true,speed:.14});mainField.start();miniField.start();fields=[mainField,miniField];
    setIcon(byId("full-prev"),"prev");setIcon(byId("full-next"),"next");setIcon(byId("mini-prev"),"prev");setIcon(byId("mini-next"),"next");setIcon(byId("full-mix"),"mix");setIcon(byId("full-share"),"share");setIcon(byId("full-download"),"download");setIcon(byId("full-expand"),"expand");
    document.querySelectorAll("[data-view-target]").forEach(function(button){button.addEventListener("click",function(){showView(button.getAttribute("data-view-target"));});});
    byId("full-play").addEventListener("click",playAudio);byId("mini-play").addEventListener("click",playAudio);byId("full-prev").addEventListener("click",function(){loadTrack(current-1,playing);});byId("mini-prev").addEventListener("click",function(){loadTrack(current-1,playing);});byId("full-next").addEventListener("click",function(){loadTrack(current+1,playing);});byId("mini-next").addEventListener("click",function(){loadTrack(current+1,playing);});
    document.querySelectorAll(".favorite-toggle").forEach(function(button){button.addEventListener("click",function(){if(tracks[current])toggleFavorite(tracks[current].id);});});
    byId("full-mix").addEventListener("click",function(){var panel=byId("quick-mix"),open=panel.hidden;panel.hidden=!open;this.setAttribute("aria-expanded",String(open));setUtilityStatus(open?"Choose how present the atmosphere feels":"");});
    byId("quick-mix").querySelectorAll("button").forEach(function(button){button.addEventListener("click",function(){byId("quick-mix").querySelectorAll("button").forEach(function(item){item.classList.toggle("is-active",item===button);});setUtilityStatus(button.textContent+" room mode active");});});
    byId("full-share").addEventListener("click",function(){var title=trackTitle(tracks[current]||{}),url=location.href.split("#")[0]+"#player";if(navigator.share){navigator.share({title:title+" — SolHarmonic",text:"Listen to "+title+" on SolHarmonic",url:url}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){setUtilityStatus("Player link copied");});}else setUtilityStatus("Share link ready");});
    byId("full-download").addEventListener("click",downloadCurrent);
    byId("full-expand").addEventListener("click",function(){if(!document.fullscreenElement&&document.documentElement.requestFullscreen){document.documentElement.requestFullscreen();setUtilityStatus("Fullscreen player");}else if(document.exitFullscreen){document.exitFullscreen();setUtilityStatus("");}});
    function volume(value){byId("full-volume").value=value;byId("mini-volume").value=value;if(audio)audio.volume=Number(value)/100;}byId("full-volume").addEventListener("input",function(){volume(this.value);});byId("mini-volume").addEventListener("input",function(){volume(this.value);});
    byId("full-seek").addEventListener("click",function(event){if(!audio||!duration)return;var bounds=this.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width))*duration;syncProgress();});
    renderLibrary();renderFavorites();loadTrack(0,false);showView(location.hash.slice(1)||"player");
  });
}());
