(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
var root=$('pgame'),cv=$('pgCv'),ctx=cv.getContext('2d'),scr=$('pgScreen'),muteBtn=$('pgMute');
var W=960,H=544,T=32,ROWS=17,N=216,WATER=15*T;
var FONT=getComputedStyle(document.body).fontFamily||'sans-serif';
var sheet=new Image();sheet.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAABiCAMAAACBDF3LAAABIFBMVEXgnGfq06qabFiyi2fTYDFkZGipnpDw6NjZYUnltI2fIxnIJyFcbYiVTxo6TGZjHCJHPULYiTN1RB/4xnYoLEA8QDx1goSAPkGDfYWntsEAAAAIBQcrJysWFBcsGBQ1NDZNNywsCAo0IxtMKBkaGyNvRi8zOUZNFhRqOCeNVzJMCQ1vFRVJKiRTRDiOFhgmHSOMSC0dIitMR0hvChFrV0nRdk+xJSeuGCSOChKpZzVzUzawdk1qNhqNNyqtGBo7RFCPaErQZ0nxpm3w2LLsmGiwaEjOh1JXMhuYZDb158qSGCLthlVvKSX99tJyZFOuVzTJJSfnd02sSTNHVWeQJiTPWDdZVE3Pqo6rOC5tJxiNWkawczrStpXzxpGQJBuVh3OB4vItAAAAYHRSTlP//////////////////////////////////wD///////////////////////////////////////////////////////////////////////////////////////////+TYTX8AAAfCUlEQVR42u1853rjyK4tFR069+x97r2uwCIpmqRE5WAr2ZIVnHPO7/8WByhStgJJ9ezvnj/nG850z3RbEKpWLaCAAorKxj/PhvIPBP+A8A8IfwwC+U++lcDzH0iQ//HpksCRRYCQoZQxfd9sOY6Qf8HYUiXlcqZcBBnTFFwq/QMZlVJORd50HFN+mP0JFjA0FSQOnJI3NvoHIiBDhYmPQEVE/wMQ1E1VFaZz0Hx+drzPi0RvyXx2d3fzeec50Y73BEHcNz0wIp7Nu0petHrtdnsEMiik60vZqcLQ8gftceK56bgSNLFMaGNXpWoL1PR6TzUOQ2O6sQQERtUyyPRa+bwQIp+XSBtKpPWADCDdAqQrPzd/5gVFTeb4OXJ51E38ftNENaIidJQ5GEXOhqlqGYZm5iuVfB5FcV1FPpJAQGsqFcn5VOTYyGSBQmaVAdRU8dQ+qFU28flZUeFvdSURoYlWKG09P8dbQpUydxVUZCq/oqhTqYh866DZM2FtgXqVPMocjKPoU1YB6167B0PbhZH9rJ0h6YQZBUJGlfbWyqOWzc3dyp2KC+RbnhK2QFS0WibOZxdVqQJMjxhKO2p9KDV7bVAkcQNt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';
var FW=52,FH=98;

/* ---------------- áudio ---------------- */
var ac=null,muted=false;
try{muted=localStorage.getItem('pgMute')==='1'}catch(e){}
function tone(f0,f1,d,type,v){
  if(muted||!ac)return;
  try{var t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+d);
  g.gain.setValueAtTime(v||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.03)}catch(e){}
}
function seq(a,step,type){a.forEach(function(f,i){setTimeout(function(){tone(f,f,step/1000*1.2,type||'triangle',.06)},i*step)})}
var sfx={
  jump:function(){tone(300,640,.14,'square',.04)},
  coin:function(){tone(988,988,.07,'square',.04);setTimeout(function(){tone(1319,1319,.12,'square',.04)},70)},
  stomp:function(){tone(260,70,.15,'square',.06)},
  hit:function(){tone(180,50,.3,'sawtooth',.07)},
  slash:function(){tone(900,260,.1,'sawtooth',.025)},
  boom:function(){tone(130,30,.4,'sawtooth',.08)},
  splash:function(){tone(520,90,.28,'sine',.06)},
  power:function(){seq([523,659,784,1047],80)},
  piece:function(){seq([659,784,988,1319],70)},
  check:function(){seq([523,784],90)},
  win:function(){seq([523,659,784,1047,784,1047,1319],120)},
  lose:function(){seq([392,330,262,196],150,'sawtooth')},
  fire:function(){tone(110,40,.18,'sawtooth',.05)}
};

/* ---------------- fase ---------------- */
var grid,contents,enemies,plats,cannons,cps,bumps,particles,pops,items;
var boss=null,bossDead=false,goal={x:209*T+12,y:6*T,w:10,h:8*T};
var totalCoins=0,totalPieces=5;
function buildLevel(){
  grid=[];for(var y=0;y<ROWS;y++){var r=[];for(var x=0;x<N;x++)r.push('.');grid.push(r)}
  contents={};enemies=[];plats=[];cannons=[];cps=[];bumps={};particles=[];pops=[];items=[];boss=null;bossDead=false;
  function put(x,y,c){if(x>=0&&x<N&&y>=0&&y<ROWS)grid[y][x]=c}
  function ground(a,b){for(var x=a;x<=b;x++)for(var y=14;y<ROWS;y++)put(x,y,'#')}
  function box(x,y,w,h,c){for(var i=0;i<w;i++)for(var j=0;j<h;j++)put(x+i,y+j,c||'B')}
  function coins(x,y,n){for(var i=0;i<n;i++)put(x+i,y,'o')}
  function arc(x,y,n,h){for(var i=0;i<n;i++)put(x+i,y-Math.round(Math.sin((i+.5)/n*Math.PI)*h),'o')}
  function crab(x){enemies.push({t:'crab',x:x*T,y:14*T-20,w:28,h:20,vx:-.7,vy:0,dead:0,anim:0,og:false})}
  function gull(cx,y,amp,sp){enemies.push({t:'gull',cx:cx*T,x:cx*T,y:y,by:y,w:30,h:18,amp:amp,vx:sp,ph:Math.random()*6,dead:0,anim:0})}
  function hplat(x0,x1,top,sp){plats.push({t:'h',x:x0,y:top,w:80,h:14,x0:x0,x1:x1,dir:1,sp:sp,dx:0,dy:0})}

  /* 1. Porto: aquecimento */
  ground(0,23);
  arc(7,10,5,2);
  put(11,10,'Q');put(12,10,'B');put(13,10,'Q');contents['13,10']='rum';put(14,10,'B');put(15,10,'Q');
  put(19,13,'B');box(22,12,1,2);
  /* primeiro vão */
  arc(24,12,3,2);
  /* 2. caranguejos e espinhos */
  ground(27,47);
  crab(33);crab(40);
  box(36,10,3,1);coins(36,9,3);
  put(44,13,'S');put(45,13,'S');arc(43,11,5,2);
  /* vão com plataforma móvel */
  hplat(48*T+8,50*T+8,13*T+8,.9);coins(49,10,2);
  /* 3. pirâmide de caixotes */
  ground(52,73);
  put(54,13,'B');box(55,12,1,2);box(56,11,5,3);box(61,12,1,2);put(62,13,'B');
  put(58,10,'M');coins(56,10,2);coins(60,10,1);
  crab(65);crab(69);gull(66,288,60,1.1);
  put(72,13,'C');
  /* 4. plataformas que caem */
  [76,81,86].forEach(function(x){plats.push({t:'f',x:x*T,y:13*T,w:96,h:14,st:0,tm:0,y0:13*T,vy:0,dx:0,dy:0})});
  coins(76,11,3);put(79,10,'M');coins(81,11,3);coins(86,11,3);gull(84,250,70,1.2);
  /* 5. canhões */
  ground(91,150);
  put(92,13,'C');put(121,13,'C');put(148,13,'C');
  put(103,13,'K');cannons.push({x:103,y:13,tm:60});
  put(112,13,'B');put(112,12,'K');cannons.push({x:112,y:12,tm:0});
  crab(97);crab(108);crab(118);
  coins(105,11,3);coins(114,10,3);
  /* elevador e muralha */
  plats.push({t:'v',x:125*T,y:14*T,w:96,h:14,y0:14*T,y1:9*T,dir:-1,sp:1,dx:0,dy:0});
  box(128,9,2,5);box(130,9,10,1);
  put(133,8,'S');put(134,8,'S');put(133,6,'o');put(134,6,'o');put(136,7,'o');put(138,8,'o');coins(131,8,1);
  put(133,5,'M');
  /* segredo embaixo da laje */
  put(134,13,'M');coins(131,13,2);coins(136,13,3);
  crab(145);
  /* 6. travessia de gaivotas */
  hplat(151*T+8,153*T+8,13*T,.9);
  hplat(155*T+8,157*T+8,12*T,1.0);
  hplat(160*T+8,162*T+8,13*T,.95);
  coins(152,10,2);coins(156,9,2);coins(161,10,2);
  gull(154,300,60,1.2);gull(158,250,70,1.0);gull(162,330,50,1.3);
  /* 7. última corrida */
  ground(164,215);
  put(165,13,'C');
  put(170,13,'S');put(171,13,'S');put(172,13,'S');arc(169,11,5,3);
  put(173,10,'Q');contents['173,10']='rum';put(174,10,'B');put(175,10,'Q');
  crab(176);crab(179);
  put(181,13,'K');cannons.push({x:181,y:13,tm:30});
  put(183,13,'C');
  /* 8. arena do Rei Caranguejo */
  box(190,11,4,1);put(191,10,'M');coins(190,10,1);coins(193,10,1);
  box(204,5,2,9,'G');
  boss={t:'boss',x:196*T,y:14*T-52,w:72,h:52,vx:0,vy:0,hp:3,inv:0,act:false,dead:0,anim:0,hop:100,face:-1};
  /* 9. farol */
  coins(206,12,3);

  /* contagem */
  totalCoins=0;
  for(var yy=0;yy<ROWS;yy++)for(var xx=0;xx<N;xx++){var c=grid[yy][xx];if(c==='o')totalCoins++;if(c==='C')cps.push({x:xx*T,y:(yy+1)*T,on:false})}
  grid.forEach(function(row,yy){row.forEach(function(c,xx){if(c==='Q'&&!contents[xx+','+yy])totalCoins++})});
}

