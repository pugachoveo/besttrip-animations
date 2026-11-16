/* BestTrip header for the demo site.
   Usage on any page:  <script src="<path-to-root>/assets/header.js" defer></script>
   It inserts the approved header at the top of <body> and loads header.css itself.

   NAV is the only thing to edit when a new demo appears: add a section or a link.
   hrefs are relative to the site root. */
(function () {
  const NAV = [
    { id: 'home', label: 'Главная', href: 'home-hero/' },
    {
      id: 'mice',
      label: 'MICE',
      items: [
        { label: 'Конференции', href: 'conference-accordion/' },
      ],
    },
    {
      id: 'start-saving',
      label: 'Начать экономить',
      items: [
        { label: 'Отзывы и Кейсы', href: 'client-reviews/' },
        { label: 'Посмотреть тарифы', href: 'pricing/' },
      ],
    },
  ];
  const PHONE = { label: '0011', href: 'tel:0011' };
  const ACTIONS = {
    auth: { label: 'Авторизация', href: 'https://b2b.besttrip.ru/' },
    trips: { label: 'Личные поездки', href: 'https://b2c.besttrip.ru/' },
  };

  const script = document.currentScript;
  const root = new URL('../', script.src); // assets/ -> site root
  const asset = (p) => new URL(`assets/header/${p}`, root).href;
  const link = (p) => new URL(p, root).href;
  const here = location.href.split(/[?#]/)[0].replace(/index\.html$/, '');
  const current = (href) => (link(href) === here ? ' aria-current="page"' : '');

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('assets/header.css', root).href;
  document.head.appendChild(css);

  const phone = `<a class="bth-phone" href="${PHONE.href}" aria-label="Позвонить ${PHONE.label}">
      <span class="bth-phone__icon" aria-hidden="true"><img src="${asset('phone.svg')}" alt=""></span><span>${PHONE.label}</span></a>`;
  const decor = `<span class="bth-decor" aria-hidden="true">
      <img class="bth-palm1" src="${asset('decorative/source-03.png')}" alt="">
      <img class="bth-palm2" src="${asset('decorative/source-04.png')}" alt="">
      <img class="bth-shape" src="${asset('decorative/b2c-decorative-shape-large.svg')}" alt="">
      <img class="bth-mark" src="${asset('decorative/b2c-decorative-mark.svg')}" alt=""></span>`;
  const auth = (cls) => `<a class="bth-btn bth-btn--primary ${cls}" href="${ACTIONS.auth.href}" target="_blank" rel="noreferrer">${ACTIONS.auth.label}</a>`;
  const trips = (cls) => `<a class="bth-btn bth-btn--orange ${cls}" href="${ACTIONS.trips.href}" target="_blank" rel="noreferrer"><span>${ACTIONS.trips.label}</span>${decor}</a>`;
  const chev = `<img src="${asset('chevron-down.svg')}" alt="" aria-hidden="true">`;

  const desktopNav = NAV.map((s) => (s.items
    ? `<div class="bth-dd">
        <button class="bth-trigger" type="button" aria-expanded="false" aria-controls="bth-dd-${s.id}">${s.label}${chev}</button>
        <div class="bth-dd__menu" id="bth-dd-${s.id}" hidden>
          ${s.items.map((i) => `<a href="${link(i.href)}"${current(i.href)}>${i.label}</a>`).join('')}
        </div>
      </div>`
    : `<a class="bth-trigger" href="${link(s.href)}"${current(s.href)}>${s.label}</a>`)).join('');

  const mobileNav = NAV.map((s) => (s.items
    ? `<div class="bth-msec">
        <button class="bth-mrow" type="button" aria-expanded="false" aria-controls="bth-m-${s.id}">${s.label}${chev}</button>
        <div class="bth-msub" id="bth-m-${s.id}"><div class="bth-msub__inner">
          ${s.items.map((i) => `<a href="${link(i.href)}"${current(i.href)}>${i.label}</a>`).join('')}
        </div></div>
      </div>`
    : `<a class="bth-mrow" href="${link(s.href)}"${current(s.href)}>${s.label}</a>`)).join('');

  const header = document.createElement('header');
  header.className = 'bt-header';
  // Stay invisible and transition-free until header.css arrives, otherwise the mobile panel flashes on load
  header.style.visibility = 'hidden';
  const ready = () => requestAnimationFrame(() => { header.style.visibility = ''; header.setAttribute('data-ready', ''); });
  css.addEventListener('load', ready);
  css.addEventListener('error', ready);
  header.innerHTML = `
    <div class="bth-desktop">
      <a class="bth-desktop__logo" href="${root.href}" aria-label="BestTrip"><img src="${asset('logo-desktop.svg')}" alt="BestTrip"></a>
      <nav class="bth-nav" aria-label="Основная навигация">${desktopNav}</nav>
      <div class="bth-right">
        <div class="bth-meta"><span class="bth-lang" aria-label="Текущий язык: русский">RU</span>${phone}</div>
        <div class="bth-actions">${auth('bth-auth')}${trips('bth-trips')}</div>
      </div>
    </div>
    <div class="bth-compact">
      <a class="bth-compact__logo" href="${root.href}" aria-label="BestTrip"><img src="${asset('logo-compact.svg')}" alt="BestTrip"></a>
      <div class="bth-compact__right">${phone}
        <button class="bth-burger" type="button" aria-expanded="false" aria-controls="bth-panel" aria-label="Открыть меню"><img src="${asset('menu.svg')}" alt=""></button>
      </div>
    </div>
    <div class="bth-overlay" data-close></div>
    <div class="bth-panel" id="bth-panel" role="dialog" aria-label="Меню BestTrip">
      <nav class="bth-panel__nav" aria-label="Мобильная навигация">${mobileNav}</nav>
      <div class="bth-panel__actions"><span class="bth-lang" aria-label="Текущий язык: русский">RU</span>${auth('')}${trips('')}</div>
    </div>`;
  document.body.prepend(header);

  /* Desktop dropdowns: click to open, Esc / click outside to close */
  const closeDropdowns = (except) => header.querySelectorAll('.bth-trigger[aria-expanded="true"]').forEach((t) => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  });

  /* Mobile panel */
  const burger = header.querySelector('.bth-burger');
  const setMenu = (open) => {
    header.toggleAttribute('data-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (!open) burger.focus({ preventScroll: true });
  };

  header.addEventListener('click', (e) => {
    const trig = e.target.closest('button.bth-trigger');
    if (trig) {
      const open = trig.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(trig);
      trig.setAttribute('aria-expanded', String(open));
      document.getElementById(trig.getAttribute('aria-controls')).hidden = !open;
      return;
    }
    if (e.target.closest('.bth-burger')) { setMenu(!header.hasAttribute('data-menu-open')); return; }
    if (e.target.closest('[data-close]')) { setMenu(false); return; }
    const row = e.target.closest('button.bth-mrow');
    if (row) {
      const open = row.getAttribute('aria-expanded') !== 'true';
      row.setAttribute('aria-expanded', String(open));
      row.parentElement.toggleAttribute('data-open', open);
      document.getElementById(row.getAttribute('aria-controls')).toggleAttribute('data-open', open);
    }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.bth-dd')) closeDropdowns(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openTrig = header.querySelector('.bth-trigger[aria-expanded="true"]');
    if (openTrig) { closeDropdowns(); openTrig.focus(); }
    if (header.hasAttribute('data-menu-open')) setMenu(false);
  });
})();
