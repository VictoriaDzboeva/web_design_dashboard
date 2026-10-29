import { UIComponent } from '../UIComponent.js';
import { playerPage } from './PlayerPage.js';

const LEAGUE = 'esp.1';
const CLUB_ID = '86'; // Real Madrid

export class SquadWidget extends UIComponent {
  constructor() {
    super({ id: `squad-${Date.now()}`, title: 'Состав' });
    this.players = [];
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'widget-content';
    wrapper.append(this._createHeader());

    const grid = document.createElement('div');
    grid.className = 'squad-grid';
    grid.innerHTML = '<div class="widget-status">Загрузка состава…</div>';
    wrapper.append(grid);

    this.element = wrapper;
    await this._loadSquad(grid);
    return wrapper;
  }

  _photoExists(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async _loadSquad(container) {
    try {
      const res = await fetch(
        `https://worldcup26.ir/get/soccer/${LEAGUE}/clubs/${CLUB_ID}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const roster = (await res.json()).roster || [];
      if (!roster.length) throw new Error('Состав не найден');

      const checked = await Promise.all(
        roster.map(async (p) =>
          p.jersey && (await this._photoExists(`assets/players/${p.jersey}.png`))
            ? p
            : null
        )
      );

      this.players = checked.filter(Boolean);

      if (!this.players.length) {
        container.innerHTML = '<div class="widget-status">Нет игроков с фото</div>';
        return;
      }

      container.innerHTML = '';
      this.players.forEach((athlete) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.style.cursor = 'pointer';

        const number = document.createElement('div');
        number.className = 'player-number';
        number.textContent = athlete.jersey || '—';

        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = athlete.fullName;

        card.append(number, name);
        this._on(card, 'click', () => playerPage.open(athlete));

        container.append(card);
      });
    } catch (err) {
      console.error('Squad error:', err);
      container.innerHTML = `<div class="widget-status">Не удалось загрузить состав: ${err.message}</div>`;
    }
  }
}