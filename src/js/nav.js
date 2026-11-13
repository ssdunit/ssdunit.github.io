import { $, $$, root, RM, clamp, sleep } from './util.js';

const nav = $('#nav'), links = $('#links'), axisIn = $('#axisIn'), trace = $('#trace');
const roSec = $('#roSec'), roCmd = $('#roCmd'), dial = $('#dial'), dialG = $('#dialG');
let shCur = '', shTarget = '', shRun = false;
async function shellTo(cmd) {
  shTarget = cmd;
  if (RM) { shCur = cmd; roCmd.textContent = cmd; return; }
  if (shRun) return; shRun = true;
  while (!root.classList.contains('ready')) await sleep(100);
  roSec.classList.add('busy');
  while (shCur !== shTarget) {
    if (shTarget.startsWith(shCur)) { shCur = shTarget.slice(0, shCur.length + 1); await sleep(42); }
    else { shCur = shCur.slice(0, -1); await sleep(24); }
    roCmd.textContent = shCur;
  }
  roSec.classList.remove('busy'); shRun = false;
}
const SECS = [
  { id: 'top', label: 'intro', path: '~' },
  { id: 'projects', label: 'projects', path: '~/projects' },
  { id: 'writing', label: 'writing', path: '~/writing' },
  { id: 'contact', label: 'contact', path: '~/contact' }
];
const N = SECS.length;
export function go(id) {
  lockNav(id);
  if (id === 'top') scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  else document.getElementById(id).scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
}
/* a clicked nav link stays highlighted until the visitor scrolls away
   (the scroll-spy alone would highlight the section below the one you landed on) */
let navLock = null, lockTimer = 0;
function unlockNav() { clearTimeout(lockTimer); if (navLock) { navLock = null; locate(); } }
function lockNav(id) {
  const key = id === 'top' ? 'intro' : id;
  const i = SECS.findIndex(s => (s.id === 'top' ? 'intro' : s.id) === key);
  const el = document.getElementById(id);
  if (i < 0 || !el) return;
  let y = 0;
  if (id !== 'top') y = clamp(el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0), 0, Math.max(0, root.scrollHeight - innerHeight));
  navLock = { i, y, arrived: Math.abs(scrollY - y) <= 8 };
  setActive(i);
  clearTimeout(lockTimer); lockTimer = setTimeout(() => { if (navLock && !navLock.arrived) unlockNav(); }, 8000);
}
['wheel', 'touchmove', 'keydown'].forEach(t => addEventListener(t, () => { if (navLock && !navLock.arrived) unlockNav(); }, { passive: true }));
links.addEventListener('click', e => { const a = e.target.closest('a[data-s]'); if (a) lockNav(a.dataset.s); });
SECS.forEach(s => { s.el = document.getElementById(s.id); });
$('.brand').addEventListener('click', e => { e.preventDefault(); go('top'); });

let tops = [], docH = 1, maxS = 1, navH = 78, axW = 1;
export function measure() {
  const h = nav.offsetHeight;
  if (h !== navH) { navH = h; root.style.setProperty('--nav-h', h + 'px'); }
  tops = SECS.map(s => s.id === 'top' ? 0 : s.el.getBoundingClientRect().top + scrollY);
  docH = root.scrollHeight; maxS = Math.max(1, docH - innerHeight); axW = axisIn.clientWidth || 1;
}
let tp = 0, cp = 0, cv = 0, act = -1, sp = clamp(scrollY / 80, 0, 1), lastSp = -1;
function setActive(i) {
  if (i === act) return; act = i;
  $$('a', links).forEach(a => { if (a.dataset.s === (SECS[i].id === 'top' ? 'intro' : SECS[i].id)) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  shellTo('cd ' + SECS[i].path);
  if (links.scrollWidth > links.clientWidth + 2) {
    const a = $('a[aria-current]', links);
    if (a) links.scrollTo({ left: a.offsetLeft - (links.clientWidth - a.offsetWidth) / 2, behavior: RM ? 'auto' : 'smooth' });
  }
}
export function locate() {
  if (!tops.length) return;
  const p = clamp(scrollY / maxS, 0, 1);
  const ref = scrollY + navH + (innerHeight - navH) * (.28 + .72 * p);
  let i = 0; for (let k = 0; k < N; k++) if (tops[k] <= ref) i = k;
  let pos = 1;
  if (i < N - 1) { const a = tops[i], b = tops[i + 1]; pos = (i + clamp((ref - a) / Math.max(1, b - a), 0, 1)) / (N - 1); }
  if (navLock) {
    const near = Math.abs(scrollY - navLock.y) <= 8;
    if (near) navLock.arrived = true;
    if (near || !navLock.arrived) i = navLock.i; else navLock = null;
  }
  tp = p; setActive(i);
}
let lastTr = '', lastGt = '';
export function tickNav(dt) {
  const spT = clamp(scrollY / 80, 0, 1);
  sp = RM ? spT : sp + (spT - sp) * (1 - Math.exp(-dt * 9));
  if (Math.abs(spT - sp) < .001) sp = spT;
  if (sp !== lastSp) { nav.style.setProperty('--sp', sp.toFixed(4)); lastSp = sp; }
  if (RM) { cp = tp; cv = 0; } else { cv += ((tp - cp) * 220 - cv * 20) * dt; cp += cv * dt; if (Math.abs(tp - cp) < .00003 && Math.abs(cv) < .0003) { cp = tp; cv = 0; } }
  const tr = 'scaleX(' + clamp(cp, 0, 1).toFixed(4) + ')';
  if (tr !== lastTr) { trace.style.transform = tr; lastTr = tr; }
  const gt = (cp * 180).toFixed(1) + 'deg';
  if (gt !== lastGt) { dial.style.setProperty('--gear-turn', gt); lastGt = gt; }
}
addEventListener('scroll', locate, { passive: true });
addEventListener('resize', () => { measure(); locate(); });
if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); locate(); }).observe(document.body);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); locate(); });
addEventListener('load', () => { measure(); locate(); });
