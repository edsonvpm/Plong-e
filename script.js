let cartas = [];

let cartaAtual = null;
let dicasExibidas = 0;
let pontuacao = 20;
let cartasJogadas = [];

const categoriaEl = document.getElementById("categoria");
const pontosEl = document.getElementById("pontos");
const dicasEl = document.getElementById("dicas");
const mensagemEl = document.getElementById("mensagem");
const respostaEl = document.getElementById("resposta");

async function carregarCartas() {
    try {
        const response = await fetch("./cartas.json");

        if (!response.ok) {
            throw new Error("Erro ao carregar cartas");
        }

        cartas = await response.json();

        iniciarRodada();
    }
    catch (erro) {
        console.error(erro);
        mensagemEl.textContent =
            "Erro ao carregar o banco de cartas.";
    }
}

function iniciarRodada() {

    const categoriasSelecionadas =
        obterCategoriasSelecionadas();

    const cartasFiltradas =
        cartas.filter(carta =>
            categoriasSelecionadas.includes(carta.categoria)
        );

    if (cartasFiltradas.length === 0) {

        mensagemEl.textContent =
            "Selecione ao menos uma categoria.";

        return;
    }

    cartaAtual =
        cartasFiltradas[
            Math.floor(
                Math.random() * cartasFiltradas.length
            )
        ];

    dicasExibidas = 0;
    pontuacao = 20;

    categoriaEl.textContent =
        cartaAtual.categoria;

    pontosEl.textContent =
        pontuacao;

    dicasEl.innerHTML = "";

    mensagemEl.textContent = "";

    respostaEl.value = "";
}

function trocarCarta() {

    const container = document.querySelector(".container");

    container.classList.add("fade-out");

    setTimeout(() => {
        iniciarRodada();

        container.classList.remove("fade-out");
        container.classList.add("fade-in");

        setTimeout(() => {
            container.classList.remove("fade-in");
        }, 300);

    }, 300);
}

function alternarCategorias() {

    const checks =
        document.querySelectorAll(".categoria-check");

    const todasMarcadas =
        [...checks].every(check => check.checked);

    checks.forEach(check => {
        check.checked = !todasMarcadas;
    });

    if (!todasMarcadas) {
        iniciarRodada();
    }
}

function obterCategoriasSelecionadas() {

    return [...document.querySelectorAll(".categoria-check:checked")]
        .map(check => check.value);
}

function mostrarDica() {

    if (!cartaAtual) return;

    if (dicasExibidas >= cartaAtual.dicas.length) {
        return;
    }

    const div = document.createElement("div");

    div.classList.add("dica");

    div.textContent =
        `${dicasExibidas + 1}. ${cartaAtual.dicas[dicasExibidas]}`;

    dicasEl.appendChild(div);

    dicasExibidas++;

    pontuacao = Math.max(0, pontuacao - 1);

    pontosEl.textContent = pontuacao;
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function verificarResposta() {

    if (!cartaAtual) return;

    const respostaUsuario =
        normalizar(respostaEl.value);

    const respostaCorreta =
        normalizar(cartaAtual.resposta);

    if (respostaUsuario === respostaCorreta) {

        mensagemEl.textContent =
            `✅ Acertou! (${pontuacao} pontos)`;

        setTimeout(() => {
            iniciarRodada();
        }, 2000);
    }
    else {
        mensagemEl.textContent =
            "❌ Resposta incorreta.";
    }
}

function desistir() {

    mensagemEl.innerHTML =
        `A resposta correta era: <strong>${cartaAtual.resposta}</strong>`;

    setTimeout(() => {
        iniciarRodada();
    }, 3000);
}

carregarCartas();