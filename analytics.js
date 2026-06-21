(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-5EBWL1MSFN';
  const CONSENT_KEY = 'gr_cookie_consent_v1';
  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function trackEvent(name, params = {}) {
    if (!analyticsLoaded || typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
  }

  function removeBanner() {
    document.getElementById('gr-cookie-banner')?.remove();
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
  }

  function createBanner() {
    if (document.getElementById('gr-cookie-banner')) return;

    const style = document.createElement('style');
    style.textContent = `
      #gr-cookie-banner{position:fixed;z-index:9999;left:18px;right:18px;bottom:18px;max-width:760px;margin:auto;background:#07172e;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:18px;padding:20px;box-shadow:0 18px 55px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif}
      #gr-cookie-banner h2{font-size:20px;line-height:1.2;margin:0 0 8px;color:#fff}
      #gr-cookie-banner p{font-size:14px;line-height:1.5;margin:0;color:#dce9f7}
      #gr-cookie-banner .gr-cookie-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
      #gr-cookie-banner button{border:0;border-radius:9px;min-height:44px;padding:0 18px;font-weight:800;cursor:pointer}
      #gr-cookie-accept{background:linear-gradient(135deg,#ffb000,#ff8a00);color:#07172e}
      #gr-cookie-reject{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.25)!important}
      @media(max-width:520px){#gr-cookie-banner{left:10px;right:10px;bottom:10px;padding:17px}#gr-cookie-banner .gr-cookie-actions{display:grid;grid-template-columns:1fr}#gr-cookie-banner button{width:100%}}
    `;
    document.head.appendChild(style);

    const banner = document.createElement('aside');
    banner.id = 'gr-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Nastavení analytických cookies');
    banner.innerHTML = `
      <h2>Analytické cookies</h2>
      <p>Se souhlasem používáme Google Analytics k anonymnímu měření návštěvnosti a zlepšování webu. Bez souhlasu analytiku nespouštíme.</p>
      <div class="gr-cookie-actions">
        <button id="gr-cookie-accept" type="button">Povolit analytiku</button>
        <button id="gr-cookie-reject" type="button">Odmítnout</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('gr-cookie-accept')?.addEventListener('click', () => {
      saveConsent('accepted');
      removeBanner();
      loadAnalytics();
      trackEvent('consent_accepted');
    });

    document.getElementById('gr-cookie-reject')?.addEventListener('click', () => {
      saveConsent('rejected');
      removeBanner();
    });
  }

  function installEventTracking() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href });
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { link_url: href });
      } else if (href.includes('poptavka')) {
        trackEvent('inquiry_open', { link_url: href, link_text: link.textContent.trim() });
      } else if (href.includes('garant-elektro')) {
        trackEvent('service_open', { service_name: 'garant_elektro' });
      } else if (href.includes('ezapp')) {
        trackEvent('service_open', { service_name: 'ezapp' });
      }
    });

    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form && form.tagName === 'FORM') {
        trackEvent('generate_lead', { form_id: form.id || form.getAttribute('name') || 'web_form' });
      }
    });
  }

  function init() {
    installEventTracking();
    let consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (_) {}

    if (consent === 'accepted') {
      loadAnalytics();
    } else if (consent !== 'rejected') {
      createBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
