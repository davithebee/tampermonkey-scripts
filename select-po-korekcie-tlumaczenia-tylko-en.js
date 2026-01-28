// ==UserScript==
// @name         Ctrl/Cmd + P – Ustawienie "Po korekcie tłumaczenia" (editorial_stage_en)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Przechwytuje Ctrl+P / Cmd+P i ustawia "Po korekcie tłumaczenia" tylko dla editorial_stage_en lub otwiera drukowanie
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isPrintShortcut =
      (isMac && e.metaKey && e.key === 'p') ||
      (!isMac && e.ctrlKey && e.key === 'p');

    if (!isPrintShortcut) return;

    console.log('[TM] Przechwycono Ctrl/Cmd + P');

    e.preventDefault(); // blokujemy domyślne drukowanie

    const selectName = 'editorial_stage_en';
    const desiredValue = 'translation_reviewed';

    const select = document.querySelector(`select[name="${selectName}"]`);

    if (!select) {
      console.log(`[TM] Brak selecta o nazwie: ${selectName} — otwieram drukowanie`);
      window.print();
      return;
    }

    console.log(`[TM] Znaleziono select: ${selectName}`);

    const optionExists = Array.from(select.options).some(
      opt => opt.value === desiredValue
    );

    if (!optionExists) {
      console.log(`[TM] Brak opcji "${desiredValue}" — otwieram drukowanie`);
      window.print();
      return;
    }

    select.value = desiredValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    console.log(`[TM] Ustawiono "${desiredValue}" dla ${selectName}`);
  });
})();
