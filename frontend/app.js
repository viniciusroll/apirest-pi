const API_URL = 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  try { return JSON.parse(localStorage.getItem('usuario') || 'null'); } catch { return null; }
}

function authGuard() {
  if (!getToken()) { window.location.href = 'login.html'; return false; }
  return true;
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
    throw new Error('Nao autorizado');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || data.message || 'Erro na requisicao');
  return data;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

let toastContainer = null;
function toast(msg, tipo = 'success') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function formatDate(str) {
  if (!str) return '-';
  const d = (str + '').split('T')[0];
  if (!d || d === 'undefined') return '-';
  const parts = d.split('-');
  if (parts.length !== 3) return str;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatMoney(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
}

function escHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item[href]').forEach(item => {
    if (item.getAttribute('href') === page) item.classList.add('active');
    else item.classList.remove('active');
  });
}

function initTopbar() {
  const u = getUsuario();
  const el = document.getElementById('nomeUsuario');
  if (el && u) el.textContent = u.nome;
  setActiveNav();
  setTimeout(() => {
    atualizarLabelSilenciar();
    carregarNotificacoes();
  }, 300);
}

// Sidebar HTML helper
function sidebarHTML(active) {
  const items = [
    { href: 'dashboard.html',    label: 'Inicio',       icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { href: 'clientes.html',     label: 'Clientes',     icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { href: 'produtos.html',     label: 'Produtos',     icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
    { href: 'pedidos.html',      label: 'Pedidos',      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>' },
    { href: 'fornecedores.html', label: 'Fornecedores', icon: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  ];
  return `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        ${items.map(i => `
          <a href="${i.href}" class="nav-item${active === i.href ? ' active' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.icon}</svg>
            ${i.label}
          </a>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <button class="nav-item" onclick="logout()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>
    </aside>`;
}

function topbarHTML() {
  return `
    <header class="topbar">
      <div class="topbar-search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" id="searchInput" placeholder="Pesquisar..." oninput="filtrarTabela(this.value)">
      </div>
      <div class="topbar-spacer"></div>
      <div class="topbar-right">
        <div class="topbar-icon-wrap">
          <button class="topbar-icon" id="btnNoti" onclick="toggleDropdown('dropdownNoti')" title="Notificacoes">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="noti-badge hidden" id="notiBadge"></span>
          </button>
          <div class="dropdown dropdown-right hidden" id="dropdownNoti" style="width:300px">
            <div class="dropdown-header">Notificacoes</div>
            <div id="notiList"><div style="padding:16px;text-align:center;color:#94a3b8;font-size:13px">Carregando...</div></div>
          </div>
        </div>
        <div class="topbar-icon-wrap">
          <button class="topbar-icon" id="btnConfig" onclick="toggleDropdown('dropdownConfig')" title="Configuracoes">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <div class="dropdown dropdown-right hidden" id="dropdownConfig">
            <div class="dropdown-header">Configuracoes</div>
            <button class="dropdown-item" onclick="abrirAlterarSenha(); closeDropdowns()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Alterar senha
            </button>
            <button class="dropdown-item" id="btnSilenciarEstoque" onclick="toggleSilenciar('estoque')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              <span id="labelSilenciarEstoque">Silenciar estoque</span>
            </button>
            <button class="dropdown-item" id="btnSilenciarInadimplentes" onclick="toggleSilenciar('inadimplentes')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span id="labelSilenciarInadimplentes">Silenciar inadimplentes</span>
            </button>
            <button class="dropdown-item" onclick="abrirSobre(); closeDropdowns()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Sobre o sistema
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item-danger" onclick="confirmarLogout()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </div>
        <div class="topbar-user" id="topbarUser">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span id="nomeUsuario"></span>
        </div>
      </div>
    </header>

    <!-- Modal alterar senha -->
    <div class="modal-backdrop hidden" id="modalSenhaBackdrop">
      <div class="modal" style="max-width:380px">
        <div class="modal-header">
          <span class="modal-title">Alterar Senha</span>
          <button class="modal-close" onclick="fecharAlterarSenha()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-group">
          <label>Senha atual</label>
          <input type="password" id="senhaAtual" placeholder="Digite sua senha atual">
        </div>
        <div class="form-group">
          <label>Nova senha</label>
          <input type="password" id="senhaNova" placeholder="Minimo 6 caracteres">
        </div>
        <div class="form-group">
          <label>Confirmar nova senha</label>
          <input type="password" id="senhaConfirm" placeholder="Repita a nova senha">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="fecharAlterarSenha()">Cancelar</button>
          <button class="btn btn-primary" id="btnAlterarSenha" onclick="salvarNovaSenha()">Salvar</button>
        </div>
      </div>
    </div>

    <!-- Modal sobre -->
    <div class="modal-backdrop hidden" id="modalSobreBackdrop">
      <div class="modal" style="max-width:360px">
        <div class="modal-header">
          <span class="modal-title">Sobre o Sistema</span>
          <button class="modal-close" onclick="document.getElementById('modalSobreBackdrop').classList.add('hidden')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="padding:4px 0 12px;font-size:13px;color:#475569;line-height:1.7">
          <p><strong>Sistema de Gestao \u2014 Loja de Bebidas</strong></p>
          <p style="margin-top:8px">Versao 1.0.0 &nbsp;&mdash;&nbsp; Projeto Integrador \u2014 FATEC, 2\u00ba semestre</p>
          <p style="margin-top:12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8">Equipe</p>
          <ul style="margin-top:6px;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:4px">
            <li>Gabriel Verdin</li>
            <li>Leonardo Xu</li>
            <li>Leonardo Tagliamento</li>
            <li>Thiago Freri</li>
            <li>Vinicius Rodrigo</li>
            <li>Willian Pontieri</li>
          </ul>
          <p style="margin-top:12px;color:#94a3b8;font-size:12px">API: Express + SQLite + TypeScript</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('modalSobreBackdrop').classList.add('hidden')">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Confirm logout -->
    <div class="modal-backdrop hidden" id="modalLogoutBackdrop">
      <div class="confirm-dialog">
        <h3>Sair do sistema</h3>
        <p>Deseja encerrar sua sessao?</p>
        <div class="confirm-dialog-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('modalLogoutBackdrop').classList.add('hidden')">Cancelar</button>
          <button class="btn btn-danger" onclick="logout()">Sair</button>
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------ Dropdowns
function toggleDropdown(id) {
  const el = document.getElementById(id);
  const wasHidden = el.classList.contains('hidden');
  closeDropdowns();
  if (wasHidden) el.classList.remove('hidden');
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.add('hidden'));
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.topbar-icon-wrap')) closeDropdowns();
});

// ------------------------------------------------------------------ Logout
function confirmarLogout() {
  document.getElementById('modalLogoutBackdrop').classList.remove('hidden');
}

// ------------------------------------------------------------------ Alterar senha
function abrirAlterarSenha() {
  document.getElementById('senhaAtual').value = '';
  document.getElementById('senhaNova').value = '';
  document.getElementById('senhaConfirm').value = '';
  document.getElementById('modalSenhaBackdrop').classList.remove('hidden');
}

function fecharAlterarSenha() {
  document.getElementById('modalSenhaBackdrop').classList.add('hidden');
}

async function salvarNovaSenha() {
  const atual = document.getElementById('senhaAtual').value;
  const nova = document.getElementById('senhaNova').value;
  const confirm = document.getElementById('senhaConfirm').value;

  if (!atual || !nova || !confirm) { toast('Preencha todos os campos', 'error'); return; }
  if (nova.length < 6) { toast('Nova senha deve ter ao menos 6 caracteres', 'error'); return; }
  if (nova !== confirm) { toast('As senhas nao coincidem', 'error'); return; }

  const btn = document.getElementById('btnAlterarSenha');
  btn.disabled = true;
  try {
    await api('/auth/alterar-senha', {
      method: 'POST',
      body: JSON.stringify({ senha_atual: atual, nova_senha: nova }),
    });
    toast('Senha alterada com sucesso');
    fecharAlterarSenha();
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

// ------------------------------------------------------------------ Silenciar notificacoes
function toggleSilenciar(tipo) {
  const key = tipo === 'estoque' ? 'noti_silenciar_estoque' : 'noti_silenciar_inadimplentes';
  const silenciado = localStorage.getItem(key) === '1';
  const novoEstado = !silenciado;
  localStorage.setItem(key, novoEstado ? '1' : '0');
  atualizarLabelSilenciar();
  closeDropdowns();
  const nomes = { estoque: 'estoque baixo', inadimplentes: 'inadimplentes' };
  toast(novoEstado ? `Notificacoes de ${nomes[tipo]} silenciadas` : `Notificacoes de ${nomes[tipo]} ativadas`);
  carregarNotificacoes();
}

function atualizarLabelSilenciar() {
  const silEstoque = localStorage.getItem('noti_silenciar_estoque') === '1';
  const silInad = localStorage.getItem('noti_silenciar_inadimplentes') === '1';
  const le = document.getElementById('labelSilenciarEstoque');
  const li = document.getElementById('labelSilenciarInadimplentes');
  if (le) le.textContent = silEstoque ? 'Ativar estoque' : 'Silenciar estoque';
  if (li) li.textContent = silInad ? 'Ativar inadimplentes' : 'Silenciar inadimplentes';
}

// ------------------------------------------------------------------ Sobre
function abrirSobre() {
  document.getElementById('modalSobreBackdrop').classList.remove('hidden');
}

// ------------------------------------------------------------------ Notificacoes
async function carregarNotificacoes() {
  const silEstoque = localStorage.getItem('noti_silenciar_estoque') === '1';
  const silInad = localStorage.getItem('noti_silenciar_inadimplentes') === '1';
  const list = document.getElementById('notiList');
  const badge = document.getElementById('notiBadge');
  if (!list) return;
  try {
    const [estoqueBaixoRes, inadimplentesRes] = await Promise.all([
      api('/relatorios/estoque-baixo?limite=10'),
      api('/relatorios/inadimplentes'),
    ]);

    const estoqueBaixo = estoqueBaixoRes.produtos || [];
    const inadimplentes = inadimplentesRes.clientes || [];

    const itens = [];

    if (!silEstoque && estoqueBaixo.length) {
      itens.push(`<div class="noti-section-label">Estoque baixo</div>`);
      estoqueBaixo.slice(0, 5).forEach(p => {
        itens.push(`<div class="noti-item noti-warn">
          <strong>${escHtml(p.nome)}</strong>
          <span>${p.estoque} unidade${p.estoque !== 1 ? 's' : ''} restante${p.estoque !== 1 ? 's' : ''}</span>
        </div>`);
      });
    }

    if (!silInad && inadimplentes.length) {
      itens.push(`<div class="noti-section-label">Clientes inadimplentes</div>`);
      inadimplentes.slice(0, 5).forEach(c => {
        itens.push(`<div class="noti-item noti-danger">
          <strong>${escHtml(c.nome)}</strong>
          <span>Em aberto: ${formatMoney(c.valor_total_em_aberto || 0)}</span>
        </div>`);
      });
    }

    const total = (silEstoque ? 0 : estoqueBaixo.length) + (silInad ? 0 : inadimplentes.length);
    if (total > 0) {
      badge.textContent = total > 9 ? '9+' : total;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    list.innerHTML = itens.length
      ? itens.join('')
      : '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:13px">Sem alertas no momento</div>';
  } catch (e) {
    list.innerHTML = '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:13px">Erro ao carregar</div>';
  }
}