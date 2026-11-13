import { $$, root, RM, sleep } from './util.js';

export function initReveal() {
const revealItems = [];
$$('.sec').forEach(sec => $$('.sec-h, .prose > *, .chips .tag, .grid2 .pcard, .tbl > *, h3.sub, .hint', sec).forEach((el, k) => {
  el.classList.add('rv'); el.style.setProperty('--i', k % 3); revealItems.push(el);
}));
if ('IntersectionObserver' in window && !RM) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: .08 });
  (async () => { while (!root.classList.contains('ready')) await sleep(100); revealItems.forEach(el => io.observe(el)); })();
} else revealItems.forEach(el => el.classList.add('in'));
}
