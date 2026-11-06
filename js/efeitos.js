(function(){
const c=document.getElementById('sea'),g=c.getContext('2d'),ov=document.getElementById('ar3d');
let w=0,h=0,t=0,last=0,raf=0;const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){const d=1;w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;g.setTransform(d,0,0,d,0,0);draw()}
function draw(){
 g.clearRect(0,0,w,h);
 const sp=58,off=-((scrollY*.3)%sp),rows=Math.ceil(h/sp)+2;
 g.lineWidth=2;
 for(let i=-1;i<rows;i++){
  const y0=i*sp+off,ph=i*1.7+Math.floor((scrollY*.3)/sp)*1.7,a=.035+.05*((i*7+3)%5)/4;
  g.beginPath();
  for(let x=0;x<=w+16;x+=16){const y=y0+Math.sin(x*.011+t*.7+ph)*7+Math.sin(x*.026-t*.5+ph*1.3)*3;x?g.lineTo(x,y):g.moveTo(x,y)}
  g.strokeStyle='rgba(185,232,255,'+a.toFixed(3)+')';g.stroke();
 }
}
let acc=0;
function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000||.016);last=now;if(ov&&ov.classList.contains('show'))return;acc+=dt;if(acc<1/30)return;t+=acc;acc=0;draw()}
size();addEventListener('resize',size);
if(reduce)addEventListener('scroll',draw,{passive:true});else raf=requestAnimationFrame(loop);
})();

/* hero video: pausa fora da tela e respeita movimento reduzido */
(function(){const v=document.getElementById('heroVideo');if(!v)return;
 const rm=matchMedia('(prefers-reduced-motion: reduce)');
 const play=()=>{if(!rm.matches){const p=v.play();if(p&&p.catch)p.catch(()=>{})}};
 if(rm.matches)v.pause();
 if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?play():v.pause()),{threshold:.1}).observe(v);
 rm.addEventListener&&rm.addEventListener('change',()=>rm.matches?v.pause():play());
})();
