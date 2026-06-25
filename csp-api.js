/**
 * csp-api.js  — Classic Silver Palace
 * Shared API helper. Include on every frontend page.
 * Reads from /api/* and applies to DOM just like the old localStorage approach.
 */
(function () {
  const BASE = '';  // same origin — Railway serves both frontend + API

  async function get(path) {
    try {
      const r = await fetch(BASE + path);
      return r.ok ? r.json() : {};
    } catch { return {}; }
  }

  function set(id, val) {
    if (!val) return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function escHtml(s) {
    return String(s || '').replace(/[&<>'"]/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  async function applyAll() {
    // Run all fetches in parallel
    const [C, CT, S] = await Promise.all([
      get('/api/content/content'),
      get('/api/content/contact'),
      get('/api/content/settings'),
    ]);

    // ── Hero / Content ────────────────────────────────────
    set('csp-hero-eyebrow', C.eyebrow);
    set('csp-hero-title',   C.heroTitle);
    set('csp-hero-desc',    C.heroDesc);
    set('csp-intro',        C.intro);
    set('csp-our-products', C.ourProducts);
    set('csp-infra',        C.infra);
    set('csp-why',          C.why);
    set('csp-address',      C.address);

    // ── Settings / Brand ─────────────────────────────────
    document.querySelectorAll('.csp-brand-name').forEach(el => { if (S.siteTitle) el.textContent = S.siteTitle; });
    document.querySelectorAll('.csp-tagline').forEach(el => { if (S.tagline) el.textContent = S.tagline; });
    set('csp-stat1-val', S.stat1val); set('csp-stat1-lbl', S.stat1lbl);
    set('csp-stat2-val', S.stat2val); set('csp-stat2-lbl', S.stat2lbl);
    set('csp-stat3-val', S.stat3val); set('csp-stat3-lbl', S.stat3lbl);
    set('csp-stat4-val', S.stat4val); set('csp-stat4-lbl', S.stat4lbl);
    set('csp-footer-desc', S.footerDesc);

    // ── Contact ───────────────────────────────────────────
    set('csp-contact-name',   CT.companyName);
    set('csp-contact-addr1',  CT.addr1);
    set('csp-contact-addr2',  CT.addr2);
    set('csp-contact-city',   CT.city);
    set('csp-contact-phone',  CT.phone);
    set('csp-contact-mobile', CT.mobile);
    set('csp-contact-email',  CT.email);
    const emailLink = document.getElementById('csp-contact-email-link');
    if (emailLink && CT.email) { emailLink.textContent = CT.email; emailLink.href = 'mailto:' + CT.email; }
    set('csp-paypal-email',   CT.paypalEmail);
    set('csp-paypal-note',    CT.paypalNote);
    set('csp-min-order',      CT.minOrder);

    // Bank details
    set('csp-usd-bank', CT.usdBank);   set('csp-usd-swift', CT.usdSwift);
    set('csp-usd-acc', CT.usdAcc);     set('csp-usd-routing', CT.usdRouting);
    set('csp-usd-bene-bank', CT.usdBeneBank); set('csp-usd-bene-acc', CT.usdBeneAcc);
    set('csp-gbp-bank', CT.gbpBank);   set('csp-gbp-swift', CT.gbpSwift);
    set('csp-gbp-sort', CT.gbpSort);   set('csp-gbp-acc', CT.gbpAcc);
    set('csp-gbp-bene-acc', CT.gbpBeneAcc);
    set('csp-eur-bank', CT.eurBank);   set('csp-eur-swift', CT.eurSwift);
    set('csp-eur-iban', CT.eurIban);   set('csp-eur-bene-acc', CT.eurBeneAcc);

    // ── FAQ ───────────────────────────────────────────────
    const faqContainer = document.getElementById('csp-faq-list');
    if (faqContainer) {
      const faqItems = await get('/api/faq');
      if (Array.isArray(faqItems) && faqItems.length > 0) {
        faqContainer.innerHTML = faqItems.map(f =>
          `<details><summary>${escHtml(f.q)}</summary>
           <p style="margin:10px 0 4px;color:#4e4942;line-height:1.75;font-size:14px">${escHtml(f.a)}</p>
           </details>`
        ).join('');
      }
    }
  }

  applyAll();
})();
