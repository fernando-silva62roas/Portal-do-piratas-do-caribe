(function(){
 var b=document.getElementById('arBtn'),done=false,loaded=false,waiting=false;
 var files=['js/three.min.js','js/ar3d.js'];
 function load(){
  if(done)return;done=true;
  files.forEach(function(f,i){var t=document.createElement('script');t.src=f;t.async=false;
   if(i===files.length-1)t.onload=function(){loaded=true;if(waiting){waiting=false;b.removeEventListener('click',first,true);b.click()}};
   document.body.appendChild(t)});
 }
 function first(e){if(loaded)return;e.stopImmediatePropagation();waiting=true;load()}
 b.addEventListener('click',first,true);
 ['pointerenter','touchstart','focus'].forEach(function(ev){[b,document.getElementById('heroAr'),document.getElementById('endAr')].forEach(function(el){el&&el.addEventListener(ev,load,{once:true,passive:true})})});
})();
