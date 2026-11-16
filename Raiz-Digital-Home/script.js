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

// -----------------------------------------------------
// script do cadastro do netlify
// -----------------------------------------------------
// 

// const form = document.getElementById("formCadastro");
// const mensagem = document.getElementById("mensagem");

// function mostrar(texto, ok) {
//     mensagem.textContent = texto;
//     mensagem.style.color = ok ? "green" : "red";
// }

// form.addEventListener("submit", async (evento) => {
//     evento.preventDefault();
//     mostrar("Cadastrando...", true);

    // try {
    //     const resposta = await fetch("/api/cadastro", {
    //         method: "POST",
    //         body: new FormData(form),
    //     });
    //     const dados = await resposta.json();

    //     if (resposta.ok) {
    //         mostrar(dados.mensagem || "Cadastro realizado com sucesso!", true);
    //         form.reset();
    //         setTimeout(() => {
    //             window.location.href = "../Login/index.html";
    //         }, 1500);
    //     } else {
    //         mostrar(dados.erro || "Não foi possível cadastrar.", false);
    //     }
    // } catch (erro) {
    //     console.error(erro);
    //     mostrar("Erro de conexão. Tente novamente.", false);
    // }

// simulação de cadastro sem banco

const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

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
        // Simula cadastro com localStorage (já que /api/cadastro não existe em site estático)
        const usuarios = JSON.parse(localStorage.getItem("raizDigitalUsuarios") || "[]");

        // Verifica se email já existe
        if (usuarios.some(u => u.email === form.email.value)) {
            mostrar("Este e-mail já está cadastrado.", false);
            return;
        }

        // Salva novo usuário (sem a senha em texto plano em produção!)
        const novoUsuario = {
            nome: form.nome.value,
            email: form.email.value,
            senha: senha, // Em produção, usar hash!
            contato: form.Contato.value,
            dataCadastro: new Date().toISOString()
        };

        usuarios.push(novoUsuario);
        localStorage.setItem("raizDigitalUsuarios", JSON.stringify(usuarios));

        mostrar("Cadastro realizado com sucesso!", true);
        form.reset();
        setTimeout(() => {
            window.location.href = "../Login/index.html";
        }, 1500);

    } catch (erro) {
        console.error(erro);
        mostrar("Erro ao cadastrar. Tente novamente.", false);
    }
});