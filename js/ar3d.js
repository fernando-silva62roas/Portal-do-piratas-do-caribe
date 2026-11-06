(function(){
'use strict';
const T=THREE,$=id=>document.getElementById(id);
T.ColorManagement.enabled=false;
const ov=$('ar3d'),cv=$('arCv'),loadEl=$('arLoad');
let R,S,C,sky,sea,shallow,base,sun,hemi,built=false,run=false,mode='tour',tod='day',yaw=0,pitch=0,fov=70,aY=.8,aP=.55,aD=64,idle=true,tw=null,cur=0,gy=false,gOff=0,hasDev=false,last=0,tt=0,raf=0;
const devQ=new T.Quaternion(),A={},VPS=[];
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const rnd=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const mat=(c,o)=>new T.MeshPhongMaterial(Object.assign({color:c,flatShading:true,shininess:6,specular:0x111111},o||{}));
const bas=(c,o)=>new T.MeshBasicMaterial(Object.assign({color:c},o||{}));

function H(x,z){
  const r=Math.hypot(x,z),a=Math.atan2(z,x),rad=21+3*Math.sin(a*3+1)+2*Math.sin(a*5+2)+1.5*Math.sin(a*2);
  const land=1-sm(.72,1.05,r/rad);
  let h=-2.4+land*3.2+land*(.35*Math.sin(x*.6)*Math.cos(z*.5)+.25*Math.sin(x*1.3+z*.9));
  h+=10.5*Math.exp(-((x+6)**2+(z+5)**2)/34)+3.4*Math.exp(-((x-15)**2+(z+11)**2)/16)+2*Math.exp(-((x-3)**2+(z-1)**2)/60);
  h-=3.4*Math.exp(-((x+6)**2+(z+5)**2)/1.8);
  return h;
}
function tcol(h,s,x,z){
  const j=Math.sin(x*2.3)*Math.cos(z*1.9)*.5+.5;
  if(h<-.25)return[.55,.5,.36];
  if(h<.3)return[.86,.78,.55];
  if(h<1.1){const k=sm(.3,1.1,h);return[.9-k*.6+j*.05,.82-k*.28,.58-k*.38]}
  if(h>9.4)return[.3+.1*j,.17,.14];
  if(s>1.1||h>7.2)return[.46+.1*j,.44+.08*j,.43];
  return[.2+.12*j,.5+.13*j,.18+.06*j];
}
function coast(a){const dx=Math.cos(a),dz=Math.sin(a);let r=4;while(r<45&&H(dx*r,dz*r)>.15)r+=.25;return{x:dx*r,z:dz*r,dx,dz}}
function dot(c,s){const k=document.createElement('canvas');k.width=k.height=64;const g=k.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return new T.CanvasTexture(k)}
function skull(){
  const k=document.createElement('canvas');k.width=k.height=128;const g=k.getContext('2d');
  g.fillStyle='#16161b';g.fillRect(0,0,128,128);g.strokeStyle='#eee';g.lineWidth=9;g.lineCap='round';
  g.beginPath();g.moveTo(26,96);g.lineTo(102,112);g.moveTo(102,96);g.lineTo(26,112);g.stroke();
  g.fillStyle='#f2f2f2';g.beginPath();g.arc(64,46,26,0,7);g.fill();g.fillRect(50,60,28,24);
  g.fillStyle='#16161b';g.beginPath();g.arc(54,46,7,0,7);g.arc(74,46,7,0,7);g.fill();g.fillRect(62,56,4,8);
  return new T.CanvasTexture(k);
}

function build(){
  R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  R.outputColorSpace=T.LinearSRGBColorSpace;R.useLegacyLights=true;
  const lowEnd=matchMedia('(pointer:coarse)').matches;
  R.setPixelRatio(Math.min(devicePixelRatio||1,lowEnd?1.6:2));
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  S=new T.Scene();C=new T.PerspectiveCamera(70,1,.1,900);C.rotation.order='YXZ';

  hemi=new T.HemisphereLight(0xbfe6ff,0x5a8f4a,.75);S.add(hemi);
  sun=new T.DirectionalLight(0xfff2cc,1.05);sun.castShadow=true;sun.shadow.mapSize.set(lowEnd?1024:2048,lowEnd?1024:2048);
  const sc=sun.shadow.camera;sc.left=-40;sc.right=40;sc.top=40;sc.bottom=-40;sc.near=10;sc.far=200;sun.shadow.bias=-.0006;S.add(sun,sun.target);

  sky=new T.Mesh(new T.SphereGeometry(500,32,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,
    uniforms:{uTop:{value:new T.Color()},uBot:{value:new T.Color()},uSun:{value:new T.Vector3(0,1,0)},uSC:{value:new T.Color()},uN:{value:0}},
    vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vP;uniform vec3 uTop,uBot,uSC,uSun;uniform float uN;float hs(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.7)))*43758.5453);}'+
    'void main(){vec3 d=normalize(vP);float h=max(d.y,0.);vec3 c=mix(uBot,uTop,pow(h,.55));float s=max(dot(d,uSun),0.);c+=uSC*(pow(s,900.)*3.+pow(s,18.)*.35+pow(s,4.)*.12);'+
    'c+=vec3(step(.9986,hs(floor(d*210.))))*uN*smoothstep(.02,.3,d.y);if(d.y<0.)c=mix(uBot,uBot*.6,-d.y*3.);gl_FragColor=vec4(c,1.);}'}));
  S.add(sky);

  // terreno
  const N=120,SZ=96,g=new T.PlaneGeometry(SZ,SZ,N,N);g.rotateX(-Math.PI/2);
  const p=g.attributes.position,col=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++)p.setY(i,H(p.getX(i),p.getZ(i)));
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=p.getY(i),s=Math.hypot(H(x+.6,z)-h,H(x,z+.6)-h)/.6,c=tcol(h,s,x,z);col.set(c,i*3)}
  g.setAttribute('color',new T.BufferAttribute(col,3));g.computeVertexNormals();
  const ter=new T.Mesh(g,mat(0xffffff,{vertexColors:true}));ter.receiveShadow=true;S.add(ter);A.ter=ter;

  // mar
  const sg=new T.PlaneGeometry(700,700,90,90);sg.rotateX(-Math.PI/2);
  sea=new T.Mesh(sg,mat(0x1a86c8,{shininess:90,specular:0x9fd6ff,transparent:true,opacity:.93}));sea.frustumCulled=false;sea.receiveShadow=true;S.add(sea);
  const sp=sg.attributes.position;A.sx=new Float32Array(sp.count);A.sz=new Float32Array(sp.count);
  for(let i=0;i<sp.count;i++){A.sx[i]=sp.getX(i);A.sz[i]=sp.getZ(i)}
  const k=document.createElement('canvas');k.width=k.height=128;const kg=k.getContext('2d'),rg=kg.createRadialGradient(64,64,0,64,64,64);
  rg.addColorStop(0,'rgba(120,255,230,.0)');rg.addColorStop(.5,'rgba(120,255,230,.6)');rg.addColorStop(.78,'rgba(150,255,240,.35)');rg.addColorStop(1,'rgba(150,255,240,0)');kg.fillStyle=rg;kg.fillRect(0,0,128,128);
  shallow=new T.Mesh(new T.CircleGeometry(40,64).rotateX(-Math.PI/2),bas(0xffffff,{map:new T.CanvasTexture(k),transparent:true,depthWrite:false}));shallow.position.y=.05;S.add(shallow);
  base=new T.Mesh(new T.CylinderGeometry(33,33,3,64),bas(0x2a8fd0));base.position.y=-1.8;base.visible=false;S.add(base);

  // palmeiras e pedras
  const rr=rnd(7),pm=[];
  for(let i=0;i<1500&&pm.length<85;i++){const x=(rr()-.5)*58,z=(rr()-.5)*58,h=H(x,z);if(h<.55||h>3.3)continue;
    if(Math.hypot(H(x+.6,z)-h,H(x,z+.6)-h)/.6>.7)continue;if(Math.hypot(x-4,z-9)<3.6||Math.hypot(x-7.5,z-10.5)<2.2||Math.hypot(x-15,z+11)<3||Math.hypot(x+6,z+5)<7)continue;pm.push([x,h,z,2.3+rr()*1.4])}
  const tg=new T.CylinderGeometry(.1,.2,1,6);tg.translate(0,.5,0);
  const lg=new T.ConeGeometry(.3,2.5,4);lg.translate(0,1.25,0);lg.rotateZ(-Math.PI/2);lg.scale(1,.3,1.5);
  const tr=new T.InstancedMesh(tg,mat(0x8a5a2b),pm.length),lf=new T.InstancedMesh(lg,mat(0x2fa043),pm.length*7),d=new T.Object3D();d.rotation.order='YXZ';
  pm.forEach((q,i)=>{d.position.set(q[0],q[1]-.1,q[2]);d.scale.set(1,q[3],1);d.rotation.set(0,0,0);d.updateMatrix();tr.setMatrixAt(i,d.matrix);
    for(let j=0;j<7;j++){d.position.set(q[0],q[1]+q[3]-.1,q[2]);const sc=.8+rr()*.45;d.scale.set(sc,sc,sc);d.rotation.set(0,j*.9+rr()*.3,-.45-rr()*.4);d.updateMatrix();lf.setMatrixAt(i*7+j,d.matrix);lf.setColorAt(i*7+j,new T.Color().setHSL(.31+rr()*.04,.55,.3+rr()*.12))}});
  tr.castShadow=lf.castShadow=true;S.add(tr,lf);
  const rk=[];for(let i=0;i<500&&rk.length<55;i++){const x=(rr()-.5)*60,z=(rr()-.5)*60,h=H(x,z),r=Math.hypot(x,z);if(r<14||h<-.5||h>1.8)continue;rk.push([x,h,z,.5+rr()*1.1])}
  const rm=new T.InstancedMesh(new T.DodecahedronGeometry(1),mat(0x77736f),rk.length);
  rk.forEach((q,i)=>{d.position.set(q[0],q[1]+q[3]*.1,q[2]);d.scale.set(q[3],q[3]*.7,q[3]);d.rotation.set(0,rr()*6,0);d.updateMatrix();rm.setMatrixAt(i,d.matrix)});rm.castShadow=rm.receiveShadow=true;S.add(rm);

  // cais
  const c=coast(.9),dock=new T.Group();dock.position.set(c.x-c.dx*1.2,0,c.z-c.dz*1.2);dock.rotation.y=Math.atan2(c.dx,c.dz);
  const wood=mat(0x9a6b3a),woodD=mat(0x6b4423);
  for(let z=0;z<=9;z+=.52){const b=new T.Mesh(new T.BoxGeometry(2.1,.14,.46),wood);b.position.set(0,.55,z);b.castShadow=b.receiveShadow=true;dock.add(b)}
  for(let z=.4;z<=9;z+=1.9)for(const sx of[-1.05,1.05]){const b=new T.Mesh(new T.CylinderGeometry(.12,.12,2.2),woodD);b.position.set(sx,-.4,z);b.castShadow=true;dock.add(b)}
  S.add(dock);
  // navio
  const ship=new T.Group(),sh=new T.Shape();sh.moveTo(-3.4,1.2);sh.lineTo(-2.7,-.6);sh.lineTo(2.4,-.6);sh.quadraticCurveTo(3.8,.3,4.4,1.7);sh.lineTo(-3.4,1.2);
  const hg=new T.ExtrudeGeometry(sh,{depth:1.8,bevelEnabled:false});hg.translate(0,0,-.9);
  const hull=new T.Mesh(hg,mat(0x6b4423));hull.castShadow=true;ship.add(hull);
  const deck=new T.Mesh(new T.BoxGeometry(7.2,.1,1.7),mat(0x9a6b3a));deck.position.set(.5,1.35,0);ship.add(deck);
  const sk=skull(),cloth=mat(0x2a2a30,{side:T.DoubleSide});
  [[-.6,5.2,3.4,0],[2.1,4.4,2.8,1]].forEach(m=>{const ms=new T.Mesh(new T.CylinderGeometry(.09,.11,m[1]),woodD);ms.position.set(m[0],1.2+m[1]/2,0);ms.castShadow=true;ship.add(ms);
    const sl=new T.Mesh(new T.PlaneGeometry(m[2]*.85,m[1]*.55),m[3]?cloth:bas(0xffffff,{map:sk,side:T.DoubleSide}));sl.rotation.y=Math.PI/2;sl.position.set(m[0]+.15,1.2+m[1]*.62,0);sl.castShadow=true;ship.add(sl)});
  const fl=new T.Mesh(new T.PlaneGeometry(.9,.5),bas(0x16161b,{side:T.DoubleSide}));fl.position.set(-.1,6.7,0);ship.add(fl);
  const lamp=new T.PointLight(0xffc27a,0,16);lamp.position.set(1,2.6,0);ship.add(lamp);A.shipLamp=lamp;
  ship.position.set(c.x+c.dx*11-c.dz*7.5,.1,c.z+c.dz*11+c.dx*7.5);ship.rotation.y=Math.atan2(-c.dz,c.dx);S.add(ship);A.ship=ship;

  // farol
  const lx=15,lz=-11,ly=H(lx,lz),lh=new T.Group();lh.position.set(lx,ly,lz);
  for(let i=0;i<4;i++){const m=new T.Mesh(new T.CylinderGeometry(.95-i*.09,1.04-i*.09,1.7,14),mat(i%2?0xc83a32:0xf3efe6));m.position.y=.85+i*1.7;m.castShadow=true;lh.add(m)}
  const ga=new T.Mesh(new T.CylinderGeometry(1.15,1.15,.18,14),mat(0x2a2a30));ga.position.y=6.9;lh.add(ga);
  const gl=new T.Mesh(new T.CylinderGeometry(.55,.55,.9,12),bas(0xffe9a0));gl.position.y=7.45;lh.add(gl);
  const rf=new T.Mesh(new T.ConeGeometry(.85,.9,12),mat(0xc83a32));rf.position.y=8.35;lh.add(rf);
  const ll=new T.PointLight(0xffd27a,0,34);ll.position.y=7.5;lh.add(ll);A.lhLight=ll;
  const bg=new T.ConeGeometry(2.6,16,18,1,true);bg.translate(0,-8,0);bg.rotateZ(Math.PI/2);
  const bm=new T.Mesh(bg,bas(0xffe08a,{transparent:true,opacity:.2,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));const bp=new T.Group();bp.position.y=7.45;bp.add(bm);lh.add(bp);A.beam=bp;A.beamM=bm.material;S.add(lh);

  // cabana, fogueira, baú
  const hx=4,hz=9,hy=H(hx,hz),hut=new T.Group();hut.position.set(hx,hy,hz);hut.rotation.y=-.5;
  const hb=new T.Mesh(new T.BoxGeometry(3.2,2.2,2.6),mat(0xa9733b));hb.position.y=1.1;hb.castShadow=hb.receiveShadow=true;hut.add(hb);
  const hr=new T.Mesh(new T.ConeGeometry(2.9,1.5,4),mat(0xc9a24a));hr.rotation.y=Math.PI/4;hr.position.y=2.95;hr.castShadow=true;hut.add(hr);
  const dr=new T.Mesh(new T.BoxGeometry(.8,1.5,.1),mat(0x4a2e18));dr.position.set(-.5,.75,1.32);hut.add(dr);
  A.win=new T.Mesh(new T.BoxGeometry(.7,.6,.1),bas(0xffd27a));A.win.position.set(.8,1.3,1.32);hut.add(A.win);S.add(hut);
  const fx=7.5,fz=10.6,fy=H(fx,fz),fire=new T.Group();fire.position.set(fx,fy,fz);
  for(let i=0;i<3;i++){const lg2=new T.Mesh(new T.CylinderGeometry(.09,.09,.9,5),woodD);lg2.rotation.set(1.3,i*2.1,0);lg2.position.y=.1;fire.add(lg2)}
  const f1=new T.Mesh(new T.ConeGeometry(.3,1,7),bas(0xff7a1a)),f2=new T.Mesh(new T.ConeGeometry(.16,.6,7),bas(0xffe27a));f1.position.y=.6;f2.position.y=.45;fire.add(f1,f2);
  const fl2=new T.PointLight(0xff9a3a,0,16);fl2.position.y=1.2;fire.add(fl2);A.f1=f1;A.f2=f2;A.fl=fl2;S.add(fire);
  const cx=8.7,cz=8.4,ch=new T.Group();ch.position.set(cx,H(cx,cz),cz);ch.rotation.y=.6;
  const cb=new T.Mesh(new T.BoxGeometry(.95,.45,.6),mat(0x7a4a22));cb.position.y=.22;const cl=new T.Mesh(new T.CylinderGeometry(.3,.3,.95,10,1,false,0,Math.PI),mat(0x8a5a2b));cl.rotation.set(0,0,Math.PI/2);cl.rotation.order='ZXY';cl.rotation.x=Math.PI/2;cl.position.y=.45;
  const cg=new T.Mesh(new T.BoxGeometry(.8,.1,.46),bas(0xffcf3a));cg.position.y=.47;ch.add(cb,cl,cg);ch.traverse(o=>o.castShadow=true);S.add(ch);

  // vulcão: lava e partículas
  const vy=H(-6,-5)+.1;
  const lava=new T.Mesh(new T.CircleGeometry(1.7,24).rotateX(-Math.PI/2),bas(0xff5a1a));lava.position.set(-6,vy,-5);S.add(lava);A.lava=lava;
  const vl=new T.PointLight(0xff6a2a,0,30);vl.position.set(-6,vy+2,-5);S.add(vl);A.vl=vl;
  const mk=(n,size,color,op,bl)=>{const gg=new T.BufferGeometry();gg.setAttribute('position',new T.BufferAttribute(new Float32Array(n*3),3));
    const pt=new T.Points(gg,new T.PointsMaterial({size,map:dot(),color,transparent:true,opacity:op,depthWrite:false,blending:bl}));pt.frustumCulled=false;S.add(pt);pt.userData.s=Array.from({length:n},(_,i)=>[Math.random(),Math.random()*6.28,.5+Math.random()]);return pt};
  A.emb=mk(70,.55,0xffa04a,1,T.AdditiveBlending);A.smk=mk(18,7,0x555555,.28,T.NormalBlending);A.vy=vy;

  // nuvens e gaivotas
  const clouds=new T.Group(),cmat=bas(0xffffff,{transparent:true,opacity:.92,fog:false});A.cmat=cmat;
  for(let i=0;i<9;i++){const cg2=new T.Group(),a=i/9*6.28+rr(),r=70+rr()*110;cg2.position.set(Math.cos(a)*r,32+rr()*14,Math.sin(a)*r);
    for(let j=0;j<5;j++){const s=new T.Mesh(new T.SphereGeometry(1,8,6),cmat),k2=5+rr()*5;s.scale.set(k2,k2*.5,k2*.8);s.position.set((j-2)*k2*.9,rr()*2,rr()*3);cg2.add(s)}clouds.add(cg2)}
  S.add(clouds);A.clouds=clouds;
  A.birds=[];const wm=bas(0xffffff,{side:T.DoubleSide});
  for(let i=0;i<7;i++){const b=new T.Group(),w1=new T.Mesh(new T.PlaneGeometry(1,.3).translate(-.5,0,0),wm),w2=new T.Mesh(new T.PlaneGeometry(1,.3).translate(.5,0,0),wm);b.add(w1,w2);b.userData={w1,w2,r:14+rr()*28,s:.12+rr()*.14,a:rr()*6.28,y:9+rr()*8,ph:rr()*6};S.add(b);A.birds.push(b)}

  // pontos de visita (estilo Street View)
  const dk=v=>dock.localToWorld(v);
  const sp0=dk(new T.Vector3(0,.62,8.2));
  const defs=[
    ['Cais',sp0,.62,new T.Vector3(-2,5,-2),'O cais','Do fim do cais se vê a ilha inteira. O navio do pirata balança ao lado, esperando o próximo mapa.'],
    ['Cabana',new T.Vector3(6.1,0,6.6),null,new T.Vector3(7.5,fy+.6,10.6),'Cabana e fogueira','Aqui o pirata descansa, ao lado do baú que guarda as moedas do velho capitão.'],
    ['Farol',new T.Vector3(12.2,0,-7.6),null,new T.Vector3(lx,ly+7,lz),'O farol','Sua luz guia os navios de volta. É aos pés dele que o mapa termina em um X.'],
    ['Vulcão',new T.Vector3(-4.4,0,-3.4),null,new T.Vector3(-7.4,vy-.5,-6.4),'Cratera do vulcão','Do alto, a lava ilumina a noite e a ilha inteira cabe num só olhar.'],
    ['Convés',ship.position.clone().add(new T.Vector3(0,1.4,0)),1.4,new T.Vector3(0,3,0),'Convés do navio','O mundo visto do leme: o cais, o farol e o vulcão ao fundo.']];
  defs.forEach((v,i)=>{const gy0=v[2]==null?H(v[1].x,v[1].z):v[2],pos=new T.Vector3(v[1].x,gy0+1.7,v[1].z),dx=v[3].x-pos.x,dz=v[3].z-pos.z;
    VPS.push({n:v[0],pos,ground:new T.Vector3(v[1].x,gy0+.08,v[1].z),yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(v[3].y-pos.y,Math.hypot(dx,dz)),t:v[4],d:v[5]})});
  A.mk=new T.Group();
  VPS.forEach((v,i)=>{const g2=new T.Group();g2.position.copy(v.ground);g2.userData.i=i;
    const ring=new T.Mesh(new T.RingGeometry(.65,.9,32).rotateX(-Math.PI/2),bas(0xff2fa0,{transparent:true,opacity:.95,fog:false})),disc=new T.Mesh(new T.CircleGeometry(.65,32).rotateX(-Math.PI/2),bas(0xff2fa0,{transparent:true,opacity:.3,fog:false}));
    disc.userData.i=i;g2.add(ring,disc);A.mk.add(g2)});S.add(A.mk);

  // atalhos
  const chips=$('arChips');VPS.forEach((v,i)=>{const b=document.createElement('button');b.className='arChip';b.textContent=v.n;b.onclick=()=>goTo(i);chips.appendChild(b)});
  const v0=VPS[0];C.position.copy(v0.pos);yaw=v0.yaw;pitch=v0.pitch;
  setTod('day');setCap(0);
}

