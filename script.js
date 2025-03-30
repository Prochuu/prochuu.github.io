document.addEventListener('DOMContentLoaded', () => {

    // Obsługa Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Zamknięcie menu po kliknięciu linku (na mobilnych)
        document.querySelectorAll('.nav-links a').forEach(link => {
             // Sprawdź czy link nie jest przyciskiem zmiany motywu (jeśli byłby wewn. <a>)
             if (!link.closest('#theme-toggle')) {
                 link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                });
             }
        });
    } else {
        console.error("Nie znaleziono elementu hamburgera lub linków nawigacji.");
    }

    // Obsługa Przełącznika Motywu
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Ustaw motyw przy ładowaniu strony
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
    } else {
         body.classList.remove('light-theme'); // Domyślnie ciemny
    }


    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');

            // Zapisz wybór motywu w localStorage
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.removeItem('theme');
            }
        });
    } else {
         console.error("Nie znaleziono przycisku zmiany motywu #theme-toggle.");
    }


    // (Opcjonalnie) Aktywny link w nawigacji na podstawie sekcji
    const sections = document.querySelectorAll('section[id]'); // Tylko sekcje z ID
    const navLiAnchors = document.querySelectorAll('.nav-links a[href^="#"]'); // Tylko linki do sekcji

     const activateNavLink = (currentId) => {
         navLiAnchors.forEach(a => {
            a.classList.remove('active');
            // Sprawdź czy href pasuje do ID sekcji
            if (a.getAttribute('href') === `#${currentId}`) {
                a.classList.add('active');
            }
        });
     };

    // Początkowe ustawienie aktywnego linku
    // Znajdź pierwszy link w nawigacji (zazwyczaj prowadzący do pierwszej sekcji)
    if (navLiAnchors.length > 0) {
        const firstSectionId = sections.length > 0 ? sections[0].id : null;
         if (firstSectionId) {
             const firstNavLink = document.querySelector(`.nav-links a[href="#${firstSectionId}"]`);
              if (firstNavLink) {
                   // Usuń 'active' z innych linków i dodaj do pierwszego
                   navLiAnchors.forEach(a => a.classList.remove('active'));
                   firstNavLink.classList.add('active');
              }
         }
    }


    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('header')?.offsetHeight || 60; // Wysokość nagłówka lub domyślna

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // 50px offset
            const sectionBottom = sectionTop + section.offsetHeight;

             // Sprawdź, czy sekcja jest w widoku
             // Używamy scrollY zamiast pageYOffset dla spójności
             if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        // Specjalny warunek dla samej góry strony
        if (window.scrollY < (sections[0]?.offsetTop || 0) - headerHeight - 50) {
            // Aktywuj link do pierwszej sekcji, jeśli istnieje
            current = sections[0]?.getAttribute('id') || '';
        }

        // Aktywuj link tylko jeśli znaleziono pasującą sekcję
        if (current) {
            activateNavLink(current);
        }
        // Jeśli jesteśmy na samym dole, aktywuj ostatni link
        else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) { // -2 tolerancja
             const lastSectionId = sections.length > 0 ? sections[sections.length-1].id : null;
              if(lastSectionId) {
                  activateNavLink(lastSectionId);
              }
        }


    }, { passive: true }); // Poprawa wydajności scroll eventu


    // Obsługa formularza kontaktowego (tylko demo)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Zapobiegaj wysłaniu
            formMessage.textContent = 'Dziękujemy! Formularz demo - wiadomość nie została wysłana.';
            formMessage.style.color = 'var(--accent-main)'; // Użyj zmiennej CSS
            // Opcjonalnie wyczyść formularz po chwili
            // setTimeout(() => contactForm.reset(), 2000);
            setTimeout(() => formMessage.textContent = '', 5000); // Wyczyść komunikat
        });
    }

}); // Koniec DOMContentLoaded