import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import { ComposedEvent } from '@patternfly/pfe-core';

import '@patternfly/pfe-switch';
import '@patternfly/pfe-icon';
import '@patternfly/pfe-button';

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

        :host([card]) {
            position: absolute;
            bottom: 0;
            right: 0;
            min-width: 400px;
        }

        [part="banner"] {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            background: var(--rh-switcher-background-color, #bde1f4);
            max-width: 100vw;
        }

        :host([card]) [part="banner"] {
            position: relative;
            grid-template-columns: auto;
            grid-template-rows: 1fr;
            background: var(--rh-switch-background-color, #FFFFFF);
            border: 1px solid var(--rh-switcher-border, var(--rh-color-border-subtle-on-light, #d2d2d2));
        }

        [part="banner"][hidden] {
            display: none;
        }

        :host([card]) [part="header"] {
          color: var(--rh-switch-header-color, #FFFFFF);
          background:  var(--rh-switch-header-background-color, #6753ac);
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
            padding: var(--rh-space-md, 16px);
        }

        :host([card]) #container {
            justify-content: flex-start;
        }

        :host([card]) pfe-button {
            position: absolute;
            top: 28px;
            right: 16px;
            --pf-c-button--m-plain--Color: #FFFFFF;
        }

        :host([card]) pfe-button button:hover {
            --pf-c-button--m-plain--Color: #d2d2d2;
        }

        #switch {
            padding: 0 var(--rh-space-md, 16px);
        }

        [data-state] {
            font-weight: bold;
        }

        ::slotted(:is(h1, h2, h3, h4 , h5)) {
          padding: 0 16px;
          text-transform: uppercase;
          font-weight: 300;
        }

        ::slotted(pfe-icon) {
            color: #06c;
            --pfe-icon--size: 16px;
        }
    `
  @query('pfe-switch') private _switch!: any;

  @query('#container') private _container!: HTMLElement;

  @queryAssignedElements({ slot: 'a' }) private _slotA!: Array<HTMLElement>;
  @queryAssignedElements({ slot: 'b' }) private _slotB!: Array<HTMLElement>;

  @property({ reflect: false }) key?: string;

  @property({ reflect: true, attribute: 'off-message' }) offMessage = "Off";

  @property({ reflect: true, attribute: 'on-message' }) onMessage = "On";

  @property({ reflect: true, type: Boolean }) card? = false;

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
    const classes = classMap({ 'card': this.card ? true : false })
    return html`
            <div part="banner" ?hidden="${this._hideSwitch}" class="${classes}">
                <div part="header">
                    <slot></slot>
                </div>
                <div id="container">
                    <div id="switch">
                        <pfe-switch id="checked" ?checked="${this._switchChecked}" show-check-icon></pfe-switch>
                        <label for="checked" data-state="on">${this.onMessage}</label>
                        <label for="checked" data-state="off">${this.offMessage}</label>
                    </div>
                    <pfe-button plain @click="${this._onCloseClick}"><button><pfe-icon icon="xmark" size="md" aria-label="Close"></pfe-icon></button></pfe-button>
                </div>
                <slot name="form"></slot>
            </div>
        `;
  }

  #checkStorage() {
    if (this.key === undefined) {
      return;
    }

    if (localStorage.getItem(this.key) !== null) {
      const storage = JSON.parse(localStorage.getItem(this.key) ?? "{}");
      this._hideSwitch = storage.hide === 'true';
      this._switchChecked = storage.switchOn === 'true';
    }
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

  @bound
  private _onCloseClick() {
    if (this.key === undefined) {
      return;
    }
    localStorage.setItem(this.key, JSON.stringify({ 'hide': 'true' }));
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rh-switcher': RhSwitcher;
  }
}
