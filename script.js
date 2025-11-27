const sampleProducts = [
  {
    id: "tr-001",
    title: "G-SHOCK",
    desc: "Stainless steel case, sapphire crystal, automatic movement. A modern classic.",
    price: 29.99,
    img: "logo1.png"
  },
  {
    id: "tr-002",
    title: "CURREN BLACK",
    desc: "Black-dial masterpiece with leather strap and precision quartz movement.",
    price: 29.99,
    img: "logo2.png"
  },
  {
    id: "tr-003",
    title: "YAZOLE CLASSIC",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 29.99,
    img: "3.png"
  },
  {
    id: "tr-004",
    title: "NAVI CLASSIC",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "4.png"
  },
  {
    id: "tr-005",
    title: "CURREN WHITE",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "5.png"
  },
  {
    id: "tr-006",
    title: "CURREN BLACK",
    desc: "Ultralight titanium body built for endurance and refined performance.",
    price: 0,
    img: "6.png"
  },
  {
    id: "tr-007",
    title: "NAVI SILVER",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "7.png"
  },
  {
    id: "tr-008",
    title: "YAZOLE BLACK",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "8.png"
  },
  {
    id: "tr-009",
    title: "YAZOLE FULL BLACK",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "9.png"
  },
  {
    id: "tr-0010",
    title: "YAZOLE BROWN",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "10.png"
  },
  {
    id: "tr-011",
    title: "SEKMEI BLACK",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "11.png"
  },
  {
    id: "tr-012",
    title: "SEKMEI GREEN",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "12.png"
  },
  {
    id: "tr-013",
    title: "SEKMEI B",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "13.png"
  },
  {
    id: "tr-014",
    title: "SEKMEI G",
    desc: "Gold-plated bezel, Roman numerals, and luxurious finishing touches.",
    price: 0,
    img: "14.png"
  }
];

function $(q){return document.querySelector(q)}
function $all(q){return document.querySelectorAll(q)}

function formatPrice(v){ return '$' + v.toLocaleString(); }

function renderProducts(){
  const cont = $("#featuredProducts"); 
  cont.innerHTML = "";
  sampleProducts.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="price">${formatPrice(p.price)}</div>
      <div style="margin-top:12px;">
        <button class="btn" data-id="${p.id}" data-action="quick">Quick view</button>
        <button class="btn primary" data-id="${p.id}" data-action="add">Add to cart</button>
      </div>
    `;
    cont.appendChild(card);
  });
}

/* ----------------------------
    CART HANDLING
---------------------------- */

let cart = JSON.parse(localStorage.getItem('tr_cart')||"{}");

function updateCartCount(){
  const count = Object.values(cart).reduce((s,n)=>s+n,0);
  $("#cartCount").innerText = count;
  localStorage.setItem('tr_cart', JSON.stringify(cart));
}

/* ----------------------------
    FEATURED TOGGLE (FIXED)
---------------------------- */

function toggleFeatured() {
    const grid = document.getElementById("featuredProducts");
    const arrow = document.getElementById("toggleBtn");

    if (grid.classList.contains("hidden")) {
        grid.classList.remove("hidden");
        grid.classList.add("show");
        arrow.classList.add("down");
    } else {
        grid.classList.add("hidden");
        grid.classList.remove("show");
        arrow.classList.remove("down");
    }
}

/* ----------------------------
    CLICK EVENTS (FIXED)
---------------------------- */

document.addEventListener("click", (e)=>{

  if(e.target.id === "toggleBtn"){
    toggleFeatured();
  }

  else if(e.target.matches("[data-action='quick']")){
    const id = e.target.dataset.id;
    openModal(id);
  }

  else if(e.target.matches("[data-action='add']")){
    const id = e.target.dataset.id;
    addToCart(id);
  }

  else if(e.target.id==="closeModal" || e.target.id==="productModal"){
    closeModal();
  }

  else if(e.target.id==="cartBtn"){
    alert("Cart is a demo in this static site. Use Checkout to finalize (demo).");
  }

  else if(e.target.id==="addToCart"){
    const id = e.target.dataset.id;
    addToCart(id);
    closeModal();
  }

});

/* ----------------------------
    MODAL
---------------------------- */

function openModal(id){
  const p = sampleProducts.find(x=>x.id===id);
  if(!p) return;
  $("#modalTitle").innerText = p.title;
  $("#modalDesc").innerText = p.desc;
  $("#modalPrice").innerText = formatPrice(p.price);
  $("#modalImg").src = p.img;
  $("#addToCart").dataset.id = p.id;
  $("#productModal").setAttribute("aria-hidden","false");
}

function closeModal(){
  $("#productModal").setAttribute("aria-hidden","true");
}

/* ----------------------------
    CART ADD
---------------------------- */

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  updateCartCount();

  // Simple toast
  const old = document.getElementById('addedToast');
  if(old) old.remove();
  const t = document.createElement('div');
  t.id = 'addedToast';
  t.style.position='fixed';
  t.style.right='20px';
  t.style.bottom='20px';
  t.style.background='#111';
  t.style.padding='12px 16px';
  t.style.border='1px solid rgba(255,255,255,0.06)';
  t.style.borderRadius='8px';
  t.innerText='Added to cart';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

/* ----------------------------
    INIT
---------------------------- */

window.addEventListener('load',()=>{
  renderProducts();
  updateCartCount();
  document.getElementById('year').innerText = new Date().getFullYear();
});
document.querySelector(".btn-shop").addEventListener("click", () => {
    toggleFeatured(); 
});
