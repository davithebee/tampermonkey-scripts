// ==UserScript==
// @name         Auto Kopiowanie Zaznaczonego Tekstu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatyczne kopiowanie zaznaczonego tekstu z debugiem i wsparciem dla input/textarea
// @author       Zespół Support IT
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // ─── Configuration ─────────────────────────────────────────────────────────
    const DEBUG = false; // Ustaw true, aby włączyć logi debug
    const DEBOUNCE_MS = 300; // Opóźnienie debounce przy selectionchange

    // ─── State ─────────────────────────────────────────────────────────────────
    let lastSelection = '';
    let debounceTimer = null;

    // ─── Logging ───────────────────────────────────────────────────────────────
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[AutoCopy]', ...args);
        }
    }

    // ─── Core copy logic ───────────────────────────────────────────────────────
    function getCurrentSelection() {
        const sel = window.getSelection().toString().trim();
        if (sel) {
            return sel;
        }
        // Optionally handle <input> or <textarea> selections
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            const { selectionStart, selectionEnd, value } = active;
            if (selectionEnd > selectionStart) {
                return value.substring(selectionStart, selectionEnd).trim();
            }
        }
        return '';
    }

    function attemptCopy() {
        debugLog('► attemptCopy() wywołane');
        const sel = getCurrentSelection();
        debugLog('   Pobranie zaznaczenia →', JSON.stringify(sel));
        if (!sel) {
            // Reset state if nothing selected
            if (lastSelection) {
                debugLog('   Brak zaznaczenia – resetuję lastSelection.');
                lastSelection = '';
            }
            return;
        }
        if (sel === lastSelection) {
            debugLog('   Tekst taki sam jak poprzednio – pomijam.');
            return;
        }
        // New, non-empty selection: copy
        debugLog('   Nowe zaznaczenie – kopiuję:', sel);
        try {
            GM_setClipboard(sel, 'text');
            debugLog('   GM_setClipboard zakończone.');
            lastSelection = sel;
        } catch (err) {
            console.error('[AutoCopy] Błąd kopiowania do schowka:', err);
        }
    }

    // ─── Event Handlers ────────────────────────────────────────────────────────
    function onSelectionChange() {
        debugLog('Event: selectionchange');
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(attemptCopy, DEBOUNCE_MS);
    }

    function onImmediateEvent(e) {
        debugLog(`Event: ${e.type}; key/button:`, e.key ?? e.button, '– sprawdzam natychmiast');
        attemptCopy();
    }

    // ─── Initialization ───────────────────────────────────────────────────────
    debugLog('Skrypt AutoCopy (v0.5) załadowany; czekam na zdarzenia…');

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseup', onImmediateEvent);
    document.addEventListener('keyup', onImmediateEvent);

    // Jeśli potrzebujesz debugowania kliknięć:
    // document.addEventListener('click', () => {
    //     debugLog('Event: click; zaznaczenie:', window.getSelection().toString());
    // });
})();