/* ---------------- estado ---------------- */
var S={state:'title',tick:0,score:0,coins:0,pieces:0,lives:3,time:0,best:0,spawn:{x:3*T,y:14*T-50},dying:0,dyingType:'',winT:0,shake:0};
var P={x:0,y:0,w:22,h:50,vx:0,vy:0,face:1,onGround:false,coy:0,jbuf:0,riding:null,inv:0,atk:0,atkCd:0,anim:0,hp:3,jumping:false};
var cam={x:0};
var keys={left:false,right:false,jump:false,run:false,atk:false};
var jumpHeld=false,atkHeld=false;
try{S.best=+localStorage.getItem('pgBest')||0}catch(e){}

function resetPlayer(){
  P.x=S.spawn.x;P.y=S.spawn.y;P.vx=P.vy=0;P.face=1;P.onGround=false;P.coy=0;P.jbuf=0;P.riding=null;P.inv=90;P.atk=0;P.atkCd=0;P.hp=3;
  cam.x=Math.max(0,Math.min(N*T-W,P.x-W*.35));
  if(boss&&!bossDead){boss.x=196*T;boss.y=14*T-52;boss.hp=3;boss.inv=0;boss.act=false;boss.vx=0;boss.vy=0;boss.dead=0}
  plats.forEach(function(p){if(p.t==='f'){p.st=0;p.tm=0;p.y=p.y0;p.vy=0}});
  enemies=enemies.filter(function(e){return e.t!=='ball'});
}
function newGame(){
  buildLevel();
  S.score=0;S.coins=0;S.pieces=0;S.lives=3;S.time=0;S.tick=0;S.dying=0;S.winT=0;S.shake=0;
  S.spawn={x:3*T,y:14*T-50};
  resetPlayer();S.state='play';hideScreen();
  try{if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur()}catch(e){}
}

/* ---------------- tiles ---------------- */
function solidAt(tx,ty){
  if(tx<0||tx>=N)return true;if(ty<0||ty>=ROWS)return false;
  var c=grid[ty][tx];return c==='#'||c==='B'||c==='Q'||c==='U'||c==='K'||(c==='G'&&!bossDead);
}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function moveX(e,dx){
  e.x+=dx;var hit=false;
  var y0=Math.floor(e.y/T),y1=Math.floor((e.y+e.h-.01)/T),x0=Math.floor(e.x/T),x1=Math.floor((e.x+e.w-.01)/T);
  for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){
    if(solidAt(tx,ty)){if(dx>0)e.x=tx*T-e.w;else if(dx<0)e.x=(tx+1)*T;hit=true;e.vx=e.t?e.vx:0;x0=Math.floor(e.x/T);x1=Math.floor((e.x+e.w-.01)/T)}
  }
  return hit;
}
function moveY(e,dy,isP){
  e.y+=dy;e.onG=false;
  var y0=Math.floor(e.y/T),y1=Math.floor((e.y+e.h-.01)/T),x0=Math.floor(e.x/T),x1=Math.floor((e.x+e.w-.01)/T);
  var bumpTx=-1,bumpTy=-1,best=-1;
  for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){
    if(solidAt(tx,ty)){
      if(dy>0){e.y=ty*T-e.h;e.vy=0;e.onG=true}
      else if(dy<0){
        e.y=(ty+1)*T;e.vy=0;
        var ov=Math.min(e.x+e.w,(tx+1)*T)-Math.max(e.x,tx*T);if(ov>best){best=ov;bumpTx=tx;bumpTy=ty}
      }
      y0=Math.floor(e.y/T);y1=Math.floor((e.y+e.h-.01)/T);
    }
  }
  if(isP&&bumpTx>=0)bumpBlock(bumpTx,bumpTy);
}
function bumpBlock(tx,ty){
  var c=grid[ty][tx];if(c!=='Q')return;
  grid[ty][tx]='U';bumps[tx+','+ty]=10;
  var k=contents[tx+','+ty]||'coin';
  if(k==='rum'){items.push({t:'rum',x:tx*T+6,y:ty*T+2,w:20,h:28,rise:11});sfx.power()}
  else{S.coins++;S.score+=100;sfx.coin();pops.push({x:tx*T+16,y:ty*T-4,vy:-6,life:26})}
}
function spawnP(x,y,n,col,spd,life,g){
  for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(.3+Math.random())*(spd||2);
    particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(spd||2)*.4,life:life||30+Math.random()*10,max:life||40,col:col,g:g===undefined?.15:g,sz:2+Math.random()*3})}
}

