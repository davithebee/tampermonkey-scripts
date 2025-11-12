// ==UserScript==
// @name         Ctrl/Cmd + S → Zapisz (Bethink admin)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Kliknij "Zapisz" (lub "Zapisz slajd/przypis") przy Ctrl+S / Cmd+S
// @author       Bethink
// @match        *://*/admin/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const normalize = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const targets = ['zapisz', 'zapisz slajd', 'zapisz przypis'];

  function visible(el) {
    const cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && el.offsetParent !== null;
  }

  function findSaveButton() {
    const nodes = document.querySelectorAll('.ds-button, button, a, [role="button"]');
    for (const el of nodes) {
      if (!visible(el)) continue;
      if (el.closest('[aria-disabled="true"], [disabled]')) continue;

      const t1 = normalize(el.innerText || el.textContent);
      if (targets.some(t => t === t1 || t1.startsWith(t + ' '))) return el;

      const inner = el.querySelector('.ds-button__content');
      const t2 = normalize(inner?.innerText || inner?.textContent || '');
      if (targets.includes(t2)) return el;
    }
    return null;
  }

  function clickLikeHuman(el) {
    el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    el.click();
  }

  function onKeyDown(e) {
    const isSave = (e.ctrlKey || e.metaKey) && normalize(e.key) === 's';
    if (!isSave) return;

    const btn = findSaveButton();
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      clickLikeHuman(btn);
      console.log('[Zapisz] Kliknięto:', btn);
    } else {
      console.log('[Zapisz] Nie znaleziono przycisku/linku "Zapisz".');
    }
  }

  // capture:true – żeby nasz handler wykonał się, nawet jeśli appka zatrzymuje eventy wcześniej
  document.addEventListener('keydown', onKeyDown, true);
})();
