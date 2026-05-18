// ==UserScript==
// @name         MM - Skróty do tłumaczeń
// @namespace    https://tampermonkey.net/
// @version      1.0.1
// @description  Skróty do ustawiania statusów tłumaczeń w Media Managerze.
// @author       Bethink
// @match        *://*/admin/app/media-manager/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_NAME = 'MM - Skróty do tłumaczeń';
  const LOG_PREFIX = `[${SCRIPT_NAME}]`;

  const STATUS = {
    EDITORIAL_APPROVED: 'editorial_approved',       // Po edycji
    TRANSLATION_REVIEWED: 'translation_reviewed',   // Po korekcie tłumaczenia
  };

  const SELECT_NAMES = {
    PL: 'localizations.pl_PL.status',
    EN_PL: 'localizations.en_PL.status',
    EN_US: 'localizations.en_US.status',
    EN_UK: 'localizations.en_UK.status',
    LA_PL: 'localizations.la_PL.status',
  };

  const SHORTCUTS = {
    q: {
      label: 'Alt+Q / Control+Q: PL, EN (PL) -> Po edycji',
      updates: {
        [SELECT_NAMES.PL]: STATUS.EDITORIAL_APPROVED,
        [SELECT_NAMES.EN_PL]: STATUS.EDITORIAL_APPROVED,
      },
    },
    w: {
      label: 'Alt+W / Control+W: EN (PL) -> Po korekcie tłumaczenia',
      updates: {
        [SELECT_NAMES.EN_PL]: STATUS.TRANSLATION_REVIEWED,
      },
    },
    e: {
      label: 'Alt+E / Control+E: PL, EN (PL), EN (US), EN (UK) -> Po edycji',
      updates: {
        [SELECT_NAMES.PL]: STATUS.EDITORIAL_APPROVED,
        [SELECT_NAMES.EN_PL]: STATUS.EDITORIAL_APPROVED,
        [SELECT_NAMES.EN_US]: STATUS.EDITORIAL_APPROVED,
        [SELECT_NAMES.EN_UK]: STATUS.EDITORIAL_APPROVED,
      },
    },
    r: {
      label: 'Alt+R / Control+R: EN (PL), EN (US), EN (UK) -> Po korekcie tłumaczenia',
      updates: {
        [SELECT_NAMES.EN_PL]: STATUS.TRANSLATION_REVIEWED,
        [SELECT_NAMES.EN_US]: STATUS.TRANSLATION_REVIEWED,
        [SELECT_NAMES.EN_UK]: STATUS.TRANSLATION_REVIEWED,
      },
    },
  };

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function warn(...args) {
    console.warn(LOG_PREFIX, ...args);
  }

  function escapeAttributeValue(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function getSelectsByName(name) {
    const selector = `select[name="${escapeAttributeValue(name)}"]`;
    return Array.from(document.querySelectorAll(selector));
  }

  function setNativeSelectValue(select, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value'
    )?.set;

    if (nativeSetter) {
      nativeSetter.call(select, value);
    } else {
      select.value = value;
    }
  }

  function dispatchSelectEvents(select) {
    select.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  function setStatus(selectName, statusValue) {
    const selects = getSelectsByName(selectName);

    if (!selects.length) {
      warn(`Nie znaleziono selecta: ${selectName}`);
      return false;
    }

    let changedAnything = false;

    selects.forEach((select, index) => {
      const optionExists = Array.from(select.options).some((option) => option.value === statusValue);

      if (!optionExists) {
        warn(`Select "${selectName}" nie ma opcji "${statusValue}". Pomijam.`, {
          select,
          index,
        });
        return;
      }

      const previousValue = select.value;

      if (previousValue === statusValue) {
        log(`Bez zmian: ${selectName} już ma wartość "${statusValue}".`, {
          select,
          index,
        });
        return;
      }

      setNativeSelectValue(select, statusValue);
      dispatchSelectEvents(select);

      changedAnything = true;

      log(`Zmieniono status: ${selectName}`, {
        previousValue,
        newValue: statusValue,
        select,
        index,
      });
    });

    return changedAnything;
  }

  function runShortcut(shortcutKey) {
    const shortcut = SHORTCUTS[shortcutKey];

    if (!shortcut) {
      return;
    }

    log(`Uruchamiam skrót: ${shortcut.label}`);

    let changedCount = 0;
    let attemptedCount = 0;

    Object.entries(shortcut.updates).forEach(([selectName, statusValue]) => {
      attemptedCount += 1;

      const changed = setStatus(selectName, statusValue);

      if (changed) {
        changedCount += 1;
      }
    });

    log(`Zakończono skrót: ${shortcut.label}`, {
      attemptedCount,
      changedCount,
      updates: shortcut.updates,
    });
  }

  function getShortcutKey(event) {
    if (event.code && /^Key[QWER]$/.test(event.code)) {
      return event.code.replace('Key', '').toLowerCase();
    }

    const key = String(event.key || '').toLowerCase();

    if (['q', 'w', 'e', 'r'].includes(key)) {
      return key;
    }

    return null;
  }

  function isSupportedModifierCombination(event) {
    const noShift = !event.shiftKey;
    const noMeta = !event.metaKey;

    const altShortcut = event.altKey && !event.ctrlKey;
    const controlShortcut = event.ctrlKey && !event.altKey;

    return noShift && noMeta && (altShortcut || controlShortcut);
  }

  function handleKeydown(event) {
    if (event.repeat) {
      return;
    }

    if (!isSupportedModifierCombination(event)) {
      return;
    }

    const shortcutKey = getShortcutKey(event);

    if (!shortcutKey || !SHORTCUTS[shortcutKey]) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    log('Przechwycono skrót klawiaturowy.', {
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shortcutKey,
    });

    runShortcut(shortcutKey);
  }

  function logInitialState() {
    log('Skrypt załadowany. Ograniczenie URL obsługuje wyłącznie nagłówek Tampermonkey @match.');

    log('Aktywne skróty:', {
      'Alt+Q / Control+Q': 'PL, EN (PL) -> Po edycji',
      'Alt+W / Control+W': 'EN (PL) -> Po korekcie tłumaczenia',
      'Alt+E / Control+E': 'PL, EN (PL), EN (US), EN (UK) -> Po edycji',
      'Alt+R / Control+R': 'EN (PL), EN (US), EN (UK) -> Po korekcie tłumaczenia',
    });

    Object.values(SELECT_NAMES).forEach((selectName) => {
      const found = getSelectsByName(selectName).length;
      log(`Wstępne wykrycie selecta "${selectName}": ${found}`);
    });
  }

  window.addEventListener('keydown', handleKeydown, true);

  logInitialState();
})();
