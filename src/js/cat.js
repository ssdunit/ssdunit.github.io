import { $, $$, RM, copyText } from './util.js';
import { effTheme, setTheme } from './theme.js';
import { go } from './nav.js';
import { site } from '../content.js';

const CONTACT_KINDS = ['mail', 'phone', 'github', 'linkedin', 'twitter'];

export function initCat() {
const pixelCat = $('#pixelCat'), bubble = $('#catBubble');
if (pixelCat) {
  let busy = false, idleTimer = null, bubbleTimer = null, bag = [], last = '';

  const contact = k => site.contact.find(c => c.id === k);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const kinds = ['mail', 'phone', 'github', 'linkedin', 'twitter', 'theme', 'writing', 'interests'].filter(k => !CONTACT_KINDS.includes(k) || contact(k));

  function nextKind() {
    if (!bag.length) {
      bag = kinds.slice();
      for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
      if (bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    return last = bag.pop();
  }

  function pulseToggle() {
    const b = $('#themeToggle');
    b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
    setTimeout(() => b.classList.remove('pulse'), 3500);
  }
  function flashTag(name) {
    setTimeout(() => {
      const t = $$('#intro .tag').find(x => x.textContent === name);
      if (!t) return;
      t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
      setTimeout(() => t.classList.remove('flash'), 1700);
    }, RM ? 0 : 500);
  }

  const TIPS = {
    mail: () => ({ msg: "my human's inbox is always open. say hi?", acts: [{ t: 'send mail', href: contact('mail').h }, { t: 'copy', copy: contact('mail').copy }] }),
    phone: () => ({ msg: 'prefer to contact my human? here is the number.', acts: [{ t: 'call', href: contact('phone').h }, { t: 'copy', copy: contact('phone').copy }] }),
    github: () => ({ msg: 'my human keeps the code on github.', acts: [{ t: 'open github', href: contact('github').h }] }),
    twitter: () => ({ msg: 'my human shares thoughts on X.', acts: [{ t: 'open X', href: contact('twitter').h }] }),
    linkedin: () => ({ msg: 'the formal route: linkedin.', acts: [{ t: 'open linkedin', href: contact('linkedin').h }] }),
    theme: () => {
      const dark = effTheme() === 'dark';
      return { msg: dark ? 'too dark in here? the light switch is up there.' : 'too bright? the dark switch is up there.',
        acts: [{ t: dark ? 'go light' : 'go dark', fn: () => { setTheme(dark ? 'light' : 'dark'); pulseToggle(); } }] };
    },
    writing: () => ({ msg: 'notes, experiments and research thoughts live here.', acts: [{ t: 'read writing', fn: () => go('writing') }, { t: 'open notes', href: site.writing.url }] }),
    interests: () => {
      const i = pick($$('#intro .tag').map(t => t.textContent));
      return { msg: 'fun fact: my human is into ' + i + '.', acts: [{ t: 'see interests', fn: () => { go('intro'); flashTag(i); } }] };
    }
  };

  function hide() { clearTimeout(bubbleTimer); bubble.classList.remove('show'); }
  function say(tip) {
    clearTimeout(bubbleTimer);
    bubble.innerHTML = '<button type="button" class="cb-x" aria-label="Close">\u00d7</button><div class="cb-msg"></div><div class="cb-acts"></div>';
    $('.cb-msg', bubble).textContent = tip.msg;
    tip.acts.forEach(a => {
      let el;
      if (a.href) {
        el = document.createElement('a'); el.href = a.href;
        if (/^https?:/.test(a.href)) { el.target = '_blank'; el.rel = 'noopener'; }
      } else { el = document.createElement('button'); el.type = 'button'; }
      el.className = 'mini'; el.textContent = a.t;
      if (a.copy) el.addEventListener('click', () => copyText(a.copy, el));
      else if (a.fn) el.addEventListener('click', () => { a.fn(); hide(); });
      $('.cb-acts', bubble).append(el);
    });
    $('.cb-x', bubble).addEventListener('click', hide);
    bubble.classList.add('show');
    bubbleTimer = setTimeout(hide, 3000);
  }
  bubble.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const main = $('.cb-acts .mini', bubble); if (main) main.click();
  });
  bubble.addEventListener('mouseenter', () => clearTimeout(bubbleTimer));
  bubble.addEventListener('focusin', () => clearTimeout(bubbleTimer));
  bubble.addEventListener('mouseleave', () => { if (bubble.classList.contains('show')) bubbleTimer = setTimeout(hide, 3000); });
  addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });

  function scheduleLookAround() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!busy && !RM) pixelCat.classList.toggle('flip', Math.random() < 0.5);
      scheduleLookAround();
    }, 6000 + Math.random() * 6000);
  }

  function playWithCat() {
    if (busy) return;
    busy = true; hide();
    pixelCat.classList.add('pounce');
    setTimeout(() => pixelCat.classList.remove('pounce'), RM ? 0 : 280);
    setTimeout(() => pixelCat.classList.add('hiding'), RM ? 0 : 120);
    setTimeout(() => say(TIPS[nextKind()]()), RM ? 0 : 200);
    setTimeout(() => {
      pixelCat.classList.remove('hiding');
      busy = false;
    }, RM ? 0 : 1500);
  }

  pixelCat.addEventListener('click', playWithCat);
  pixelCat.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playWithCat(); }
  });
  scheduleLookAround();
}
}
