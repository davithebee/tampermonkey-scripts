// ==UserScript==
// @name         Ctrl/Cmd + D – Ustawienie opcji "Po korekcie tłumaczenia"
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Przechwytuje Ctrl+D / Cmd+D i ustawia "Po korekcie tłumaczenia" lub otwiera okno drukowania
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isPrintShortcut = (isMac && e.metaKey && e.key === 'd') || (!isMac && e.ctrlKey && e.key === 'd');

    if (isPrintShortcut) {
      console.log('Przechwycono skrót drukowania');

      e.preventDefault(); // zatrzymujemy domyślne okno drukowania

      var selectNames = ['slide_content_editorial_stage_en'];
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

      selectNames = ['editorial_stage_en'];

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