/* ---------------- jogador ---------------- */
function hurt(kind){
  if(P.inv>0||S.state!=='play')return;
  P.hp--;P.inv=100;P.vy=-6.5;P.vx=-P.face*3.2;P.riding=null;sfx.hit();S.shake=10;
  spawnP(P.x+P.w/2,P.y+P.h/2,10,'#ff5a5a',3,26);
  if(P.hp<=0)die('hit');
}
function die(type){
  if(S.state!=='play')return;
  S.state='dying';S.dying=type==='water'?80:95;S.dyingType=type;S.lives--;
  if(type==='water'){sfx.splash();spawnP(P.x+P.w/2,WATER,16,'#bfe9ff',4,30,.25)}
  else{P.vy=-9.5;P.vx=0;sfx.lose()}
}
function collectTiles(){
  var x0=Math.floor(P.x/T),x1=Math.floor((P.x+P.w-.01)/T),y0=Math.floor(P.y/T),y1=Math.floor((P.y+P.h-.01)/T);
  for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){
    if(tx<0||tx>=N||ty<0||ty>=ROWS)continue;
    var c=grid[ty][tx];
    if(c==='o'){grid[ty][tx]='.';S.coins++;S.score+=100;sfx.coin();spawnP(tx*T+16,ty*T+16,6,'#ffd84a',2,20,.05)}
    else if(c==='M'){grid[ty][tx]='.';S.pieces++;S.score+=500;sfx.piece();spawnP(tx*T+16,ty*T+16,18,'#f7e2a8',3.5,40,.04)}
    else if(c==='S'){
      var r={x:tx*T+4,y:ty*T+14,w:24,h:18};if(overlap(P,r)){hurt('spike');if(S.state==='play'){P.vy=-8}}
    }
  }
  items=items.filter(function(it){
    if(overlap(P,it)){if(P.hp<3){P.hp++;sfx.power()}else{S.score+=200;sfx.coin()}spawnP(it.x+10,it.y+14,10,'#7fe08a',2.5,28,.05);return false}
    return true;
  });
  cps.forEach(function(c){if(!c.on&&P.x+P.w/2>c.x+8&&P.x<c.x+T+60&&P.y+P.h>c.y-T*3){
    cps.forEach(function(o){o.on=false});c.on=true;S.spawn={x:c.x+4,y:c.y-50};sfx.check();spawnP(c.x+16,c.y-60,14,'#ffffff',3,34,.05)}});
}
function updatePlayer(){
  var onG=P.onGround;
  if(onG)P.coy=7;else if(P.coy>0)P.coy--;
  if(keys.jump&&!jumpHeld)P.jbuf=7;else if(P.jbuf>0)P.jbuf--;
  jumpHeld=keys.jump;
  var dir=(keys.right?1:0)-(keys.left?1:0);
  var max=keys.run?5.4:3.7,acc=onG?.5:.32;
  if(dir){P.vx+=dir*acc;if(Math.abs(P.vx)>max)P.vx+=((dir*max)-P.vx)*.35;P.face=dir}
  else{P.vx*=onG?.78:.96;if(Math.abs(P.vx)<.1)P.vx=0}
  if(P.jbuf>0&&P.coy>0){P.vy=-10.6;P.jbuf=0;P.coy=0;P.onGround=false;P.riding=null;P.jumping=true;sfx.jump();spawnP(P.x+P.w/2,P.y+P.h,4,'#e8d3a0',1.2,16,.05)}
  var g=(P.vy<0&&keys.jump)?.38:.58;
  if(P.vy<0&&!keys.jump&&P.jumping&&P.vy<-4)P.vy=-4;
  P.vy=Math.min(12,P.vy+g);
  if(P.vy>0)P.jumping=false;
  /* espada */
  if(keys.atk&&!atkHeld&&P.atkCd<=0){P.atk=14;P.atkCd=22;sfx.slash()}
  atkHeld=keys.atk;if(P.atk>0)P.atk--;if(P.atkCd>0)P.atkCd--;
  /* plataforma que carrega */
  if(P.riding){P.x+=P.riding.dx;}
  moveX(P,P.vx);
  var prevBottom=P.y+P.h;
  moveY(P,P.vy,true);
  P.onGround=!!P.onG&&P.vy>=0?true:false;
  if(P.onG)P.vy=0;
  /* plataformas */
  var land=null;
  if(P.vy>=0||P.riding){
    for(var i=0;i<plats.length;i++){
      var p=plats[i];if(p.t==='f'&&p.st>=2)continue;
      if(P.x+P.w>p.x+4&&P.x<p.x+p.w-4){
        var pTopPrev=p.y-p.dy;
        if(prevBottom<=pTopPrev+8&&P.y+P.h>=p.y-1&&P.y+P.h<=p.y+p.h+Math.max(10,P.vy+Math.abs(p.dy)+2)){land=p;break}
      }
    }
  }
  if(land){P.y=land.y-P.h;P.vy=0;P.onGround=true;P.riding=land;if(land.t==='f'&&land.st===0){land.st=1;land.tm=34}}
  else if(!P.onGround)P.riding=null;
  else if(P.onGround&&!land)P.riding=null;
  if(P.inv>0)P.inv--;
  P.anim+=Math.abs(P.vx)*.06;
  /* mar */
  if(P.y+P.h>WATER+16)die('water');
  if(S.state==='play')collectTiles();
  /* meta */
  if(S.state==='play'&&overlap(P,goal)){S.state='win';S.winT=0;sfx.win();S.score+=Math.max(0,400-Math.floor(S.time/60))*10;S.score+=S.lives*300;if(S.pieces===5)S.score+=2000;
    try{if(S.score>S.best){S.best=S.score;localStorage.setItem('pgBest',String(S.best))}}catch(e){}
    spawnP(goal.x,goal.y+40,40,'#ffd84a',5,60,.08)}
}

/* ---------------- inimigos e plataformas ---------------- */
function updatePlats(){
  plats.forEach(function(p){
    var ox=p.x,oy=p.y;
    if(p.t==='h'){p.x+=p.dir*p.sp;if(p.x>=p.x1){p.x=p.x1;p.dir=-1}else if(p.x<=p.x0){p.x=p.x0;p.dir=1}}
    else if(p.t==='v'){p.y+=p.dir*p.sp;if(p.y<=p.y1){p.y=p.y1;p.dir=1}else if(p.y>=p.y0){p.y=p.y0;p.dir=-1}}
    else if(p.t==='f'){
      if(p.st===1){p.tm--;if(p.tm<=0){p.st=2;p.vy=0;p.tm=220}}
      else if(p.st===2){p.vy+=.5;p.y+=p.vy;p.tm--;if(p.tm<=0){p.st=0;p.y=p.y0;p.vy=0;p.tm=0}}
    }
    p.dx=p.x-ox;p.dy=p.y-oy;
  });
}
function stompOK(e){return P.vy>0.5&&(P.y+P.h-P.vy-1)<=e.y+10}
function slashBox(){return P.atk>0?{x:P.face>0?P.x+P.w-2:P.x-36,y:P.y+6,w:38,h:38}:null}
function kill(e,pts){
  e.dead=24;S.score+=pts||200;spawnP(e.x+e.w/2,e.y+e.h/2,10,e.t==='gull'?'#ffffff':'#ff7a45',3,24);
}
function updateEnemies(){
  var sb=slashBox();
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
    if(e.dead){e.dead--;if(e.dead<=0)enemies.splice(i,1);continue}
    if(Math.abs(e.x-P.x)>W+200&&e.t!=='ball'){continue}
    if(e.t==='crab'){
      e.anim+=.15;e.vy=Math.min(10,e.vy+.5);
      var hit=moveX(e,e.vx);
      var ahead=e.vx>0?e.x+e.w+2:e.x-2;
      if(hit||(e.onG&&!solidAt(Math.floor(ahead/T),Math.floor((e.y+e.h+4)/T))))e.vx=-e.vx;
      moveY(e,e.vy,false);if(e.onG)e.vy=0;
      if(e.y>H+50){enemies.splice(i,1);continue}
    }else if(e.t==='gull'){
      e.anim+=.2;e.ph+=.05;e.x+=e.vx;if(Math.abs(e.x-e.cx)>e.amp)e.vx=-e.vx;
      e.y=e.by+Math.sin(e.ph)*22;
    }else if(e.t==='ball'){
      e.x+=e.vx;e.y+=e.vy||0;
      if(solidAt(Math.floor((e.x+(e.vx<0?0:e.w))/T),Math.floor((e.y+8)/T))||e.x<-40||e.x>N*T+40){spawnP(e.x+8,e.y+8,6,'#555',2,20);enemies.splice(i,1);continue}
    }
    if(S.state!=='play')continue;
    if(sb&&overlap(sb,e)){kill(e,200);sfx.stomp();continue}
    if(overlap(P,e)){
      if(stompOK(e)){kill(e,200);P.vy=keys.jump?-10:-7;P.jumping=true;sfx.stomp()}
      else hurt('enemy');
    }
  }
  /* canhões */
  cannons.forEach(function(c){
    var cx=c.x*T;if(Math.abs(cx-P.x)>640||P.x>cx+T*3)return;
    c.tm--;if(c.tm<=0){c.tm=150;enemies.push({t:'ball',x:cx-14,y:c.y*T+8,w:16,h:16,vx:-3.1,dead:0});sfx.fire();spawnP(cx-6,c.y*T+16,6,'#d8d8d8',2,18,0)}
  });
  /* chefe */
  if(boss&&!bossDead){
    var b=boss;
    if(!b.act&&P.x>187*T)b.act=true;
    if(b.dead){b.dead--;if(b.dead<=0){bossDead=true;S.score+=1000;sfx.boom()}}
    else if(b.act){
      b.anim+=.12;if(b.inv>0)b.inv--;
      var sp=b.hp===3?1.3:b.hp===2?1.8:2.4;
      var tx=P.x+P.w/2-(b.x+b.w/2);
      b.vx=Math.sign(tx)*sp;b.face=b.vx>0?1:-1;
      b.hop--;if(b.hop<=0&&b.onG){b.vy=-10.5;b.hop=b.hp===1?70:110}
      b.vy=Math.min(12,b.vy+.55);
      moveX(b,b.vx);
      var nx=Math.max(186*T,Math.min(b.x,203*T-b.w));b.x=nx;
      moveY(b,b.vy,false);if(b.onG)b.vy=0;
      if(S.state==='play'){
        if(sb&&b.inv<=0&&overlap(sb,b)){bossHit(false)}
        else if(overlap(P,b)){
          if(b.inv<=0&&stompOK(b)){bossHit(true);P.vy=-10;P.jumping=true}
          else if(b.inv<=0)hurt('boss');
        }
      }
    }
  }
}
function bossHit(stomp){
  boss.hp--;boss.inv=55;sfx.stomp();S.score+=300;S.shake=8;spawnP(boss.x+36,boss.y+20,14,'#ff6a3a',4,30);
  if(boss.hp<=0){boss.dead=70;boss.inv=999;sfx.boom();spawnP(boss.x+36,boss.y+26,40,'#ffd84a',6,50,.1);
    for(var ty=5;ty<14;ty++)for(var tx=204;tx<206;tx++){if(grid[ty][tx]==='G'){spawnP(tx*T+16,ty*T+16,3,'#9b6a33',3,40)}}}
}