const PR={
  day:{top:0x2e86de,bot:0xbfe6ff,fog:0xbfe6ff,fd:.0065,sun:[.5,.55,.4],sc:0xfff2cc,si:1.05,hs:0xbfe6ff,hg:0x5a8f4a,hi:.75,sea:0x1a86c8,cl:0xffffff,lamp:0,n:0},
  dusk:{top:0x3b2f7a,bot:0xff9a5c,fog:0xe99a70,fd:.0075,sun:[.85,.14,.2],sc:0xff9a4a,si:1,hs:0xf2b48a,hg:0x4a4a6a,hi:.55,sea:0x3d6a9a,cl:0xffc9a0,lamp:.6,n:0},
  night:{top:0x040a1e,bot:0x16264f,fog:0x0b1633,fd:.008,sun:[-.4,.5,.5],sc:0x9bb4ff,si:.5,hs:0x6a82c8,hg:0x1a2a3a,hi:.4,sea:0x0a2a4c,cl:0x3a4a7a,lamp:1,n:1}};
function setTod(k){
  tod=k;const p=PR[k],u=sky.material.uniforms;
  u.uTop.value.setHex(p.top);u.uBot.value.setHex(p.bot);u.uSun.value.set(...p.sun).normalize();u.uSC.value.setHex(p.sc);u.uN.value=p.n;
  A.fog=new T.FogExp2(p.fog,p.fd);if(mode==='tour')S.fog=A.fog;
  sun.color.setHex(p.sc);sun.intensity=p.si;sun.position.set(...p.sun).normalize().multiplyScalar(80);hemi.color.setHex(p.hs);hemi.groundColor.setHex(p.hg);hemi.intensity=p.hi;
  sea.material.color.setHex(p.sea);base.material.color.setHex(p.sea);A.cmat.color.setHex(p.cl);A.lamp=p.lamp;
  shallow.material.color.setScalar(p.n?.28:k==='dusk'?.75:1);
  A.beamM.opacity=.05+.15*p.lamp;A.birds.forEach(b=>b.visible=!p.n);
  document.querySelectorAll('.arTod').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
}
function setCap(i){$('arCapT').textContent=VPS[i].t;$('arCapP').textContent=VPS[i].d;document.querySelectorAll('.arChip').forEach((b,j)=>b.classList.toggle('on',j===i));A.mk.children.forEach((g,j)=>g.visible=j!==i&&mode==='tour')}
function goTo(i){
  if(mode!=='tour')return;idle=false;const v=VPS[i];let ty=v.yaw;const d=((ty-yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;ty=yaw+d;
  tw={t:0,dur:1.3,fp:C.position.clone(),tp:v.pos,fy:yaw,ty,fpi:pitch,tpi:v.pitch};cur=i;setCap(i);
}
function setMode(m){
  const was=mode;mode=m;const top=m==='top';
  document.querySelectorAll('.arMode').forEach(b=>b.classList.toggle('on',b.dataset.k===m));ov.classList.toggle('isTop',top);
  S.fog=A.fog;A.mk.visible=!top;C.fov=top?50:fov;C.updateProjectionMatrix();idle=!top?false:true;
  if(top){aP=1.0;aD=62}
  if(!top&&was==='top'){const v=VPS[cur];C.position.copy(v.pos);yaw=v.yaw;pitch=v.pitch}
  setCap(cur);
}
function toast(t){const e=$('arToast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),5200)}

// giroscópio
const zee=new T.Vector3(0,0,1),q0=new T.Quaternion(),q1=new T.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5)),eu=new T.Euler();
function onOri(e){
  if(e.alpha==null)return;const o=(screen.orientation?screen.orientation.angle:window.orientation||0)*Math.PI/180,r=Math.PI/180;
  eu.set(e.beta*r,e.alpha*r,-e.gamma*r,'YXZ');devQ.setFromEuler(eu).multiply(q1).multiply(q0.setFromAxisAngle(zee,-o));
  if(!hasDev){hasDev=true;const f=new T.Vector3(0,0,-1).applyQuaternion(devQ);gOff=yaw-Math.atan2(-f.x,-f.z)}
}
async function toggleGyro(){
  const b=$('arGyro');
  if(gy){gy=false;hasDev=false;removeEventListener('deviceorientation',onOri);b.classList.remove('on');pitch=0;return}
  try{if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted')return}}catch(e){return}
  gy=true;hasDev=false;addEventListener('deviceorientation',onOri);b.classList.add('on');setMode('tour');idle=false;
}

// controles
const pts=new Map();let pd=0,moved=0;const ray=new T.Raycaster(),nd=new T.Vector2();
function bind(){
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;idle=false;if(pts.size===2){const[a,b]=[...pts.values()];pd=Math.hypot(a.x-b.x,a.y-b.y)}});
  cv.addEventListener('pointermove',e=>{
    const o=pts.get(e.pointerId);if(!o)return;const dx=e.clientX-o.x,dy=e.clientY-o.y;o.x=e.clientX;o.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
    if(pts.size===2){const[a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoom(pd/d);pd=d;return}
    const k=(mode==='top'?.9:fov*Math.PI/180)/cv.clientHeight;
    if(mode==='top'){aY-=dx*k*1.6;aP=Math.min(1.45,Math.max(.25,aP+dy*k*1.6))}
    else if(gy)gOff-=dx*k;else{yaw+=dx*k;pitch=Math.min(1.35,Math.max(-1.35,pitch+dy*k))}});
  const up=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);if(pts.size===0&&moved<8&&mode==='tour')tap(e)};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>pts.delete(e.pointerId));
  cv.addEventListener('wheel',e=>{e.preventDefault();zoom(1+e.deltaY*.0012)},{passive:false});
}
function zoom(f){idle=false;if(mode==='top')aD=Math.min(110,Math.max(26,aD*f));else{fov=Math.min(95,Math.max(32,fov*f));C.fov=fov;C.updateProjectionMatrix()}}
function tap(e){
  const r=cv.getBoundingClientRect();nd.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));ray.setFromCamera(nd,C);
  const h=ray.intersectObjects(A.mk.children,true).find(x=>x.object.userData.i!=null&&x.object.parent.visible);if(h)goTo(h.object.userData.i);
}

