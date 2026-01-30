(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();function C(t,r,e,i){const o=Math.sin(i),s=Math.cos(i),a=t[r],c=t[e];return{...t,[r]:a*s-c*o,[e]:a*o+c*s}}function q(t,r){return C(t,"x","y",r)}function N(t,r){return C(t,"x","z",r)}function Y(t,r){return C(t,"y","z",r)}function k(t,r){return C(t,"x","w",r)}function B(t,r){return C(t,"y","w",r)}function V(t,r){return C(t,"z","w",r)}const H=2*Math.PI,E=124.7354645891,A={xy:3.034538902655*E,xz:5.028469563403*E,yz:7.037635209575*E,xw:11.06479853421*E,yw:13.08750265132*E,zw:17.00573092632*E};function S(t){for(;t>=H;)t-=H;for(;t<0;)t+=H;return t}function Z(t){const r=[],e={xy:0,xz:0,yz:0,xw:0,yw:0,zw:0};for(let i=0;i<t;i+=1){let o={x:1,y:.7,z:.8,w:.9};e.xy=S(e.xy+A.xy),o=q(o,e.xy),e.xz=S(e.xz+A.xz),o=N(o,e.xz),e.yz=S(e.yz+A.yz),o=Y(o,e.yz),e.xw=S(e.xw+A.xw),o=k(o,e.xw),e.yw=S(e.yw+A.yw),o=B(o,e.yw),e.zw=S(e.zw+A.zw),o=V(o,e.zw),r.push(o)}return r}function G(t,r,e,i,o){const{stereoHalfAngle:s,pointRadius:a,scaleX:c,palette:f,background:m}=i,h=t.canvas.width,u=t.canvas.height,g=h/2-h/4,x=h/2+h/4,w=Math.sin(s),z=Math.cos(s),M=Math.sin(o),b=Math.cos(o);t.fillStyle=m,t.fillRect(0,0,h,u);for(let p=0;p<r.length;p+=1){const l=r[p];if(l.w*b-l.x*M<0)continue;const v=l.w*M+l.x*b,P=l.z,I=v*z+P*w,R=v*z-P*w,O=I*c+g,_=R*c+x,F=e[p];t.fillStyle=f[p%f.length],t.beginPath(),t.arc(O,F,a,0,Math.PI*2),t.fill(),t.beginPath(),t.arc(_,F,a,0,Math.PI*2),t.fill()}}const K=1e3,Q=.012,J=.15*.5,tt=["#0000aa","#00aa00","#00aaaa","#ffff55"];function et(t){const r=(()=>{const c=t.getContext("2d");if(!c)throw new Error("Unable to acquire 2D rendering context.");return c})(),e=Z(K);let i=0,o=[];const s=()=>{const c=t.parentElement;if(c){const h=c.getBoundingClientRect(),u=Math.max(320,Math.floor(h.width)),g=Math.floor(window.innerHeight*.65),x=Math.max(240,Math.min(g,Math.floor(u*(350/640))));t.width=u,t.height=x}else t.width=640,t.height=350;const f=t.height/350*70,m=t.height/2;o=e.map(h=>h.y*f+m)},a=()=>{i+=Q,i>=Math.PI*2&&(i-=Math.PI*2);const c=t.width/640*80;t.height/350*70,G(r,e,o,{stereoHalfAngle:J,pointRadius:2,scaleX:c,palette:tt,background:"#080808"},i),requestAnimationFrame(a)};return s(),requestAnimationFrame(a),{resize:s}}const U=.99,W=.61,X=.86,D=.74;function ot(){const t=[];for(let r=0;r<2;r++)for(let e=0;e<2;e++)for(let i=0;i<2;i++)for(let o=0;o<2;o++)t.push({x:r===0?U:-U,y:e===0?W:-W,z:i===0?X:-X,w:o===0?D:-D});return t}function n(t,r,e,i){return t*8+r*4+e*2+i}function nt(){return[{from:n(0,0,0,0),to:n(1,0,0,0),color:1},{from:n(0,1,0,0),to:n(1,1,0,0),color:2},{from:n(0,0,1,0),to:n(1,0,1,0),color:3},{from:n(0,1,1,0),to:n(1,1,1,0),color:4},{from:n(0,0,0,1),to:n(1,0,0,1),color:4},{from:n(0,1,0,1),to:n(1,1,0,1),color:3},{from:n(0,0,1,1),to:n(1,0,1,1),color:2},{from:n(0,1,1,1),to:n(1,1,1,1),color:1},{from:n(0,0,0,0),to:n(0,1,0,0),color:5},{from:n(1,0,0,0),to:n(1,1,0,0),color:6},{from:n(0,0,1,0),to:n(0,1,1,0),color:7},{from:n(1,0,1,0),to:n(1,1,1,0),color:7},{from:n(0,0,0,1),to:n(0,1,0,1),color:7},{from:n(1,0,0,1),to:n(1,1,0,1),color:7},{from:n(0,0,1,1),to:n(0,1,1,1),color:6},{from:n(1,0,1,1),to:n(1,1,1,1),color:5},{from:n(0,0,0,0),to:n(0,0,1,0),color:8},{from:n(1,0,0,0),to:n(1,0,1,0),color:9},{from:n(0,1,0,0),to:n(0,1,1,0),color:10},{from:n(1,1,0,0),to:n(1,1,1,0),color:11},{from:n(0,0,0,1),to:n(0,0,1,1),color:11},{from:n(1,0,0,1),to:n(1,0,1,1),color:10},{from:n(0,1,0,1),to:n(0,1,1,1),color:9},{from:n(1,1,0,1),to:n(1,1,1,1),color:8},{from:n(0,0,0,0),to:n(0,0,0,1),color:12},{from:n(1,0,0,0),to:n(1,0,0,1),color:13},{from:n(0,1,0,0),to:n(0,1,0,1),color:14},{from:n(1,1,0,0),to:n(1,1,0,1),color:15},{from:n(0,0,1,0),to:n(0,0,1,1),color:15},{from:n(1,0,1,0),to:n(1,0,1,1),color:14},{from:n(0,1,1,0),to:n(0,1,1,1),color:13},{from:n(1,1,1,0),to:n(1,1,1,1),color:12}]}function rt(t,r){let e={...t};const i=Math.sin(r.xy),o=Math.cos(r.xy),s=e.x*o+e.y*i,a=-e.x*i+e.y*o;e.x=s,e.y=a;const c=Math.sin(r.xz),f=Math.cos(r.xz),m=e.x*f+e.z*c,h=-e.x*c+e.z*f;e.x=m,e.z=h;const u=Math.sin(r.yz),g=Math.cos(r.yz),x=e.y*g+e.z*u,w=-e.y*u+e.z*g;e.y=x,e.z=w;const z=Math.sin(r.xw),M=Math.cos(r.xw),b=e.x*M+e.w*z,p=-e.x*z+e.w*M;e.x=b,e.w=p;const l=Math.sin(r.yw),y=Math.cos(r.yw),v=e.y*y+e.w*l,P=-e.y*l+e.w*y;e.y=v,e.w=P;const I=Math.sin(r.zw),R=Math.cos(r.zw),O=e.z*R+e.w*I,_=-e.z*I+e.w*R;return e.z=O,e.w=_,e}function it(t,r){const e=Math.sin(r),i=Math.cos(r);return{x:t.x*i-t.z*e,z:t.x*e+t.z*i}}function st(t,r,e,i,o){const{stereoHalfAngle:s,scaleX:a,scaleY:c,palette:f,background:m,lineWidth:h}=o,u=t.canvas.width,g=t.canvas.height;t.fillStyle=m,t.fillRect(0,0,u,g);const x=r.map(w=>rt(w,i));for(let w=0;w<2;w++){const z=w===0?u/4:u/4*3,M=g/2,b=w===0?s:-s,p=[];for(const l of x){const y=it({x:l.x,z:l.z},b);p.push({x:y.x*a+z,y:l.y*c+M})}t.lineWidth=h;for(const l of e){const y=p[l.from],v=p[l.to];t.strokeStyle=f[l.color-1]||f[f.length-1],t.beginPath(),t.moveTo(y.x,y.y),t.lineTo(v.x,v.y),t.stroke()}}}const d=2*Math.PI,T=2,L={xy:.0055*T,xz:.0027*T,yz:.0034*T,xw:2e-4*T,yw:.0039*T,zw:.0091*T},ct=.15*.5,at=["#ffffff","#0000aa","#00aa00","#005555","#00aa00","#00aa55","#00aaaa","#00aaff","#aaaa00","#aaaa55","#55ff55","#55ffaa","#55ffff","#ffff55","#ffffff"];function lt(t){const r=(()=>{const c=t.getContext("2d");if(!c)throw new Error("Unable to acquire 2D rendering context.");return c})(),e=ot(),i=nt(),o={xy:0,xz:0,yz:0,xw:0,yw:0,zw:0},s=()=>{const c=t.parentElement;if(c){const f=c.getBoundingClientRect(),m=Math.max(320,Math.floor(f.width)),h=Math.floor(window.innerHeight*.65),u=Math.max(240,Math.min(h,Math.floor(m*(350/640))));t.width=m,t.height=u}else t.width=640,t.height=350},a=()=>{o.xy+=L.xy,o.xz+=L.xz,o.yz+=L.yz,o.xw+=L.xw,o.yw+=L.yw,o.zw+=L.zw,o.xy>d&&(o.xy-=d),o.xz>d&&(o.xz-=d),o.yz>d&&(o.yz-=d),o.xw>d&&(o.xw-=d),o.yw>d&&(o.yw-=d),o.zw>d&&(o.zw-=d);const c=t.width/640*80,f=t.height/350*70;st(r,e,i,o,{stereoHalfAngle:ct,scaleX:c,scaleY:f,palette:at,background:"#080808",lineWidth:1.5}),requestAnimationFrame(a)};return s(),requestAnimationFrame(a),{resize:s}}const $={four16:{create:et,title:"4D Sphere (S³) – W-Gated Stereo",description:"A 4D point cloud on the 3-sphere, with perceptual W-gate hiding half the space."},four01:{create:lt,title:"4D Tesseract – Rotating Hyperrectangle",description:"A 4D rectangular parallelepiped rotating through all six 4D planes."}};function ft(){const t=window.location.hash.slice(1);return t in $?t:null}function ht(){const t=document.getElementById("app");t&&(t.innerHTML=`
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
          We are able to perceive a stable three-dimensional object from changing two-dimensional images—for
          example when watching a film, a computer screen, or a rotating object rendered on a flat display.
          Although only two-dimensional projections are presented, the perceptual system reconstructs a
          coherent three-dimensional form.
        </p>
        <p class="question">
          These experiments explore a simple but unconventional question:
        </p>
        <p class="emphasis">
          If the perceptual system can recognize a stable three-dimensional structure in dynamically changing
          two-dimensional projections, might it also—when supplied with genuine stereoscopic three-dimensional
          input—recognize a stable four-dimensional structure—so that what initially appears as a changing
          three-dimensional scene is instead experienced as a coherent four-dimensional form?
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
          ${Object.entries($).map(([r,e])=>`
            <a href="#${r}" class="vis-card">
              <div class="vis-card-icon">${r==="four16"?"◉":"⬡"}</div>
              <h3>${e.title}</h3>
              <p>${e.description}</p>
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
  `)}function ut(t){const r=$[t],e=document.getElementById("app");if(!e||!r)return;e.innerHTML=`
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
  `;const i=document.getElementById("canvas");if(!(i instanceof HTMLCanvasElement))throw new Error('Expected a <canvas id="canvas"> element.');const o=r.create(i),s=()=>{var a;return(a=o==null?void 0:o.resize)==null?void 0:a.call(o)};window.addEventListener("resize",s),window.__visCleanup=()=>{window.removeEventListener("resize",s)}}function j(){const t=window.__visCleanup;t&&(t(),delete window.__visCleanup);const r=ft();r?ut(r):ht()}window.addEventListener("hashchange",j);j();
