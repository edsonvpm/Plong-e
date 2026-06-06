let cartas = [];
let cartaAtual = null;

async function carregarCartas(){

    const response =
        await fetch("./cartas.json");

    cartas = (await response.json()).flat();

    novaCarta();
}

function obterCategoriasSelecionadas(){

    return [...document.querySelectorAll(".categoria-check:checked")]
        .map(check => check.value);
}

function novaCarta(){

    const categorias =
        obterCategoriasSelecionadas();

    const cartasFiltradas =
        cartas.filter(carta =>
            categorias.includes(carta.categoria)
        );

    if(cartasFiltradas.length === 0){
        return;
    }

    cartaAtual =
        cartasFiltradas[
            Math.floor(
                Math.random() *
                cartasFiltradas.length
            )
        ];

    renderizarCarta();
}

function renderizarCarta(){

    document.getElementById("categoria")
        .textContent =
        cartaAtual.categoria;

    document.getElementById("respostaCarta")
        .textContent =
        cartaAtual.resposta;

    const lista =
        document.getElementById("listaDicas");

    lista.innerHTML = "";

    cartaAtual.dicas.forEach((dica,index)=>{

        const div =
            document.createElement("div");

        div.className =
            "dica-item";

        div.textContent =
            `${index+1}. ${dica}`;

        lista.appendChild(div);
    });
}

function alternarCategorias(){

    const checks =
        document.querySelectorAll(".categoria-check");

    const todasMarcadas =
        [...checks].every(
            c => c.checked
        );

    checks.forEach(c=>{
        c.checked =
            !todasMarcadas;
    });

    novaCarta();
}

document
    .querySelectorAll(".categoria-check")
    .forEach(check=>{
        check.addEventListener(
            "change",
            novaCarta
        );
    });

carregarCartas();