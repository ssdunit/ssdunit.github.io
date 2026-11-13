import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/cat.css';
import './styles/responsive.css';

import { root, RM } from './js/util.js';
import { renderContent } from './js/render.js';
import { initTheme } from './js/theme.js';
import { tickNav, measure, locate } from './js/nav.js';
import { initName } from './js/name.js';
import { initCat } from './js/cat.js';
import { initReveal } from './js/reveal.js';
import { drawWaves, initWaves } from './js/waves.js';

renderContent();
initTheme();
initName();
initCat();
initReveal();
initWaves();
measure(); locate();

let last = 0;
function frame(t) {
  const dt = last ? Math.min(.05, Math.max(0, (t - last) / 1000)) : 0; last = t;
  tickNav(dt);
  if (!RM) drawWaves(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// no boot screen: reveal the page straight away
requestAnimationFrame(() => root.classList.add('ready'));
