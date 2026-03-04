const products = [
  {
    id: 1,
    name: "Es Kopi Susu",
    price: 18000,
    image: "assets/images/kopi.jpg"
  },
  {
    id: 2,
    name: "Matcha Latte",
    price: 22000,
    image: "assets/images/matcha.jpg"
  },
  {
    id: 3,
    name: "Jus Jeruk Fresh",
    price: 15000,
    image: "assets/images/jus.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");
const payBtn = document.getElementById("pay-btn");
const paymentStatus = document.getElementById("payment-status");

function renderProducts() {
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">Rp ${product.price.toLocaleString()}</p>
      <input type="number" min="1" value="1" class="qty">
      <button class="add-btn">Tambah</button>
    `;

    card.querySelector(".add-btn")
      .addEventListener("click", () => addToCart(product, card));

    productList.appendChild(card);
  });
}

function addToCart(product, card) {
  const qty = parseInt(card.querySelector(".qty").value);

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart();
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} (${item.qty}) - Rp ${subtotal.toLocaleString()}
      <button class="remove-btn">X</button>
    `;

    li.querySelector(".remove-btn")
      .addEventListener("click", () => removeItem(index));

    cartList.appendChild(li);
  });

  totalPrice.innerText = `Total: Rp ${total.toLocaleString()}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

payBtn.addEventListener("click", () => {
  const method = document.getElementById("payment-method").value;

  if (cart.length === 0) {
    paymentStatus.style.color = "red";
    paymentStatus.innerText = "Keranjang kosong.";
    return;
  }

  if (!method) {
    paymentStatus.style.color = "red";
    paymentStatus.innerText = "Pilih metode pembayaran.";
    return;
  }

  paymentStatus.style.color = "#fbc531";
  paymentStatus.innerText = "Memproses pembayaran...";

  setTimeout(() => {
    paymentStatus.style.color = "#4cd137";
    paymentStatus.innerText = "Pembayaran berhasil. Terima kasih!";
    cart = [];
    saveCart();
    renderCart();
  }, 2000);
});

renderProducts();
renderCart();
