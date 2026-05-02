const state = {
  tab: "dashboard",
  orders: [
    { id: "ord_1042", customerName: "Mariana Souza", phone: "24999990000", total: 57.9, status: "recebido" },
    { id: "ord_1043", customerName: "Bruna Martins", phone: "24944443333", total: 39.9, status: "preparando" }
  ],
  customers: [
    { name: "Mariana Souza", phone: "24999990000", lastOrder: "2026-05-01", orders: 8, spent: 386.2 },
    { name: "Bruna Martins", phone: "24944443333", lastOrder: "2026-05-02", orders: 3, spent: 121.7 }
  ],
  conversations: [
    {
      customerName: "Cliente WhatsApp",
      phone: "24988887777",
      status: "open",
      step: "choosing",
      messages: [
        { from: "customer", text: "Oi, tem combo hoje?" },
        { from: "bot", text: "Temos Combo X Tudo + batata + refri por R$ 39,90. Quer pedir para entrega?" }
      ]
    }
  ]
};

const money = value => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const e = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function renderNav() {
  const items = [["dashboard", "Hoje"], ["orders", "Pedidos"], ["bot", "WhatsApp Bot"], ["customers", "Clientes"], ["billing", "Minha assinatura"]];
  document.getElementById("nav").innerHTML = items.map(([id, label]) => `<button class="${state.tab === id ? "active" : ""}" data-tab="${id}">${label}</button>`).join("");
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => setTab(button.dataset.tab)));
}

function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
  renderNav();
  const titles = {
    dashboard: ["Hoje no delivery", "Pedidos, vendas e situacao da loja."],
    orders: ["Pedidos", "Receba pedidos e avance o status."],
    bot: ["WhatsApp Bot", "Fluxo de atendimento automatico em demonstracao."],
    customers: ["Clientes", "Base demonstrativa de clientes."],
    billing: ["Cobranca", "Mensalidade e status da assinatura."]
  };
  document.getElementById("pageTitle").textContent = titles[tab][0];
  document.getElementById("pageSubtitle").textContent = titles[tab][1];
  render();
}

function renderDashboard() {
  const sales = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  document.getElementById("dashboard").innerHTML = `
    <div class="grid-3">
      <div class="card metric"><span>Vendas</span><strong>${money(sales)}</strong></div>
      <div class="card metric"><span>Pedidos</span><strong>${state.orders.length}</strong></div>
      <div class="card metric"><span>Clientes</span><strong>${state.customers.length}</strong></div>
    </div>
    <div class="card">
      <h2>Loja conectada</h2>
      <p>Lanchonete Demo Pereque - Plano Venda Mais - vencimento 2026-05-11</p>
      <div class="row">
        <button class="btn primary" data-action="tab" data-tab-target="orders">Criar pedido</button>
        <button class="btn" data-action="tab" data-tab-target="billing">Ver assinatura</button>
      </div>
    </div>
  `;
}

function renderOrders() {
  document.getElementById("orders").innerHTML = `
    <div class="grid-2">
      <form class="card stack" id="orderForm">
        <h2>Novo pedido</h2>
        <label>Cliente<input name="customerName" required></label>
        <label>Telefone<input name="phone" required></label>
        <label>Itens<textarea name="items" required>Combo X Tudo + batata + refri</textarea></label>
        <label>Total<input name="total" type="number" step="0.01" value="39.90" required></label>
        <button class="btn primary">Simular pedido</button>
      </form>
      <div class="card">
        <h2>Fila de pedidos</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Status</th><th>Acao</th></tr></thead>
            <tbody>${state.orders.map(order => `
              <tr>
                <td>${e(order.id)}</td>
                <td>${e(order.customerName)}<br><small>${e(order.phone)}</small></td>
                <td>${money(order.total)}</td>
                <td><span class="pill">${e(order.status)}</span></td>
                <td><button class="btn" data-action="advance-order" data-id="${e(order.id)}">Avancar</button></td>
              </tr>
            `).join("")}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.getElementById("orderForm").addEventListener("submit", event => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.target).entries());
    state.orders.unshift({
      id: `ord_demo_${state.orders.length + 1}`,
      customerName: body.customerName,
      phone: body.phone,
      total: Number(body.total),
      status: "recebido"
    });
    toast("Pedido simulado na demo.");
    renderOrders();
  });
}

function renderBot() {
  document.getElementById("bot").innerHTML = `
    <div class="grid-2">
      <form class="card stack" id="botForm">
        <h2>Simular mensagem do WhatsApp</h2>
        <label>Mensagem recebida<textarea name="text" required>Boa noite, quero ver o cardapio</textarea></label>
        <button class="btn primary">Enviar para o bot</button>
      </form>
      <div class="card">
        <h2>Conversas</h2>
        <div class="stack">
          ${state.conversations.map(chat => `
            <div class="card">
              <h3>${e(chat.customerName)}</h3>
              <p>${e(chat.phone)} - <span class="pill">${e(chat.status)}</span> - etapa: ${e(chat.step)}</p>
              <div class="chat-box">
                ${chat.messages.map(message => `
                  <div class="bubble ${e(message.from)}">
                    <strong>${message.from === "customer" ? "Cliente" : "Bot"}</strong>
                    <span>${e(message.text)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  document.getElementById("botForm").addEventListener("submit", event => {
    event.preventDefault();
    const text = new FormData(event.target).get("text");
    state.conversations[0].messages.push({ from: "customer", text });
    state.conversations[0].messages.push({ from: "bot", text: "Esse e o cardapio demo: Combo X Tudo, Marmita executiva, Acai 500ml e Pizza brotinho." });
    toast("Resposta simulada.");
    renderBot();
  });
}

function renderCustomers() {
  document.getElementById("customers").innerHTML = `
    <div class="card">
      <h2>Clientes salvos automaticamente</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Cliente</th><th>Telefone</th><th>Ultima compra</th><th>Pedidos</th><th>Total</th></tr></thead>
          <tbody>${state.customers.map(customer => `
            <tr>
              <td>${e(customer.name)}</td>
              <td>${e(customer.phone)}</td>
              <td>${e(customer.lastOrder)}</td>
              <td>${customer.orders}</td>
              <td>${money(customer.spent)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderBilling() {
  document.getElementById("billing").innerHTML = `
    <div class="grid-2">
      <div class="card">
        <h2>Minha assinatura</h2>
        <p>Plano Venda Mais - mensalidade R$ 147,00 - vencimento 2026-05-11</p>
        <p>Status: <span class="pill active">Ativo</span></p>
      </div>
      <div class="card">
        <h2>Pix da loja</h2>
        <p>Chave cadastrada: <strong>24999990000</strong></p>
      </div>
    </div>
  `;
}

function render() {
  if (state.tab === "dashboard") renderDashboard();
  if (state.tab === "orders") renderOrders();
  if (state.tab === "bot") renderBot();
  if (state.tab === "customers") renderCustomers();
  if (state.tab === "billing") renderBilling();
}

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("appView").classList.remove("hidden");
  setTab("dashboard");
});

document.getElementById("logoutBtn").addEventListener("click", () => location.reload());

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "tab") setTab(button.dataset.tabTarget);
  if (button.dataset.action === "advance-order") {
    const order = state.orders.find(item => item.id === button.dataset.id);
    if (order) order.status = order.status === "recebido" ? "preparando" : "entregue";
    renderOrders();
  }
});
