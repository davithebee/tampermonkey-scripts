// ==UserScript==
// @name         CKEditor Color Picker (1-7)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Select CKEditor colors with keyboard shortcuts (Ctrl+1-7 on macOS, Alt+1-7 on Windows)
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const isMac = navigator.platform.toUpperCase().includes('MAC');

    document.addEventListener('keydown', function (e) {
        if (!['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) return;

        const modifierActive = isMac ? e.ctrlKey : e.altKey;
        const otherModifiers = isMac
            ? e.altKey || e.metaKey || e.shiftKey
            : e.ctrlKey || e.metaKey || e.shiftKey;

        if (!modifierActive || otherModifiers) return;

        e.preventDefault();

        const colorIndex = parseInt(e.key) - 1;
        const dropdownButton = document.querySelector('.ck-dropdown__button[data-cke-tooltip-text="Kolor czcionki"]');

        if (!dropdownButton) return;

        const isOpen = dropdownButton.getAttribute('aria-expanded') === 'true';

        function clickColor() {
            const colorButtons = document.querySelectorAll('.ck-color-grid .ck-color-grid__tile');
            if (colorButtons[colorIndex]) colorButtons[colorIndex].click();
        }

        if (isOpen) {
            clickColor();
        } else {
            dropdownButton.click();
            setTimeout(clickColor, 50);
        }
    });
})();
