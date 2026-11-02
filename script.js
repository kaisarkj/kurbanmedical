/**
 * KURBAN MEDICAL — Main Application Script
 * Handles: Language switching, UI rendering, vCard generation,
 *          scroll reveal, WhatsApp integration, and animations.
 */

(() => {
  "use strict";

  // ─── Constants ───────────────────────────────────────────────
  const PHONE = "+77771667203";
  const PHONE_DISPLAY = "+7 777 166 72 03";
  const WHATSAPP_URL = "https://wa.me/77771667203";
  const INSTAGRAM_URL = "https://www.instagram.com/kurban.medical/";
  const GIS_URL = "https://2gis.kz/astana/firm/70000001077212332";
  const LS_KEY = "kurbanmedical_lang";
  const DEFAULT_LANG = "kz";

  // ─── State ───────────────────────────────────────────────────
  let currentLang = localStorage.getItem(LS_KEY) || DEFAULT_LANG;

  // ─── Helpers ─────────────────────────────────────────────────

  /** Get a translation value by dot-separated key */
  function t(key) {
    const keys = key.split(".");
    let value = translations[currentLang];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // fallback to key
      }
    }
    return value;
  }

  /** Create a WhatsApp link with encoded message */
  function waLink(message) {
    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  }

  /** Create a WhatsApp service booking link */
  function waServiceLink(serviceName) {
    const template = t("whatsapp.serviceBooking");
    const message = template.replace("{{service}}", serviceName);
    return waLink(message);
  }

  // ─── Lucide-style SVG Icons (inline) ─────────────────────────
  const icons = {
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    messageCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    navigation: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
    externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    // Service icons
    hand: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 13"/></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,
    droplets: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
    stretchHorizontal: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="6" height="20" x="2" y="2" rx="2"/><rect width="6" height="20" x="16" y="2" rx="2"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
    stethoscope: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  };

  // Map service keys to icon keys
  const serviceIconMap = {
    massage: "hand",
    manualTherapy: "activity",
    hijama: "droplets",
    kinesiotherapy: "stretchHorizontal",
    capillaryTherapy: "sparkles",
    consultation: "stethoscope",
  };

  // ─── Rendering ───────────────────────────────────────────────

  function renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="card">
        <!-- Top gradient line is CSS ::before -->

        <!-- Language Selector -->
        <div class="lang-bar fade-in fade-in--1" role="navigation" aria-label="${t("langSelector.label")}">
          <div class="lang-selector" role="tablist">
            <button class="lang-btn ${currentLang === "kz" ? "active" : ""}" 
                    data-lang="kz" role="tab" aria-selected="${currentLang === "kz"}" 
                    id="lang-kz" aria-label="Қазақша">KZ</button>
            <button class="lang-btn ${currentLang === "ru" ? "active" : ""}" 
                    data-lang="ru" role="tab" aria-selected="${currentLang === "ru"}" 
                    id="lang-ru" aria-label="Русский">RU</button>
            <button class="lang-btn ${currentLang === "en" ? "active" : ""}" 
                    data-lang="en" role="tab" aria-selected="${currentLang === "en"}" 
                    id="lang-en" aria-label="English">EN</button>
          </div>
        </div>

        <!-- Hero Section -->
        <section class="hero fade-in fade-in--2" id="hero">
          <div class="logo-wrapper">
            <div class="logo-ring">
              <img src="assets/logo.png" alt="KURBAN MEDICAL" width="102" height="102" />
            </div>
          </div>
          <h1 class="hero-brand">KURBAN MEDICAL</h1>
          <p class="hero-subtitle" id="hero-subtitle">${t("hero.subtitle")}</p>
          <span class="hero-location" id="hero-location">
            ${icons.mapPin}
            ${t("hero.location")}
          </span>
        </section>

        <!-- Social Icons -->
        <div class="social-row fade-in fade-in--3">
          <a href="${waLink(t("whatsapp.booking"))}" 
             class="social-btn social-btn--whatsapp" 
             target="_blank" rel="noopener noreferrer" 
             aria-label="WhatsApp" id="social-whatsapp">
            ${icons.messageCircle}
          </a>
          <a href="${INSTAGRAM_URL}" 
             class="social-btn social-btn--instagram" 
             target="_blank" rel="noopener noreferrer" 
             aria-label="Instagram" id="social-instagram">
            ${icons.instagram}
          </a>
          <a href="tel:${PHONE}" 
             class="social-btn social-btn--phone" 
             aria-label="${t("actions.call")}" id="social-phone">
            ${icons.phone}
          </a>
        </div>

        <div class="divider"></div>

        <!-- Action Buttons -->
        <div class="actions fade-in fade-in--4">
          <a href="${waLink(t("whatsapp.booking"))}" 
             class="action-btn action-btn--primary" 
             target="_blank" rel="noopener noreferrer" 
             id="btn-book">
            <span class="icon-wrap">${icons.calendar}</span>
            <span>${t("actions.book")}</span>
          </a>
          <a href="tel:${PHONE}" 
             class="action-btn action-btn--secondary" 
             id="btn-call">
            <span class="icon-wrap">${icons.phone}</span>
            <span>${t("actions.call")}</span>
          </a>
          <a href="${INSTAGRAM_URL}" 
             class="action-btn action-btn--secondary" 
             target="_blank" rel="noopener noreferrer" 
             id="btn-instagram">
            <span class="icon-wrap">${icons.instagram}</span>
            <span>${t("actions.instagram")}</span>
          </a>
          <button class="action-btn action-btn--secondary" 
                  onclick="window.KurbanMedical.saveContact()" 
                  id="btn-save-contact">
            <span class="icon-wrap">${icons.download}</span>
            <span>${t("actions.saveContact")}</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Services Section -->
        <section class="services-section reveal" id="services">
          <h2 class="section-title" id="services-title">${t("services.title")}</h2>
          <div class="services-grid">
            ${renderServices()}
          </div>
        </section>

        <div class="divider"></div>

        <!-- Location Section -->
        <section class="location-section reveal" id="location">
          <div class="location-card">
            <div class="location-icon">${icons.mapPin}</div>
            <h2 class="location-label" id="location-title">${t("location.title")}</h2>
            <p class="location-address" id="location-address">${t("location.address")}</p>
            <a href="${GIS_URL}" 
               class="location-btn" 
               target="_blank" rel="noopener noreferrer" 
               id="btn-directions">
              ${icons.navigation}
              <span>${t("location.openMap")}</span>
            </a>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer reveal">
          <p class="footer-brand">KURBAN MEDICAL</p>
          <p class="footer-desc" id="footer-desc">${t("footer.description")}</p>
          <p class="footer-rights" id="footer-rights">© ${new Date().getFullYear()} KURBAN MEDICAL. ${t("footer.rights")}</p>
        </footer>
      </div>
    `;

    // Bind language buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchLang(btn.dataset.lang));
    });

    // Initialize scroll reveal
    initScrollReveal();
  }

  function renderServices() {
    return serviceKeys
      .map((key) => {
        const iconKey = serviceIconMap[key] || "activity";
        const icon = icons[iconKey] || icons.activity;
        const name = t(`services.${key}.name`);
        const desc = t(`services.${key}.description`);
        const bookBtn = t(`services.${key}.bookBtn`);

        return `
        <div class="service-card" id="service-${key}">
          <div class="service-header">
            <div class="service-icon">${icon}</div>
            <h3 class="service-name">${name}</h3>
          </div>
          <p class="service-desc">${desc}</p>
          <a href="${waServiceLink(name)}" 
             class="service-book-btn" 
             target="_blank" rel="noopener noreferrer"
             aria-label="${bookBtn} — ${name}">
            ${icons.calendar}
            <span>${bookBtn}</span>
          </a>
        </div>
      `;
      })
      .join("");
  }

  // ─── Language Switching ──────────────────────────────────────

  function switchLang(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(LS_KEY, lang);
    updateMeta();
    renderApp();
  }

  function updateMeta() {
    // HTML lang attribute
    document.documentElement.lang =
      currentLang === "kz" ? "kk" : currentLang === "ru" ? "ru" : "en";

    // Page title
    document.title = t("meta.title");

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t("meta.description");

    // OG meta
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = t("meta.title");

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = t("meta.description");
  }

  // ─── Scroll Reveal ──────────────────────────────────────────

  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  // ─── vCard Generator ────────────────────────────────────────

  function saveContact() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:KURBAN MEDICAL",
      "ORG:KURBAN MEDICAL",
      `TEL;TYPE=WORK,VOICE:${PHONE}`,
      "ADR;TYPE=WORK:;;Korday Street, 79A;Astana;;010000;Kazakhstan",
      `URL:${INSTAGRAM_URL}`,
      `X-SOCIALPROFILE;TYPE=instagram:${INSTAGRAM_URL}`,
      `NOTE:WhatsApp: ${WHATSAPP_URL}`,
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "KURBAN_MEDICAL.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      currentLang === "kz"
        ? "Контакт сақталды ✓"
        : currentLang === "ru"
        ? "Контакт сохранён ✓"
        : "Contact saved ✓"
    );
  }

  // ─── Toast Notification ──────────────────────────────────────

  function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // ─── Public API ──────────────────────────────────────────────
  window.KurbanMedical = { saveContact };

  // ─── Initialize ──────────────────────────────────────────────
  function init() {
    updateMeta();
    renderApp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
