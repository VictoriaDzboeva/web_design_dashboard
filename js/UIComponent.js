export class UIComponent {
  constructor({ id, title }) {
    if (new.target === UIComponent) {
      throw new Error('UIComponent is abstract — use a subclass.');
    }
    this.id = id;
    this.title = title;
    this.element = null;
    this._listeners = [];
  }

  _on(target, event, handler) {
    target.addEventListener(event, handler);
    this._listeners.push({ target, event, handler });
  }

  _clearListeners() {
    this._listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this._listeners = [];
  }

  _createHeader() {
    const header = document.createElement('div');
    header.className = 'widget-header';

    const title = document.createElement('span');
    title.className = 'widget-title';
    title.textContent = this.title;

    const line = document.createElement('span');
    line.className = 'step-line';

    header.append(title, line);
    return header;
  }

  render() {
    throw new Error('render() must be implemented by subclass.');
  }

  destroy() {
    this._clearListeners();
    this.element?.remove();
    this.element = null;
  }
}