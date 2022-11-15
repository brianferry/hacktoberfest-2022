import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import { ComposedEvent } from '@patternfly/pfe-core';

import '@patternfly/pfe-switch';
import '@patternfly/pfe-icon';
import '@patternfly/pfe-button';

export class SwapChangeEvent extends ComposedEvent {
  constructor(
    public swap: boolean,
    public toggle: RhInlineSwitch,
  ) {
    super('swap-change');
  }
}

@customElement('rh-inline-switch')
export class RhInlineSwitch extends LitElement {

  static styles = css`
pfe-card {
  --pfe-card--BackgroundColor: transparent;
  --pfe-card__header--BackgroundColor: transparent;
  --pfe-card--PaddingBottom: 0;
  
}

h3 {
  margin-block: 0;
}

[slot="header"] {
  color: #b8bbbe;
  font-size: 1rem;
}

label[for=expand] {
  display: block;
}

fieldset {
  border: none;
}

:host {
  --pf-c-accordion__toggle--expanded--before--BackgroundColor: transparent;
  --pf-c-accordion__panel--content-body--before--BackgroundColor: transparent;
}
  `;

  @property({ reflect: false }) key?: string;

  @property({ reflect: true, attribute: 'off-message' }) offMessage = "Off";

  @property({ reflect: true, attribute: 'on-message' }) onMessage = "On";

  @state()
  private _hideSwitch = false;

  @state()
  private _switchChecked = false;

  @query('pfe-switch') private _switch!: any;

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this._switch.addEventListener('change', this._onSwitch)
  }

  updated() {
    this.#checkStorage();
  }

  render() {
    return html`
            <pfe-switch id="checked" ?checked="${this._switchChecked}" show-check-icon></pfe-switch>
            <label for="checked" data-state="on">${this.onMessage}</label>
            <label for="checked" data-state="off">${this.offMessage}</label>
        `
  }

  @bound
  private async _onSwitch() {
    if (this.key === undefined) {
      return;
    }
    const isSwitchChecked = this._switch.checked;
    localStorage.setItem(this.key, JSON.stringify({ 'switchOn': isSwitchChecked.toString() }));
    this.dispatchEvent(new SwapChangeEvent(isSwitchChecked, this));
    this.requestUpdate();
  }

  #checkStorage() {
    if (this.key === undefined) {
      return;
    }

    if (localStorage.getItem(this.key) !== null) {
      const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");    
      this._switchChecked = storage.switchOn === 'true';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rh-inline-switch': RhInlineSwitch;
  }
}
