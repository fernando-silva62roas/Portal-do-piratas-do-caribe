(function(){
 var b=document.getElementById('gameBtn'),done=false,want=false;
 function load(){if(done)return;done=true;var t=document.createElement('script');t.src='js/game.js';t.onload=function(){if(want&&window.PirateGame)window.PirateGame.open();want=false};document.body.appendChild(t)}
 b.addEventListener('click',function(){if(window.PirateGame){window.PirateGame.open();return}want=true;load()});
 ['pointerenter','touchstart','focus'].forEach(function(ev){b.addEventListener(ev,load,{once:true,passive:true})});
 var ab=document.getElementById('arBtn'),tk=0;
 function sync(){tk=0;if(innerWidth<=640){b.style.opacity=ab.style.opacity;b.style.pointerEvents=ab.style.pointerEvents}else{b.style.opacity='';b.style.pointerEvents=''}}
 function q(){if(!tk)tk=requestAnimationFrame(sync)}
 addEventListener('scroll',q,{passive:true});addEventListener('resize',q);addEventListener('load',function(){setTimeout(sync,300)});
})();
