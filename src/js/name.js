import { $, root, RM, sleep } from './util.js';
import { site } from '../content.js';

/* ---------- name: English / Hindi ---------- */
export function initName() {
const nameWrap = $('#namewrap'), nameEl = $('#name');
let hiOn = false, flipping = false, hovering = false;
const EN = [...site.name], HI = site.nameHi;
nameEl.innerHTML = '<span class="tt" aria-hidden="true"><span class="tx"></span><i class="cur"></i></span>';
const tt = nameEl.querySelector('.tt'), tx = nameEl.querySelector('.tx');
(async () => {
  flipping = true;
  if (RM) { tx.textContent = site.name; flipping = false; return; }
  while (!root.classList.contains('ready')) await sleep(100);
  await sleep(1400); tt.classList.add('busy');
  for (let i = 1; i <= EN.length; i++) { tx.textContent = EN.slice(0, i).join(''); await sleep(120); }
  await sleep(400); tt.classList.remove('busy'); flipping = false;
})();
async function flip() {
  if (flipping) return; flipping = true;
  const from = hiOn ? HI : EN, to = hiOn ? EN : HI;
  hiOn = !hiOn;
  if (RM) { tx.textContent = to.join(''); tt.classList.toggle('hi', hiOn); }
  else {
    tt.classList.add('busy');
    for (let i = from.length - 1; i >= 0; i--) { tx.textContent = from.slice(0, i).join(''); await sleep(85); }
    await sleep(350);
    tt.classList.toggle('hi', hiOn);
    for (let i = 1; i <= to.length; i++) { tx.textContent = to.slice(0, i).join(''); await sleep(hiOn ? 210 : 120); }
    await sleep(400); tt.classList.remove('busy');
  }
  flipping = false;
}
nameWrap.addEventListener('click', flip);
nameWrap.addEventListener('mouseenter', () => { hovering = true; });
nameWrap.addEventListener('mouseleave', () => { hovering = false; });
(async () => { while (true) { await sleep(3600); if (!RM && !hovering && !document.hidden && root.classList.contains('ready')) await flip(); } })();
}
