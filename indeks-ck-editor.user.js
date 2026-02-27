// ==UserScript==
// @name         CKEditor: Indeks górny/dolny na skrót
// @namespace    tampermonkey-ckeditor-supsub
// @version      1.1.0
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

    const inEditor =
      !!target.closest?.('.ck-editor') ||
      !!target.closest?.('.ck-content') ||
      !!target.closest?.('.ck-toolbar') ||
      !!target.closest?.('.ck.ck-editor__main') ||
      !!target.closest?.('.ck.ck-editor__top');

    return inEditor;
  }

  function findButtonByTooltipText(text) {
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

    log('Klikam przycisk:', tooltipText, {
      ariaPressed: btn.getAttribute('aria-pressed'),
      classes: btn.className
    });

    btn.click();
    return true;
  }

  function handleShortcut(e) {
    // Nie opieraj się tylko na e.key (zmienia się z Shiftem i układem klawiatury).
    const code = e.code; // "Comma", "Period", ...
    const key = e.key;   // ",", ".", "<", ">", ...

    // Ctrl/Cmd (bez zgadywania platformy też działa):
    // - na Mac: metaKey
    // - na Win/Linux: ctrlKey
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    // Wymagamy: Ctrl/Cmd + Shift
    if (!ctrlOrCmd || !e.shiftKey) return;

    // Najpewniej: code === 'Comma' / 'Period'
    // Fallback: key może być ',' '.' albo '<' '>' (częste na Windows)
    const isComma = code === 'Comma' || key === ',' || key === '<';
    const isDot   = code === 'Period' || key === '.' || key === '>';

    if (!isComma && !isDot) return;

    const target = e.target;
    const inContext = isInCKEditorContext(target);

    log('Wykryto skrót:', {
      code,
      key,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      target: target?.tagName,
      targetClass: target?.className,
      inCKEditorContext: inContext
    });

    if (!inContext) {
      log('Pominięto — nie jesteśmy w kontekście CKEditora.');
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (isComma) {
      const ok = clickCKButton('Indeks dolny');
      log('Wynik akcji (Indeks dolny):', ok);
    } else if (isDot) {
      const ok = clickCKButton('Indeks górny');
      log('Wynik akcji (Indeks górny):', ok);
    }
  }

  // Czasem lepiej łapać na document (bliżej targetów), ale capture=true zostaje.
  document.addEventListener('keydown', handleShortcut, true);

  log(
    'Skrypt załadowany. Skróty:',
    (isMacLike() ? 'Cmd' : 'Ctrl') + '+Shift+, => Indeks dolny; ' +
    (isMacLike() ? 'Cmd' : 'Ctrl') + '+Shift+. => Indeks górny'
  );
})();
