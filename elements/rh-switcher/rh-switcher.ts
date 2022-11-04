import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';

@customElement('rh-switcher')
export class RhSwitcher extends LitElement {
    @queryAssignedElements({slot: 'a'}) private _slotA!: Array<HTMLElement>;
    @queryAssignedElements({slot: 'b'}) private _slotB!: Array<HTMLElement>;

    @property({reflect: false}) key?: string;

    #showA = true;
    
    @state()
    private _storage: string | null = null;

    updated() {
        this.#checkStorage();
    }

    render() {
        return html`
            <label><input type="checkbox" @click="${this.#handleClick}" ?checked="${this._storage}"/> On</label>
            <div ?hidden=${!this.#showA}><slot name="a"><slot></div>
            <div ?hidden=${this.#showA}><slot name="b"><slot></div>
        `;
    }

    #checkStorage() {
        if (this.key === undefined) {
            return;
        }
        this._storage = localStorage.getItem(this.key);
        this.#showA = this._storage === "checked" ? false : true;
    }

    async #handleClick(event: Event) {
        if (this.key === undefined) {
            return;
        }
        const checked = (<HTMLInputElement>event.target).checked ? "checked" : "";
        localStorage.setItem(this.key, checked);
        this.requestUpdate();
    }
}