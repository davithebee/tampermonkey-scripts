// ==UserScript==
// @name         Auto select "Tłumaczenie zatwierdzone" on Ctrl+O
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wybiera "Tłumaczenie zatwierdzone" jeśli dostępne, inaczej wykonuje domyślną akcję Ctrl+O
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlOrCmd && e.key.toLowerCase() === 'o') {
            console.log('[TM] Ctrl+O/Cmd+O pressed');
            const options = document.querySelectorAll('option');
            let found = false;

            options.forEach(option => {
                if (option.textContent.trim() === 'Tłumaczenie zatwierdzone') {
                    const select = option.parentElement;
                    if (select && select.tagName.toLowerCase() === 'select') {
                        console.log('[TM] Found target option, setting value:', option.value);
                        select.value = option.value;

                        const event = new Event('change', { bubbles: true });
                        select.dispatchEvent(event);

                        found = true;
                    }
                }
            });

            if (found) {
                console.log('[TM] Option selected, skipping default Ctrl+O action');
                e.preventDefault(); // Zapobiega otwarciu dialogu "Open"
            } else {
                console.log('[TM] Option not found, proceeding with default Ctrl+O action');
            }
        }
    });
})();
