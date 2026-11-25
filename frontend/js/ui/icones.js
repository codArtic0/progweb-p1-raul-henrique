// Ícones SVG (estilo traço, 24x24). Constantes nossas, nunca dado do usuário.
// Uso no HTML: <span data-icone="gota"></span> → vira o SVG.
const CAMINHOS = {
  pulso: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  gota: '<path d="M12 2.7s6 6.2 6 10.6a6 6 0 0 1-12 0c0-4.4 6-10.6 6-10.6z"/>',
  lua: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sol: '<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.6 4.6 6 6M18 18l1.4 1.4M1.5 12h2M20.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  halter: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  usuario: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  lapis: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  lixeira: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  alerta: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  chama: '<path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  ok: '<path d="M20 6 9 17l-5-5"/>',
};

const NS = 'http://www.w3.org/2000/svg';

export function icone(nome) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('icone');
  svg.innerHTML = CAMINHOS[nome] ?? '';
  return svg;
}

// Troca cada <span data-icone="..."> do HTML pelo SVG correspondente.
export function hidratarIcones(raiz = document) {
  raiz.querySelectorAll('[data-icone]').forEach((alvo) => {
    alvo.replaceChildren(icone(alvo.dataset.icone));
  });
}
