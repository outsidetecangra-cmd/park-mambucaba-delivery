const products = [
  {
    id: "pizza-calabresa",
    category: "pizzas",
    name: "Pizza Calabresa Grande",
    description: "Mussarela, calabresa fatiada, cebola, azeitona e orégano. Serve 3 a 4 pessoas.",
    price: 54.9,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pizza-frango-catupiry",
    category: "pizzas",
    name: "Pizza Frango com Catupiry Grande",
    description: "Frango temperado, catupiry, mussarela, milho, azeitona e orégano.",
    price: 59.9,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pizza-portuguesa",
    category: "pizzas",
    name: "Pizza Portuguesa Grande",
    description: "Presunto, ovos, cebola, pimentão, mussarela, azeitona e orégano.",
    price: 62.9,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pizza-marguerita",
    category: "pizzas",
    name: "Pizza Marguerita Grande",
    description: "Mussarela, tomate, manjericão fresco, parmesão e molho artesanal.",
    price: 56.9,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "brotinho-mussarela",
    category: "brotinhos",
    name: "Brotinho de Mussarela",
    description: "Pizza individual com mussarela, molho da casa, tomate e orégano.",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "brotinho-calabresa",
    category: "brotinhos",
    name: "Brotinho de Calabresa",
    description: "Pizza individual com calabresa, mussarela, cebola e azeitona.",
    price: 26.9,
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "calzone-frango",
    category: "calzones",
    name: "Calzone de Frango com Catupiry",
    description: "Massa fechada e assada com frango, catupiry, mussarela e milho.",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "calzone-quatro-queijos",
    category: "calzones",
    name: "Calzone Quatro Queijos",
    description: "Mussarela, provolone, parmesão, catupiry e orégano.",
    price: 36.9,
    image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "coca-2l",
    category: "bebidas",
    name: "Coca-Cola 2L",
    description: "Refrigerante 2 litros bem gelado para acompanhar a pizza.",
    price: 14.0,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "guarana-2l",
    category: "bebidas",
    name: "Guaraná 2L",
    description: "Refrigerante 2 litros gelado.",
    price: 12.0,
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "borda-catupiry",
    category: "adicionais",
    name: "Borda Recheada de Catupiry",
    description: "Adicional de borda recheada para pizzas grandes.",
    price: 8.0,
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "molho-alho",
    category: "adicionais",
    name: "Molho de Alho da Casa",
    description: "Molho cremoso artesanal para acompanhar pizzas e calzones.",
    price: 3.5,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=900&q=80"
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
    cartItems.innerHTML = `<p class="empty-cart">Seu carrinho está vazio.</p>`;
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
    "Novo pedido pelo cardápio online:",
    "",
    `Cliente: ${formData.get("name")}`,
    `Telefone: ${formData.get("phone")}`,
    `Endereço: ${formData.get("address")}`,
    `Pagamento: ${formData.get("payment")}`,
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
