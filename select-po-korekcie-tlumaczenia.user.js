// ==UserScript==
// @name         Ctrl/Cmd + P – Ustawienie opcji "Po korekcie tłumaczenia"
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Przechwytuje Ctrl+P / Cmd+P i ustawia "Po korekcie tłumaczenia" lub otwiera okno drukowania
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isPrintShortcut = (isMac && e.metaKey && e.key === 'p') || (!isMac && e.ctrlKey && e.key === 'p');

    if (isPrintShortcut) {
      console.log('Przechwycono skrót drukowania');

      e.preventDefault(); // zatrzymujemy domyślne okno drukowania

      const selectNames = ['slide_content_editorial_stage_en_us', 'slide_content_editorial_stage_en_uk'];
      const desiredValue = 'translation_reviewed';
      let found = false;

      selectNames.forEach(name => {
        const select = document.querySelector(`select[name="${name}"]`);
        if (select) {
          console.log(`Znaleziono select o nazwie: ${name}`);
          const option = Array.from(select.options).find(opt => opt.value === desiredValue);
          if (option) {
            select.value = desiredValue;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Ustawiono wartość "${desiredValue}" dla ${name}`);
            found = true;
          } else {
            console.log(`Nie znaleziono opcji "${desiredValue}" w ${name}`);
          }
        } else {
          console.log(`Brak selecta o nazwie: ${name}`);
        }
      });

      if (!found) {
        console.log('Nie znaleziono żadnych pasujących selectów — otwieranie okna drukowania');
        window.print();
      }
    }
  });
})();
