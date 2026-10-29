export class PlayerPage {
  constructor() {
    this.element = null;
    this._listeners = [];
    this._isOpen = false;
  }

  _on(target, event, handler) {
    target.addEventListener(event, handler);
    this._listeners.push({ target, event, handler });
  }

  _clearListeners() {
    this._listeners.forEach(({ target, event, handler }) =>
      target.removeEventListener(event, handler)
    );
    this._listeners = [];
  }

  open(athlete) {
    if (this._isOpen) this.close();

    const overlay = document.createElement('div');
    overlay.className = 'player-page-overlay';

    const page = document.createElement('div');
    page.className = 'player-page';

    const topbar = document.createElement('div');
    topbar.className = 'player-page-topbar';

    const backBtn = document.createElement('button');
    backBtn.className = 'player-page-back';
    backBtn.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M22 12H2M2 12L8 6M2 12L8 18"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="square"
              stroke-linejoin="miter"/>
      </svg>
    `;
    backBtn.setAttribute('aria-label', 'Назад');
    this._on(backBtn, 'click', () => this.close());

    const pageTitle = document.createElement('span');
    pageTitle.className = 'player-page-title';
    pageTitle.textContent = `${athlete.fullName} — профиль`;

    topbar.append(backBtn, pageTitle);

    const content = document.createElement('div');
    content.className = 'player-page-content';

    const bgWord = document.createElement('div');
    bgWord.className = 'pp-bg-word';
    bgWord.textContent = athlete.fullName.trim().split(' ').pop().toUpperCase();
    content.append(bgWord);

    const giantNumber = document.createElement('div');
    giantNumber.className = 'pp-giant-number';
    giantNumber.textContent = athlete.jersey || '—';
    content.append(giantNumber);

    const photoWrap = document.createElement('div');
    photoWrap.className = 'pp-photo-wrap';

    const img = document.createElement('img');
    img.className = 'pp-photo-img';
    img.alt = athlete.fullName;
    img.style.display = 'none';

    const placeholder = document.createElement('div');
    placeholder.className = 'pp-photo-placeholder';
    placeholder.textContent = athlete.fullName[0];

    if (athlete.jersey) {
      img.src = `assets/players/${athlete.jersey}.png`;
      img.onload = () => {
        img.style.display = 'block';
        placeholder.style.display = 'none';
      };
      img.onerror = () => {
        img.remove();
        console.info(`Локальное фото для ${athlete.fullName} не найдено — показываем заглушку.`);
      };
    }

    photoWrap.append(img, placeholder);
    content.append(photoWrap);

    const leftPanel = document.createElement('aside');
    leftPanel.className = 'pp-panel pp-panel-left';
    leftPanel.innerHTML = `
      <div class="pp-panel-title">Биография</div>
      <div class="pp-row"><span>Позиция</span><span>${athlete.position?.displayName || '—'}</span></div>
      <div class="pp-row"><span>Страна</span><span>${athlete.flag?.alt || '—'}</span></div>
      <div class="pp-row"><span>Дата рождения</span><span>${athlete.dateOfBirth ? athlete.dateOfBirth.slice(0, 10) : '—'}</span></div>
      <div class="pp-row"><span>Возраст</span><span>${athlete.age || '—'}</span></div>
    `;
    content.append(leftPanel);

    const rightPanel = document.createElement('aside');
    rightPanel.className = 'pp-panel pp-panel-right';
    rightPanel.innerHTML = `
      <div class="pp-panel-title">Физические данные</div>
      <div class="pp-row"><span>Рост</span><span>${athlete.displayHeight || '—'}</span></div>
      <div class="pp-row"><span>Вес</span><span>${athlete.displayWeight || '—'}</span></div>
      <div class="pp-row"><span>Номер</span><span>${athlete.jersey || '—'}</span></div>
      <div class="pp-row"><span>Команда</span><span>Real Madrid</span></div>
    `;
    content.append(rightPanel);

    page.append(topbar, content);
    overlay.append(page);
    document.body.append(overlay);

    requestAnimationFrame(() => overlay.classList.add('open'));

    this.element = overlay;
    this._isOpen = true;

    this._on(document, 'keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    this._on(overlay, 'click', (e) => {
      if (e.target === overlay) this.close();
    });
  }

  close() {
    if (!this._isOpen || !this.element) return;
    const el = this.element;
    el.classList.remove('open');
    setTimeout(() => el.remove(), 250);
    this._clearListeners();
    this.element = null;
    this._isOpen = false;
  }
}

export const playerPage = new PlayerPage();