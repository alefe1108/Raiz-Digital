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


// -----------------------------------------------------
// CADASTRO CONECTADO AO BACKEND (API)
// -----------------------------------------------------

const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");
const API_BASE = 'http://localhost:3001/api';

function mostrar(texto, ok) {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.style.color = ok ? "green" : "red";
}

function validarSenhas(senha, confirmaSenha) {
    if (senha !== confirmaSenha) {
        return "As senhas não coincidem.";
    }
    if (senha.length < 6) {
        return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
}

// CORREÇÃO 1: Verifica se o formulário existe na página atual antes de adicionar o evento
if (form) {
    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const senha = form.senha.value;
        const confirmaSenha = form.ConfirmaSenha.value;

        const erroSenha = validarSenhas(senha, confirmaSenha);
        if (erroSenha) {
            mostrar(erroSenha, false);
            return;
        }

        mostrar("Cadastrando...", true);

        try {
            const dados = {
                nome: form.nome.value,
                email: form.email.value,
                senha: senha,
                ConfirmaSenha: confirmaSenha,
                Contato: form.Contato.value
            };

            const resposta = await fetch(`${API_BASE}/cadastro`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                mostrar(resultado.mensagem || "Cadastro realizado com sucesso!", true);
                form.reset();
                setTimeout(() => {
                    window.location.href = "../Login/index.html";
                }, 1500);
            } else {
                mostrar(resultado.erro || "Erro ao cadastrar.", false);
            }

        } catch (erro) {
            console.error(erro);
            mostrar("Erro de conexão. Verifique se o backend está rodando.", false);
        }
    });
}


// -----------------------------------------------------
// EXPANDIR / RECOLHER ÁRVORES EXTRAS NA HOME
// -----------------------------------------------------

const expandTreesButton = document.querySelector('.expand-trees');
const extraTreesGrid = document.getElementById('arvores-extras');

if (expandTreesButton && extraTreesGrid) {
    expandTreesButton.addEventListener('click', () => {
        const expanded = expandTreesButton.getAttribute('aria-expanded') === 'true';
        expandTreesButton.setAttribute('aria-expanded', String(!expanded));
        extraTreesGrid.hidden = expanded;
        extraTreesGrid.classList.remove('is-opening');

        if (!expanded) {
            void extraTreesGrid.offsetWidth;
            extraTreesGrid.classList.add('is-opening');
            
            // CORREÇÃO 2: Garante que os cards extras não fiquem invisíveis por causa da classe .reveal
            extraTreesGrid.querySelectorAll('.tree-card').forEach((card) => {
                card.classList.add('visible');
            });
        }

        expandTreesButton.firstChild.textContent = expanded ? 'Ver todas as árvores ' : 'Mostrar menos árvores ';
    });
}