import { $, root, RM } from './util.js';

const waveCanvas = $('#wave-field'), waveCtx = waveCanvas.getContext('2d');
let waveWidth = innerWidth, waveHeight = innerHeight, waveTime = 0;
let pointerX = innerWidth / 2, pointerY = innerHeight / 2, smoothX = pointerX, smoothY = pointerY, presence = 0, targetPresence = 0;
let waveColors = [], cursorGlow = "";
// phones/tablets: lower resolution + ~30fps so scrolling stays smooth and battery friendly
let lite = false, acc = 0;
function resizeWaves() {
  waveWidth = innerWidth; waveHeight = innerHeight;
  lite = matchMedia('(pointer: coarse), (max-width: 760px)').matches;
  const dpr = lite ? 1 : Math.min(devicePixelRatio || 1, 2);
  waveCanvas.width = Math.round(waveWidth * dpr); waveCanvas.height = Math.round(waveHeight * dpr);
  if (waveCtx) waveCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const styles = getComputedStyle(root);
  waveColors = [styles.getPropertyValue('--wave').trim(), styles.getPropertyValue('--wave2').trim()];
  cursorGlow = styles.getPropertyValue('--accent').trim();
  if (RM) drawWaves(0);
}
export function drawWaves(dt) {
  if (!waveCtx || document.hidden) return;
  if (lite && dt > 0) { acc += dt; if (acc < 1 / 30) return; dt = acc; acc = 0; }
  waveTime += dt;
  const ease = 1 - Math.exp(-dt * 4);
  smoothX += (pointerX - smoothX) * ease; smoothY += (pointerY - smoothY) * ease;
  presence += (targetPresence - presence) * ease;
  waveCtx.clearRect(0, 0, waveWidth, waveHeight);
  if (presence > .001 && !RM) {
    const glow = waveCtx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, 180);
    glow.addColorStop(0, cursorGlow);
    glow.addColorStop(1, 'transparent');
    waveCtx.save();
    waveCtx.globalAlpha = presence * .10;
    waveCtx.fillStyle = glow;
    waveCtx.fillRect(0, 0, waveWidth, waveHeight);
    waveCtx.restore();
  }
  waveCtx.save();
  for (let line = -2; line < Math.ceil(waveHeight / 56) + 2; line++) {
    waveCtx.beginPath(); waveCtx.strokeStyle = waveColors[Math.abs(line) % 2]; waveCtx.lineWidth = 1.25;
    for (let x = -12; x <= waveWidth + 12; x += 12) {
      const base = line * 56 + Math.sin(x / 240 + waveTime * .18 + line * .25) * 28 + Math.sin(x / 420 - waveTime * .12) * 16;
      const distance = ((x - smoothX) ** 2 + (base - smoothY) ** 2) / (190 ** 2);
      const y = base + Math.exp(-distance) * 38 * presence * Math.sin((x - smoothX) / 130 + waveTime * .5);
      if (x === -12) waveCtx.moveTo(x, y); else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();
  }
  waveCtx.restore();
}

export function initWaves() {
if (!RM) {
  window.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; pointerX = e.clientX; pointerY = e.clientY; targetPresence = 1; }, { passive:true });
  document.documentElement.addEventListener('pointerleave', () => { targetPresence = 0; });
  window.addEventListener('blur', () => { targetPresence = 0; });
}
window.addEventListener('resize', resizeWaves, { passive:true });
new MutationObserver(resizeWaves).observe(root, { attributes:true, attributeFilter:['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', resizeWaves);
resizeWaves();
}
