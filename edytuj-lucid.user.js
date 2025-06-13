// ==UserScript==
// @name         Shortcut - Edytuj Lucid
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Szuka selecta z językiem i klika przypisany przycisk Edytuj Lucid (skrót L+1 do L+5)
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const shortcutMap = {
        '1': 'pl',
        '2': 'en',
        '3': 'la',
        '4': 'en_uk',
        '5': 'en_us'
    };

    let waitingForNumber = false;
    let timeout = null;

    document.addEventListener('keydown', function (e) {
        console.log(`[Tampermonkey] Naciśnięto klawisz: key="${e.key}", code="${e.code}"`);

        if (!waitingForNumber && e.key.toLowerCase() === 'l') {
            console.log("[Tampermonkey] Wykryto L – oczekuję na cyfrę 1–5 przez 2 sekundy...");
            waitingForNumber = true;

            timeout = setTimeout(() => {
                console.log("[Tampermonkey] Timeout: nie podano cyfry – resetuję.");
                waitingForNumber = false;
            }, 2000);
            return;
        }

        if (waitingForNumber && shortcutMap[e.key]) {
            const lang = shortcutMap[e.key];
            console.log(`[Tampermonkey] Wykryto L+${e.key} → język: ${lang}`);
            clearTimeout(timeout);
            waitingForNumber = false;
            runSearch(lang);
        }
    });

    function runSearch(languageCode) {
        console.log("[Tampermonkey] Startuję z wyszukiwaniem dla języka:", languageCode);
        let index = 0;

        while (true) {
            const selectorName = `assets.0.variants.0.files.${index}.media_content_language`;
            const select = document.querySelector(`select[name="${selectorName}"]`);
            console.log(`[Tampermonkey] Sprawdzam select: ${selectorName}`, select);

            if (!select) {
                console.log("[Tampermonkey] Brak więcej selectów – przerywam pętlę.");
                break;
            }

            const selectedValue = select.value;
            console.log(`[Tampermonkey] Wybrana wartość: ${selectedValue}`);

            if (selectedValue === languageCode) {
                console.log(`[Tampermonkey] Trafienie! Język ${languageCode} w select #${index}`);
                const wrapper = select.closest('.mediaFile__contentWrapper');
                if (wrapper) {
                    const button = [...wrapper.querySelectorAll('span.ds-button__content')]
                        .find(btn => btn.textContent?.includes('Edytuj Lucid'));

                    if (button) {
                        const fullButton = button.closest('span.ds-button');
                        if (fullButton) {
                            console.log("[Tampermonkey] Klikam lokalny przycisk Edytuj Lucid:", fullButton);
                            fullButton.click();
                        } else {
                            console.warn("[Tampermonkey] Nie znaleziono pełnego wrappera przycisku.");
                        }
                    } else {
                        console.warn("[Tampermonkey] Brak przycisku Edytuj Lucid w wrapperze.");
                    }
                } else {
                    console.warn("[Tampermonkey] Nie znaleziono wrappera .mediaFile__contentWrapper dla selecta.");
                }
            }

            index++;
        }
    }
})();
