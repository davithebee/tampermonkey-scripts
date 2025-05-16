// ==UserScript==
// @name         Nawigacja strzałkami - Slideshow
// @namespace    BethinkScripts
// @version      1.4
// @description  Klikanie przycisków "Poprzedni slajd" i "Następny slajd" strzałkami klawiatury
// @author       Dawid Liberski
// @match        https://*/admin/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script for slideshow navigation loaded.");

    function isEditableElement(element) {
        if (!element) return false;
        const tag = element.tagName.toLowerCase();
        const editable = element.isContentEditable;
        return tag === 'input' || tag === 'textarea' || editable;
    }

    document.addEventListener('keydown', function(event) {
        if (isEditableElement(event.target)) {
            console.log("Key pressed inside editable element, skipping...");
            return;
        }

        if (event.key === "ArrowLeft") {
            console.log("Left arrow pressed.");
            let prevButton = document.querySelector('.ds-button:has(.fa-angle-left), .navigate-left');
            if (prevButton) {
                console.log("Clicking previous slide button.");
                prevButton.click();
            } else {
                console.log("Previous slide button not found.");
            }
        } else if (event.key === "ArrowRight") {
            console.log("Right arrow pressed.");
            let nextButton = document.querySelector('.ds-button:has(.fa-angle-right), .navigate-right');
            if (nextButton) {
                console.log("Clicking next slide button.");
                nextButton.click();
            } else {
                console.log("Next slide button not found.");
            }
        }
    });
})();