function resize(){const w=ov.clientWidth,h=ov.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
function frame(now){
  if(!run)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000||.016);last=now;tt+=dt;
  // mar
  const sp=sea.geometry.attributes.position;for(let i=0;i<sp.count;i++){const x=A.sx[i],z=A.sz[i];sp.setY(i,.16*Math.sin(x*.32+tt*1.1)+.12*Math.sin(z*.41+tt*1.4)+.06*Math.sin((x+z)*.9+tt*2))}sp.needsUpdate=true;
  A.ship.position.y=.1+.16*Math.sin(tt*1.1);A.ship.rotation.z=.035*Math.sin(tt*.9);
  const lf=.25+.75*A.lamp,fk=.8+.2*Math.sin(tt*17)+.1*Math.sin(tt*31);
  A.fl.intensity=1.8*lf*fk;A.f1.scale.set(1,.85+.25*Math.sin(tt*14),1);A.f2.scale.set(1,.8+.3*Math.sin(tt*19),1);A.shipLamp.intensity=1.2*A.lamp;
  A.lhLight.intensity=2.4*lf;A.vl.intensity=2.2*lf*(.9+.1*Math.sin(tt*3));A.win.material.color.setScalar(.55+.45*A.lamp);A.lava.material.color.setHSL(.05,1,.45+.07*Math.sin(tt*2.5));
  A.beam.rotation.y=tt*.8;
  const e=A.emb.geometry.attributes.position,es=A.emb.userData.s;for(let i=0;i<es.length;i++){const s=es[i],l=(tt*(.25+s[2]*.3)+s[0])%1;e.setXYZ(i,-6+Math.cos(s[1])*(.4+l*2.2*s[0]),A.vy+l*8,-5+Math.sin(s[1])*(.4+l*2.2*s[0]))}e.needsUpdate=true;
  const m=A.smk.geometry.attributes.position,ms=A.smk.userData.s;for(let i=0;i<ms.length;i++){const s=ms[i],l=(tt*.06*(.6+s[2])+s[0])%1;m.setXYZ(i,-6+Math.cos(s[1])*l*3+l*6,A.vy+2+l*20,-5+Math.sin(s[1])*l*3)}m.needsUpdate=true;
  A.clouds.rotation.y+=dt*.004;
  A.birds.forEach(b=>{const u=b.userData;u.a+=dt*u.s;b.position.set(Math.cos(u.a)*u.r,u.y+Math.sin(tt*.7+u.ph),Math.sin(u.a)*u.r);b.rotation.y=-u.a;const f=Math.sin(tt*8+u.ph)*.55;u.w1.rotation.z=f;u.w2.rotation.z=-f});
  A.mk.children.forEach((g,i)=>{const s=1+.12*Math.sin(tt*3+i);g.scale.set(s,1,s)});
  if(mode==='top'){
    if(idle)aY+=dt*.12;
    const cy=3;C.position.set(Math.sin(aY)*Math.cos(aP)*aD,cy+Math.sin(aP)*aD,Math.cos(aY)*Math.cos(aP)*aD);C.lookAt(0,cy,0);
  }else{
    if(tw){tw.t+=dt;const k0=Math.min(1,tw.t/tw.dur),k=k0*k0*(3-2*k0);C.position.lerpVectors(tw.fp,tw.tp,k);C.position.y+=Math.sin(k0*Math.PI)*2.5;yaw=tw.fy+(tw.ty-tw.fy)*k;pitch=tw.fpi+(tw.tpi-tw.fpi)*k;if(k0>=1)tw=null}
    else if(idle)yaw+=dt*.07;
    if(gy&&hasDev)C.quaternion.setFromAxisAngle(new T.Vector3(0,1,0),gOff).multiply(devQ);else C.rotation.set(pitch,yaw,0);
  }
  R.render(S,C);
}
function start(){run=true;last=performance.now();resize();raf=requestAnimationFrame(frame)}

