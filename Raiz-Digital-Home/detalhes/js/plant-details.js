/**
 * Navegação entre as oito plantas.
 * Mantém o layout criado para a página Sobre as Plantas.
 */
(() => {
  'use strict';

  const plantas = window.RAIZ_PLANT_DETAILS || [];
  const porId = new Map(plantas.map((planta) => [planta.id, planta]));
  const painel = document.getElementById('painel-planta');
  const foto = document.getElementById('planta-foto');
  const botoes = [...document.querySelectorAll('.planta-opcao')];

  function selecionarPlanta(id, atualizarEndereco = true) {
    const planta = porId.get(id);
    if (!planta) return;

    document.getElementById('planta-titulo').textContent = planta.nome;
    document.getElementById('planta-cientifico').textContent = planta.cientifico;
    document.getElementById('planta-descricao').textContent = planta.descricao;

    for (const campo of ['adubacao', 'poda', 'irrigacao', 'luminosidade']) {
      document.getElementById(`planta-${campo}`).textContent = planta[campo];
    }

    foto.src = `assets/images/${planta.foto}`;
    foto.alt = `Fotografia original de ${planta.nome}, na escola`;
    document.title = `${planta.nome} | Raiz Digital`;

    botoes.forEach((botao) => {
      const ativo = botao.dataset.planta === id;
      botao.classList.toggle('planta-ativa', ativo);
      botao.setAttribute('aria-pressed', String(ativo));
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      painel.classList.remove('planta-trocando');
      void painel.offsetWidth;
      painel.classList.add('planta-trocando');
    }

    if (atualizarEndereco) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.replaceState(null, '', url);
    }
  }

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => selecionarPlanta(botao.dataset.planta));
  });

  const idDaUrl = new URLSearchParams(window.location.search).get('id');
  selecionarPlanta(porId.has(idDaUrl) ? idDaUrl : plantas[0]?.id, false);
})();