/* ---------------- laço principal ---------------- */
function step(){
  S.tick++;
  if(S.state==='play'){
    S.time++;
    updatePlats();updatePlayer();updateEnemies();
  }else if(S.state==='dying'){
    updatePlats();updateEnemies();
    P.vy+=.5;P.y+=P.vy;P.x+=P.vx;S.dying--;
    if(S.dying<=0){
      if(S.lives>0){resetPlayer();S.state='play'}
      else{S.state='over';showOver()}
    }
  }else if(S.state==='win'){
    S.winT++;P.vx*=.9;updatePlats();
    if(S.winT===70)showWin();
  }
  /* partículas e pops */
  for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;if(p.life<=0)particles.splice(i,1)}
  for(var j=pops.length-1;j>=0;j--){var q=pops[j];q.y+=q.vy;q.vy+=.5;q.life--;if(q.life<=0)pops.splice(j,1)}
  for(var k in bumps){bumps[k]--;if(bumps[k]<=0)delete bumps[k]}
  items.forEach(function(it){if(it.rise>0){it.y-=3;it.rise--;}});
  if(S.shake>0)S.shake--;
  /* câmera */
  var tx=P.x+P.w/2-W*.4+(P.face>0?40:-40)*0;
  cam.x+=(tx-cam.x)*.12;cam.x=Math.max(0,Math.min(N*T-W,cam.x));
}

/* ---------------- desenho: tiles pré-renderizados ---------------- */
var tiles={};
function mk(w,h,fn){var c=document.createElement('canvas');c.width=w;c.height=h;var g=c.getContext('2d');fn(g);return c}
function hash(x,y){var h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967295}
function makeTiles(){
  tiles.top=[0,1,2].map(function(v){return mk(T,T,function(g){
    g.fillStyle='#8a5a2c';g.fillRect(0,0,T,T);
    g.fillStyle='#e9c47c';g.fillRect(0,0,T,12);
    g.fillStyle='#f6dfa4';g.fillRect(0,0,T,4);
    g.fillStyle='#d3a65a';for(var i=0;i<5;i++)g.fillRect(((i*7+v*5)%28)+1,5+((i*3)%5),3,2);
    g.fillStyle='#b8873f';g.fillRect(0,12,T,3);
    g.fillStyle='#6e4520';for(var i=0;i<5;i++)g.fillRect(((i*9+v*7)%27)+2,17+((i*5)%12),3,2);
    g.fillStyle='#a47040';for(var i=0;i<4;i++)g.fillRect(((i*11+v*3)%26)+3,19+((i*7)%10),4,3);
  })});
  tiles.fill=[0,1,2,3].map(function(v){return mk(T,T,function(g){
    g.fillStyle='#8a5a2c';g.fillRect(0,0,T,T);
    g.fillStyle='#74481f';for(var i=0;i<7;i++)g.fillRect(((i*13+v*9)%28)+1,((i*7+v*5)%28)+1,3,2);
    g.fillStyle='#a67541';for(var i=0;i<5;i++)g.fillRect(((i*11+v*5)%26)+2,((i*9+v*3)%26)+2,4,3);
    g.fillStyle='#5f3a18';g.fillRect(((v*8)%24)+3,((v*11)%24)+3,5,4);
  })});
  tiles.B=mk(T,T,function(g){
    g.fillStyle='#5b3414';g.fillRect(0,0,T,T);
    g.fillStyle='#c0803f';g.fillRect(2,2,T-4,T-4);
    g.fillStyle='#d79a55';g.fillRect(2,2,T-4,3);
    g.fillStyle='#9b6228';g.fillRect(2,T/2-1,T-4,2);g.fillRect(2,T-5,T-4,3);
    g.fillStyle='#5b3414';for(var i=0;i<2;i++){g.fillRect(8+i*14,2,2,T-4)}
    g.fillStyle='#2f1b08';[[4,4],[T-6,4],[4,T-6],[T-6,T-6]].forEach(function(p){g.fillRect(p[0],p[1],2,2)});
  });
  function chest(light){return mk(T,T,function(g){
    g.fillStyle='#4a2a0c';g.fillRect(0,0,T,T);
    g.fillStyle=light?'#ffcf4a':'#e0a42a';g.fillRect(2,2,T-4,T-4);
    g.fillStyle=light?'#fff0a8':'#f7cd63';g.fillRect(2,2,T-4,4);
    g.fillStyle='#8a5a14';g.fillRect(2,T-6,T-4,4);
    g.fillStyle='#5b3a0e';g.fillRect(14,9,5,3);g.fillRect(17,12,3,3);g.fillRect(14,15,5,3);g.fillRect(14,18,3,3);g.fillRect(14,22,3,3);
    g.fillStyle='#fff6cf';g.fillRect(13,8,5,3);g.fillRect(16,11,3,3);g.fillRect(13,14,5,3);g.fillRect(13,17,3,3);g.fillRect(13,21,3,3);
    g.fillStyle='#4a2a0c';[[4,4],[T-6,4],[4,T-6],[T-6,T-6]].forEach(function(p){g.fillRect(p[0],p[1],2,2)});
  })}
  tiles.Q=[chest(false),chest(true)];
  tiles.U=mk(T,T,function(g){
    g.fillStyle='#3c2a18';g.fillRect(0,0,T,T);g.fillStyle='#6b523a';g.fillRect(2,2,T-4,T-4);
    g.fillStyle='#7f6246';g.fillRect(2,2,T-4,3);g.fillStyle='#4a3822';g.fillRect(2,T-5,T-4,3);
    g.fillStyle='#3c2a18';[[4,4],[T-6,4],[4,T-6],[T-6,T-6]].forEach(function(p){g.fillRect(p[0],p[1],2,2)});
  });
  tiles.S=mk(T,T,function(g){
    for(var i=0;i<3;i++){var x=i*10+1;
      g.fillStyle='#2a323a';g.beginPath();g.moveTo(x-1,T);g.lineTo(x+5,12);g.lineTo(x+11,T);g.fill();
      g.fillStyle='#c9d4de';g.beginPath();g.moveTo(x+1,T);g.lineTo(x+5,15);g.lineTo(x+9,T);g.fill();
      g.fillStyle='#ffffff';g.beginPath();g.moveTo(x+3,T);g.lineTo(x+5,17);g.lineTo(x+6,T);g.fill();
    }
    g.fillStyle='#2a323a';g.fillRect(0,T-4,T,4);
  });
  tiles.K=mk(T,T,function(g){
    g.fillStyle='#6b3f17';g.fillRect(4,16,26,12);
    g.fillStyle='#2b2f36';g.beginPath();g.moveTo(0,10);g.lineTo(22,8);g.lineTo(30,10);g.lineTo(30,22);g.lineTo(22,24);g.lineTo(0,22);g.fill();
    g.fillStyle='#454c57';g.fillRect(2,10,26,4);
    g.fillStyle='#0d0f12';g.beginPath();g.ellipse(2,16,3,6,0,0,6.3);g.fill();
    g.fillStyle='#8a8f99';g.fillRect(24,9,3,14);
    g.fillStyle='#3a2410';g.beginPath();g.arc(14,26,6,0,6.3);g.fill();
    g.fillStyle='#8a5a2c';g.beginPath();g.arc(14,26,3,0,6.3);g.fill();
  });
  tiles.G=mk(T,T,function(g){
    g.fillStyle='#4a2a0c';g.fillRect(0,0,T,T);
    g.fillStyle='#a8692e';g.fillRect(1,0,14,T);g.fillRect(17,0,14,T);
    g.fillStyle='#c98a48';g.fillRect(1,0,14,3);g.fillRect(17,0,14,3);
    g.fillStyle='#2b2f36';g.fillRect(0,5,T,5);g.fillRect(0,T-10,T,5);
    g.fillStyle='#8a8f99';g.fillRect(3,6,2,2);g.fillRect(T-5,6,2,2);g.fillRect(3,T-9,2,2);g.fillRect(T-5,T-9,2,2);
  });
}

