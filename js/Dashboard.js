export class Dashboard {
  constructor() {
    this.widgets = [];
  }

  /**
   * Монтирует виджет в слот по id.
   * @param {Function} factory — () => new SomeWidget()
   * @param {string} slotId — id DOM-элемента слота
   */
  async mount(factory, slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) {
      console.warn(`Слот не найден: ${slotId}`);
      return;
    }

    const widget = factory();
    const el = await widget.render();
    slot.append(el);
    this.widgets.push(widget);
    return widget;
  }

  removeWidget(widgetId) {
    const widget = this.widgets.find((w) => w.id === widgetId);
    if (!widget) return;
    widget.destroy();
    this.widgets = this.widgets.filter((w) => w.id !== widgetId);
  }
}