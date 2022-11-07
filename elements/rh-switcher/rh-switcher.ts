import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import type { PfeSwitch } from '@patternfly/pfe-switch';
import '@patternfly/pfe-switch';
import '@patternfly/pfe-icon';
import '@patternfly/pfe-button';

@customElement('rh-switcher')
export class RhSwitcher extends LitElement {

    static styles = css`
        [part="banner"] {
            display: grid;
            grid-template-columns: 1fr fit-content(300px) fit-content(1ch);
            grid-template-rows: auto;
            background: var(--rh-switcher-background-color, #bde1f4);
            max-width: 100vw;
            padding: var(--rh-space-md, 16px);
        }

        pfe-button {
            --pf-c-button--PaddingBottom: 0;
            --pf-c-button--PaddingRight: 0;
            --pf-c-button--PaddingLeft: 0;
            --pf-c-button--PaddingTop: 0;
            display: inline-flex;
        }

        button {
            display: flex;
            padding: 0;
            margin: 0;
        }

        #switch {
            padding: 0 var(--rh-space-md, 16px);
        }

        ::slotted(pfe-icon) {
            color: #06c;
            --pfe-icon--size: 16px;
        }
    `
    @query('pfe-switch') private _switch!: PfeSwitch;

    @queryAssignedElements({slot: 'a'}) private _slotA!: Array<HTMLElement>;
    @queryAssignedElements({slot: 'b'}) private _slotB!: Array<HTMLElement>;

    @property({reflect: false}) key?: string;

    @property({reflect: true, attribute: 'off-message'}) offMessage = "Off"

    @property({reflect: true, attribute: 'on-message'}) onMessage = "On"

    @state()
    private _show: boolean = false;

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
            <div part="banner">
                <div>
                    <slot></slot>
                </div>
                <div id="switch">
                    <pfe-switch id="checked" ?checked="${this._show}" show-check-icon></pfe-switch>
                    <label for="checked" data-state="on">${this.onMessage}</label>
                    <label for="checked" data-state="off">${this.offMessage}</label>
                </div>
                <pfe-button plain @click="${this._onCloseClick}"><button><pfe-icon icon="xmark" size="md" aria-label="Close"></pfe-icon></button></pfe-button>
            </div>
            <div ?hidden=${this._show}><slot name="a"><slot></div>
            <div ?hidden=${!this._show}><slot name="b"><slot></div>
        `;
    }

    #checkStorage() {
        if (this.key === undefined) {
            return;
        }
        this._show = localStorage.getItem(this.key) === 'true';
        console.log(this._show);
    }

    @bound
    private async _onSwitch(event: Event) {
        if (this.key === undefined) {
            return;
        }
        localStorage.setItem(this.key,  this._switch.checked.toString());
        console.log('switched to ', localStorage.getItem(this.key));
        this.requestUpdate();
    }

    @bound
    private _onCloseClick(event: Event) {
        // TODO: save preference for bar to not show if closed.
        this.remove();
    }
}