/* ---------------- desenho: fundo ---------------- */
var clouds=[],islands=[];
for(var ci=0;ci<9;ci++)clouds.push({x:ci*190+Math.random()*80,y:40+Math.random()*150,s:.7+Math.random()*.8,l:ci%2});
for(var ii=0;ii<8;ii++)islands.push({x:ii*260+Math.random()*100,w:120+Math.random()*120,h:26+Math.random()*36});
function drawCloud(c,x,y,s){
  ctx.fillStyle='rgba(255,255,255,.92)';
  ctx.beginPath();ctx.ellipse(x,y,46*s,17*s,0,0,6.3);ctx.ellipse(x-26*s,y+4*s,28*s,13*s,0,0,6.3);ctx.ellipse(x+30*s,y+5*s,30*s,12*s,0,0,6.3);ctx.ellipse(x+6*s,y-12*s,26*s,15*s,0,0,6.3);ctx.fill();
  ctx.fillStyle='rgba(190,214,236,.6)';ctx.beginPath();ctx.ellipse(x,y+10*s,40*s,6*s,0,0,6.3);ctx.fill();
}
function drawBackground(t){
  var g=ctx.createLinearGradient(0,0,0,H*.8);g.addColorStop(0,'#4aa9e6');g.addColorStop(.6,'#9fd8f2');g.addColorStop(1,'#d9f1f8');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  /* sol */
  var sx=760-cam.x*.03,rg=ctx.createRadialGradient(sx,100,4,sx,100,120);rg.addColorStop(0,'rgba(255,248,200,1)');rg.addColorStop(.25,'rgba(255,240,170,.9)');rg.addColorStop(1,'rgba(255,240,170,0)');
  ctx.fillStyle=rg;ctx.fillRect(sx-130,-30,260,260);
  clouds.forEach(function(c){var par=c.l?.12:.22,span=1900;var x=((c.x-cam.x*par+t*(c.l?.01:.02))%span+span)%span-200;drawCloud(c,x,c.y,c.s)});
  /* ilhas distantes */
  var base=424;
  islands.forEach(function(is){var span=2300;var x=((is.x-cam.x*.3)%span+span)%span-250;
    ctx.fillStyle='#6fa6c4';ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+is.w*.5,base-is.h*1.4,x+is.w,base);ctx.fill();
    ctx.fillStyle='#5b93b3';ctx.fillRect(x+is.w*.45,base-is.h-10,2,16);
    ctx.beginPath();ctx.moveTo(x+is.w*.45+1,base-is.h-10);ctx.lineTo(x+is.w*.45-9,base-is.h-4);ctx.lineTo(x+is.w*.45+11,base-is.h-4);ctx.fill();
  });
  /* navio distante */
  var sh=((1500-cam.x*.22-t*.05)%2600+2600)%2600-300;
  ctx.fillStyle='#3d6f90';ctx.beginPath();ctx.moveTo(sh,base+6);ctx.lineTo(sh+46,base+6);ctx.lineTo(sh+38,base+16);ctx.lineTo(sh+8,base+16);ctx.fill();
  ctx.fillRect(sh+22,base-26,2,32);ctx.beginPath();ctx.moveTo(sh+24,base-24);ctx.lineTo(sh+40,base);ctx.lineTo(sh+24,base);ctx.fill();ctx.beginPath();ctx.moveTo(sh+22,base-18);ctx.lineTo(sh+10,base);ctx.lineTo(sh+22,base);ctx.fill();
  /* mar do horizonte */
  var sg=ctx.createLinearGradient(0,base,0,H);sg.addColorStop(0,'#58b0dc');sg.addColorStop(1,'#1c6aa0');
  ctx.fillStyle=sg;ctx.fillRect(0,base,W,H-base);
  ctx.fillStyle='rgba(255,255,255,.22)';
  for(var i=0;i<26;i++){var wx=((i*97-cam.x*.5+Math.sin(t*.02+i)*8)%1100+1100)%1100-60,wy=base+10+((i*53)%90);ctx.fillRect(wx,wy,26+(i%4)*8,2)}
}
function drawWaterFront(t){
  /* água nos vãos (frente) */
  var y0=WATER;
  ctx.save();
  var g=ctx.createLinearGradient(0,y0,0,H);g.addColorStop(0,'#2f95d0');g.addColorStop(1,'#0f4a7a');ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(0,H);
  for(var x=0;x<=W+8;x+=8){var wx=x+cam.x;ctx.lineTo(x,y0+Math.sin(wx*.045+t*.06)*3+Math.sin(wx*.11+t*.09)*1.5)}
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=2;ctx.beginPath();
  for(var x2=0;x2<=W+8;x2+=8){var wx2=x2+cam.x,yy=y0+Math.sin(wx2*.045+t*.06)*3+Math.sin(wx2*.11+t*.09)*1.5;x2?ctx.lineTo(x2,yy):ctx.moveTo(x2,yy)}
  ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.2)';for(var i=0;i<14;i++){var fx=((i*83-cam.x*1+t*.4)%1000+1000)%1000-20;ctx.fillRect(fx,y0+14+(i%4)*14,28,2)}
  ctx.restore();
}

