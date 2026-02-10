// ==UserScript==
  // @name         WNL Admin - Szybki Wybór Kursów
  // @namespace    http://tampermonkey.net/
  // @version      1.2
  // @description  Panel do masowego zaznaczania/odznaczania kursów
  // @author       Ty
  // @match        *://*.wiecejnizlek.pl/admin/app/dashboard-news/*
  // @grant        none
  // @run-at       document-end
  // ==/UserScript==

  (function() {
      'use strict';

      console.log('🎓 WNL Helper: Skrypt uruchomiony!');
      console.log('📍 URL:', window.location.href);

      // 1. Konfiguracja danych
      const coursesData = {
        "KNP PL": [
          "Kurs z Anatomii",
          "Kurs z Fizjologii",
          "Kurs z Patofizjologii",
          "Kurs z Biochemii",
          "Kurs z Farmakologii",
          "Kurs z Genetyki",
          "Kurs z Histologii",
          "Kurs z Mikrobiologii, Parazytologii i Immunologii "
        ],
        "KNK PL": [
          "Kurs z Interny",
          "Kurs z Pediatrii",
          "Kurs z Chirurgii",
          "Kurs z Ginekologii",
          "Kurs z Psychiatrii",
          "Kurs z Medycyny Ratunkowej i Anestezjologii",
          "Kurs z Samodzielnych Nauk Klinicznych"
        ],
        "PES": [
          "Baza PES: Alergologia",
          "Baza PES: Anestezjologia i intensywna terapia",
          "Baza PES: Angiologia",
          "Baza PES: Audiologia i foniatria",
          "Baza PES: Balneologia i medycyna fizykalna",
          "Baza PES: Chirurgia dziecięca",
          "Baza PES: Chirurgia klatki piersiowej",
          "Baza PES: Chirurgia naczyniowa",
          "Baza PES: Chirurgia ogólna",
          "Baza PES: Chirurgia onkologiczna",
          "Baza PES: Chirurgia plastyczna",
          "Baza PES: Chirurgia stomatologiczna",
          "Baza PES: Chirurgia szczękowo-twarzowa",
          "Baza PES: Choroby płuc",
          "Baza PES: Choroby płuc dzieci",
          "Baza PES: Choroby wewnętrzne",
          "Baza PES: Choroby zakaźne",
          "Baza PES: Dermatologia i wenerologia",
          "Baza PES: Diabetologia",
          "Baza PES: Diagnostyka laboratoryjna",
          "Baza PES: Endokrynologia",
          "Baza PES: Endokrynologia ginekologiczna i rozrodczość",
          "Baza PES: Endokrynologia i diabetologia dziecięca",
          "Baza PES: Gastroenterologia",
          "Baza PES: Gastroenterologia dziecięca",
          "Baza PES: Genetyka kliniczna",
          "Baza PES: Geriatria",
          "Baza PES: Ginekologia onkologiczna",
          "Baza PES: Hematologia",
          "Baza PES: Hipertensjologia",
          "Baza PES: Immunologia kliniczna",
          "Baza PES: Intensywna terapia",
          "Baza PES: Kardiochirurgia",
          "Baza PES: Kardiologia",
          "Baza PES: Kardiologia dziecięca",
          "Baza PES: Medycyna nuklearna",
          "Baza PES: Medycyna paliatywna",
          "Baza PES: Medycyna pracy",
          "Baza PES: Medycyna ratunkowa",
          "Baza PES: Medycyna rodzinna",
          "Baza PES: Medycyna sportowa",
          "Baza PES: Mikrobiologia lekarska",
          "Baza PES: Nefrologia",
          "Baza PES: Nefrologia dziecięca",
          "Baza PES: Neonatologia",
          "Baza PES: Neurochirurgia",
          "Baza PES: Neurologia",
          "Baza PES: Neurologia dziecięca",
          "Baza PES: Okulistyka",
          "Baza PES: Onkologia i hematologia dziecięca",
          "Baza PES: Onkologia kliniczna",
          "Baza PES: Ortodoncja",
          "Baza PES: Ortopedia i traumatologia narządu ruchu",
          "Baza PES: Otorynolaryngologia",
          "Baza PES: Patomorfologia",
          "Baza PES: Pediatria",
          "Baza PES: Perinatologia",
          "Baza PES: Periodontologia",
          "Baza PES: Położnictwo i ginekologia",
          "Baza PES: Protetyka stomatologiczna",
          "Baza PES: Psychiatria",
          "Baza PES: Psychiatria dzieci i młodzieży",
          "Baza PES: Radiologia i diagnostyka obrazowa",
          "Baza PES: Radioterapia onkologiczna",
          "Baza PES: Rehabilitacja medyczna",
          "Baza PES: Reumatologia",
          "Baza PES: Seksuologia",
          "Baza PES: Stomatologia dziecięca",
          "Baza PES: Stomatologia zachowawcza z endodoncją",
          "Baza PES: Transplantologia kliniczna",
          "Baza PES: Urologia dziecięca",
          "Baza PES: Zdrowie publiczne"
        ],
        "SKP": [
          "Kurs ze Stomatologii Zachowawczej i Endodoncji",
          "Kurs ze Stomatologii Dziecięcej",
          "Kurs z Protetyki",
          "Kurs z Ortodoncji",
          "Kurs z Chirurgii Stomatologicznej",
          "Kurs z Periodontologii"
        ]
      };

      // 2. Funkcja główna
      function toggleCheckboxes(categoryKey, shouldCheck) {
          console.log(`🔄 Przełączanie: ${categoryKey} → ${shouldCheck ? 'Zaznacz' : 'Odznacz'}`);

          const courseNames = coursesData[categoryKey];
          if (!courseNames) {
              console.warn('❌ Nie znaleziono kategorii:', categoryKey);
              return;
          }

          let count = 0;
          courseNames.forEach(name => {
              const selector = `input[type="checkbox"][name="${name}"]`;
              const inputs = document.querySelectorAll(selector);

              if (inputs.length === 0) {
                  console.log(`⚠️ Nie znaleziono checkboxa dla: "${name}"`);
              }

              inputs.forEach(input => {
                  if (input.checked !== shouldCheck) {
                      input.click();
                      count++;
                  }
              });
          });

          console.log(`✅ Zmieniono stan ${count} checkboxów`);
      }

      // 3. Budowanie interfejsu
      function createFloatingPanel() {
          console.log('📦 Tworzenie panelu...');

          if (document.getElementById('wnl-course-helper')) {
              console.log('⚠️ Panel już istnieje');
              return;
          }

          const panel = document.createElement('div');
          panel.id = 'wnl-course-helper';

          Object.assign(panel.style, {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '2px solid #4CAF50',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              borderRadius: '10px',
              padding: '15px',
              zIndex: '999999',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              color: '#333'
          });

          // Nagłówek
          const title = document.createElement('h3');
          title.innerText = '🎓 Wybór Kursów WNL';
          Object.assign(title.style, {
              marginTop: '0',
              marginBottom: '15px',
              fontSize: '16px',
              borderBottom: '2px solid #4CAF50',
              paddingBottom: '8px',
              color: '#4CAF50'
          });
          panel.appendChild(title);

          // Generowanie wierszy
          Object.keys(coursesData).forEach(key => {
              const row = document.createElement('div');
              Object.assign(row.style, {
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px'
              });

              const label = document.createElement('span');
              label.innerText = key;
              label.style.fontWeight = 'bold';
              label.style.fontSize = '13px';

              const btnContainer = document.createElement('div');

              // Przycisk Zaznacz
              const btnCheck = document.createElement('button');
              btnCheck.innerText = '✓';
              styleButton(btnCheck, '#4CAF50');
              btnCheck.addEventListener('click', () => toggleCheckboxes(key, true));

              // Przycisk Odznacz
              const btnUncheck = document.createElement('button');
              btnUncheck.innerText = '✗';
              styleButton(btnUncheck, '#F44336');
              btnUncheck.addEventListener('click', () => toggleCheckboxes(key, false));

              btnContainer.appendChild(btnCheck);
              btnContainer.appendChild(btnUncheck);

              row.appendChild(label);
              row.appendChild(btnContainer);
              panel.appendChild(row);
          });

          // Stopka
          const footer = document.createElement('div');
          footer.innerText = 'WNL Helper v1.2';
          Object.assign(footer.style, {
              fontSize: '10px',
              color: '#999',
              textAlign: 'center',
              marginTop: '15px',
              paddingTop: '10px',
              borderTop: '1px solid #eee'
          });
          panel.appendChild(footer);

          document.body.appendChild(panel);
          console.log('✅ Panel dodany!');
      }

      // Pomocnicza funkcja
      function styleButton(btn, color) {
          Object.assign(btn.style, {
              backgroundColor: color,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '6px 14px',
              marginLeft: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          });

          btn.addEventListener('mouseenter', () => {
              btn.style.opacity = '0.85';
              btn.style.transform = 'translateY(-1px)';
              btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          });

          btn.addEventListener('mouseleave', () => {
              btn.style.opacity = '1';
              btn.style.transform = 'translateY(0)';
              btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          });
      }

      // 4. Inicjalizacja
      function init() {
          console.log('🚀 Inicjalizacja WNL Helper...');

          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', createFloatingPanel);
          } else {
              createFloatingPanel();
          }

          // Fallback dla SPA
          setTimeout(() => {
              if (!document.getElementById('wnl-course-helper')) {
                  createFloatingPanel();
              }
          }, 2000);
      }

      init();
  })();
