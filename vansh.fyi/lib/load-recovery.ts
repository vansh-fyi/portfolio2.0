/**
 * Inline script, first thing in <body>. A cold first visit can lose requests (timeouts, resets), and
 * nothing retries them: a lost JS chunk leaves a page that never hydrates, a lost <img> stays blank
 * (Safari does not retry). This runs before any other script, so its capture listener sees them all.
 *  - <img>: re-request up to 3 times with growing delay.
 *  - <script>/<link rel=stylesheet|modulepreload> from /_next/: reload once (guarded in sessionStorage
 *    so a genuine outage cannot cause a reload loop).
 */
export const loadRecoveryScript = `(function(){
var retries=new WeakMap();
var reloaded=false;
function reload(){
  if(reloaded)return;reloaded=true;
  try{
    var k='load-recovery-reload',last=+sessionStorage.getItem(k)||0;
    if(Date.now()-last<30000)return;
    sessionStorage.setItem(k,String(Date.now()));
  }catch(e){}
  location.reload();
}
document.addEventListener('error',function(e){
  var t=e.target;
  if(!t||!t.tagName)return;
  if(t.tagName==='IMG'){
    var n=retries.get(t)||0;
    if(n>=3)return;
    retries.set(t,n+1);
    setTimeout(function(){
      var ss=t.getAttribute('srcset'),s=t.getAttribute('src');
      if(ss){t.removeAttribute('srcset');t.setAttribute('srcset',ss);}
      if(s){t.removeAttribute('src');t.setAttribute('src',s);}
    },800*(n+1));
  }else if(t.tagName==='SCRIPT'||t.tagName==='LINK'){
    var u=t.src||t.href||'';
    if(u.indexOf('/_next/')>-1)setTimeout(reload,500);
  }
},true);
})();`;
