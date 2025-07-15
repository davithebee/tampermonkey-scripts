// ==UserScript==
// @name         Ctrl/Cmd + S - Zapisanie slajdu/przypisu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kliknij "Zapisz" przy Ctrl+S lub Cmd+S
// @author       Bethink
// @match        *://*/admin/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Zapisz Script] Script loaded.");

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            console.log("[Zapisz Script] Ctrl+S lub Cmd+S wykryto.");

            let found = false;

            // Szukaj button z tekstem "Zapisz Slajd"
            const buttons = document.querySelectorAll("span.ds-button");
            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                console.log("[Zapisz Slajd Script] Sprawdzany przycisk tekst:", text);

                if (text === "Zapisz slajd") {
                    btn.click();
                    console.log("[Zapisz Slajd Script] Kliknięto przycisk Zapisz slajd!");
                    found = true;
                }
            });

            // Szukaj <a> z tekstem "Zapisz"
            const links = document.querySelectorAll("a");
            links.forEach(link => {
                const text = link.textContent.trim();
                console.log("[Zapisz Script] Sprawdzany link tekst:", text);
                if (text === "Zapisz") {
                    link.click();
                    console.log("[Zapisz Script] Kliknięto link Zapisz!");
                    found = true;
                }
            });

            if (!found) {
                console.log("[Zapisz Script] Nie znaleziono przycisku ani linku Zapisz.");
            }
        }
    });
})();
