// redirecionamento simples

function voltarPagina() {
    history.back();
};

function receberCodigo() {
    window.location.href = "./receber-código/index.html"
};

function novaSenha() {
    window.location.href = "./nova-senha/index.html"
};

function login() {
    window.location.href = "../../../index.html"
};

function sair() {
    window.location.href = "../"
};


// // login conectado ao banco de dados

// const formLogin = document.getElementById("formLogin");
// const areaMensagem = document.getElementById("mensagem");
// const botaoEntrar = document.querySelector(".botao");

// function mostrarMensagem(texto, ok) {
//     if (!areaMensagem) return;
//     areaMensagem.textContent = texto;
//     areaMensagem.style.color = ok ? "green" : "red";
// }

// async function fazerLogin() {
//     if (!formLogin) return;
//     mostrarMensagem("Entrando...", true);

//     try {
//         const resposta = await fetch("/api/login", {
//             method: "POST",
//             body: new FormData(formLogin),
//         });
//         const dados = await resposta.json();

//         if (resposta.ok) {
//             mostrarMensagem(dados.mensagem || "Login realizado!", true);

//             window.location.href = "../../Home/Logado/index.html";
//         } else {
//             mostrarMensagem(dados.erro || "Não foi possível entrar.", false);
//         }
//     } catch (erro) {
//         console.error(erro);
//         mostrarMensagem("Erro de conexão. Tente novamente.", false);
//     }
// }

// if (formLogin) {
//     formLogin.addEventListener("submit", (evento) => {
//         evento.preventDefault();
//         fazerLogin();
//     });
// }

// if (botaoEntrar) {
//     botaoEntrar.addEventListener("click", fazerLogin);
// }

// login conectado ao localStorage (demo)

const formLogin = document.getElementById("formLogin");
const areaMensagem = document.getElementById("mensagem");
const botaoEntrar = document.querySelector(".botao");

function mostrarMensagem(texto, ok) {
    if (!areaMensagem) return;
    areaMensagem.textContent = texto;
    areaMensagem.style.color = ok ? "green" : "red";
}

function fazerLogin() {
    if (!formLogin) return;
    mostrarMensagem("Entrando...", true);

    try {
        const usuarios = JSON.parse(localStorage.getItem("raizDigitalUsuarios") || "[]");
        const email = formLogin.email.value;
        const senha = formLogin.senha.value;

        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuario) {
            // Salva sessão simples
            localStorage.setItem("raizDigitalUsuarioAtual", JSON.stringify({
                nome: usuario.nome,
                email: usuario.email
            }));

            mostrarMensagem("Login realizado!", true);
            setTimeout(() => {
                window.location.href = "../../Home/Logado/index.html";
            }, 1000);
        } else {
            mostrarMensagem("E-mail ou senha incorretos.", false);
        }
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao fazer login. Tente novamente.", false);
    }
}

if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();
        fazerLogin();
    });
}

if (botaoEntrar) {
    botaoEntrar.addEventListener("click", fazerLogin);
}

//codigo secreto para erro de conexão
const codigoSecreto = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
];

let progresso = 0;

document.addEventListener("keydown", function(event) {

    const tecla = event.key.length === 1
        ? event.key.toLowerCase()
        : event.key;

    if (tecla === codigoSecreto[progresso]) {

        progresso++;

        if (progresso === codigoSecreto.length) {
            window.location.href = "../../Home/Logado/index.html";
        }

    } else {
        // Se errar, verifica se a tecla pode iniciar novamente
        progresso = tecla === codigoSecreto[0] ? 1 : 0;
    }

});