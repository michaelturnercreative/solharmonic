(function(){
  "use strict";
  var list=SH.data.ATMOSPHERES, tracks=SH.tracks||[], index=0, audio=null, playing=false, field;
  var title=document.getElementById("preview-title"), status=document.getElementById("preview-status"), play=document.getElementById("preview-play");
  function icon(el,name){el.innerHTML=SH.icon(name);}
  function findStart(){var id=location.hash.slice(1), found=list.findIndex(function(a){return a.id===id;});return found<0?0:found;}
  function load(next){
    if(audio){audio.pause();audio=null;} playing=false;index=(next+list.length)%list.length;
    var item=list[index], track=tracks.find(function(t){return t.id===item.id;})||tracks[index%Math.max(tracks.length,1)];
    title.textContent=item.name;status.textContent=track?"Ready to play · visitor sample":"Preview artwork · audio coming soon";location.hash=item.id;
    if(track){audio=new Audio(track.main);audio.addEventListener("ended",function(){playing=false;sync();});audio.addEventListener("timeupdate",function(){status.textContent="Playing sample · "+Math.floor(audio.currentTime/60)+":"+String(Math.floor(audio.currentTime%60)).padStart(2,"0");});}
    if(field)field.set({amp:42+index*4,warm:item.warm,tex:34+index*5,bright:44,disc:index%3===0});sync();
  }
  function sync(){icon(play,playing?"pause":"play");play.setAttribute("aria-label",playing?"Pause sample":"Play sample");}
  document.addEventListener("DOMContentLoaded",function(){
    SH.mountIcons();field=new SH.WaveField(document.getElementById("preview-canvas"),{amp:50,warm:.58,tex:55,bright:44,disc:true,discR:.11});field.start();
    icon(document.getElementById("preview-prev"),"prev");icon(document.getElementById("preview-next"),"next");
    document.getElementById("preview-prev").addEventListener("click",function(){load(index-1);});document.getElementById("preview-next").addEventListener("click",function(){load(index+1);});
    play.addEventListener("click",function(){if(!audio)return;if(playing){audio.pause();playing=false;sync();}else{audio.play().then(function(){playing=true;sync();});}});load(findStart());
  });
}());
