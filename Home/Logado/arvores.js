const trees = {
    "pitangueira": {
        "nome": "pitangueira",
        "cientifico": "Eugenia uniflora L",
        "foto": "arvore-01-pitanga.jpg",
        "descricao": "Conhecida por seus frutos ricos em vitamina C."
    },
    "sibipiruna": {
        "nome": "Sibipiruna",
        "cientifico": "Cenostigma pluviosum",
        "foto": "arvore-02-sibipiruna.jpg",
        "descricao": "Árvore ornamental de copa ampla, frequentemente usada na arborização urbana."
    },
    "bananeira": {
        "nome": "Bananeira",
        "cientifico": "Musa spp.",
        "foto": "arvore-03-bananeira.jpg",
        "descricao": "Planta de folhas grandes, cultivada principalmente por seus frutos."
    },
    "mangueira": {
        "nome": "Mangueira",
        "cientifico": "Mangifera indica",
        "foto": "arvore-04-mangueira.jpg",
        "descricao": "Árvore frutífera tropical conhecida pela produção de mangas."
    }
};
const id = new URLSearchParams(location.search).get('id');
const tree = trees[id];
if (tree) {
    document.title = tree.nome + ' | Raiz Digital';
    document.querySelector('#treeName').textContent = tree.nome;
    document.querySelector('#treeScientific').textContent = tree.cientifico;
    document.querySelector('#treeDescription').textContent = tree.descricao;
    const photo = document.querySelector('#treePhoto');
    photo.src = '../../img/' + tree.foto;
    photo.alt = 'Foto da ' + tree.nome
} else {
    document.querySelector('#treeName').textContent = 'Árvore não encontrada';
    document.querySelector('#treeDescription').textContent = 'Volte ao catálogo e escolha uma árvore cadastrada.'
}