// ==UserScript==
// @name         Ctrl/Cmd + O – Ustawienie "Tłumaczenie zatwierdzone"
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Ustawia opcję "Tłumaczenie zatwierdzone" w select albo wykonuje domyślną akcję Ctrl/Cmd+O
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isOpenShortcut = (isMac && e.metaKey && e.key === 'o') || (!isMac && e.ctrlKey && e.key === 'o');

    if (isOpenShortcut) {
      console.log('Przechwycono skrót otwierania (Ctrl/Cmd+O)');

      e.preventDefault(); // zatrzymujemy domyślne zachowanie (otwieranie pliku/linku)

      var selectName = 'slide_content_editorial_stage_en';
      const desiredValue = 'translation_approved';

      var select = document.querySelector(`select[name="${selectName}"]`);
      if (select) {
        console.log(`Znaleziono select o nazwie: ${selectName}`);
        const option = Array.from(select.options).find(opt => opt.value === desiredValue);
        if (option) {
          select.value = desiredValue;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`Ustawiono wartość "${desiredValue}" dla ${selectName}`);
        } else {
          console.log(`Nie znaleziono opcji "${desiredValue}" w ${selectName}`);
        }
      } else {
        selectName = 'editorial_stage_en';
        select = document.querySelector(`select[name="${selectName}"]`);
        if (select) {
          console.log(`Znaleziono select o nazwie: ${selectName}`);
          const option = Array.from(select.options).find(opt => opt.value === desiredValue);
            if (option) {
                select.value = desiredValue;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`Ustawiono wartość "${desiredValue}" dla ${selectName}`);
            } else {
                console.log(`Nie znaleziono opcji "${desiredValue}" w ${selectName}`);
            }
        } else {
            console.log(`Nie znaleziono selecta "${selectName}" – wykonanie domyślnej akcji otwierania`);
        }
      }
    }
  });
})();
