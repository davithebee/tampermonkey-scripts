// ==UserScript==
// @name         Uppercase/lowercase toggle (platforma)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zmienia zaznaczenie na UPPER/lower w zależności od zawartości. Działa tylko na stronach zawierających /admin/. Skrót: Ctrl/Cmd + Shift + U
// @author       Bethink
// @match        */admin/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.pathname.includes('/admin/')) {
        console.log('[Tampermonkey] Skrypt nieaktywny (nie jesteś na /admin/).');
        return;
    }

    console.log('[Tampermonkey] Skrypt toggle case (tylko /admin/) załadowany');

    document.addEventListener('keydown', function (e) {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const isShortcut =
            (isMac && e.metaKey && e.shiftKey && e.code === 'KeyU') ||
            (!isMac && e.ctrlKey && e.shiftKey && e.code === 'KeyU');

        if (!isShortcut) return;

        e.preventDefault();
        console.log('[Tampermonkey] Skrót Ctrl/Cmd + Shift + U aktywowany');

        const toToggleCase = (text) => {
            if (text === text.toUpperCase()) {
                console.log('[Tampermonkey] Wykryto UPPERCASE → zamieniamy na lowercase');
                return text.toLowerCase();
            } else {
                console.log('[Tampermonkey] Wykryto lowercase/mieszane → zamieniamy na UPPERCASE');
                return text.toUpperCase();
            }
        };

        const activeEl = document.activeElement;

        // 1. ACE EDITOR
        if (window.ace && activeEl && activeEl.classList.contains('ace_text-input')) {
            try {
                const editorElement = activeEl.closest('.ace_editor');
                const editor = ace.edit(editorElement);

                const range = editor.getSelectionRange();
                const selectedText = editor.session.getTextRange(range);
                if (selectedText.trim() !== '') {
                    const newText = toToggleCase(selectedText);
                    editor.session.replace(range, newText);
                    console.log(`[Tampermonkey] Ace: "${selectedText}" → "${newText}"`);
                    return;
                }
            } catch (err) {
                console.warn('[Tampermonkey] Błąd obsługi Ace:', err);
            }
        }

        // 2. TEXTAREA / INPUT
        if (activeEl && (activeEl.tagName === 'TEXTAREA' ||
            (activeEl.tagName === 'INPUT' && activeEl.type === 'text'))) {

            const start = activeEl.selectionStart;
            const end = activeEl.selectionEnd;
            const selectedText = activeEl.value.substring(start, end);

            if (selectedText.trim() !== '') {
                const newText = toToggleCase(selectedText);
                activeEl.setRangeText(newText, start, end, 'select');
                console.log(`[Tampermonkey] Textarea/Input: "${selectedText}" → "${newText}"`);
                return;
            }
        }

        // 3. DOM SELECTION
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selectedText = selection.toString();
            if (selectedText.trim() !== '') {
                const range = selection.getRangeAt(0);
                const span = document.createElement("span");
                const newText = toToggleCase(selectedText);
                span.textContent = newText;
                range.deleteContents();
                range.insertNode(span);
                console.log(`[Tampermonkey] DOM Selection: "${selectedText}" → "${newText}"`);
                return;
            }
        }

        console.log('[Tampermonkey] Brak aktywnego zaznaczenia do zmiany.');
    });
})();
