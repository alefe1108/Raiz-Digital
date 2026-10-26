// =====================================================
// RAIZ DIGITAL
// JavaScript principal
// =====================================================

console.log("Raiz Digital iniciado!");

// -----------------------------------------------------
// NAVEGAÇÃO SUAVE
// -----------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// -----------------------------------------------------
// MENU ATIVO
// -----------------------------------------------------

const sections = document.querySelectorAll("main section[id]");
const menuLinks = document.querySelectorAll(".menu a[href^='#']");

function updateActiveMenu() {

    const scrollPosition = window.scrollY + 140;

    let currentSection = "inicio";

    sections.forEach((section) => {

        if (scrollPosition >= section.offsetTop) {
            currentSection = section.id;
        }

    });

    menuLinks.forEach((link) => {

        const targetId = link.getAttribute("href");

        link.classList.toggle(
            "active",
            targetId === `#${currentSection}`
        );

    });
}

window.addEventListener("scroll", updateActiveMenu);
updateActiveMenu();


// -----------------------------------------------------
// ANIMAÇÃO SUAVE AO ENTRAR NA TELA
// -----------------------------------------------------

const animatedElements = document.querySelectorAll(
    ".tree-card, .qr-section, .step, .signup-content"
);

animatedElements.forEach((element) => {
    element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });

} else {

    animatedElements.forEach((element) => {
        element.classList.add("visible");
    });

}


// -----------------------------------------------------
// LINKS PROVISÓRIOS
// -----------------------------------------------------
// O link "Sobre o projeto" e os botões de cadastro/login
// ainda não possuem páginas próprias.
// Quando essas páginas existirem, basta trocar o href
// no HTML pelo endereço correto.

// -----------------------------------------------------
// CARROSSEL DE VÍDEOS DO HERO
// -----------------------------------------------------

const heroVideos = document.querySelectorAll(".hero-video");
const heroIndicators = document.querySelectorAll(".slider-indicators button");

let currentHeroVideo = 0;
let heroTimer = null;

function showHeroVideo(index) {

    if (!heroVideos.length) {
        return;
    }

    currentHeroVideo = (index + heroVideos.length) % heroVideos.length;

    heroVideos.forEach((video, videoIndex) => {

        const isActive = videoIndex === currentHeroVideo;

        video.classList.toggle("active", isActive);

        if (isActive) {
            video.currentTime = 0;

            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } else {
            video.pause();
        }

    });

    heroIndicators.forEach((indicator, indicatorIndex) => {

        const isActive = indicatorIndex === currentHeroVideo;

        indicator.classList.toggle("active", isActive);
        indicator.setAttribute("aria-current", isActive ? "true" : "false");

    });

    clearTimeout(heroTimer);

    // Os vídeos foram preparados com cerca de 6 segundos.
    // O timer garante a troca mesmo em navegadores que não disparam "ended".
    heroTimer = setTimeout(() => {
        showHeroVideo(currentHeroVideo + 1);
    }, 6000);
}

heroIndicators.forEach((indicator, index) => {

    indicator.addEventListener("click", () => {
        showHeroVideo(index);
    });

});

if (heroVideos.length) {
    showHeroVideo(0);
}

