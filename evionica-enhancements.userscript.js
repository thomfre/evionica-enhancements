// ==UserScript==
// @name         LimaNovember.Aero - Evionica CBT Enhancements
// @namespace    https://limanovember.aero/
// @version      0.2
// @description  Make the CBT a bit better for myself
// @icon         https://limanovember.aero/images/icon.png
// @author       thomfre
// @match        https://cdn.talentlms.com/engine/V2.5/scorm_popupV2.html
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL  https://raw.githubusercontent.com/thomfre/evionica-enhancements/main/evionica-enhancements.userscript.js
// @updateURL    https://raw.githubusercontent.com/thomfre/evionica-enhancements/main/evionica-enhancements.userscript.meta.js
// ==/UserScript==

let lastText = '';
let iframe = undefined;

const prependTextContainer = () => {
    GM_addStyle(
        '#lnaHeader:empty { display: none; } #lnaHeader { text-align: center; padding: 5px; position: fixed; top: 0; left: 89px; right: 89.5px; z-index: 999; background-color: #3E4045; color: #E6E0E0; }'
    );

    let div = document.createElement('div');
    div.id = 'lnaHeader';

    document.body.prepend(div);
};

const checkChanges = (mutationsList) => {
    unsafeWindow._DEBUG = false;

    const newText = [...iframe.querySelectorAll('div[data-acc-text]')]
        .map((x) => x.dataset.accText)
        .filter((x) => !x.endsWith('.png'))
        .at(2);

    if (newText === undefined) {
        return;
    }

    if (newText !== lastText) {
        console.log(newText);
        document.getElementById('lnaHeader').innerText = lastText;
        lastText = newText;
    }
};

const observeAndAct = () => {
    unsafeWindow._DEBUG = false;

    iframe = unsafeWindow.document.getElementById('sc_content').contentWindow.document.body;
    iframe.onkeyup = keyEventHandler;
    document.body.onkeyup = keyEventHandler;

    prependTextContainer();

    let config = { subtree: true, attributes: true, childList: true, characterData: true };

    let observer = new MutationObserver(checkChanges);
    observer.observe(iframe, config);
};

const keyEventHandler = (e) => {
    if (e.keyCode === 32) {
        const playButton = iframe.querySelector('div[data-acc-text^="Play_button"]');
        const pauseButton = iframe.querySelector('div[data-acc-text^="Pause_button"]');

        if (playButton.classList.contains('shown')) {
            playButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        } else if (pauseButton.classList.contains('shown')) {
            pauseButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        } else {
            console.error('Unknown play/pause state');
        }
    }
};

(function () {
    'use strict';
    unsafeWindow._DEBUG = false;

    setTimeout(observeAndAct, 1000);
})();
