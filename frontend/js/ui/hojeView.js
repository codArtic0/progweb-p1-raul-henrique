// Camada de UI do painel "Hoje": um anel de progresso por hábito e a faixa dos últimos dias.
import { icone } from './icones.js';
import { TIPOS, formatarValor } from './tipos.js';
import { formatarData } from '../utils/datas.js';

const el = {
  cartoes: document.querySelector('#hoje-cartoes'),
  faixa: document.querySelector('#historico-faixa'),
  data: document.querySelector('#data-hoje'),
};

// Cabeçalho da página: a data de hoje por extenso
el.data.textContent = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const NS = 'http://www.w3.org/2000/svg';
const RAIO = 34;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

// Anel (SVG): trilho + arco proporcional ao progresso da meta
function anel(pct, nomeIcone) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 80 80');
  svg.setAttribute('class', 'anel');
  svg.setAttribute('aria-hidden', 'true');
  for (const classe of ['anel-trilho', 'anel-arco']) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', '40');
    c.setAttribute('cy', '40');
    c.setAttribute('r', String(RAIO));
    c.setAttribute('class', classe);
    if (classe === 'anel-arco') {
      c.setAttribute('stroke-dasharray', String(CIRCUNFERENCIA));
      c.setAttribute('stroke-dashoffset', String(CIRCUNFERENCIA * (1 - pct / 100)));
    }
    svg.append(c);
  }
  const miolo = document.createElement('span');
  miolo.className = 'anel-miolo';
  miolo.append(icone(nomeIcone));
  const caixa = document.createElement('span');
  caixa.className = 'anel-caixa';
  caixa.append(svg, miolo);
  return caixa;
}

function cartao({ habito, registro, pct, atingiu }) {
  const tipo = TIPOS[habito.tipo];
  const art = document.createElement('article');
  art.className = `cartao-hoje tipo-${habito.tipo}${atingiu ? ' cartao-ok' : ''}`;

  const nome = document.createElement('h3');
  nome.className = 'cartao-hoje-nome';
  nome.textContent = habito.nome; // dado do usuário entra como TEXTO

  const detalhe = document.createElement('p');
  detalhe.className = 'cartao-hoje-detalhe numero';
  detalhe.textContent = registro
    ? `${formatarValor(habito.tipo, registro.valor)} de ${formatarValor(habito.tipo, habito.meta)}`
    : `Meta: ${formatarValor(habito.tipo, habito.meta)}`;

  const estado = document.createElement('p');
  estado.className = 'cartao-hoje-estado';
  estado.textContent = atingiu ? 'Meta batida' : registro ? `${pct}% da meta` : 'Ainda sem registro hoje';

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn btn-sm btn-outline-primary';
  botao.dataset.acao = registro ? 'editar' : 'registrar';
  botao.dataset.habitoId = habito.id;
  if (registro) botao.dataset.registroId = registro.id;
  botao.textContent = registro ? 'Ajustar' : 'Registrar';
  botao.setAttribute('aria-label', `${registro ? 'Ajustar' : 'Registrar'} ${habito.nome} de hoje`);

  const textos = document.createElement('div');
  textos.className = 'cartao-hoje-textos';
  textos.append(nome, detalhe, estado);

  const topo = document.createElement('div');
  topo.className = 'cartao-hoje-topo';
  topo.append(anel(pct, tipo.icone), textos);

  art.append(topo, botao);
  return art;
}

function quadrado({ data, batidas, total, nivel }) {
  const li = document.createElement('li');
  li.className = `dia nivel-${nivel}`;
  li.title = `${formatarData(data)}: ${batidas} de ${total} metas`;
  li.setAttribute('aria-label', li.title);
  return li;
}

export const hojeView = {
  // dados = null enquanto carrega
  render(dados) {
    if (!dados) {
      el.cartoes.replaceChildren();
      el.faixa.replaceChildren();
      return;
    }
    if (!dados.cartoes.length) {
      const vazio = document.createElement('p');
      vazio.className = 'text-body-secondary mb-0';
      vazio.textContent = 'Crie um hábito para acompanhar o seu dia aqui.';
      el.cartoes.replaceChildren(vazio);
    } else {
      el.cartoes.replaceChildren(...dados.cartoes.map(cartao));
    }
    el.faixa.replaceChildren(...dados.dias.map(quadrado));
  },

  // Os botões dos cartões: registrar um dia novo ou ajustar o de hoje
  aoClicar({ registrar, ajustar }) {
    el.cartoes.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      if (alvo.dataset.acao === 'registrar') registrar(Number(alvo.dataset.habitoId));
      if (alvo.dataset.acao === 'editar') ajustar(Number(alvo.dataset.registroId));
    });
  },
};
