// assets/js/main.js (replace existing file)

// --- loadProducts: try relative candidates ---
async function loadProducts() {
  const candidates = [
    'data/products.json',       // typical for root pages
    './data/products.json',
    '../data/products.json'     // if called from pages/products/
  ];

  for (const path of candidates) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('not ok');
      const products = await res.json();
      return products;
    } catch (err) {
      // try next candidate
    }
  }
  console.error('Could not load products.json from any path.');
  return [];
}

// --- helper: determine base path for asset resolution ---
function assetBasePath() {
  // If current pathname includes '/products/' we need to go up one level
  const path = window.location.pathname || '';
  // For GitHub pages the repo name might be present; check for '/products/'
  if (path.includes('/products/')) return '../';
  // otherwise root
  return '';
}

// --- create a product card, resolving image path properly ---
function createProductCard(p){
  const base = assetBasePath();             // '' or '../'
  // Ensure we point to assets/img/<filename>
  const safeImage = String(p.image || '').replace(/^\/+/, ''); // remove leading slash if any
  const imgSrc = `${base}assets/img/${safeImage}`;

  const div = document.createElement('div');
  div.className = 'col-md-4';
  div.innerHTML = `
    <div class="card p-3 h-100">
      <img src="${imgSrc}" alt="${p.name}" class="product-img mb-3 w-100" loading="lazy">
      <h5>${p.name}</h5>
      <div class="mb-2"><span class="badge-cat">${p.category}</span></div>
      <p class="mb-2 text-truncate">${p.description}</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="product-price">₹ ${p.price}</div>
        <a href="${base}products/product-template.html?id=${p.id}" class="btn btn-outline-primary btn-sm">View</a>
      </div>
    </div>
  `;
  return div;
}

async function renderFeatured(){
  const featuredEl = document.getElementById('featured');
  if(!featuredEl) return;
  const products = await loadProducts();
  const categories = [];
  for(const p of products){
    if(!categories.includes(p.category)) categories.push(p.category);
    if(categories.length >= 3) break;
  }
  if(categories.length === 0){
    featuredEl.innerHTML = '<div class="col-12">No categories found.</div>';
    return;
  }
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card p-4 text-center h-100">
        <h5 class="mb-2">${cat}</h5>
        <p class="mb-3">High quality ${cat.toLowerCase()} sourced from trusted suppliers.</p>
        <a href="products/index.html" class="btn btn-sm btn-primary">Explore ${cat}</a>
      </div>
    `;
    featuredEl.appendChild(card);
  });
}

async function renderProductList(){
  const container = document.getElementById('productList');
  if(!container) return;
  const products = await loadProducts();
  if(products.length === 0){
    container.innerHTML = '<div class="col-12">No products yet. Edit <code>data/products.json</code> to add products.</div>';
    return;
  }
  products.forEach(p => container.appendChild(createProductCard(p)));
}

function getQueryParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function renderProductDetail(){
  const container = document.getElementById('productDetail');
  if(!container) return;
  const id = getQueryParam('id');
  const products = await loadProducts();
  const p = products.find(x => String(x.id) === String(id));
  if(!p){
    container.innerHTML = `<div class="col-12"><div class="alert alert-warning">Product not found. <a href="index.html">Back to products</a></div></div>`;
    return;
  }

  const base = assetBasePath();
  const safeImage = String(p.image || '').replace(/^\/+/, '');
  const imgSrc = `${base}assets/img/${safeImage}`;

  container.innerHTML = `
    <div class="col-md-6">
      <img src="${imgSrc}" alt="${p.name}" class="product-img w-100 mb-3" loading="lazy">
    </div>
    <div class="col-md-6">
      <h1>${p.name}</h1>
      <div class="mb-2"><span class="badge-cat">${p.category}</span></div>
      <p>${p.description}</p>
      <p class="product-price mb-2">₹ ${p.price}</p>
      <p><strong>Packaging:</strong> ${p.packaging || 'Standard'}</p>
      <p><strong>Minimum Order Qty:</strong> ${p.moq || 'Contact for MOQ'}</p>
      <p><strong>Certifications:</strong> ${p.certifications ? p.certifications.join(', ') : 'N/A'}</p>
      <a class="btn btn-primary" href="../contact.html">Request Quote</a>
    </div>
  `;
}

// initialize
document.addEventListener('DOMContentLoaded', async () => {
  await renderFeatured();
  await renderProductList();
  await renderProductDetail();
});
