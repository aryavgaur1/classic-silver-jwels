/**
 * csp-api.js — Classic Silver Palace
 * Reads content from localStorage (saved by admin panel).
 * Drop-in replacement — same DOM IDs, no Railway/API needed.
 */
(function () {

  // ── Same keys as admin.html ───────────────────────────────
  const CONTENT_KEY  = 'cspSiteContent';
  const CONTACT_KEY  = 'cspContactData';
  const SETTINGS_KEY = 'cspSiteSettings';
  const FAQ_KEY      = 'cspFaqData';

  // ── Default fallbacks (same as admin.html) ────────────────
  const DEFAULT_CONTENT = {
    eyebrow:     'Established 1970 - Jaipur, India',
    heroTitle:   'Classic Silver Place Jewellery Catalog',
    heroDesc:    'Established in 1970, Classic Silver Palace has carved a niche for itself in the market as a leading wholesale manufacturer and exporter of all type Silver Articles, Silver with stone Studded Jewellery, Gem Color Stone Jewellery, Silver Oxidized Jewellery, High Fashion Jewellery etc.',
    intro:       'Established in 1970, Classic Silver Palace has carved a niche for itself in the market as a leading wholesale manufacturer and exporter of all type Silver Articles, Silver with stone Studded Jewellery, Gem Color Stone Jewellery, Silver Oxidized Jewellery, High Fashion Jewellery etc. We are located in Jaipur (Rajasthan), India.\n\nOur success is based upon our early principles which are still held today — innovative design, exquisite craftsmanship, impeccable quality and real value for money. The traditional skills of jewellery making, handed down over decades, are still in use in our state of the art workshops.\n\nOur spectacular range of Indian Silver Articles & Semi Precious Sterling Silver Jewellery is the result of a proper insight into the functional aspect of this industry. We are a member of the Export Promotion Council For Handicraft (EPCH).',
    ourProducts: 'Where elegance is an attitude and innovation is the buzzword, we at Classic Silver Jewellery are committed to excellence by providing a nonpareil collection of Sterling Silver Jewellery & Silver Articles. Our collection includes:\n- Gem Stone Jewelry\n- 925 Silver With Studded Jewellery\n- Beaded Jewellery\n- Sterling Silver Jewellery\n- Silver Articles\n\nFor any query, please send us an email: info@indianclassicsilverjewellery.com',
    infra:       'Owing to our well-established infrastructural setup, outfitted with latest machinery and advanced technology, we are actively engaged in offering a vast array of premium quality Silver Jewelries with certified gemstones.\n\nWe employ a state-of-the-art infrastructure facility equipped with the latest machines to design and manufacture our products, segregated into manufacturing, designing, sales & marketing, administration and logistics.\n\nWhat makes our infrastructure stand apart:\n- Well-equipped quality control\n- Professional administrative setup\n- Standardized processes\n- Latest machinery & advanced technology',
    why:         'We are a reckoned entity engaged in manufacturing, exporting and supplying a vast collection of intricately designed Certified Gemstones and Sterling Silver Jewellery.\n\nFactors behind our success:\n- Unique and exclusive designs\n- Flawless quality and fine finish\n- Wide choice in terms of design and jewellery types\n- Capacious warehousing and suitable packaging\n- Fast order processing and timely delivery\n- Integrated designing and manufacturing facilities\n- Certified Gems & Diamonds',
    address:     'Classic Silver Palace\nV-2, Opp. Aashiyana Guest House, Chameli Wala Market, M.I. Road,\nJaipur 302003, Rajasthan, India\nTel: 0091-141-2360070 | Mobile: 0091-94140-72173',
  };

  const DEFAULT_CONTACT = {
    companyName: 'Classic Silver Palace',
    addr1:       'V-2, Opp. Aashiyana Guest House, Chameli Wala Market',
    addr2:       'M.I. Road',
    city:        'Jaipur 302003, Rajasthan, India',
    phone:       '0091-141-2360070',
    mobile:      '0091-94140-72173',
    email:       'info@indianclassicsilverjewellery.com',
    paypalEmail: 'info@indianclassicsilverjewellery.com',
    paypalNote:  'Instant Payment by PAYPAL (For all customers other than India)',
    minOrder:    'No minimum order amount or minimum order quantity.',
    usdBank: 'JP MORGAN CHASE BANK', usdSwift: 'HASUS33XXX', usdAcc: '001-1-407376',
    usdRouting: '021000021', usdBeneBank: 'AXIS Bank Ltd', usdBeneAcc: '010010200019196',
    gbpBank: 'Chase Manhattan Bank', gbpSwift: 'CHASGB2LXXX', gbpSort: '60-92-42',
    gbpAcc: '00111 31588', gbpBeneAcc: '010010200019196',
    eurBank: 'JPMorgan Chase Bank Frankfurt', eurSwift: 'CHASDEFXXXX',
    eurIban: 'DE81501108006231605392', eurBeneAcc: '010010200019196',
  };

  const DEFAULT_SETTINGS = {
    siteTitle:  'Classic Silver Place',
    tagline:    'Manufacturer & Exporter',
    footerDesc: 'Classic Silver Palace\nManufacturer & Exporter of Sterling Silver Jewellery & Silver Articles\nV-2, Opp. Aashiyana Guest House, Chameli Wala Market, M.I. Road,\nJaipur [302003], (Raj.) India',
    stat1val: '1970', stat1lbl: 'Established',
    stat2val: '925',  stat2lbl: 'Sterling Silver',
    stat3val: '500+', stat3lbl: 'Products',
    stat4val: '50+',  stat4lbl: 'Countries',
  };

  const DEFAULT_FAQ = [
    { id:'f1',  q:'Do your prices include shipping?', a:'No, all prices mentioned on this website exclude shipping charges. Shipping costs are calculated based on your location and preferred shipping method.' },
    { id:'f2',  q:'Where do you ship from?', a:'We are based in Jaipur, Rajasthan, India. All items are shipped directly from Jaipur through reputed international Freight Forwarders.' },
    { id:'f3',  q:'How do you ship?', a:'We use various shipping options as per your needs — including FedEx, UPS, and Post Parcel Service (Express Mail Service).' },
    { id:'f4',  q:'How long does it take for delivery?', a:'We normally take 1–2 weeks (working days only) to dispatch the shipment after order confirmation.' },
    { id:'f5',  q:'What is your Minimum Order Amount?', a:'There is NO minimum order amount and NO minimum order quantity. We welcome orders of all sizes.' },
    { id:'f6',  q:'What stone types do you use?', a:'We use Precious and Semi-Precious stones in our jewelry. All stones are original and of the best quality available — no inclusions.' },
    { id:'f7',  q:'What are your shipping charges?', a:'Shipping charges depend on the shipping method and company involved. Please contact us for a quote based on your destination and order size.' },
    { id:'f8',  q:'Are there additional charges beyond the purchase price?', a:'As items are shipped internationally, you may be charged a Customs Duty by your government. Customs rules and rates vary by country — please check local regulations.' },
    { id:'f9',  q:'Can I return or exchange items?', a:'Please contact us at info@indianclassicsilverjewellery.com for any return or exchange queries. We strive to ensure complete customer satisfaction.' },
    { id:'f10', q:'How do I place a bulk or wholesale order?', a:'Use our Contact page to send an enquiry or email us directly. We cater to wholesale buyers and exporters worldwide with competitive pricing.' },
    { id:'f11', q:'Are you a member of any trade body?', a:'Yes, we are a member of the Export Promotion Council For Handicraft (EPCH), India.' },
    { id:'f12', q:'Note on Jurisdiction', a:'In case of any dispute, the place of jurisdiction will be Jaipur, India.' },
  ];

  // ── Helpers ───────────────────────────────────────────────
  function load(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
  }

  function set(id, val) {
    if (val === null || val === undefined) return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // For multi-line text fields: blank lines = new paragraph, "- item" lines = bullet list
  function setHtml(id, val) {
    if (val === null || val === undefined) return;
    const el = document.getElementById(id);
    if (!el) return;
    const blocks = String(val).split(/\n{2,}/);
    el.innerHTML = blocks.map(block => {
      const lines = block.split('\n');
      const isBullet = l => l.trim().startsWith('- ');
      let html = '';
      let textLines = [];
      let bulletLines = [];
      lines.forEach(line => {
        if (isBullet(line)) {
          if (textLines.length) {
            html += '<p style="margin:0 0 6px;color:#4e4942;line-height:1.75;font-size:14px">' + escHtml(textLines.join(' ')) + '</p>';
            textLines = [];
          }
          bulletLines.push(line.trim().slice(2));
        } else {
          if (bulletLines.length) {
            html += '<ul style="padding-left:18px;margin:4px 0 8px">' + bulletLines.map(b => '<li style="color:#4e4942;line-height:1.75;font-size:14px">' + escHtml(b) + '</li>').join('') + '</ul>';
            bulletLines = [];
          }
          textLines.push(line);
        }
      });
      if (textLines.length) html += '<p style="margin:0 0 6px;color:#4e4942;line-height:1.75;font-size:14px">' + escHtml(textLines.join(' ')) + '</p>';
      if (bulletLines.length) html += '<ul style="padding-left:18px;margin:4px 0 8px">' + bulletLines.map(b => '<li style="color:#4e4942;line-height:1.75;font-size:14px">' + escHtml(b) + '</li>').join('') + '</ul>';
      return html;
    }).join('');
  }

  function escHtml(s) {
    return String(s || '').replace(/[&<>'"]/g,
      c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }


  // ── Appearance ────────────────────────────────────────────
  const APPEARANCE_KEY = 'cspAppearance';
  const DEFAULT_APPEARANCE = {
    displayFont:   "'Playfair Display', Georgia, serif",
    displayWeight: '400',
    bodyFont:      'Inter, system-ui, sans-serif',
    baseFontSize:  '15',
    lineHeight:    '1.65',
    accentColor:   '#9b7230',
    bgStyle:       'warm-cream',
    radius:        '4px',
    btnStyle:      'subtle',
  };
  const BG_MAP  = {'warm-cream':'#fdfcf9','pure-white':'#ffffff','cool-gray':'#f8f9fa','warm-gray':'#f7f5f2','parchment':'#f4ede0'};
  const BTN_MAP = {'sharp':'0px','subtle':'4px','pill':'999px'};

  function _loadGoogleFont(fontFamily) {
    if (!fontFamily) return;
    const match = fontFamily.match(/'([^']+)'|^([^,]+)/);
    const name = match ? (match[1] || match[2]).trim() : null;
    if (!name) return;
    const system = ['Inter','Arial','Georgia','Times New Roman','system-ui','sans-serif','serif'];
    if (system.some(s => name.toLowerCase().includes(s.toLowerCase()))) return;
    const id = 'gfont-' + name.replace(/\s+/g,'-').toLowerCase();
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  function applyAppearance() {
    const A = load(APPEARANCE_KEY, DEFAULT_APPEARANCE);
    const root = document.documentElement;
    const accent    = A.accentColor  || DEFAULT_APPEARANCE.accentColor;
    const bg        = BG_MAP[A.bgStyle] || '#fdfcf9';
    const btnRadius = BTN_MAP[A.btnStyle] || '4px';
    const dispFont  = A.displayFont  || DEFAULT_APPEARANCE.displayFont;
    const bodyFont  = A.bodyFont     || DEFAULT_APPEARANCE.bodyFont;

    root.style.setProperty('--gold',           accent);
    root.style.setProperty('--accent',         accent);
    root.style.setProperty('--paper',          bg);
    root.style.setProperty('--page-bg',        bg);
    root.style.setProperty('--radius',         A.radius || '4px');
    root.style.setProperty('--btn-radius',     btnRadius);
    root.style.setProperty('--display-font',   dispFont);
    root.style.setProperty('--display-weight', A.displayWeight || '400');
    root.style.setProperty('--body-font',      bodyFont);
    root.style.setProperty('--base-font-size', (A.baseFontSize || '15') + 'px');
    root.style.setProperty('--line-height',    A.lineHeight || '1.65');

    if (document.body) {
      document.body.style.background  = bg;
      document.body.style.fontFamily  = bodyFont;
      document.body.style.fontSize    = (A.baseFontSize || '15') + 'px';
      document.body.style.lineHeight  = A.lineHeight || '1.65';
    }

    document.querySelectorAll('.serif, h1, h2, h3').forEach(el => {
      el.style.fontFamily = dispFont;
      if (A.displayWeight) el.style.fontWeight = A.displayWeight;
    });

    document.querySelectorAll('.btn').forEach(el => {
      el.style.borderRadius = btnRadius;
    });

    _loadGoogleFont(dispFont);
    _loadGoogleFont(bodyFont);
  }

  // ── Apply everything ──────────────────────────────────────
  function applyAll() {
    applyAppearance();
    const C  = load(CONTENT_KEY,  DEFAULT_CONTENT);
    const CT = load(CONTACT_KEY,  DEFAULT_CONTACT);
    const S  = load(SETTINGS_KEY, DEFAULT_SETTINGS);

    // Hero / Content
    set('csp-hero-eyebrow', C.eyebrow);
    set('csp-hero-title',   C.heroTitle);
    set('csp-hero-desc',    C.heroDesc);
    setHtml('csp-intro',        C.intro);
    setHtml('csp-our-products', C.ourProducts);
    setHtml('csp-infra',        C.infra);
    setHtml('csp-why',          C.why);
    set('csp-address',      C.address);

    // Brand / Settings
    document.querySelectorAll('.csp-brand-name').forEach(el => { if (S.siteTitle) el.textContent = S.siteTitle; });
    document.querySelectorAll('.csp-tagline').forEach(el => { if (S.tagline) el.textContent = S.tagline; });
    set('csp-stat1-val', S.stat1val); set('csp-stat1-lbl', S.stat1lbl);
    set('csp-stat2-val', S.stat2val); set('csp-stat2-lbl', S.stat2lbl);
    set('csp-stat3-val', S.stat3val); set('csp-stat3-lbl', S.stat3lbl);
    set('csp-stat4-val', S.stat4val); set('csp-stat4-lbl', S.stat4lbl);
    set('csp-footer-desc', S.footerDesc);

    // Contact
    set('csp-contact-name',   CT.companyName);
    set('csp-contact-addr1',  CT.addr1);
    set('csp-contact-addr2',  CT.addr2);
    set('csp-contact-city',   CT.city);
    set('csp-contact-phone',  CT.phone);
    set('csp-contact-mobile', CT.mobile);
    set('csp-contact-email',  CT.email);
    const emailLink = document.getElementById('csp-contact-email-link');
    if (emailLink && CT.email) { emailLink.textContent = CT.email; emailLink.href = 'mailto:' + CT.email; }
    set('csp-paypal-email', CT.paypalEmail);
    set('csp-paypal-note',  CT.paypalNote);
    set('csp-min-order',    CT.minOrder);

    // Bank details
    set('csp-usd-bank', CT.usdBank);   set('csp-usd-swift', CT.usdSwift);
    set('csp-usd-acc',  CT.usdAcc);    set('csp-usd-routing', CT.usdRouting);
    set('csp-usd-bene-bank', CT.usdBeneBank); set('csp-usd-bene-acc', CT.usdBeneAcc);
    set('csp-gbp-bank', CT.gbpBank);   set('csp-gbp-swift', CT.gbpSwift);
    set('csp-gbp-sort', CT.gbpSort);   set('csp-gbp-acc',   CT.gbpAcc);
    set('csp-gbp-bene-acc', CT.gbpBeneAcc);
    set('csp-eur-bank', CT.eurBank);   set('csp-eur-swift', CT.eurSwift);
    set('csp-eur-iban', CT.eurIban);   set('csp-eur-bene-acc', CT.eurBeneAcc);

    // FAQ
    const faqContainer = document.getElementById('csp-faq-list');
    if (faqContainer) {
      const faqItems = load(FAQ_KEY, DEFAULT_FAQ);
      if (Array.isArray(faqItems) && faqItems.length > 0) {
        const mid = Math.ceil(faqItems.length / 2);
        const renderItem = f => `<div class="faq-item"><h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p></div>`;
        const col1 = faqItems.slice(0, mid).map(renderItem).join('');
        const col2 = faqItems.slice(mid).map(renderItem).join('');
        faqContainer.innerHTML = `<div class="faq-column">${col1}</div><div class="faq-column">${col2}</div>`;
      }
    }

    // Simple single-element FAQ fallback (details-based, used only if csp-faq-list isn't a two-column grid)
    const faqSimple = document.getElementById('csp-faq-list-simple');
    if (faqSimple) {
      const faqItems = load(FAQ_KEY, DEFAULT_FAQ);
      if (Array.isArray(faqItems) && faqItems.length > 0) {
        faqSimple.innerHTML = faqItems.map(f =>
          `<details><summary>${escHtml(f.q)}</summary>
           <p style="margin:10px 0 4px;color:#4e4942;line-height:1.75;font-size:14px">${escHtml(f.a)}</p>
           </details>`
        ).join('');
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }

  // Re-apply when user switches back to this tab (admin → index same tab flow)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') applyAll();
  });

  // Re-apply when another tab changes localStorage
  window.addEventListener('storage', e => {
    if (['cspSiteContent','cspContactData','cspSiteSettings','cspFaqData','cspAppearance'].includes(e.key)) applyAll();
  });
})();
