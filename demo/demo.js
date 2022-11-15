import '@patternfly/pfe-band';
import '@patternfly/pfe-cta';
import '@rhds/elements/rh-secondary-nav/rh-secondary-nav.js';

import '../elements/rh-switcher/rh-switcher.js';
import '../elements/rh-swap/rh-swap.js';
import '../elements/rh-feedback-form/rh-feedback-form.js';
import '../elements/rh-inline-switch/rh-inline-switch.js';


const local = document.querySelector('#local-storage-button');
local.addEventListener('click', function() {
    const switchers= document.querySelectorAll('rh-switcher');
    const keys = [];
    switchers.forEach((sw) => {
        keys.push(sw.key);
    })
    keys.forEach((k) => {
        console.log(`removing ${k} from localStorage`);
        localStorage.removeItem(k);
    })
})
