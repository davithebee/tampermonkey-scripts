// ==UserScript==
// @name         Wklejanie po naciśnięciu Shift (Clipboard API)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Wkleja zawartość schowka po naciśnięciu samego Shift, używając navigator.clipboard.readText()
// @author       Zespół Support IT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('[PasteOnShift] Skrypt załadowany.');

    document.addEventListener('keydown', async function(e) {
        console.log('[PasteOnShift] keydown:', e.key, ' repeat:', e.repeat);
        // Sprawdzamy czy naciśnięto sam Shift, bez powtórki
        if (e.key === 'Shift' && !e.repeat) {
            console.log('[PasteOnShift] Shift wykryty, odczytuję schowek za pomocą Clipboard API...');
            let text = '';
            try {
                text = await navigator.clipboard.readText();
                console.log('[PasteOnShift] Zawartość schowka:', text);
            } catch (err) {
                console.error('[PasteOnShift] Błąd odczytu schowka:', err);
                return;
            }

            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') {
                    const start = active.selectionStart;
                    const end = active.selectionEnd;
                    const value = active.value;
                    active.value = value.slice(0, start) + text + value.slice(end);
                    const pos = start + text.length;
                    active.setSelectionRange(pos, pos);
                    console.log('[PasteOnShift] Wklejono do pola tekstowego na pozycji', pos);
                } else {
                    document.execCommand('insertText', false, text);
                    console.log('[PasteOnShift] Wklejono do contentEditable.');
                }
            } else {
                console.log('[PasteOnShift] Brak aktywnego pola tekstowego.');
            }

            e.preventDefault();
        }
    }, true);
})();
