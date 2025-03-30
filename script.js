/**
 * Główny skrypt JavaScript dla strony PiekaLenka
 * Odpowiada za:
 * - Obsługę menu hamburgerowego na urządzeniach mobilnych
 * - Przełączanie motywu kolorystycznego (jasny/ciemny) i zapis preferencji
 * - Podświetlanie aktywnego linku w nawigacji podczas przewijania (scrollspy)
 * - Obsługę demonstracyjną formularza kontaktowego
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================== */
    /* ===   Obsługa Menu Hamburgerowego    === */
    /* ======================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Sprawdzenie czy elementy istnieją, aby uniknąć błędów
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Przełącz klasę 'active' na hamburgerze (dla animacji X)
            hamburger.classList.toggle('active');
            // Przełącz klasę 'active' na liście linków (aby ją pokazać/ukryć w CSS)
            navLinks.classList.toggle('active');
        });

        // Zamknięcie menu mobilnego po kliknięciu na link nawigacyjny
        document.querySelectorAll('.nav-links a').forEach(link => {
             // Upewnij się, że kliknięty element nie jest przyciskiem zmiany motywu
             // (na wypadek, gdyby był opakowany w <a>, co tutaj nie ma miejsca, ale jest dobrą praktyką)
             if (!link.closest('#theme-toggle')) {
                 link.addEventListener('click', () => {
                    // Jeśli menu jest aktywne (rozwinięte)
                    if (navLinks.classList.contains('active')) {
                        // Usuń klasy 'active' aby zwinąć menu i przywrócić ikonę hamburgera
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                });
             }
        });
    } else {
        console.error("Błąd: Nie znaleziono elementu .hamburger lub .nav-links.");
    }

    /* ======================================== */
    /* ===   Obsługa Przełącznika Motywu   === */
    /* ======================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme'); // Odczytaj zapisany motyw

    // Ustaw motyw na podstawie zapisu w localStorage przy ładowaniu strony
    if (currentTheme === 'light') {
        body.classList.add('light-theme'); // Dodaj klasę dla jasnego motywu
    } else {
         body.classList.remove('light-theme'); // Usuń klasę (domyślnie ciemny)
    }

    // Sprawdzenie czy przycisk istnieje
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Przełącz klasę 'light-theme' na elemencie <body>
            body.classList.toggle('light-theme');

            // Zapisz wybór użytkownika w localStorage
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light'); // Zapisz 'light'
            } else {
                localStorage.removeItem('theme'); // Usuń zapis (wróć do domyślnego ciemnego)
            }
        });
    } else {
         console.error("Błąd: Nie znaleziono przycisku #theme-toggle.");
    }

    /* ======================================== */
    /* ===   Aktywny Link Nawigacji (Scrollspy) === */
    /* ======================================== */
    const sections = document.querySelectorAll('main section[id]'); // Wybierz wszystkie sekcje w <main> z atrybutem ID
    const navLiAnchors = document.querySelectorAll('.nav-links a[href^="#"]'); // Wybierz linki nawigacyjne prowadzące do sekcji

    // Funkcja do usuwania i dodawania klasy 'active'
     const activateNavLink = (idToActivate) => {
         navLiAnchors.forEach(a => {
            a.classList.remove('active'); // Usuń klasę ze wszystkich linków
            // Sprawdź, czy href linku (np. "#o-nas") pasuje do ID aktualnej sekcji
            if (a.getAttribute('href') === `#${idToActivate}`) {
                a.classList.add('active'); // Dodaj klasę 'active' do pasującego linku
            }
        });
     };

    // Ustaw aktywny link dla pierwszej sekcji przy ładowaniu strony
    // (prostsze niż symulowanie scrolla na starcie)
    if (sections.length > 0 && navLiAnchors.length > 0) {
        activateNavLink(sections[0].id);
    }

    // Funkcja wywoływana podczas przewijania strony
    const handleScroll = () => {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header')?.offsetHeight || 70; // Pobierz wysokość nagłówka lub użyj wartości domyślnej
        const scrollPosition = window.scrollY;

        // Iteruj przez sekcje, aby znaleźć tę, która jest aktualnie widoczna
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 60; // Oblicz górną krawędź sekcji z offsetem
            const sectionBottom = sectionTop + section.offsetHeight;

            // Sprawdź, czy pozycja przewinięcia mieści się w granicach sekcji
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Jeśli jesteśmy na samej górze strony (przed pierwszą sekcją)
        if (scrollPosition < (sections[0]?.offsetTop || 0) - headerHeight - 60) {
             currentSectionId = sections[0]?.getAttribute('id') || ''; // Aktywuj pierwszą sekcję
        }
        // Jeśli jesteśmy na samym dole strony
        else if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 5) { // 5px tolerancji
             currentSectionId = sections.length > 0 ? sections[sections.length - 1].id : ''; // Aktywuj ostatnią sekcję
        }

        // Jeśli znaleziono pasującą sekcję, zaktualizuj aktywny link
        if (currentSectionId) {
            activateNavLink(currentSectionId);
        }
    };

    // Dodaj nasłuchiwanie na zdarzenie scroll, używając throttle dla wydajności (opcjonalnie)
    // Prostsza wersja bez throttle:
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Wersja z prostym throttle (ogranicza częstotliwość wywoływania funkcji):
    // let scrollTimeout;
    // window.addEventListener('scroll', () => {
    //     clearTimeout(scrollTimeout);
    //     scrollTimeout = setTimeout(handleScroll, 50); // Wywołaj co 50ms
    // }, { passive: true });


    /* ======================================== */
    /* ===   Obsługa Formularza (Demo)      === */
    /* ======================================== */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Zatrzymaj domyślne wysyłanie formularza

            // Wyświetl komunikat dla użytkownika
            formMessage.textContent = 'Dziękujemy! Formularz jest w wersji demonstracyjnej - wiadomość nie została wysłana.';
            formMessage.style.color = 'var(--accent-main)'; // Użyj koloru akcentu

            // Opcjonalnie wyczyść formularz
            // contactForm.reset();

            // Schowaj komunikat po 5 sekundach
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    } else {
        console.warn("Elementy formularza kontaktowego (#contactForm, #form-message) nie zostały znalezione.");
    }

}); // Koniec nasłuchiwania na DOMContentLoaded