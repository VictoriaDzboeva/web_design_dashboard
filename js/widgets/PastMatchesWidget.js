import { UIComponent } from '../UIComponent.js';

const LA_LIGA_URL =
  'https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/es.1.json';

export class PastMatchesWidget extends UIComponent {
  constructor() {
    super({ id: `past-${Date.now()}`, title: 'Последние матчи' });
    this.matches = [];
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'widget-content';
    wrapper.append(this._createHeader());

    const body = document.createElement('div');
    body.className = 'widget-status';
    body.textContent = 'Загрузка…';
    wrapper.append(body);

    this.element = wrapper;
    await this._loadMatches(body);
    return wrapper;
  }

  async _loadMatches(container) {
    try {
      const res = await fetch(LA_LIGA_URL);
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const now = new Date();
      this.matches = (await res.json()).matches
        .filter((m) => {
          const isReal = `${m.team1} ${m.team2}`.toLowerCase().includes('real madrid');
          return isReal && new Date(m.date) < now;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      this._renderMatches(container);
    } catch (err) {
      container.textContent = `Не удалось загрузить: ${err.message}`;
    }
  }

  _renderMatches(container) {
    container.className = '';
    container.innerHTML = '';

    if (!this.matches.length) {
      container.className = 'widget-status';
      container.textContent = 'Нет прошедших матчей';
      return;
    }

    this.matches.forEach((m) => {
      const row = document.createElement('div');
      row.className = 'match-row';

      const date = document.createElement('span');
      date.className = 'match-date';
      date.textContent = m.date
        ? new Date(m.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
        : '—';

      const teams = document.createElement('span');
      teams.className = 'match-teams';
      teams.textContent = `${m.team1} — ${m.team2}`;

      const score = document.createElement('span');
      score.className = 'match-score';
      const ft = m.score?.ft || m.score;
      score.textContent = Array.isArray(ft) ? `${ft[0]} : ${ft[1]}` : '—';

      row.append(date, teams, score);
      container.append(row);
    });
  }
}