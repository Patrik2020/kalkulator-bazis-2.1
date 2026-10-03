(() => {
  if (window.KB_WISE_PARTNER) return;

  // Only page/placement labels are sent. Never include amounts or visitor identifiers.
  const page = (window.location.pathname.split('/').filter(Boolean).at(-1) || 'index')
    .replace(/\.html?$/i, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 48);
  const label = (value) => String(value || '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 24);
  const locationFor = (link) => link.dataset.wiseLocation ||
    (link.matches('.wise-banner')
      ? window.location.pathname.includes('/kalkulatorok/') ? 'calculator-after-result' : 'banner'
      : link.closest('.hero') ? 'hero' : link.closest('.cta-section') ? 'final_cta' : 'content');

  const prepareLink = (link) => {
    try {
      const url = new URL(link.getAttribute('href'), window.location.href);
      if (url.protocol !== 'https:' || url.hostname !== 'wise.prf.hn' ||
          !/^\/click\/camref:1100l5Km25(?:\/|$)/.test(url.pathname)) return null;
      const placement = label(locationFor(link));
      const useCase = label(link.dataset.wiseUse);
      const pubref = ['kb', page, placement, useCase].filter(Boolean).join('_');
      url.pathname = url.pathname.replace(/\/pubref:[^/]+/g, '').replace(/\/$/, '') + '/pubref:' + pubref;
      if (link.href !== url.href) link.href = url.href;
      return { pubref, promo_location: placement, use_case: useCase,
        promo_variant: label(link.dataset.wiseVariant), page_path: window.location.pathname };
    } catch (error) {
      return null;
    }
  };

  const track = (name, params) => {
    if (window.KB_CONSENT_MANAGER?.hasConsent('analytics') && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  };
  window.KB_WISE_PARTNER = { prepareLink, track };

  const scan = () => document.querySelectorAll('a[href*="wise.prf.hn"]').forEach(prepareLink);
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const params = prepareLink(link);
    if (params) track('wise_partner_click', params);
  });
  const init = () => {
    scan();
    new MutationObserver(scan).observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['href', 'data-wise-use', 'data-wise-location', 'data-wise-variant'],
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
