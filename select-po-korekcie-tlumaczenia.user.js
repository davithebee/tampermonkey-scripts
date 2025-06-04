// ==UserScript==
// @name         Auto select "Po korekcie tłumaczenia" on Ctrl+P
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wybiera "Po korekcie tłumaczenia" jeśli dostępne, inaczej uruchamia drukowanie
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlOrCmd && e.key.toLowerCase() === 'p') {
            console.log('[TM] Ctrl+P/Cmd+P pressed');
            const options = document.querySelectorAll('option');
            let found = false;

            options.forEach(option => {
                if (option.textContent.trim() === 'Po korekcie tłumaczenia') {
                    const select = option.parentElement;
                    if (select && select.tagName.toLowerCase() === 'select') {
                        console.log('[TM] Found target option, setting value:', option.value);
                        select.value = option.value;

                        // Trigger change event in case there is logic bound to it
                        const event = new Event('change', { bubbles: true });
                        select.dispatchEvent(event);

                        found = true;
                    }
                }
            });

            if (found) {
                console.log('[TM] Option selected, skipping print dialog');
                e.preventDefault(); // Prevent print dialog
            } else {
                console.log('[TM] Option not found, proceeding with print');
                // Allow normal print action
            }
        }
    });
})();
