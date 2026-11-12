RAIZ DIGITAL — PÓS LOGIN
Abra index.html para visualizar a tela. O projeto é independente da Home pública.

ARQUIVOS
index.html — tela inicial pós-login e catálogo completo de árvores.
arvore.html — página individual de árvore; recebe ?id=aceroleira, ?id=sibipiruna, ?id=bananeira ou ?id=mangueira.
perfil.html — interface de perfil para futura integração.
style.css — visual responsivo.
script.js — menu de perfil, avisos e leitor de QR Code.
arvores.js — dados das árvores.

LEITOR QR CODE
No celular, abra o site publicado em HTTPS e permita acesso à câmera. O leitor usa a biblioteca html5-qrcode carregada por CDN, portanto precisa de internet. QRs com URLs HTTP/HTTPS são aceitos. Se o QR apontar para outro domínio, o usuário precisa confirmar. Em computador, o botão mostra o aviso de acesso pelo celular.
Teste em um celular real; o leitor não funciona ao abrir arquivos locais (file://).

PENDÊNCIAS DE INTEGRAÇÃO
- Botão "Sair da conta" não encerra sessão sem backend de autenticação; hoje mostra aviso honesto.
- Campos de perfil são apenas interface e precisam ser ligados ao banco/autenticação.
- A identificação botânica das árvores por imagem é provisória. Confirme os nomes e dados com a escola.
- Substitua URLs e IDs das árvores conforme as páginas/QR Codes definitivos do grupo.
- As páginas de detalhes já funcionam com os quatro IDs de demonstração.

ATUALIZAÇÃO
- Foto da árvore enviada pelo usuário no hero, substituindo o símbolo.
- Seção final repetida de QR Code removida.
- Ícone de QR Code em SVG no cartão e no aviso.
- Menu de perfil sem opção Editar perfil (edição continua na página Meu perfil).
- Foto de perfil circular com botão de lápis para selecionar imagem. A foto é salva apenas no navegador via localStorage, não no servidor ou na conta.

ATUALIZAÇÃO DE PERFIL: escolha uma imagem, arraste-a dentro do círculo e ajuste o zoom antes de confirmar. O botão Limpar remove foto, nome e e-mail deste navegador. Nome, e-mail e foto são armazenados localmente no navegador; não há sincronização com servidor.

EDITOR DE FOTO DE PERFIL
Na página Meu Perfil, clique no lápis, escolha uma foto, arraste dentro do círculo e ajuste o zoom.
Clique em Usar esta foto para salvar o recorte. A imagem aparecerá no avatar do canto superior direito ao voltar para Início.
Salvar alterações grava nome/e-mail neste navegador. Limpar remove os três dados locais.
A foto e os campos são armazenados apenas no navegador (localStorage); para sincronizar entre dispositivos, integrar ao backend de autenticação.
