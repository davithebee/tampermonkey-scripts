// ==UserScript==
// @name         Ctrl/Cmd + D – Ustawienie "Po korekcie tłumaczenia" (editorial_stage_en)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Przechwytuje Ctrl+D / Cmd+D i ustawia "Po korekcie tłumaczenia" tylko dla editorial_stage_en lub otwiera drukowanie
// @author       Bethink
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isShortcut =
      (isMac && e.metaKey && e.key.toLowerCase() === 'd') ||
      (!isMac && e.ctrlKey && e.key.toLowerCase() === 'd');

    if (!isShortcut) return;

    console.log('[TM] Przechwycono Ctrl/Cmd + D');

    e.preventDefault(); // blokujemy domyślną akcję (np. dodanie zakładki)

    const selectName = 'editorial_stage_en';
    const desiredValue = 'translation_reviewed';

    const select = document.querySelector(`select[name="${selectName}"]`);

    if (!select) {
      console.log(`[TM] Brak selecta o nazwie: ${selectName} — brak akcji`);
      return;
    }

    console.log(`[TM] Znaleziono select: ${selectName}`);

    const optionExists = Array.from(select.options).some(
      opt => opt.value === desiredValue
    );

    if (!optionExists) {
      console.log(`[TM] Brak opcji "${desiredValue}" — brak akcji`);
      return;
    }

    select.value = desiredValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    console.log(`[TM] Ustawiono "${desiredValue}" dla ${selectName}`);
  });
})();
