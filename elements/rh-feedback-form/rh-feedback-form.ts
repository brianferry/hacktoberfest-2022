import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rh-feedback-form')
export class RhFeedbackForm extends LitElement {

  static styles = css`
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

    legend {
      max-width: 20rem;
      padding: var(--rh-space-md, 16px) 0 0;
    }

    .set {
      padding: var(--rh-space-xs, 4px) 0 var(--rh-space-xs, 4px);
    }

    h3 {
      font-family: var(--pfe-theme--font-family--heading, "RedHatDisplay", "Overpass", Overpass, Helvetica, Arial, sans-serif);
      padding: var(--rh-space-md, 16px) 0;
    }

    .question {
      display: block;
      font-family: var(--pfe-theme--font-family--heading, "RedHatDisplay", "Overpass", Overpass, Helvetica, Arial, sans-serif);
      font-weight: bold;
      padding: var(--rh-space-sm, 8px) 0;
    }
  `;

  render() {
    return html`
      <form>
        <fieldset>
          <legend>This could be some info text about the change in design and how important feedback is to improve UX.</legend>
          <h3>Feedback</h3>
          <label class="question" for="version-pick-1">Which version did you prefer? *</label>
          <div class="set">
            <input type="radio" id="version-pick-1" name="version" value="1">
            <label for="version-pick-1">Original</label>
            <input type="radio" id="version-pick-2" name="version" value="2">
            <label for="version-pick-2">New</label>
          </div>
          <div class="set">
            <label class="question" for="expand">Care to expand? *</label>
            <textarea id="expand" name="expand" rows="5" cols="35"></textarea>
          </div>
          <div>
            <pfe-button type="submit"><button>Send</button></pfe-button>
          </div>
        </fieldset>
      </form>`
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'rh-feedback-form': RhFeedbackForm;
  }
}
