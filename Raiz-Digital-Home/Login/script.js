// Login conectado ao backend (API)

const formLogin = document.getElementById("formLogin");
const areaMensagem = document.getElementById("mensagem");
const botaoEntrar = document.querySelector(".botao");

// URL base da API - ajuste conforme necessário
const API_BASE = 'http://localhost:3001/api';

function mostrarMensagem(texto, ok) {
    if (!areaMensagem) return;
    areaMensagem.textContent = texto;
    areaMensagem.style.color = ok ? "green" : "red";
}

async function fazerLogin() {
    if (!formLogin) return;
    mostrarMensagem("Entrando...", true);

    try {
        const formData = new FormData(formLogin);
        const dados = {
            email: formData.get('email'),
            senha: formData.get('senha')
        };

        const resposta = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mostrarMensagem(resultado.mensagem || "Login realizado!", true);

            // Salva token e dados do usuário no localStorage
            localStorage.setItem("raizDigitalToken", resultado.token);
            localStorage.setItem("raizDigitalUsuario", JSON.stringify(resultado.usuario));

            setTimeout(() => {
                window.location.href = "../../Home/Logado/index.html";
            }, 1000);
        } else {
            mostrarMensagem(resultado.erro || "Não foi possível entrar.", false);
        }
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro de conexão. Verifique se o backend está rodando.", false);
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

// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}

// Código secreto (Konami code) para acesso direto (mantido para compatibilidade)
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