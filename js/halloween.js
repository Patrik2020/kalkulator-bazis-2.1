(() => {
  'use strict';
  // One-off campaign: Budapest midnight boundaries, independent of visitor timezone.
  const start = Date.parse('2026-10-30T00:00:00+01:00');
  const end = Date.parse('2026-11-01T00:00:00+01:00');
  if (new URLSearchParams(location.search).has('__kb_static_export')) return;
  const root = document.documentElement;
  const copy = {
    hu: 'Ijesztő árak? Inkább számolj utána! 🎃',
    en: 'Scary prices? Do the maths! 🎃',
    de: 'Gruselige Preise? Rechne lieber nach! 🎃',
  };
  let timer;
  let observer;
  const updateCopy = () => {
    const note = document.getElementById('kb-halloween-note');
    const text = copy[root.lang.split('-')[0]] || copy.hu;
    if (note && note.textContent !== text) note.textContent = text;
  };
  const decorate = () => {
    document.querySelectorAll('.kb-header, .header-inner').forEach(header => {
      if (header.querySelector('.kb-halloween-web')) return;
      const web = document.createElement('span');
      web.className = 'kb-halloween-web';
      web.setAttribute('aria-hidden', 'true');
      header.append(web);
    });
    const hero = document.querySelector('#homeHero .hero-copy');
    if (hero && !document.getElementById('kb-halloween-note')) {
      const note = document.createElement('p');
      note.id = 'kb-halloween-note';
      note.className = 'kb-halloween-note';
      hero.prepend(note);
    }
    updateCopy();
  };
  const refresh = () => {
    clearTimeout(timer);
    const now = Date.now();
    const active = now >= start && now < end;
    root.classList.toggle('kb-halloween', active);
    if (active) {
      decorate();
      if (!observer) {
        observer = new MutationObserver(decorate);
        // Headers can arrive asynchronously. Observe additions without observing text updates.
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } else {
      observer?.disconnect();
      observer = null;
      document.querySelectorAll('.kb-halloween-web, #kb-halloween-note').forEach(node => node.remove());
    }
    if (now < end) timer = setTimeout(refresh, Math.min(active ? end - now : start - now, 60000));
  };
  const init = () => {
    refresh();
    document.addEventListener('kb:language-changed', updateCopy);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', refresh);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