/* ---------------- desenho: mundo ---------------- */
function drawTiles(t){
  var c0=Math.max(0,Math.floor(cam.x/T)-1),c1=Math.min(N-1,Math.floor((cam.x+W)/T)+1);
  ctx.imageSmoothingEnabled=false;
  for(var ty=0;ty<ROWS;ty++)for(var tx=c0;tx<=c1;tx++){
    var c=grid[ty][tx];if(c==='.')continue;
    var x=Math.round(tx*T-cam.x),y=ty*T;
    if(c==='#'){var above=ty>0&&grid[ty-1][tx]==='#';
      ctx.drawImage(above?tiles.fill[Math.floor(hash(tx,ty)*4)]:tiles.top[Math.floor(hash(tx,ty)*3)],x,y)}
    else if(c==='B')ctx.drawImage(tiles.B,x,y);
    else if(c==='Q')ctx.drawImage(tiles.Q[Math.floor(t/22)%2],x,y-(bumps[tx+','+ty]>0?Math.sin(bumps[tx+','+ty]/10*Math.PI)*8:0));
    else if(c==='U')ctx.drawImage(tiles.U,x,y-(bumps[tx+','+ty]>0?Math.sin(bumps[tx+','+ty]/10*Math.PI)*8:0));
    else if(c==='S')ctx.drawImage(tiles.S,x,y);
    else if(c==='K')ctx.drawImage(tiles.K,x,y);
    else if(c==='G'&&!bossDead)ctx.drawImage(tiles.G,x,y);
  }
  ctx.imageSmoothingEnabled=true;
  /* decoração e coletáveis */
  for(var ty2=0;ty2<ROWS;ty2++)for(var tx2=c0;tx2<=c1;tx2++){
    var cc=grid[ty2][tx2];
    if(cc==='o'){var cx=tx2*T+16-cam.x,cy=ty2*T+16+Math.sin(t*.06+tx2)*2,wv=Math.abs(Math.cos(t*.07+tx2*.7));
      ctx.fillStyle='#b8860b';ctx.beginPath();ctx.ellipse(cx,cy,9*wv+1.5,10,0,0,6.3);ctx.fill();
      ctx.fillStyle='#ffd84a';ctx.beginPath();ctx.ellipse(cx,cy,7*wv+1,8,0,0,6.3);ctx.fill();
      ctx.fillStyle='#fff3a6';ctx.fillRect(cx-1,cy-4,2,6*wv+1)}
    else if(cc==='M'){var mx=tx2*T+16-cam.x,my=ty2*T+16+Math.sin(t*.07+tx2)*4;
      var gl=ctx.createRadialGradient(mx,my,2,mx,my,26);gl.addColorStop(0,'rgba(255,240,170,.8)');gl.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=gl;ctx.fillRect(mx-28,my-28,56,56);
      ctx.save();ctx.translate(mx,my);ctx.rotate(Math.sin(t*.05)*.12);
      ctx.fillStyle='#e8cf92';ctx.fillRect(-11,-9,22,18);ctx.fillStyle='#caa96a';ctx.fillRect(-11,-9,22,3);ctx.fillRect(-11,6,22,3);
      ctx.strokeStyle='#a8321f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(5,5);ctx.moveTo(5,-3);ctx.lineTo(-5,5);ctx.stroke();
      ctx.restore()}
    else if(cc==='C'){drawCheckpoint(tx2*T-cam.x,(ty2+1)*T,cps.filter(function(k){return k.x===tx2*T})[0],t)}
  }
}
function drawCheckpoint(x,y,c,t){
  ctx.fillStyle='#4a2a0c';ctx.fillRect(x+14,y-66,4,66);ctx.fillStyle='#d9c27a';ctx.beginPath();ctx.arc(x+16,y-68,4,0,6.3);ctx.fill();
  var on=c&&c.on,w=Math.sin(t*.12)*3;
  ctx.fillStyle=on?'#1b1b1f':'#8a8f99';ctx.beginPath();ctx.moveTo(x+18,y-64);ctx.quadraticCurveTo(x+34,y-62+w,x+46,y-58);ctx.quadraticCurveTo(x+34,y-50+w,x+18,y-46);ctx.fill();
  ctx.fillStyle=on?'#ffffff':'#c4c8cf';ctx.beginPath();ctx.arc(x+29,y-54+w*.4,3.2,0,6.3);ctx.fill();ctx.fillRect(x+26,y-52+w*.4,6,3);
}
function drawLighthouse(t){
  var x=212*T-cam.x,gy=14*T;
  if(x<-200||x>W+200)return;
  /* torre */
  for(var i=0;i<8;i++){ctx.fillStyle=i%2?'#f4f1ea':'#d63a2f';var wi=76-i*2.5;ctx.fillRect(x+48-wi/2,gy-(i+1)*30,wi,30)}
  ctx.fillStyle='#2b2f36';ctx.fillRect(x+4,gy-262,88,12);ctx.fillRect(x+16,gy-292,64,30);
  var gl=ctx.createRadialGradient(x+48,gy-277,2,x+48,gy-277,120);gl.addColorStop(0,'rgba(255,240,150,.95)');gl.addColorStop(1,'rgba(255,240,150,0)');ctx.fillStyle=gl;ctx.fillRect(x-80,gy-400,256,260);
  ctx.fillStyle='#ffe27a';ctx.fillRect(x+24,gy-288,48,22);
  ctx.fillStyle='#d63a2f';ctx.beginPath();ctx.moveTo(x+10,gy-292);ctx.lineTo(x+48,gy-330);ctx.lineTo(x+86,gy-292);ctx.fill();
  ctx.fillStyle='#4a2a0c';ctx.fillRect(x+34,gy-44,28,44);ctx.fillStyle='#8a5a2c';ctx.fillRect(x+36,gy-42,24,42);
  /* feixe */
  var a=Math.sin(t*.03);ctx.fillStyle='rgba(255,240,170,.18)';ctx.beginPath();ctx.moveTo(x+48,gy-277);ctx.lineTo(x+48-330*Math.cos(a)-20,gy-277-60*Math.sin(a)-70);ctx.lineTo(x+48-330*Math.cos(a)-20,gy-277-60*Math.sin(a)+50);ctx.fill();
  /* mastro da bandeira */
  var px=goal.x-cam.x;
  ctx.fillStyle='#e9e2c8';ctx.fillRect(px,goal.y,5,goal.h);ctx.fillStyle='#ffd84a';ctx.beginPath();ctx.arc(px+2.5,goal.y-2,6,0,6.3);ctx.fill();
  var fy=S.state==='win'?goal.y+Math.min(150,S.winT*3):goal.y+10,w=Math.sin(t*.12)*4;
  ctx.fillStyle='#14141a';ctx.beginPath();ctx.moveTo(px+5,fy);ctx.quadraticCurveTo(px+36,fy-4+w,px+62,fy+2);ctx.lineTo(px+62,fy+36);ctx.quadraticCurveTo(px+36,fy+34+w,px+5,fy+40);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px+33,fy+17+w*.3,6,0,6.3);ctx.fill();ctx.fillRect(px+29,fy+21+w*.3,8,5);
  ctx.fillStyle='#14141a';ctx.fillRect(px+30,fy+16+w*.3,2,2);ctx.fillRect(px+35,fy+16+w*.3,2,2);
}
function drawPlats(t){
  plats.forEach(function(p){
    if(p.t==='f'&&p.st>=2&&p.y>H)return;
    var x=p.x-cam.x,y=p.y+(p.t==='f'&&p.st===1?Math.sin(t*1.4)*1.5:0);
    if(x>W+100||x<-200)return;
    ctx.fillStyle='#4a2a0c';ctx.fillRect(x,y,p.w,p.h);
    ctx.fillStyle='#b8793a';ctx.fillRect(x+1,y+1,p.w-2,p.h-4);
    ctx.fillStyle='#d79a55';ctx.fillRect(x+1,y+1,p.w-2,3);
    ctx.fillStyle='#6b3f17';for(var i=16;i<p.w;i+=16)ctx.fillRect(x+i,y+1,2,p.h-3);
    ctx.fillStyle='#2f1b08';ctx.fillRect(x+3,y+4,2,2);ctx.fillRect(x+p.w-5,y+4,2,2);
    if(p.t==='v'||p.t==='h'){ctx.fillStyle='rgba(255,216,74,.9)';ctx.fillRect(x+p.w/2-6,y+p.h-4,12,2)}
  });
}
function drawCrab(e,t,big){
  var cx=e.x+e.w/2-cam.x,cy=e.y+e.h,s=big?2.2:1,sq=e.dead?.35:1;
  ctx.save();ctx.translate(cx,cy);ctx.scale(s,s*sq);
  var fl=big&&boss.inv>0&&Math.floor(t/4)%2===0;
  var body=big?'#b3261e':'#e0502c',dk=big?'#7a150f':'#a8321f';
  ctx.strokeStyle=dk;ctx.lineWidth=2;
  for(var i=0;i<3;i++){var l=Math.sin(e.anim*2+i)*3;
    ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-14-i*1,-2+l);ctx.lineTo(-15-i,0);ctx.moveTo(8,-6);ctx.lineTo(14+i,-2-l);ctx.lineTo(15+i,0);ctx.stroke()}
  ctx.fillStyle=fl?'#fff':body;ctx.beginPath();ctx.ellipse(0,-9,13,9,0,0,6.3);ctx.fill();
  ctx.fillStyle=fl?'#fff':dk;ctx.beginPath();ctx.ellipse(0,-5,12,4,0,0,6.3);ctx.fill();
  var cl=Math.sin(e.anim)*2;
  ctx.fillStyle=fl?'#fff':body;
  ctx.beginPath();ctx.arc(-15,-14+cl,5.5,0,6.3);ctx.arc(15,-14-cl,5.5,0,6.3);ctx.fill();
  ctx.fillStyle='#14141a';ctx.beginPath();ctx.moveTo(-18,-16+cl);ctx.lineTo(-15,-14+cl);ctx.lineTo(-18,-12+cl);ctx.moveTo(18,-16-cl);ctx.lineTo(15,-14-cl);ctx.lineTo(18,-12-cl);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-4,-19,3,0,6.3);ctx.arc(4,-19,3,0,6.3);ctx.fill();
  ctx.fillStyle='#14141a';ctx.beginPath();ctx.arc(-4,-19,1.4,0,6.3);ctx.arc(4,-19,1.4,0,6.3);ctx.fill();
  ctx.strokeStyle=body;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-15);ctx.lineTo(-4,-18);ctx.moveTo(4,-15);ctx.lineTo(4,-18);ctx.stroke();
  if(big){ctx.fillStyle='#ffd84a';ctx.beginPath();ctx.moveTo(-8,-22);ctx.lineTo(-8,-29);ctx.lineTo(-4,-25);ctx.lineTo(0,-31);ctx.lineTo(4,-25);ctx.lineTo(8,-29);ctx.lineTo(8,-22);ctx.fill()}
  ctx.restore();
}
function drawGull(e,t){
  var x=e.x+e.w/2-cam.x,y=e.y+e.h/2,f=Math.sin(e.anim*2)*9,d=e.vx>0?1:-1,sq=e.dead?.4:1;
  ctx.save();ctx.translate(x,y);ctx.scale(d,sq);
  ctx.fillStyle='#f6f8fb';ctx.beginPath();ctx.ellipse(0,0,11,5.5,0,0,6.3);ctx.fill();
  ctx.beginPath();ctx.moveTo(-4,0);ctx.quadraticCurveTo(-8,-12-f,-16,-8-f*1.2);ctx.quadraticCurveTo(-7,-3,2,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-2,2);ctx.quadraticCurveTo(-6,10+f,-13,8+f*1.2);ctx.quadraticCurveTo(-5,3,3,1);ctx.fill();
  ctx.fillStyle='#c9d2dc';ctx.beginPath();ctx.ellipse(-3,2,7,2.5,0,0,6.3);ctx.fill();
  ctx.fillStyle='#f6f8fb';ctx.beginPath();ctx.arc(10,-2,4,0,6.3);ctx.fill();
  ctx.fillStyle='#f2a93b';ctx.beginPath();ctx.moveTo(13,-3);ctx.lineTo(19,-1);ctx.lineTo(13,0);ctx.fill();
  ctx.fillStyle='#14141a';ctx.fillRect(10,-4,2,2);
  ctx.restore();
}
function drawBall(e){
  var x=e.x+8-cam.x,y=e.y+8;
  ctx.fillStyle='#15171c';ctx.beginPath();ctx.arc(x,y,8.5,0,6.3);ctx.fill();
  ctx.fillStyle='#3a404a';ctx.beginPath();ctx.arc(x-2.5,y-2.5,3.6,0,6.3);ctx.fill();
}
function drawItems(t){
  items.forEach(function(it){
    var x=it.x+10-cam.x,y=it.y+14+Math.sin(t*.08)*2;
    ctx.fillStyle='#2e8b3f';ctx.beginPath();ctx.ellipse(x,y+4,8,10,0,0,6.3);ctx.fill();
    ctx.fillStyle='#5fcf72';ctx.beginPath();ctx.ellipse(x-2,y+2,3,6,0,0,6.3);ctx.fill();
    ctx.fillStyle='#2e8b3f';ctx.fillRect(x-3,y-11,6,8);ctx.fillStyle='#b98450';ctx.fillRect(x-3,y-14,6,4);
  });
}
function drawPlayer(t){
  var fi=0;
  if(S.state==='dying'&&S.dyingType==='water')return;
  if(!P.onGround||S.state==='dying')fi=3;
  else if(Math.abs(P.vx)>.4)fi=1+Math.floor(P.anim*1.3)%4;
  else fi=0;
  if(P.inv>0&&S.state==='play'&&Math.floor(t/4)%2===0)return;
  var sc=.58,dw=FW*sc,dh=FH*sc,cx=P.x+P.w/2-cam.x,by=P.y+P.h+1;
  ctx.save();ctx.translate(cx,by);
  /* sombra */
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(0,0,13,3,0,0,6.3);ctx.fill();
  if(S.state==='dying'&&S.dyingType!=='water')ctx.rotate(Math.min(1.4,(95-S.dying)*.03)*P.face);
  if(P.face<0)ctx.scale(-1,1);
  var sq=P.onGround?1:1+Math.min(.1,Math.abs(P.vy)*.012);
  ctx.scale(1/sq,sq);
  if(sheet.complete&&sheet.naturalWidth)ctx.drawImage(sheet,fi*FW,0,FW,FH,-dw/2,-dh+2*sc,dw,dh);
  else{ctx.fillStyle='#222';ctx.fillRect(-11,-50,22,50)}
  ctx.restore();
  /* golpe */
  if(P.atk>0){
    var k=1-P.atk/14,ax=P.x+P.w/2-cam.x,ay=P.y+24;
    ctx.save();ctx.translate(ax,ay);if(P.face<0)ctx.scale(-1,1);
    ctx.strokeStyle='rgba(255,255,255,'+(.95-k*.8)+')';ctx.lineWidth=5;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(2,0,30,-1.1+k*.6,1.0+k*.5);ctx.stroke();
    ctx.strokeStyle='rgba(190,230,255,'+(.8-k*.7)+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(2,0,24,-1+k*.6,.9+k*.5);ctx.stroke();
    ctx.restore();
  }
}
function drawParticles(){
  particles.forEach(function(p){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.fillRect(p.x-cam.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz)});
  ctx.globalAlpha=1;
  pops.forEach(function(q){ctx.fillStyle='#ffd84a';ctx.strokeStyle='#8a5a14';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(q.x-cam.x,q.y,6,8,0,0,6.3);ctx.fill();ctx.stroke()});
}
function heart(x,y,s,full){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.beginPath();ctx.moveTo(0,5);ctx.bezierCurveTo(-12,-4,-6,-12,0,-5);ctx.bezierCurveTo(6,-12,12,-4,0,5);ctx.closePath();
  ctx.fillStyle=full?'#ff4d5e':'rgba(0,0,0,.35)';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=1.5;ctx.stroke();
  if(full){ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-5,-6,2.5,2.5)}
  ctx.restore();
}
function txt(s,x,y,size,col,al){
  ctx.font='800 '+size+'px '+FONT;ctx.textAlign=al||'left';ctx.textBaseline='middle';
  ctx.lineWidth=4;ctx.strokeStyle='rgba(8,20,32,.75)';ctx.lineJoin='round';ctx.strokeText(s,x,y);ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y);
}
function drawHUD(){
  for(var i=0;i<3;i++)heart(26+i*30,26,1.5,i<P.hp);
  txt('Vidas ×'+Math.max(0,S.lives),100-6,56,15,'#ffe9a8');
  ctx.fillStyle='#ffd84a';ctx.beginPath();ctx.ellipse(34,84,8,9,0,0,6.3);ctx.fill();ctx.fillStyle='#fff3a6';ctx.fillRect(33,80,2,8);
  txt('×'+S.coins,48,85,16,'#fff');
  /* pedaços do mapa */
  txt('Mapa',W/2-84,26,15,'#ffe9a8','right');
  for(var m=0;m<5;m++){var on=m<S.pieces,mx=W/2-70+m*30;
    ctx.fillStyle=on?'#e8cf92':'rgba(0,0,0,.3)';ctx.fillRect(mx,14,22,20);
    ctx.strokeStyle=on?'#a8321f':'rgba(255,255,255,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx+5,19);ctx.lineTo(mx+17,29);ctx.moveTo(mx+17,19);ctx.lineTo(mx+5,29);ctx.stroke()}
  txt(String(S.score).padStart(6,'0'),W-100,26,22,'#fff','right');
  var sec=Math.floor(S.time/60);txt(Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),W-100,54,15,'#ffe9a8','right');
  /* barra do chefe */
  if(boss&&boss.act&&!bossDead){
    var bw=220,bx=W/2-bw/2,by=H-42;
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(bx-3,by-3,bw+6,16);
    ctx.fillStyle='#3a1210';ctx.fillRect(bx,by,bw,10);
    ctx.fillStyle='#ff5a3a';ctx.fillRect(bx,by,bw*boss.hp/3,10);
    txt('Rei Caranguejo',W/2,by-14,14,'#fff','center');
  }
}
function render(){
  var t=S.tick,sk=S.shake>0?(Math.random()-.5)*S.shake*.6:0;
  var sc=cv.width/W;
  ctx.setTransform(sc,0,0,sc,0,sk*sc);
  ctx.clearRect(0,-10,W,H+20);
  drawBackground(t);
  drawLighthouse(t);
  drawWaterFront(t);
  drawTiles(t);
  drawPlats(t);
  drawItems(t);
  enemies.forEach(function(e){var x=e.x-cam.x;if(x<-100||x>W+100)return;
    if(e.t==='crab')drawCrab(e,t,false);else if(e.t==='gull')drawGull(e,t);else if(e.t==='ball')drawBall(e)});
  if(boss&&!bossDead){
    if(boss.dead){var s=boss.dead;ctx.globalAlpha=Math.min(1,s/30);}
    drawCrab({x:boss.x+boss.w/2-14,y:boss.y+boss.h-20,w:28,h:20,anim:boss.anim,dead:0},t,true);ctx.globalAlpha=1;
  }
  drawPlayer(t);
  drawParticles();
  drawHUD();
  if(S.state==='win'){ctx.fillStyle='rgba(255,255,255,'+Math.min(.18,S.winT*.004)+')';ctx.fillRect(0,0,W,H)}
}

