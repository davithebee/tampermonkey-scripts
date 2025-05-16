// ==UserScript==
// @name         Przełączanie Elementów na Atlassian (Ctrl + Shift + E / Mac: Command + Shift + E)
// @namespace    BethinkScripts
// @version      1.6
// @description  Na zmianę otwiera i zamyka elementy z data-expanded na stronach Atlassian po naciśnięciu Ctrl + Shift + E (Mac: Command + Shift + E)
// @author       Ty
// @match        *://*.atlassian.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isExpanded = false; // Flaga do śledzenia stanu

    function toggleElements() {
        if (isExpanded) {
            console.log("Zamykanie elementów...");
            let elements = document.querySelectorAll('[data-expanded="true"] > button');
            if (elements.length === 0) {
                console.log("Nie znaleziono elementów do zamknięcia.");
            } else {
                elements.forEach(x => {
                    console.log("Klikam w przycisk (zamykam):", x);
                    x.click();
                });
            }
        } else {
            console.log("Otwieranie elementów...");
            let elements = document.querySelectorAll('[data-expanded="false"] > button');
            if (elements.length === 0) {
                console.log("Nie znaleziono elementów do otwarcia.");
            } else {
                elements.forEach(x => {
                    console.log("Klikam w przycisk (otwieram):", x);
                    x.click();
                });
            }
        }
        isExpanded = !isExpanded; // Przełączamy stan
    }

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyE') {
            console.log("Wykryto skrót Ctrl + Shift + E (Mac: Command + Shift + E), przełączam stan...");
            event.preventDefault();
            toggleElements();
        }
    });

})();
