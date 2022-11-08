import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import { SwapChangeEvent } from '../rh-switcher/rh-switcher.js';

@customElement('rh-swap')
export class RhSwap extends LitElement {

    @property({reflect: true}) key = "";

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
    
    render() {
        return html`
        <div ?hidden=${this._showA}><slot name="a"><slot></div>
        <div ?hidden=${!this._showA}><slot name="b"><slot></div>        
        `
    }

    @bound
    private _onSwapChange(event: SwapChangeEvent) {
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