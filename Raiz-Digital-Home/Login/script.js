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


// login conectado ao banco de dados

const formLogin = document.getElementById("formLogin");
const areaMensagem = document.getElementById("mensagem");
const botaoEntrar = document.querySelector(".botao");

function mostrarMensagem(texto, ok) {
    if (!areaMensagem) return;
    areaMensagem.textContent = texto;
    areaMensagem.style.color = ok ? "green" : "red";
}

async function fazerLogin() {
    if (!formLogin) return;
    mostrarMensagem("Entrando...", true);

    try {
        const resposta = await fetch("/api/login", {
            method: "POST",
            body: new FormData(formLogin),
        });
        const dados = await resposta.json();

        if (resposta.ok) {
            mostrarMensagem(dados.mensagem || "Login realizado!", true);

            window.location.href = "inicio.html";
        } else {
            mostrarMensagem(dados.erro || "Não foi possível entrar.", false);
        }
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro de conexão. Tente novamente.", false);
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