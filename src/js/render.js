import { $, copyText } from './util.js';
import * as ICONS from './icons.js';
import { site } from '../content.js';

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const isExternal = h => /^https?:/.test(h);

export function renderContent() {
  $('#hello').textContent = site.hello;
  $('#lead').textContent = site.lead;
  $('#footer-text').textContent = site.footer;

  const intro = $('#intro-text');
  site.intro.paragraphs.forEach(t => intro.append(el('p', '', t)));
  site.intro.tags.forEach(t => $('#intro-tags').append(el('span', 'tag', t)));

  site.projects.forEach(p => {
    const a = el('article', 'pcard');
    const path = el('div', 'path');
    path.append(el('span', '', p.path));
    if (p.badge) path.append(el('span', 'badge', p.badge));
    const tagBox = el('div', 'tags');
    p.tags.forEach(t => tagBox.append(el('span', 'tag', t)));
    const link = el('a', 'plink', p.url.replace('https://', ''));
    link.href = p.url; link.target = '_blank'; link.rel = 'noopener';
    a.append(path, el('h3', '', p.title), el('p', 'lede', p.lede), el('p', 'body', p.body), tagBox, link);
    $('#grid-proj').append(a);
  });

  $('#writing-text').textContent = site.writing.text;
  const wl = $('#writing-link'); wl.textContent = site.writing.label; wl.href = site.writing.url;

  site.contact.forEach(c => {
    const row = el('div', 'crow');
    const icon = el('span', 'crow-icon'); icon.innerHTML = ICONS['SVG_' + c.icon.toUpperCase()] || '';
    const link = el('a', 'v', c.text); link.href = c.href;
    if (isExternal(c.href)) { link.target = '_blank'; link.rel = 'noopener'; }
    row.append(icon, el('span', 'k', c.label), link);
    if (c.copy) {
      const acts = el('span', 'acts-c');
      const b = el('button', 'mini', 'copy'); b.type = 'button';
      b.addEventListener('click', () => copyText(c.copy, b));
      acts.append(b); row.append(acts);
    }
    $('#tbl').append(row);
  });
}