function open(){
  ov.classList.add('show');document.documentElement.style.overflow='hidden';
  if(built){start();return}
  loadEl.classList.add('show');
  setTimeout(()=>{try{build();bind();built=true;start();setTimeout(()=>ov.classList.add('hint'),400);setTimeout(()=>ov.classList.remove('hint'),5200)}catch(err){console.error(err);toast('Seu navegador não conseguiu iniciar o 3D (WebGL).')}loadEl.classList.remove('show')},60);
}
function close(){run=false;cancelAnimationFrame(raf);if(mode==='top'){setMode('tour')}ov.classList.remove('show');document.documentElement.style.overflow=''}
$('arBtn').onclick=open;$('arClose').onclick=close;
document.querySelectorAll('.arTod').forEach(b=>b.onclick=()=>built&&setTod(b.dataset.k));
document.querySelectorAll('.arMode').forEach(b=>b.onclick=()=>built&&setMode(b.dataset.k));
$('arGyro').onclick=toggleGyro;
if(!(matchMedia('(pointer:coarse)').matches&&'DeviceOrientationEvent' in window))$('arGyro').style.display='none';
addEventListener('resize',()=>{if(built&&run)resize()});
addEventListener('keydown',e=>{if(!ov.classList.contains('show'))return;if(e.key==='Escape')close();if(mode==='tour'&&built){if(e.key==='ArrowRight')goTo((cur+1)%VPS.length);if(e.key==='ArrowLeft')goTo((cur+VPS.length-1)%VPS.length)}});
})();
