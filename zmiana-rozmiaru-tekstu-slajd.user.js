// ==UserScript==
// @name         slides.com - Option+Shift+Z otwiera "Edit slide HTML" + font-size 0.7em + auto Save
// @namespace    http://tampermonkey.net/
// @namespace    tampermonkey-slides-hotkeys
// @version      1.2.0
// @description  Hotkey Alt(Option)+Shift+Z -> klik "Edit slide HTML" + replace font-size:*em => 0.7em w CodeMirror + klik Save
// @match        https://*.slides.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  console.log('[TM][slides-html] Script loaded ✅', { url: location.href });

  // --- 1) Szukanie opcji "Edit slide HTML" ---
  function findHtmlEditOption() {
    let el = document.querySelector('li.slide-option.sl-drawer-secondary-option.html');

    if (el) {
      console.log('[TM][slides-html] Found HTML edit option via direct selector ✅', el);
      return el;
    }

    const candidates = Array.from(document.querySelectorAll('li.slide-option, li.sl-drawer-secondary-option, li'));
    el = candidates.find((node) => {
      const tt = node.getAttribute && node.getAttribute('data-tooltip');
      if (tt && /Edit slide HTML/i.test(tt)) return true;

      const text = (node.textContent || '').trim();
      return /Edit\s*slide\s*HTML/i.test(text);
    });

    if (el) {
      console.log('[TM][slides-html] Found HTML edit option via fallback ✅', el);
      return el;
    }

    console.log('[TM][slides-html] HTML edit option not found ❌');
    return null;
  }

  function clickElement(el) {
    if (!el) return false;

    console.log('[TM][slides-html] Clicking element…', el);

    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const ok = el.dispatchEvent(evt);
    console.log('[TM][slides-html] Click dispatched ✅', { dispatchResult: ok });

    return true;
  }

  function isHotkey(e) {
    return e.altKey && e.shiftKey && (e.code === 'KeyZ' || e.key === 'Z' || e.key === 'z');
  }

  // --- 2) Wybór "widocznego" CodeMirror (z popupu) ---
  function getVisibleCodeMirrorElement() {
    const all = Array.from(document.querySelectorAll('.CodeMirror'));
    const visible = all.filter((el) => {
      const cs = window.getComputedStyle(el);
      return el.offsetParent !== null && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
    });

    if (!visible.length) return null;

    const preferred = visible.find((el) =>
      el.closest('.sl-modal, .modal, .overlay, .dialog, .sl-dialog, .sl-popup, .popup, .sl-lightbox')
    );

    return preferred || visible[visible.length - 1];
  }

  function getModalContainerFor(el) {
    if (!el) return null;
    const modal = el.closest('.sl-modal, .modal, .overlay, .dialog, .sl-dialog, .sl-popup, .popup, .sl-lightbox');
    return modal || document.body;
  }

  // --- 3) Czekanie na CodeMirror ---
  function waitForCodeMirrorInstance({ timeoutMs = 9000, tickMs = 100 } = {}, cb) {
    const start = Date.now();

    (function tick() {
      const cmEl = getVisibleCodeMirrorElement();
      const cm = cmEl && (cmEl.CodeMirror || cmEl.closest('.CodeMirror')?.CodeMirror);

      if (cm) {
        console.log('[TM][slides-html] CodeMirror instance found ✅', cmEl);
        cb(null, { cm, cmEl });
        return;
      }

      if (Date.now() - start > timeoutMs) {
        console.log('[TM][slides-html] Timeout waiting for CodeMirror ❌', { timeoutMs });
        cb(new Error('CodeMirror not found (timeout)'), null);
        return;
      }

      setTimeout(tick, tickMs);
    })();
  }

  // --- 4) Szukanie przycisku Save (w obrębie modala) ---
  function findSaveButton(container) {
    if (!container) container = document;

    // Najbardziej bezpośredni selektor z Twojego przykładu
    let btn = container.querySelector('button.button.l.positive');

    // Upewnij się, że to faktycznie "Save"
    if (btn) {
      const txt = (btn.textContent || '').trim();
      if (/^Save\b/i.test(txt)) {
        console.log('[TM][slides-html] Found Save button via direct selector ✅', btn);
        return btn;
      }
    }

    // Fallback: szukaj po tekście "Save"
    const candidates = Array.from(container.querySelectorAll('button'));
    btn = candidates.find((b) => /^Save\b/i.test((b.textContent || '').trim()));

    if (btn) {
      console.log('[TM][slides-html] Found Save button via text fallback ✅', btn);
      return btn;
    }

    console.log('[TM][slides-html] Save button not found ❌', container);
    return null;
  }

  function waitForSaveButton(container, { timeoutMs = 6000, tickMs = 100 } = {}, cb) {
    const start = Date.now();

    (function tick() {
      const btn = findSaveButton(container);

      if (btn) {
        cb(null, btn);
        return;
      }

      if (Date.now() - start > timeoutMs) {
        console.log('[TM][slides-html] Timeout waiting for Save button ❌', { timeoutMs });
        cb(new Error('Save button not found (timeout)'), null);
        return;
      }

      setTimeout(tick, tickMs);
    })();
  }

  // --- 5) Podmiana font-size:*em => font-size:0.7em ---
  function normalizeFontSizesInEditor(cm) {
    try {
      const oldText = cm.getValue();
      console.log('[TM][slides-html] Editor text length:', oldText.length);

      const re = /font-size\s*:\s*([0-9]*\.?[0-9]+)\s*em/gi;
      const matches = oldText.match(re) || [];
      const newText = oldText.replace(re, 'font-size:0.7em');

      console.log('[TM][slides-html] font-size:*em matches found:', matches.length);

      if (newText === oldText) {
        console.log('[TM][slides-html] No changes needed ✅ (already normalized or no em font-sizes)');
        return { changed: false, replacements: matches.length };
      }

      const cursor = cm.getCursor ? cm.getCursor() : null;
      const scroll = cm.getScrollInfo ? cm.getScrollInfo() : null;

      cm.operation(() => {
        cm.setValue(newText);

        if (cursor && cm.setCursor) cm.setCursor(cursor);
        if (scroll && cm.scrollTo) cm.scrollTo(scroll.left, scroll.top);
      });

      cm.focus && cm.focus();

      console.log('[TM][slides-html] Normalization done ✅', {
        replacements: matches.length,
        example: matches.slice(0, 5),
      });

      return { changed: true, replacements: matches.length };
    } catch (err) {
      console.log('[TM][slides-html] Error while normalizing ❌', err);
      return { changed: false, replacements: 0, error: err };
    }
  }

  // --- 6) Klik Save po normalizacji ---
  function clickSaveInSameModal(cmEl) {
    const modal = getModalContainerFor(cmEl);
    console.log('[TM][slides-html] Looking for Save button in modal/container…', modal);

    waitForSaveButton(modal, { timeoutMs: 6000, tickMs: 100 }, (err, btn) => {
      if (err || !btn) {
        console.log('[TM][slides-html] Cannot click Save ❌', err);
        return;
      }

      // Czasem przycisk jest disabled na ułamek sekundy
      const disabled = btn.disabled || btn.getAttribute('aria-disabled') === 'true';
      console.log('[TM][slides-html] Save button found ✅', { disabled, btn });

      if (disabled) {
        console.log('[TM][slides-html] Save button is disabled – retrying shortly…');
        setTimeout(() => {
          const btn2 = findSaveButton(modal);
          if (btn2 && !(btn2.disabled || btn2.getAttribute('aria-disabled') === 'true')) {
            console.log('[TM][slides-html] Save button enabled now ✅ -> clicking');
            clickElement(btn2);
          } else {
            console.log('[TM][slides-html] Save button still disabled ❌', btn2);
          }
        }, 250);
        return;
      }

      console.log('[TM][slides-html] Clicking Save…');
      clickElement(btn);
    });
  }

  // --- 7) Flow: otwórz popup -> znajdź CM -> normalize -> Save ---
  function openHtmlEditorAndNormalizeAndSave() {
    console.log('[TM][slides-html] Waiting for popup/editor…');

    waitForCodeMirrorInstance({ timeoutMs: 9000, tickMs: 100 }, (err, payload) => {
      if (err || !payload?.cm) {
        console.log('[TM][slides-html] Cannot proceed because CodeMirror not found ❌', err);
        return;
      }

      const { cm, cmEl } = payload;

      console.log('[TM][slides-html] Starting font-size normalization…');
      const res = normalizeFontSizesInEditor(cm);

      // Zapisujemy nawet jeśli "changed=false" — to bywa przydatne (np. żeby wymusić zapis stanu),
      // ale jeśli wolisz tylko gdy są zmiany, to wystarczy odkomentować warunek poniżej.
      // if (!res.changed) return;

      console.log('[TM][slides-html] Attempting auto Save…', res);

      // Krótki delay pomaga, gdy UI potrzebuje chwili na uznanie "dirty state"
      setTimeout(() => clickSaveInSameModal(cmEl), 200);
    });
  }

  // --- 8) Listener skrótu ---
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.altKey || e.shiftKey) {
        console.log('[TM][slides-html] keydown', {
          key: e.key,
          code: e.code,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          target: e.target && (e.target.tagName || e.target.className),
        });
      }

      if (!isHotkey(e) || e.repeat) return;

      console.log('[TM][slides-html] Hotkey detected ✅ (Alt/Option+Shift+H)');

      e.preventDefault();
      e.stopPropagation();

      const el = findHtmlEditOption();
      if (!el) return;

      const clicked = clickElement(el);
      if (!clicked) return;

      // Poczekaj na popup i wykonaj normalize + save
      setTimeout(openHtmlEditorAndNormalizeAndSave, 150);
    },
    true
  );
})();
