import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

import { ComposedEvent } from '@patternfly/pfe-core';
import { bound } from '@patternfly/pfe-core/decorators.js';

import '@patternfly/pfe-switch';
import '@patternfly/pfe-icon';
import '@patternfly/pfe-button';

export type Variant = (
  | 'card'
  | 'bar'
  | 'inline'
);

export class SwapChangeEvent extends ComposedEvent {
  constructor(
    public swap: boolean,
    public toggle: RhSwitcher,
  ) {
    super('swap-change');
  }
}

@customElement('rh-switcher')
export class RhSwitcher extends LitElement {

  static styles = css`

        :host([variant="card"]) {
            position: absolute;
            bottom: 0;
            right: 3rem;
            min-width: 400px;
        }
        :host(:not([variant="card"])) [part="banner"][hidden],
        [part="banner"][hidden] {
          display: none;
        }

        :host([variant="bar"]) [part="banner"] {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto;
          max-width: 100vw;
          background: var(--rh-switcher-background-color, #bde1f4);
        }

        :host([variant="card"]) [part="banner"] {
            position: relative;
            grid-template-columns: auto;
            grid-template-rows: 1fr;
            background: transparent; 
        }

        :host([variant="card"]) [part="header"] {
            color: var(--rh-switch-header-color, #FFFFFF);
            background:  var(--rh-switch-header-background-color, #6753ac);
            padding: var(--rh-space-xs, 4px) var(--rh-space-xs, 4px);
            border-radius: 3px 3px 0px 0px;
        }

        :host(:not([variant="card"])) [part="header"] {
            display: flex;
            align-items: center;
            padding-inline-start: var(--rh-space-md, 16px);
        }

        pfe-button {
            --pf-c-button--PaddingBottom: 0;
            --pf-c-button--PaddingRight: 0;
            --pf-c-button--PaddingLeft: 0;
            --pf-c-button--PaddingTop: 0;
            display: inline-flex;
            padding-inline-end: var(--rh-space-md, 16px);
        }

        button {
            display: flex;
            padding: 0;
            margin: 0;
        }

        :host(:not([variant="inline"])) #container {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            border: 1px solid var(--rh-switcher-border, var(--rh-color-border-subtle-on-light, #d2d2d2));
        }

        :host([variant="card"]) #container {
            display: block;
            background: var(--rh-switch-background-color, #FFFFFF);
            padding: 0 var(--rh-space-md, 16px) var(--rh-space-md, 16px);
        }

        :host([variant="card"]) pfe-button {
            position: absolute;
            top: 16px;
            right: 16px;
            --pf-c-button--m-plain--Color: #FFFFFF;
        }

        :host([variant="card"]) pfe-button button:hover {
            --pf-c-button--m-plain--Color: #d2d2d2;
        }

        #switch {
            padding: var(--rh-space-md, 16px) var(--rh-space-md, 16px);
         }

        :host([variant="card"]) #switch {
            border-block-end: 1px solid var(--rh-switcher-border, var(--rh-color-border-subtle-on-light, #d2d2d2));
        }

        [data-state] {
            font-family: var(--pfe-theme--font-family--heading, "RedHatDisplay", "Overpass", Overpass, Helvetica, Arial, sans-serif);
        }

        :host([variant="inline"]) [part="header"],
        :host([variant="inline"]) pfe-button,
        :host([variant="inline"]) slot[name="form"] {
          display: none !important;
        }

        ::slotted(:is(h1, h2, h3, h4 , h5)) {
            font-family: var(--pfe-theme--font-family, "RedHatText", "Overpass", Overpass, Helvetica, Arial, sans-serif);
            font-size: 1rem;
            padding: 0 16px;
            text-transform: uppercase;
            font-weight: 300;
        }

        ::slotted(pfe-icon) {
            color: #06c;
            --pfe-icon--size: 16px;
        }
    `

  @query('#container') private _container!: HTMLElement;

  @query('pfe-switch') private _switch!: any;

  @property({ reflect: false }) key?: string;

  @property({ reflect: true, attribute: 'off-message' }) offMessage = "Off";

  @property({ reflect: true, attribute: 'on-message' }) onMessage = "On";

  @property({ reflect: true }) variant: Variant = 'card'

  @state()
  private _hideSwitch = false;

  @state()
  private _switchChecked = false;

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
                <div part="header">
                    <slot></slot>
                </div>
                <div id="container">
                    <div id="switch">
                      <pfe-switch id="checked" ?checked="${this._switchChecked}" show-check-icon></pfe-switch>
                      <label for="checked" data-state="on">${this.onMessage}</label>
                      <label for="checked" data-state="off">${this.offMessage}</label>
                    </div>
                    <pfe-button plain @click="${this._onCloseClick}">
                      <button>
                        <pfe-icon icon="xmark" size="md" aria-label="Close"></pfe-icon>
                      </button>
                    </pfe-button>
                    <slot name="form"></slot>
                </div>
            </div>
        `;
  }
 
  @bound
  private async _onSwitch() {
    if (this.key === undefined) {
      return;
    }
    const isSwitchChecked = this._switch.checked;
    // TODO: I think this might cause issues later should first read the key
    // JSON.parse it then set the new key to the object, then Stringify and write
    // whole object back to localstorage.
    localStorage.setItem(this.key, JSON.stringify({ 'switchOn': isSwitchChecked.toString() }));
    this.dispatchEvent(new SwapChangeEvent(isSwitchChecked, this));
    this.requestUpdate();
  }

  @bound
  private _onCloseClick() {
    if (this.key === undefined) {
      return;
    }
    const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");
    storage.hide = 'true';
    localStorage.setItem(this.key, JSON.stringify(storage));
    this._hideSwitch = true;
    this.requestUpdate();
  }

  #checkStorage() {
    if (this.key === undefined) {
      return;
    }
    if (localStorage.getItem(this.key) !== null) {
      const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");
      this._switchChecked = storage.switchOn === 'true';
      this._hideSwitch = storage.hide === 'true';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rh-switcher': RhSwitcher;
  }
}
