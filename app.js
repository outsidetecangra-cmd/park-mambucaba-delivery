const products = [
  {
    id: "xtudo",
    category: "lanches",
    name: "X-Tudo da Casa",
    description: "Hamburguer, presunto, queijo, ovo, bacon, alface, tomate, milho, batata palha e molho especial.",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "combo-xtudo",
    category: "combos",
    name: "Combo X-Tudo + Batata + Refri",
    description: "X-tudo completo, batata frita crocante e refrigerante lata a sua escolha.",
    price: 39.9,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "xbacon",
    category: "lanches",
    name: "X-Bacon",
    description: "Hamburguer artesanal, queijo derretido, bacon crocante, salada e molho da casa.",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "batata",
    category: "combos",
    name: "Batata Frita Grande",
    description: "Porcao grande de batata frita sequinha, ideal para dividir.",
    price: 18.0,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "coca",
    category: "bebidas",
    name: "Coca-Cola Lata",
    description: "Refrigerante lata 350ml bem gelado.",
    price: 7.0,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "guarana",
    category: "bebidas",
    name: "Guarana Lata",
    description: "Refrigerante lata 350ml, gelado para acompanhar o lanche.",
    price: 6.5,
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "acai",
    category: "sobremesas",
    name: "Acai 500ml Completo",
    description: "Acai com banana, leite em po, granola, leite condensado e morango.",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pudim",
    category: "sobremesas",
    name: "Pudim da Casa",
    description: "Fatia de pudim cremoso com calda de caramelo.",
    price: 9.9,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80"
  }
];

const cart = new Map();
let selectedCategory = "todos";

const money = value => Number(value || 0).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2400);
}

function visibleProducts() {
  if (selectedCategory === "todos") return products;
  return products.filter(product => product.category === selectedCategory);
}

function renderProducts() {
  document.getElementById("productGrid").innerHTML = visibleProducts().map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-actions">
          <strong>${money(product.price)}</strong>
          <button type="button" data-add="${product.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function cartTotal() {
  return [...cart.values()].reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function renderCart() {
  const items = [...cart.values()];
  const cartItems = document.getElementById("cartItems");

  if (!items.length) {
    cartItems.innerHTML = `<p class="empty-cart">Seu carrinho esta vazio.</p>`;
  } else {
    cartItems.innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.product.name}</strong>
          <span>${money(item.product.price)} cada</span>
        </div>
        <div class="quantity">
          <button type="button" data-dec="${item.product.id}">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-inc="${item.product.id}">+</button>
        </div>
      </div>
    `).join("");
  }

  document.getElementById("cartTotal").textContent = money(cartTotal());
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const current = cart.get(productId);
  cart.set(productId, { product, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  toast(`${product.name} adicionado ao pedido.`);
}

function changeQuantity(productId, delta) {
  const current = cart.get(productId);
  if (!current) return;
  const nextQuantity = current.quantity + delta;
  if (nextQuantity <= 0) {
    cart.delete(productId);
  } else {
    current.quantity = nextQuantity;
  }
  renderCart();
}

function buildOrderMessage(formData) {
  const lines = [...cart.values()].map(item => {
    const subtotal = item.product.price * item.quantity;
    return `- ${item.quantity}x ${item.product.name}: ${money(subtotal)}`;
  });

  return [
    "Novo pedido pelo cardapio online:",
    "",
    `Cliente: ${formData.get("name")}`,
    `Telefone: ${formData.get("phone")}`,
    `Endereco: ${formData.get("address")}`,
    "",
    "Itens:",
    ...lines,
    "",
    `Total: ${money(cartTotal())}`
  ].join("\n");
}

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach(item => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const incButton = event.target.closest("[data-inc]");
  const decButton = event.target.closest("[data-dec]");

  if (addButton) addToCart(addButton.dataset.add);
  if (incButton) changeQuantity(incButton.dataset.inc, 1);
  if (decButton) changeQuantity(decButton.dataset.dec, -1);
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.size) {
    toast("Adicione pelo menos um item ao pedido.");
    return;
  }

  const formData = new FormData(event.target);
  const message = encodeURIComponent(buildOrderMessage(formData));
  window.open(`https://wa.me/5524999990000?text=${message}`, "_blank", "noopener");
});

renderProducts();
renderCart();
