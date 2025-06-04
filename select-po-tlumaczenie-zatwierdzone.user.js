// ==UserScript==
// @name         Toggle "translation_en_verified" checkbox on Ctrl+O (with class toggle)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Przełącza checkbox i klasę "switch" po Ctrl+O / Cmd+O z debug logami i zmianą klasy na "switch checked" lub "switch" w zależności od stanu checkboxa. 
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('[TM] Tampermonkey script loaded – toggle translation_en_verified on Ctrl+O');

    document.addEventListener('keydown', function (e) {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlOrCmd && e.key.toLowerCase() === 'o') {
            console.log('[TM] Detected Ctrl+O / Cmd+O press');
            e.preventDefault(); // blokuje otwieranie pliku

            const checkbox = document.getElementById('translation_en_verified');

            if (!checkbox) {
                console.log('[TM] ❌ Checkbox #translation_en_verified NOT FOUND');
                return;
            }

            if (checkbox.type !== 'checkbox') {
                console.log('[TM] ❌ Found element is not a checkbox. Type:', checkbox.type);
                return;
            }

            console.log('[TM] ✅ Checkbox found. Current: checked =', checkbox.checked, ', value =', checkbox.value);

            // Przełącz stan checkboxa
            checkbox.checked = !checkbox.checked;
            checkbox.value = checkbox.checked ? 'true' : 'false';

            console.log('[TM] 🔄 Checkbox toggled. New: checked =', checkbox.checked, ', value =', checkbox.value);

            // Przełącz klasę diva rodzica
            const parentDiv = checkbox.closest('.switch');
            if (parentDiv) {
                if (checkbox.checked) {
                    parentDiv.classList.add('checked');
                    console.log('[TM] 🟢 Parent class updated: switch → switch checked');
                } else {
                    parentDiv.classList.remove('checked');
                    console.log('[TM] ⚪ Parent class updated: switch checked → switch');
                }
            } else {
                console.log('[TM] ⚠️ Parent div with class "switch" not found');
            }

            // Wywołaj zdarzenie change
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
            console.log('[TM] 📤 "change" event dispatched');
        }
    });
})();