/* ---------------- telas HTML ---------------- */
var screenAct=null;
function hideScreen(){scr.className='';scr.innerHTML='';screenAct=null;root.classList.remove('scr')}
function showScreen(html,primary){scr.innerHTML=html;scr.className='on';root.classList.add('scr');screenAct=primary;var b=scr.querySelector('[data-act="'+primary+'"]');if(b)setTimeout(function(){b.focus({preventScroll:true})},30)}
function fmtTime(){var s=Math.floor(S.time/60);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function showTitle(){
  S.state='title';
  showScreen('<div class="pgPanel"><small>Minigame</small><h2>Corrida do Pirata</h2>'+
  '<p>Atravesse o porto, desvie dos perigos, pegue os 5 pedaços do mapa e derrote o Rei Caranguejo para chegar ao farol.</p>'+
  '<ul class="pgKeys"><li><div><b>←</b> <b>→</b> ou <b>A</b> <b>D</b></div><span>andar</span></li><li><div><b>Espaço</b> ou <b>↑</b></div><span>pular (segure para ir mais alto)</span></li><li><div><b>Shift</b></div><span>correr</span></li><li><div><b>X</b> ou <b>J</b></div><span>golpe de espada</span></li><li><div><b>P</b> ou <b>Esc</b></div><span>pausar</span></li></ul>'+
  '<p class="pgTip">Pule em cima dos inimigos ou use a espada. Baús dourados escondem moedas e rum que recupera um coração.</p>'+
  '<p class="pgRot">Dica: gire o celular para a horizontal para jogar melhor.</p>'+
  (S.best?'<p class="pgBest">Melhor pontuação: <b>'+S.best+'</b></p>':'')+
  '<div class="pgRow"><button class="pgBtn" data-act="start" type="button">Jogar</button><button class="pgBtn ghost" data-act="exit" type="button">Voltar ao site</button></div></div>','start');
}
function showPause(){
  if(S.state!=='play')return;S.state='pause';
  showScreen('<div class="pgPanel small"><h2>Pausado</h2><div class="pgRow"><button class="pgBtn" data-act="resume" type="button">Continuar</button><button class="pgBtn ghost" data-act="restart" type="button">Recomeçar</button><button class="pgBtn ghost" data-act="exit" type="button">Sair</button></div></div>','resume');
}
function showOver(){
  showScreen('<div class="pgPanel small"><small>Fim de jogo</small><h2>O mar levou o pirata</h2><p>Pontuação: <b>'+S.score+'</b> · Moedas: <b>'+S.coins+'</b> · Mapa: <b>'+S.pieces+'/5</b></p><div class="pgRow"><button class="pgBtn" data-act="restart" type="button">Tentar de novo</button><button class="pgBtn ghost" data-act="exit" type="button">Voltar ao site</button></div></div>','restart');
}
function showWin(){
  var map=S.pieces===5;
  showScreen('<div class="pgPanel"><small>Fase concluída</small><h2>'+(map?'O mapa está completo!':'O farol é seu!')+'</h2>'+
  '<p>'+(map?'Os cinco pedaços estão juntos e o caminho do tesouro finalmente aparece.':'O pirata chegou ao farol. Ainda há pedaços do mapa escondidos pela fase.')+'</p>'+
  '<ul class="pgStats"><li><span>Pontuação</span><b>'+S.score+'</b></li><li><span>Moedas</span><b>'+S.coins+' / '+totalCoins+'</b></li><li><span>Pedaços do mapa</span><b>'+S.pieces+' / 5</b></li><li><span>Tempo</span><b>'+fmtTime()+'</b></li><li><span>Recorde</span><b>'+S.best+'</b></li></ul>'+
  '<div class="pgRow"><button class="pgBtn" data-act="restart" type="button">Jogar de novo</button><button class="pgBtn ghost" data-act="exit" type="button">Voltar ao site</button></div></div>','restart');
}
scr.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act;
  if(a==='start'||a==='restart')newGame();
  else if(a==='resume'){hideScreen();S.state='play'}
  else if(a==='exit')close();
});

