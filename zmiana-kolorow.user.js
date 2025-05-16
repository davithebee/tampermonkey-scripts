// ==UserScript==
// @name         Zmieniacz Kolorów w Tekście
// @namespace    BethinkScripts
// @version      1.8
// @description  Automatyczna zmiana koloru czcionki w CKEditor (Windows & MacOS, działa także w polach tekstowych)
// @author       Ty
// @match        *://*/*
// @grant        none
//
// ==/UserScript==

(function() {
    'use strict';

    let colorIndex = 0; // Indeks aktualnego koloru

    window.addEventListener('keydown', function(event) {
        // Sprawdzamy, czy użytkownik nie jest w polu tekstowym, ale obsługujemy też CKEditor
        if ((event.ctrlKey && event.shiftKey && event.code === 'KeyC') || (event.metaKey && event.shiftKey && event.code === 'KeyC')) {
            console.log("[Tampermonkey] Wykryto naciśnięcie skrótu: Ctrl + Shift + C / Cmd + Shift + C");
            event.preventDefault();
            event.stopImmediatePropagation(); // Całkowicie blokujemy propagację zdarzenia
            changeFontColor();
        }
    }, true); // Nasłuchujemy na poziomie `window`

    function changeFontColor() {
        const colorButton = document.querySelector('.ck-dropdown__button[data-cke-tooltip-text="Kolor czcionki"]');
        if (!colorButton) {
            console.log("[Tampermonkey] Nie znaleziono przycisku wyboru koloru czcionki.");
            return;
        }
        colorButton.click();
        console.log("[Tampermonkey] Kliknięto przycisk wyboru koloru czcionki.");

        let attempts = 0;
        const checkColors = setInterval(() => {
            const colors = document.querySelectorAll('.ck-color-grid__tile');
            if (colors.length > 0) {
                clearInterval(checkColors);
                colorIndex = (colorIndex + 1) % colors.length;
                colors[colorIndex].click();
                console.log(`[Tampermonkey] Zmieniono kolor czcionki na: ${colors[colorIndex].dataset.ckeTooltipText}`);
            }

            attempts++;
            if (attempts > 10) {
                clearInterval(checkColors);
                console.log("[Tampermonkey] Nie udało się znaleźć listy kolorów.");
            }
        }, 100); // Sprawdzamy co 100 ms, max 10 razy
    }
})();
