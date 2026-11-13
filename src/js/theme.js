import { $, root, local } from './util.js';

export function effTheme() { return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
function syncSwitch() { const b = $('#themeToggle'), dark = effTheme() === 'dark'; b.setAttribute('aria-pressed', String(dark)); const label = 'Switch to ' + (dark ? 'light' : 'dark') + ' mode'; b.setAttribute('aria-label', label); b.title = label; }
export function setTheme(m, save = true) { root.dataset.theme = m; if (save) local.set('sd-theme', m); syncSwitch(); }
export function initTheme() {
  syncSwitch();
  $('#themeToggle').addEventListener('click', () => setTheme(effTheme() === 'dark' ? 'light' : 'dark'));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!root.dataset.theme) syncSwitch(); });
}
