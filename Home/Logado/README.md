# Raiz Digital — Pós Login 🌱

Página escolar da **Escola Monsenhor Sarrion**, com catálogo de oito plantas fotografadas no local, leitor de QR Code e edição de perfil.

## Estrutura

```text
Raiz-Digital-Pos-Login/
├── index.html               # Página inicial e catálogo de plantas
├── arvore.html              # Página de detalhes da planta
├── perfil.html              # Edição de perfil e recorte de foto
├── css/
│   └── style.css            # Estilos e responsividade
├── js/
│   ├── trees-data.js        # Dados das oito plantas
│   ├── tree-details.js      # Detalhes da planta escolhida
│   ├── home.js              # Menu e leitor de QR Code
│   └── profile.js           # Foto, zoom, recorte, nome e e-mail
├── assets/
│   ├── images/              # Fotos originais da escola e imagens do site
│   └── icons/               # Ícones SVG
├── .gitignore
└── README.md
```

## Como executar

Abra `index.html` no navegador para visualizar a interface. Para desenvolvimento, recomenda-se **Live Server** no VS Code ou outro servidor local. O leitor de QR Code usa câmera e requer **HTTPS** no celular, permissão de câmera e internet para carregar a biblioteca `html5-qrcode`.

## Como editar as árvores

Edite os objetos em `js/trees-data.js`. Para adicionar novas árvores, inclua uma fotografia em `assets/images/` e um objeto no catálogo; adicione também o cartão correspondente em `index.html`. Os botões de detalhes usam `arvore.html?id=...`.

## Fotografias e identificação

As oito fotografias das plantas são **as fotos originais fornecidas para o projeto escolar**. Não foram substituídas por imagens geradas ou fotos da internet. Os nomes das espécies são provisórios e devem ser conferidos pela equipe/professor. A foto anteriormente rotulada *Sibipiruna* agora é exibida como *Pau-de-ferro*, mantendo o arquivo original da fotografia.

## Perfil e autenticação

A foto recortada, nome e e-mail ficam em `localStorage` **somente neste navegador**. O botão **Limpar** apaga esses dados locais. Para cadastro real, sincronização entre aparelhos e logout funcional, é preciso conectar um backend e autenticação.

## Publicação no GitHub

Adicione a pasta inteira ao repositório. Não publique senhas, tokens ou arquivos `.env`. Se o projeto for hospedado em subpasta, confira os caminhos relativos das imagens e scripts.


## Página de detalhes das plantas (integração)

`arvore.html?id=aceroleira` (ou qualquer um dos oito IDs) abre o novo layout
**Sobre as Plantas**. A página preserva os dois painéis, a navegação entre
plantas, a foto principal e os quatro cartões de cuidados.

- `css/plantas.css`: estilo da página de detalhes, independente da Home.
- `js/plant-details-data.js`: descrições e orientações gerais das oito plantas.
- `js/plant-details.js`: seleção da planta, troca dos dados e URL.
- `assets/decor/folha.png`: ornamento original do projeto Sobre as Plantas.

As fotografias usadas na página são **os mesmos arquivos originais** já presentes
em `assets/images/`; nenhuma foi substituída ou alterada. Nomes científicos
provisórios devem ser conferidos com um professor antes da publicação.
