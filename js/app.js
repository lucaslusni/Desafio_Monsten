// Config & Helpers
const STORAGE_KEY = 'votacao_filmes_v1';
const PLACEHOLDER = 'https://via.placeholder.com/640x360?text=Sem+imagem';

const $ = (sel, root=document) => root.querySelector(sel);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function isValidUrl(url) {
  try { const u = new URL(url); return ['http:', 'https:'].includes(u.protocol); } catch { return false; }
}

function getSeed() {
  return [
    { id: uid(), titulo: 'Interstellar', genero: 'Ficção Científica', descricao: 'Uma missão através de um buraco de minhoca em busca de um novo lar para a humanidade.', imagem: 'img/interestelar.png', gostei: 0, naoGostei: 0 },
    { id: uid(), titulo: 'Stranger Things', genero: 'Suspense / Ficção', descricao: 'Um grupo de amigos enfrenta forças sobrenaturais em uma pequena cidade dos anos 80.', imagem: 'img/StrangerThings.png', gostei: 0, naoGostei: 0 },
    { id: uid(), titulo: 'O Senhor dos Anéis: A Sociedade do Anel', genero: 'Fantasia / Aventura', descricao: 'Frodo parte para destruir o Um Anel e impedir o retorno de Sauron.', imagem: 'img/OSenhordosAneis.png', gostei: 0, naoGostei: 0 },
    { id: uid(), titulo: 'A Casa do Dragão', genero: 'Fantasia / Drama', descricao: 'A ascensão da Casa Targaryen cerca de 200 anos antes de Game of Thrones.', imagem: 'img/CasaDoDragao.png', gostei: 0, naoGostei: 0 },
    { id: uid(), titulo: 'Cidade de Deus', genero: 'Crime / Drama', descricao: 'Crescer nas favelas do Rio e a escalada do crime organizado.', imagem: 'img/CidadedeDeus.png', gostei: 0, naoGostei: 0 }
  ];
}

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = getSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw);
    // Garante 5 itens na primeira carga, mesmo que exista um array vazio salvo
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = getSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    const seed = getSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Estado
let state = [];

// Renderização
let listaEl;
function renderAll() {
  renderLista(state);
  atualizarTotais();
  $('#totalItens').textContent = String(state.length);
}
function renderLista(items) {
  listaEl.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(renderItem(item)));
  listaEl.appendChild(frag);
}
function renderItem(item) {
  const card = document.createElement('article');
  card.className = 'card movie';
  card.dataset.id = item.id;

  const media = document.createElement('div');
  media.className = 'media';
  const img = document.createElement('img');
  img.src = item.imagem || PLACEHOLDER;
  img.alt = `Imagem de ${item.titulo}`;
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onerror = () => { img.src = PLACEHOLDER; };
  media.appendChild(img);

  const body = document.createElement('div');
  body.className = 'body';

  const h3 = document.createElement('h3');
  h3.className = 'title';
  h3.textContent = item.titulo;

  const genre = document.createElement('div');
  genre.className = 'genre';
  genre.textContent = item.genero;

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = item.descricao || '';

  const actions = document.createElement('div');
  actions.className = 'actions';

  const btnGood = document.createElement('button');
  btnGood.className = 'btn good';
  btnGood.type = 'button';
  btnGood.setAttribute('data-action', 'gostei');
  btnGood.setAttribute('aria-label', `Gostei de ${item.titulo}`);
  btnGood.textContent = '👍 Gostei';

  const btnBad = document.createElement('button');
  btnBad.className = 'btn bad';
  btnBad.type = 'button';
  btnBad.setAttribute('data-action', 'naoGostei');
  btnBad.setAttribute('aria-label', `Não gostei de ${item.titulo}`);
  btnBad.textContent = '👎 Não Gostei';

  actions.append(btnGood, btnBad);

  const counts = document.createElement('div');
  counts.className = 'counts';
  counts.innerHTML = `<span class="pill">👍 <strong data-role="gostei">${item.gostei}</strong></span>
                      <span class="pill">👎 <strong data-role="naoGostei">${item.naoGostei}</strong></span>`;

  body.append(h3, genre, desc, actions, counts);
  card.append(media, body);
  return card;
}
function atualizarTotais() {
  const totais = state.reduce((acc, it) => {
    acc.g += it.gostei|0; acc.n += it.naoGostei|0; return acc;
  }, { g: 0, n: 0 });
  $('#totalGostei').textContent = String(totais.g);
  $('#totalNaoGostei').textContent = String(totais.n);
}

// Votação
function onListaClick(ev) {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  if (!action) return;
  const card = btn.closest('[data-id]');
  const id = card?.dataset?.id;
  if (!id) return;

  if (action === 'gostei') incrementarGostei(id);
  if (action === 'naoGostei') incrementarNaoGostei(id);
}
function incrementarGostei(id) {
  const idx = state.findIndex(it => it.id === id);
  if (idx === -1) return;
  state[idx].gostei = (state[idx].gostei|0) + 1;
  saveItems(state);
  const card = listaEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
  if (card) card.querySelector('[data-role="gostei"]').textContent = String(state[idx].gostei);
  atualizarTotais();
}
function incrementarNaoGostei(id) {
  const idx = state.findIndex(it => it.id === id);
  if (idx === -1) return;
  state[idx].naoGostei = (state[idx].naoGostei|0) + 1;
  saveItems(state);
  const card = listaEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
  if (card) card.querySelector('[data-role="naoGostei"]').textContent = String(state[idx].naoGostei);
  atualizarTotais();
}

// Cadastro
function onSubmitCadastro(ev) {
  ev.preventDefault();
  const form = ev.currentTarget;
  const fd = new FormData(form);
  const titulo = (fd.get('titulo') || '').toString().trim();
  const genero = (fd.get('genero') || '').toString().trim();
  const imagem = (fd.get('imagem') || '').toString().trim();
  const descricao = (fd.get('descricao') || '').toString().trim();
  const feedback = $('#feedback');

  if (!titulo || !genero || !imagem) {
    feedback.textContent = 'Preencha os campos obrigatórios (*).';
    return;
  }
  if (!isValidUrl(imagem)) {
    feedback.textContent = 'Informe uma URL de imagem válida (http ou https).';
    return;
  }

  const novo = { id: uid(), titulo, genero, imagem, descricao, gostei: 0, naoGostei: 0 };
  state.push(novo);
  saveItems(state);

  // Renderiza só o novo card
  listaEl.prepend(renderItem(novo));
  atualizarTotais();
  $('#totalItens').textContent = String(state.length);

  form.reset();
  feedback.textContent = 'Item cadastrado com sucesso! Você já pode votar.';
  selectTab('lista');
}

// Tabs
let tabLista, tabCadastro;
function selectTab(name) {
  const isLista = name === 'lista';
  $('#panel-lista').classList.toggle('hidden', !isLista);
  $('#panel-cadastro').classList.toggle('hidden', isLista);
  tabLista.setAttribute('aria-selected', String(isLista));
  tabCadastro.setAttribute('aria-selected', String(!isLista));
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  // carrega e garante seed
  state = loadItems();

  // cache de elementos
  listaEl = $('#lista');
  tabLista = $('#tab-lista');
  tabCadastro = $('#tab-cadastro');

  // render inicial
  renderAll();

  // listeners
  listaEl.addEventListener('click', onListaClick);
  $('#form-cadastro').addEventListener('submit', onSubmitCadastro);
  tabLista.addEventListener('click', () => selectTab('lista'));
  tabCadastro.addEventListener('click', () => selectTab('cadastro'));
});