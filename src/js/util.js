export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const root = document.documentElement;
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const sleep = ms => new Promise(r => setTimeout(r, ms));

const safe = (fn) => (...a) => { try { return fn(...a); } catch (e) { return null; } };
export const local = {
  get: safe(n => localStorage.getItem(n)),
  set: safe((n, v) => localStorage.setItem(n, v)),
};

export async function copyText(text, btn) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select(); ok = document.execCommand('copy'); ta.remove();
    } catch (e2) {}
  }
  btn.textContent = ok ? 'copied' : 'failed';
  setTimeout(() => { btn.textContent = 'copy'; }, 1500);
}
