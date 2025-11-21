// App: loads products, renders UI, handles filtering/sorting and search
const PRODUCTS_JSON = 'data/products.json';
const productsEl = document.getElementById('products');
const template = document.getElementById('product-template');
const filterBrand = document.getElementById('filter-brand');
const sortBy = document.getElementById('sort-by');
const searchInput = document.getElementById('search');

let products = [];
let filtered = [];

function formatPrice(cents, currency='USD'){
  return (cents/100).toLocaleString(undefined, {style:'currency', currency});
}

function renderProducts(list){
  productsEl.innerHTML = '';
  if(!list.length){
    productsEl.innerHTML = '<p class="muted">No products found.</p>';
    return;
  }
  list.forEach(p => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector('.product');
    article.querySelector('img').src = p.images.length ? p.images[0] : '../public/images/placeholder.png';
    article.querySelector('img').alt = p.title;
    article.querySelector('.product-title').textContent = p.title;
    article.querySelector('.price').textContent = formatPrice(p.price_cents, p.currency);
    article.querySelector('.desc').textContent = p.description;
    const addBtn = article.querySelector('.add-to-cart');
    addBtn.addEventListener('click', () => {
      Cart.addItem(p.id, 1);
      updateCartCount();
    });
    productsEl.appendChild(node);
  });
}

function populateBrands(){
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    filterBrand.appendChild(opt);
  });
}

function applyFilters(){
  const brand = filterBrand.value;
  const sort = sortBy.value;
  const q = searchInput.value.trim().toLowerCase();
  filtered = products.filter(p => {
    if(brand && p.brand !== brand) return false;
    if(q){
      const hay = (p.title + ' ' + p.brand + ' ' + (p.tags||[]).join(' ')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  if(sort === 'price-asc') filtered.sort((a,b)=>a.price_cents-b.price_cents);
  if(sort === 'price-desc') filtered.sort((a,b)=>b.price_cents-a.price_cents);
  renderProducts(filtered);
}

function updateCartCount(){
  document.getElementById('cart-count').textContent = Cart.count();
}

async function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const res = await fetch(PRODUCTS_JSON);
  products = await res.json();
  populateBrands();
  applyFilters();
  updateCartCount();

  filterBrand.addEventListener('change', applyFilters);
  sortBy.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', ()=>{ applyFilters(); });

  // Cart drawer toggles
  document.getElementById('cart-toggle').addEventListener('click', ()=> {
    document.getElementById('cart-drawer').setAttribute('aria-hidden','false');
    renderCartItems();
  });
  document.getElementById('close-cart').addEventListener('click', ()=> {
    document.getElementById('cart-drawer').setAttribute('aria-hidden','true');
  });
  document.getElementById('clear-cart').addEventListener('click', ()=> { Cart.clear(); renderCartItems(); updateCartCount(); });
  document.getElementById('checkout').addEventListener('click', ()=> {
    const items = Cart.items();
    if(!items.length){ alert('Your cart is empty'); return; }
    document.getElementById('checkout-message').textContent = 'Demo checkout: order recorded locally. Implement Stripe for real payments.';
    Cart.clear();
    renderCartItems();
    updateCartCount();
  });
}

function renderCartItems(){
  const el = document.getElementById('cart-items');
  el.innerHTML = '';
  const items = Cart.items();
  if(!items.length){ el.innerHTML = '<p class="muted">No items in cart.</p>'; document.getElementById('cart-subtotal').textContent = formatPrice(0); return; }
  let subtotal = 0;
  items.forEach(ci => {
    const p = products.find(x=>x.id===ci.id) || {title:ci.id, images:[], price_cents:0, currency:'USD'};
    subtotal += p.price_cents * ci.qty;
    const node = document.createElement('div');
    node.className = 'cart-item';
    node.innerHTML = `
      <img src="${p.images[0] || '../public/images/placeholder.png'}" alt="${p.title}" />
      <div style="flex:1">
        <div style="font-weight:600">${p.title}</div>
        <div class="muted small">${formatPrice(p.price_cents,p.currency)} × ${ci.qty}</div>
      </div>
      <div class="qty-controls">
        <button class="btn small dec">-</button>
        <div class="small qty">${ci.qty}</div>
        <button class="btn small inc">+</button>
        <button class="btn small rem" style="margin-left:8px">Remove</button>
      </div>
    `;
    const dec = node.querySelector('.dec');
    const inc = node.querySelector('.inc');
    const rem = node.querySelector('.rem');
    dec.addEventListener('click', ()=>{ Cart.update(ci.id, Math.max(0, ci.qty-1)); renderCartItems(); updateCartCount(); });
    inc.addEventListener('click', ()=>{ Cart.update(ci.id, ci.qty+1); renderCartItems(); updateCartCount(); });
    rem.addEventListener('click', ()=>{ Cart.remove(ci.id); renderCartItems(); updateCartCount(); });
    el.appendChild(node);
  });
  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
}

init();
