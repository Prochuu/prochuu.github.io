// Obsługa Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Zamknięcie menu po kliknięciu linku (na mobilnych)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
             hamburger.classList.remove('active');
             navLinks.classList.remove('active');
        }
    });
});

// Obsługa Przełącznika Motywu
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme');

// Sprawdź zapisany motyw przy ładowaniu strony
if (currentTheme === 'light') {
    body.classList.add('light-theme');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');

    // Zapisz wybór motywu w localStorage
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.removeItem('theme'); // Usuń zapis, jeśli wracamy do domyślnego (ciemnego)
    }
});

// (Opcjonalnie) Aktywny link w nawigacji na podstawie sekcji
const sections = document.querySelectorAll('section[id]');
const navLi = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    let current = '';
    const headerHeight = document.querySelector('header').offsetHeight; // Wysokość nagłówka

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50; // Dodatkowy offset
         // Sprawdź, czy jesteśmy na samym dole strony
         const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50; // 50px tolerancji

        if (pageYOffset >= sectionTop || (section.id === 'contact' && isBottom)) {
             current = section.getAttribute('id');
        }
    });
     // Specjalny warunek dla sekcji hero (jeśli jesteśmy blisko góry)
     if(window.pageYOffset < sections[0].offsetTop - headerHeight - 50) {
         current = 'about'; // Domyślnie aktywuj 'O mnie' na samej górze
     }


    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
     // Jeśli żadna sekcja nie pasuje (np. na samej górze strony przed pierwszą sekcją)
     // upewnij się, że 'O mnie' jest aktywne
     if (!current && navLi.length > 0) {
         const aboutLink = document.querySelector('.nav-links a[href="#about"]');
         if(aboutLink) aboutLink.classList.add('active');
     }

});

// Ustaw aktywny link na początku
// (prostsze niż wywoływanie scroll event, ustawia 'O mnie' jako domyślny)
document.querySelector('.nav-links a[href="#about"]').classList.add('active');