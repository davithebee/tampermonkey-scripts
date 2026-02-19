// ==UserScript==
// @name         CKEditor: Indeks górny/dolny na skrót
// @namespace    tampermonkey-ckeditor-supsub
// @version      1.0.0
// @description  Ctrl/Cmd+Shift+, => indeks dolny; Ctrl/Cmd+Shift+. => indeks górny (CKEditor 5)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '[TM][CKEditor][sup/sub]';

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function isMacLike() {
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  }

  // Sprawdza, czy event pochodzi z obszaru CKEditora (toolbar/content)
  function isInCKEditorContext(target) {
    if (!target) return false;

    // Najczęstsze kontenery CKEditor 5
    const inEditor =
      !!target.closest?.('.ck-editor') ||
      !!target.closest?.('.ck-content') ||
      !!target.closest?.('.ck-toolbar') ||
      !!target.closest?.('.ck.ck-editor__main') ||
      !!target.closest?.('.ck.ck-editor__top');

    return inEditor;
  }

  function findButtonByTooltipText(text) {
    // CKEditor tooltip jest w data-cke-tooltip-text
    const selector = `button.ck.ck-button[data-cke-tooltip-text="${CSS.escape(text)}"]`;
    const btn = document.querySelector(selector);

    log('Szukam przycisku:', { text, selector, found: !!btn });
    return btn;
  }

  function clickCKButton(tooltipText) {
    const btn = findButtonByTooltipText(tooltipText);
    if (!btn) {
      log('Nie znaleziono przycisku:', tooltipText);
      return false;
    }

    // Dodatkowy log ze stanem aria-pressed
    log('Klikam przycisk:', tooltipText, {
      ariaPressed: btn.getAttribute('aria-pressed'),
      classes: btn.className
    });

    btn.click();
    return true;
  }

  function handleShortcut(e) {
    const key = e.key; // ',' albo '.'
    const ctrlOrCmd = isMacLike() ? e.metaKey : e.ctrlKey;

    // Wymagamy: Ctrl/Cmd + Shift + (, lub .)
    if (!ctrlOrCmd || !e.shiftKey) return;

    // Obsługujemy zarówno ',' jak i '.' (zależy od układu klawiatury i przeglądarki)
    const isComma = key === ','; // Ctrl/Cmd + Shift + ,
    const isDot = key === '.';   // Ctrl/Cmd + Shift + .

    if (!isComma && !isDot) return;

    const target = e.target;
    const inContext = isInCKEditorContext(target);

    log('Wykryto skrót:', {
      key,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      target: target?.tagName,
      targetClass: target?.className,
      inCKEditorContext: inContext
    });

    // Bezpiecznik: działamy tylko, gdy jesteśmy w CKEditorze (żeby nie psuć skrótów w innych miejscach)
    if (!inContext) {
      log('Pominięto — nie jesteśmy w kontekście CKEditora.');
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (isComma) {
      // Indeks dolny
      const ok = clickCKButton('Indeks dolny');
      log('Wynik akcji (Indeks dolny):', ok);
    } else if (isDot) {
      // Indeks górny
      const ok = clickCKButton('Indeks górny');
      log('Wynik akcji (Indeks górny):', ok);
    }
  }

  // Używamy capture=true, żeby złapać skrót zanim przejmie go CKEditor lub inne listenery
  window.addEventListener('keydown', handleShortcut, true);

  log('Skrypt załadowany. Skróty:',
      (isMacLike() ? 'Cmd' : 'Ctrl') + '+Shift+, => Indeks dolny; ' +
      (isMacLike() ? 'Cmd' : 'Ctrl') + '+Shift+. => Indeks górny');
})();
