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
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            background: var(--rh-switcher-background-color, #bde1f4);
            max-width: 100vw;
            padding: var(--rh-space-md, 16px);
        }

        [part="banner"][hidden] {
            display: none;
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

        #container {
            display: flex;
            justify-content: flex-end;
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

    @query('#container') private _container!: HTMLElement;

    @queryAssignedElements({slot: 'a'}) private _slotA!: Array<HTMLElement>;
    @queryAssignedElements({slot: 'b'}) private _slotB!: Array<HTMLElement>;

    @property({reflect: false}) key?: string;

    @property({reflect: true, attribute: 'off-message'}) offMessage = "Off"

    @property({reflect: true, attribute: 'on-message'}) onMessage = "On"

    @state()
    private _hideSwitch = false;

    @state()
    private _showA: boolean = false;

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
            <div part="banner" ?hidden="${this._hideSwitch}">
                <div>
                    <slot></slot>
                </div>
                <div id="container">
                    <div id="switch">
                        <pfe-switch id="checked" ?checked="${this._showA}" show-check-icon></pfe-switch>
                        <label for="checked" data-state="on">${this.onMessage}</label>
                        <label for="checked" data-state="off">${this.offMessage}</label>
                    </div>
                    <pfe-button plain @click="${this._onCloseClick}"><button><pfe-icon icon="xmark" size="md" aria-label="Close"></pfe-icon></button></pfe-button>
                </div>
            </div>
            <div ?hidden=${this._showA}><slot name="a"><slot></div>
            <div ?hidden=${!this._showA}><slot name="b"><slot></div>
        `;
    }

    #checkStorage() {
        if (this.key === undefined) {
            return;
        }
        const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");
        this._showA = storage.showA === 'true';
        this._hideSwitch = storage.hide === 'true';
    }

    @bound
    private async _onSwitch(event: Event) {
        if (this.key === undefined) {
            return;
        }
        localStorage.setItem(this.key,  JSON.stringify({'showA': this._switch.checked.toString()}) );
        this.requestUpdate();
    }

    @bound
    private _onCloseClick(event: Event) {
        if (this.key === undefined) {
            return;
        }
        localStorage.setItem(this.key,  JSON.stringify({'hide': 'true'}) );
        console.log(localStorage.getItem(this.key));
        this.requestUpdate();
    }
}