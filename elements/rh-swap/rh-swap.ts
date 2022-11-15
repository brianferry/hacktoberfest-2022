import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import { SwapChangeEvent } from '../rh-inline-switch/rh-inline-switch.js';

@customElement('rh-swap')
export class RhSwap extends LitElement {

  @property({ reflect: true }) key = "";

  @state()
  private _showA = false;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('swap-change', this._onSwapChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('swap-change', this._onSwapChange);
  }

  firstUpdated() {
    this.#checkStorage();
  }

  render() {
    return html`
        <slot></slot>
        <div ?hidden=${this._showA}><slot name="a"><slot></div>
        <div ?hidden=${!this._showA}><slot name="b"><slot></div>        
        `
  }

  #checkStorage() {
    if (this.key === undefined) {
      return;
    }

    if (localStorage.getItem(this.key) !== null) {
      const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");
      this._showA = storage.switchOn === 'true';
    }
  }


  @bound
  private _onSwapChange(event: any) {
    if (event instanceof SwapChangeEvent) {
      if (event.toggle.key === this.key) {
        this._showA = event.swap;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rh-swap': RhSwap;
  }
}