/* ---------------- entrada ---------------- */
var map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ShiftLeft:'run',ShiftRight:'run',KeyX:'atk',KeyJ:'atk',KeyK:'atk'};
function onKeyDown(e){
  if(!open_)return;
  if(e.code==='Escape'){e.preventDefault();if(S.state==='play')showPause();else if(S.state==='pause'){hideScreen();S.state='play'}else close();return}
  if(e.code==='KeyP'){e.preventDefault();if(S.state==='play')showPause();else if(S.state==='pause'){hideScreen();S.state='play'}return}
  if(e.code==='KeyM'){toggleMute();return}
  var k=map[e.code];
  if(k){
    if(S.state==='play'||S.state==='dying'||S.state==='win'){e.preventDefault();keys[k]=true}
    else if((e.code==='Space')&&screenAct&&document.activeElement===document.body){e.preventDefault()}
  }
  if(e.code==='Enter'&&screenAct&&!(document.activeElement&&document.activeElement.tagName==='BUTTON')){e.preventDefault();var b=scr.querySelector('[data-act="'+screenAct+'"]');if(b)b.click()}
}
function onKeyUp(e){var k=map[e.code];if(k)keys[k]=false}
function clearKeys(){keys.left=keys.right=keys.jump=keys.run=keys.atk=false;jumpHeld=false;atkHeld=false}
window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);window.addEventListener('blur',function(){clearKeys();if(open_&&S.state==='play')showPause()});
document.addEventListener('visibilitychange',function(){if(document.hidden&&open_&&S.state==='play')showPause()});
/* toque */
document.querySelectorAll('#pgTouch [data-k]').forEach(function(b){
  var k=b.dataset.k;
  b.addEventListener('pointerdown',function(e){e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(x){}keys[k]=true;b.classList.add('on')});
  var up=function(e){keys[k]=false;b.classList.remove('on')};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
  b.addEventListener('contextmenu',function(e){e.preventDefault()});
});
function toggleMute(){muted=!muted;try{localStorage.setItem('pgMute',muted?'1':'0')}catch(e){}paintMute()}
function paintMute(){muteBtn.setAttribute('aria-pressed',muted?'true':'false');muteBtn.setAttribute('aria-label',muted?'Ligar o som':'Desligar o som');muteBtn.textContent=muted?'\uD83D\uDD07':'\uD83D\uDD0A'}
muteBtn.addEventListener('click',function(){toggleMute();muteBtn.blur()});
$('pgClose').addEventListener('click',function(){close()});

/* ---------------- tamanho e laço ---------------- */
function fit(){
  var vw=root.clientWidth,vh=root.clientHeight;
  var cw=Math.min(vw,vh*W/H);cw=Math.floor(cw);var ch=Math.floor(cw*H/W);
  var wrap=$('pgWrap');wrap.style.width=cw+'px';wrap.style.height=ch+'px';
  var d=Math.min(window.devicePixelRatio||1,2);
  cv.width=Math.round(cw*d);cv.height=Math.round(ch*d);
}
var open_=false,raf=0,last=0,acc=0;
function frame(now){
  if(!open_)return;raf=requestAnimationFrame(frame);
  var dt=Math.min(100,now-last);last=now;acc+=dt;
  var n=0;while(acc>=16.667&&n<5){if(S.state!=='title'&&S.state!=='pause'&&S.state!=='over'||S.state==='over'||S.state==='title'){stepSafe()}acc-=16.667;n++}
  if(n>=5)acc=0;
  render();
}
function stepSafe(){
  if(S.state==='pause')return;
  if(S.state==='title'||S.state==='over'){S.tick++;cam.x+=0;
    for(var i=particles.length-1;i>=0;i--){particles.splice(i,1)}return}
  step();
}
function open(){
  if(open_)return;
  try{if(!ac){var AC=window.AudioContext||window.webkitAudioContext;if(AC)ac=new AC()}if(ac&&ac.state==='suspended')ac.resume()}catch(e){}
  open_=true;root.classList.add('show');document.documentElement.style.overflow='hidden';
  if(!tiles.B)makeTiles();
  var hv=document.getElementById('heroVideo');if(hv)try{hv.pause()}catch(e){}
  buildLevel();resetPlayer();cam.x=0;S.state='title';S.tick=0;
  paintMute();fit();showTitle();
  last=performance.now();acc=0;raf=requestAnimationFrame(frame);
  setTimeout(function(){window.addEventListener('resize',fit)},0);
}
function close(){
  if(!open_)return;
  open_=false;cancelAnimationFrame(raf);clearKeys();hideScreen();
  root.classList.remove('show');document.documentElement.style.overflow='';
  window.removeEventListener('resize',fit);
  var hv=document.getElementById('heroVideo');if(hv&&!matchMedia('(prefers-reduced-motion: reduce)').matches)try{hv.play().catch(function(){})}catch(e){}
  var b=document.getElementById('gameBtn');if(b)b.focus({preventScroll:true});
}
window.PirateGame={open:open,close:close};
})();
