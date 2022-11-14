import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements, state, query } from 'lit/decorators.js';

import { bound } from '@patternfly/pfe-core/decorators.js';

import { SwapChangeEvent } from '../rh-switcher/rh-switcher.js';

// import * as styles from './rh-feedback-form.css';

import '@patternfly/pfe-accordion';
import '@patternfly/pfe-card';
import '@patternfly/pfe-icon';
import '@patternfly/pfe-switch';

@customElement('rh-feedback-form')
export class RhFeedbackForm extends LitElement {

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

  render() {
    return html`
      <pfe-card>
        <h2 slot="header">X</h2>
        <div>
          <h3>This page is in open beta</h3>
        
        <p>
          Explore both versions and contribute to the new redhat.com!
        </p>
        
        <pfe-switch id="switch" checked></pfe-switch>
        
        <label for="switch" data-state="on">Design Version 1</label>
        <label for="switch" data-state="off" hidden>Current Design</label>
        
        <hr />
        
        <pfe-accordion class="accordion" expanded>
          <pfe-accordion-header>
            <h2>Give feedback</h2>
          </pfe-accordion-header>
          <pfe-accordion-panel>
            <fieldset>
              <legend>Which version did you prefer? * </legend>
              
              <input type="radio" id="version-pick-1" name="version" value="1">
              <label for="version-pick-1">1</label>
        
              <input type="radio" id="version-pick-2" name="version" value="2">
              <label for="version-pick-2">2</label>
        
              <div>
                <label for="expand">Care to expand? *</label>
                <textarea id="expand" name="expand" rows="5" cols="55"></textarea>
              </div>
        
              <div>
                <pfe-button type="submit"><button>Send</button></pfe-button>
              </div>
            </fieldset>
          </pfe-accordion-panel>
        </pfe-accordion>
      </pfe-card>`
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'rh-feedback-form': RhFeedbackForm;
  }
}
