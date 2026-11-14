
const plantas = {

    "tipuana": {
        titulo: "TIPUANA",
        cientifico: "TIPUANA TIPU",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: "Tipuana no Brasil está profundamente ligada à urbanização, ao planejamento das grandes metrópoles no século XX (20) e até ao nascimento do movimento ambientalista nacional.",

        adubacao: "Adube de 2 a 3 vezes por ano, principalmente durante o crescimento.",

        poda: "Retire galhos secos e doentes. Faça podas de formação quando necessário.",

        irrigacao: "Necessita de regas frequentes durante a fase inicial. Quando adulta, apresenta boa resistência à seca.",

        luminosidade: "Desenvolve-se melhor em sol pleno, recebendo luz solar direta por várias horas ao dia."
    },

    "pau-ferro": {
        titulo: "PAU-FERRO",
        cientifico: "LIBIDIBIA FERREA",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: "A história do pau-ferro está profundamente entrelaçada com a cultura dos povos indígenas brasileiros, o período colonial e, mais recentemente, com a arquitetura moderna e o paisagismo nacional.",

        adubacao: " Coloque composto orgânico ou esterco curtido. Adube 2 a 3 vezes por ano.",

        poda: "Retire galhos secos e faça podas de formação quando necessário.",

        irrigacao: "Enquanto jovem, precisa de regas regulares. Quando adulta, apresenta boa resistência à falta de água.",

        luminosidade: "Prefere sol pleno e ambientes abertos."
    },

    "banana": {
        titulo: "BANANA",
        cientifico: "MUSA SPP.",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: " história do pé de banana é uma jornada fascinante de milhares de anos, marcada por domesticação humana, grandes navegações e mutações genéticas que transformaram uma planta selvagem cheia de sementes em uma das frutas mais consumidas do planeta.",

        adubacao: "Use esterco de gado bem curtido ou esterco de galinha curtido. Coloque composto orgânico ao redor da planta. Reforce a adubação a cada 2 ou 3 meses.",

        poda: "Retire folhas secas e partes danificadas para manter a planta saudável.",

        irrigacao: "Precisa de bastante água e de solo constantemente úmido, mas sem encharcamento. Em períodos quentes e secos, as regas devem ser mais frequentes.",

        luminosidade: "Necessita de bastante luz solar, preferencialmente em locais com sol direto durante boa parte do dia."
    },

    "manga": {
        titulo: "MANGUEIRA",
        cientifico: "MANGIFERA INDICA",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: "A história da mangueira é uma jornada fascinante que atravessa milênios, envolve imperadores, conecta continentes por meio das grandes navegações e resulta em mitos culturais que moldaram os hábitos do Brasil.",

        adubacao: "A adubação deve ser realizada periodicamente, conforme a idade e as necessidades da planta.",

        poda: "Faça podas de limpeza, removendo galhos secos e malformados.",

        irrigacao: "Mudas precisam de regas regulares para se desenvolver. Quando adulta, a mangueira tolera períodos secos, mas precisa de água adequada para produzir frutos.",

        luminosidade: "Necessita de sol pleno para crescer e produzir frutos."
    },

    "jaca": {
        titulo: "JAQUEIRA",
        cientifico: "ARTOCARPUS HETEROPHYLLUS",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: " A jaca é originária das florestas tropicais da Índia e do sudeste da Ásia, sendo o maior fruto do mundo gerado em árvores.",

        adubacao: "Use esterco bovino bem curtido ou composto orgânico. Adube a cada 3 ou 4 meses. Evite colocar adubo encostado no tronco.",

        poda: "Retire galhos secos e doentes. Faça podas leves para melhorar a formação da copa. Evite podas muito fortes.",

        irrigacao: "Regue de 2 a 3 vezes por semana quando a muda for nova. Em dias muito quentes, pode precisar de mais água. Não deixe a terra encharcada.",

        luminosidade: "Precisa de bastante sol. O ideal é receber pelo menos 6 horas de sol por dia. Evite locais muito sombreados."
    },

    "pitanga": {
        titulo: "PITANGUEIRA",
        cientifico: "EUGENIA UNIFLORA",
        imagem: "arvore-01-aceroleira.jpg",

        descricao: " pitanga está profundamente conectada às origens do território brasileiro. A pitanga é uma fruta legitimamente brasileira, nativa da Mata Atlântica, cuja trajetória atravessa milênios de uso pelos povos originários até encantar os primeiros cronistas europeus no século XVI(16).",

        adubacao: "A adubação orgânica periódica ajuda a manter o desenvolvimento saudável.",

        poda: "Retire galhos secos e doentes. Retire galhos que estejam cruzando. Faça podas leves para manter a copa arejada.",

        irrigacao: "Regue regularmente durante o crescimento inicial, evitando o encharcamento do solo.",

        luminosidade: "Desenvolve-se bem em sol pleno e também tolera meia-sombra."
    }

};


const foto = document.getElementById("planta-foto");

const titulo = document.getElementById("planta-titulo");
const cientifico = document.getElementById("planta-cientifico");
const descricao = document.getElementById("planta-descricao");

const adubacao = document.getElementById("planta-adubacao");
const poda = document.getElementById("planta-poda");
const irrigacao = document.getElementById("planta-irrigacao");
const luminosidade = document.getElementById("planta-luminosidade");


function selecionarPlanta(nome) {

    const planta = plantas[nome];

    if (!planta) return;

    foto.src = planta.imagem;
    foto.alt = planta.titulo;

    titulo.textContent = planta.titulo;
    cientifico.textContent = planta.cientifico;
    descricao.textContent = planta.descricao;

    adubacao.textContent = planta.adubacao;
    poda.textContent = planta.poda;
    irrigacao.textContent = planta.irrigacao;
    luminosidade.textContent = planta.luminosidade;
}


document.querySelectorAll("[data-planta]").forEach(elemento => {
    elemento.addEventListener("click", () => {

        const nome = elemento.dataset.planta;

        selecionarPlanta(nome);

        document.querySelectorAll("[data-planta].nome-planta").forEach(item => {
            item.classList.remove("planta-ativa");
        });

        document.querySelector(`.nome-planta[data-planta="${nome}"]`)
            ?.classList.add("planta-ativa");
    });
});
