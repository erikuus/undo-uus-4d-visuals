(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();function L(t,r,o,i){const e=Math.sin(i),s=Math.cos(i),a=t[r],c=t[o];return{...t,[r]:a*s-c*e,[o]:a*e+c*s}}function j(t,r){return L(t,"x","y",r)}function k(t,r){return L(t,"x","z",r)}function N(t,r){return L(t,"y","z",r)}function Y(t,r){return L(t,"x","w",r)}function B(t,r){return L(t,"y","w",r)}function V(t,r){return L(t,"z","w",r)}const H=2*Math.PI,b=124.7354645891,A={xy:3.034538902655*b,xz:5.028469563403*b,yz:7.037635209575*b,xw:11.06479853421*b,yw:13.08750265132*b,zw:17.00573092632*b};function T(t){for(;t>=H;)t-=H;for(;t<0;)t+=H;return t}function Z(t){const r=[],o={xy:0,xz:0,yz:0,xw:0,yw:0,zw:0};for(let i=0;i<t;i+=1){let e={x:1,y:.7,z:.8,w:.9};o.xy=T(o.xy+A.xy),e=j(e,o.xy),o.xz=T(o.xz+A.xz),e=k(e,o.xz),o.yz=T(o.yz+A.yz),e=N(e,o.yz),o.xw=T(o.xw+A.xw),e=Y(e,o.xw),o.yw=T(o.yw+A.yw),e=B(e,o.yw),o.zw=T(o.zw+A.zw),e=V(e,o.zw),r.push(e)}return r}function G(t,r,o,i,e){const{stereoHalfAngle:s,pointRadius:a,scaleX:c,palette:f,background:m}=i,h=t.canvas.width,u=t.canvas.height,g=h/2-h/4,x=h/2+h/4,w=Math.sin(s),z=Math.cos(s),M=Math.sin(e),E=Math.cos(e);t.fillStyle=m,t.fillRect(0,0,h,u);for(let p=0;p<r.length;p+=1){const l=r[p];if(l.w*E-l.x*M<0)continue;const v=l.w*M+l.x*E,P=l.z,I=v*z+P*w,R=v*z-P*w,O=I*c+g,_=R*c+x,$=o[p];t.fillStyle=f[p%f.length],t.beginPath(),t.arc(O,$,a,0,Math.PI*2),t.fill(),t.beginPath(),t.arc(_,$,a,0,Math.PI*2),t.fill()}}const K=1e3,Q=.012,J=.15*.5,tt=["#0000aa","#00aa00","#00aaaa","#ffff55"];function ot(t){const r=(()=>{const c=t.getContext("2d");if(!c)throw new Error("Unable to acquire 2D rendering context.");return c})(),o=Z(K);let i=0,e=[];const s=()=>{const c=t.parentElement;if(c){const h=c.getBoundingClientRect(),u=Math.max(320,Math.floor(h.width)),g=Math.floor(window.innerHeight*.65),x=Math.max(240,Math.min(g,Math.floor(u*(350/640))));t.width=u,t.height=x}else t.width=640,t.height=350;const f=t.height/350*70,m=t.height/2;e=o.map(h=>h.y*f+m)},a=()=>{i+=Q,i>=Math.PI*2&&(i-=Math.PI*2);const c=t.width/640*80;t.height/350*70,G(r,o,e,{stereoHalfAngle:J,pointRadius:2,scaleX:c,palette:tt,background:"#080808"},i),requestAnimationFrame(a)};return s(),requestAnimationFrame(a),{resize:s}}const F=.99,U=.61,X=.86,W=.74;function et(){const t=[];for(let r=0;r<2;r++)for(let o=0;o<2;o++)for(let i=0;i<2;i++)for(let e=0;e<2;e++)t.push({x:r===0?F:-F,y:o===0?U:-U,z:i===0?X:-X,w:e===0?W:-W});return t}function n(t,r,o,i){return t*8+r*4+o*2+i}function nt(){return[{from:n(0,0,0,0),to:n(1,0,0,0),color:1},{from:n(0,1,0,0),to:n(1,1,0,0),color:2},{from:n(0,0,1,0),to:n(1,0,1,0),color:3},{from:n(0,1,1,0),to:n(1,1,1,0),color:4},{from:n(0,0,0,1),to:n(1,0,0,1),color:4},{from:n(0,1,0,1),to:n(1,1,0,1),color:3},{from:n(0,0,1,1),to:n(1,0,1,1),color:2},{from:n(0,1,1,1),to:n(1,1,1,1),color:1},{from:n(0,0,0,0),to:n(0,1,0,0),color:5},{from:n(1,0,0,0),to:n(1,1,0,0),color:6},{from:n(0,0,1,0),to:n(0,1,1,0),color:7},{from:n(1,0,1,0),to:n(1,1,1,0),color:7},{from:n(0,0,0,1),to:n(0,1,0,1),color:7},{from:n(1,0,0,1),to:n(1,1,0,1),color:7},{from:n(0,0,1,1),to:n(0,1,1,1),color:6},{from:n(1,0,1,1),to:n(1,1,1,1),color:5},{from:n(0,0,0,0),to:n(0,0,1,0),color:8},{from:n(1,0,0,0),to:n(1,0,1,0),color:9},{from:n(0,1,0,0),to:n(0,1,1,0),color:10},{from:n(1,1,0,0),to:n(1,1,1,0),color:11},{from:n(0,0,0,1),to:n(0,0,1,1),color:11},{from:n(1,0,0,1),to:n(1,0,1,1),color:10},{from:n(0,1,0,1),to:n(0,1,1,1),color:9},{from:n(1,1,0,1),to:n(1,1,1,1),color:8},{from:n(0,0,0,0),to:n(0,0,0,1),color:12},{from:n(1,0,0,0),to:n(1,0,0,1),color:13},{from:n(0,1,0,0),to:n(0,1,0,1),color:14},{from:n(1,1,0,0),to:n(1,1,0,1),color:15},{from:n(0,0,1,0),to:n(0,0,1,1),color:15},{from:n(1,0,1,0),to:n(1,0,1,1),color:14},{from:n(0,1,1,0),to:n(0,1,1,1),color:13},{from:n(1,1,1,0),to:n(1,1,1,1),color:12}]}function rt(t,r){let o={...t};const i=Math.sin(r.xy),e=Math.cos(r.xy),s=o.x*e+o.y*i,a=-o.x*i+o.y*e;o.x=s,o.y=a;const c=Math.sin(r.xz),f=Math.cos(r.xz),m=o.x*f+o.z*c,h=-o.x*c+o.z*f;o.x=m,o.z=h;const u=Math.sin(r.yz),g=Math.cos(r.yz),x=o.y*g+o.z*u,w=-o.y*u+o.z*g;o.y=x,o.z=w;const z=Math.sin(r.xw),M=Math.cos(r.xw),E=o.x*M+o.w*z,p=-o.x*z+o.w*M;o.x=E,o.w=p;const l=Math.sin(r.yw),y=Math.cos(r.yw),v=o.y*y+o.w*l,P=-o.y*l+o.w*y;o.y=v,o.w=P;const I=Math.sin(r.zw),R=Math.cos(r.zw),O=o.z*R+o.w*I,_=-o.z*I+o.w*R;return o.z=O,o.w=_,o}function it(t,r){const o=Math.sin(r),i=Math.cos(r);return{x:t.x*i-t.z*o,z:t.x*o+t.z*i}}function st(t,r,o,i,e){const{stereoHalfAngle:s,scaleX:a,scaleY:c,palette:f,background:m,lineWidth:h}=e,u=t.canvas.width,g=t.canvas.height;t.fillStyle=m,t.fillRect(0,0,u,g);const x=r.map(w=>rt(w,i));for(let w=0;w<2;w++){const z=w===0?u/4:u/4*3,M=g/2,E=w===0?s:-s,p=[];for(const l of x){const y=it({x:l.x,z:l.z},E);p.push({x:y.x*a+z,y:l.y*c+M})}t.lineWidth=h;for(const l of o){const y=p[l.from],v=p[l.to];t.strokeStyle=f[l.color-1]||f[f.length-1],t.beginPath(),t.moveTo(y.x,y.y),t.lineTo(v.x,v.y),t.stroke()}}}const d=2*Math.PI,S=2,C={xy:.0055*S,xz:.0027*S,yz:.0034*S,xw:2e-4*S,yw:.0039*S,zw:.0091*S},ct=.15*.5,at=["#ffffff","#0000aa","#00aa00","#005555","#00aa00","#00aa55","#00aaaa","#00aaff","#aaaa00","#aaaa55","#55ff55","#55ffaa","#55ffff","#ffff55","#ffffff"];function lt(t){const r=(()=>{const c=t.getContext("2d");if(!c)throw new Error("Unable to acquire 2D rendering context.");return c})(),o=et(),i=nt(),e={xy:0,xz:0,yz:0,xw:0,yw:0,zw:0},s=()=>{const c=t.parentElement;if(c){const f=c.getBoundingClientRect(),m=Math.max(320,Math.floor(f.width)),h=Math.floor(window.innerHeight*.65),u=Math.max(240,Math.min(h,Math.floor(m*(350/640))));t.width=m,t.height=u}else t.width=640,t.height=350},a=()=>{e.xy+=C.xy,e.xz+=C.xz,e.yz+=C.yz,e.xw+=C.xw,e.yw+=C.yw,e.zw+=C.zw,e.xy>d&&(e.xy-=d),e.xz>d&&(e.xz-=d),e.yz>d&&(e.yz-=d),e.xw>d&&(e.xw-=d),e.yw>d&&(e.yw-=d),e.zw>d&&(e.zw-=d);const c=t.width/640*80,f=t.height/350*70;st(r,o,i,e,{stereoHalfAngle:ct,scaleX:c,scaleY:f,palette:at,background:"#080808",lineWidth:1.5}),requestAnimationFrame(a)};return s(),requestAnimationFrame(a),{resize:s}}const D={four16:{create:ot,title:"4D Sphere (S³) – W-Gated Stereo",description:"A 4D point cloud on the 3-sphere, with perceptual W-gate hiding half the space."},four01:{create:lt,title:"4D Tesseract – Rotating Hyperrectangle",description:"A 4D rectangular parallelepiped rotating through all six 4D planes."}};function ft(){const t=window.location.hash.slice(1);return t in D?t:null}function ht(){const t=document.getElementById("app");t&&(t.innerHTML=`
    <div class="landing">
      <header class="landing-header">
        <h1>4D Visualisations</h1>
        <p class="subtitle">Reconstructions of Undo Uus's experiments in human perception (1997–2000)</p>
        <a href="https://github.com/erikuus/undo-uus-4d-visuals" class="github-link" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Source code and archival material
        </a>
      </header>

      <section class="intro">
        <p>
          Humans experience a three-dimensional world even though the images formed on the retina are two-dimensional.
          This is possible because the visual system detects invariant structure in changing projections — for example,
          recognizing a rigid 3D object from a sequence of 2D views.
        </p>
        <p class="question">
          These experiments explore a simple but unconventional question:
        </p>
        <p class="emphasis">
          Could the same perceptual mechanism, when supplied with the right kind of input,
          recognize a rigid four-dimensional object from dynamically changing three-dimensional projections?
        </p>
        <p>
          The visualizations presented here are modern reconstructions of programs written by Undo Uus between
          1997–2000 to generate such stimuli using stereoscopic rendering and mathematically correct
          four-dimensional rotations.
        </p>
      </section>

      <section class="experiments">
        <h2>Experiments</h2>
        <div class="vis-grid">
          ${Object.entries(D).map(([r,o])=>`
            <a href="#${r}" class="vis-card">
              <div class="vis-card-icon">${r==="four16"?"◉":"⬡"}</div>
              <h3>${o.title}</h3>
              <p>${o.description}</p>
            </a>
          `).join("")}
        </div>
      </section>

      <footer class="landing-footer">
        <div class="footer-legal">
          <p>© 1997–2000 Undo Uus (original experiments)</p>
          <p>© 2024–present Erik Uus (reconstructions and archival presentation)</p>
          <p class="disclaimer">This site is a research and archival project, not a commercial product.</p>
        </div>
      </footer>
    </div>
  `)}function ut(t){const r=D[t],o=document.getElementById("app");if(!o||!r)return;o.innerHTML=`
    <div class="container">
      <nav class="vis-nav">
        <a href="#" class="back-link">← All Visualisations</a>
      </nav>
      <h1>${r.title}</h1>
      <p>${r.description}</p>
      <canvas id="canvas"></canvas>
      <p class="stereo-hint">For stereoscopic depth perception, view the left and right images using relaxed parallel gaze or cross-eye viewing.</p>
      <footer>Reconstruction of Undo Uus's QBasic experiment (1997–2000).</footer>
    </div>
  `;const i=document.getElementById("canvas");if(!(i instanceof HTMLCanvasElement))throw new Error('Expected a <canvas id="canvas"> element.');const e=r.create(i),s=()=>{var a;return(a=e==null?void 0:e.resize)==null?void 0:a.call(e)};window.addEventListener("resize",s),window.__visCleanup=()=>{window.removeEventListener("resize",s)}}function q(){const t=window.__visCleanup;t&&(t(),delete window.__visCleanup);const r=ft();r?ut(r):ht()}window.addEventListener("hashchange",q);q();
