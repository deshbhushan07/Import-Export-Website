// assets/js/main.js
// Lightweight site JS to load product data and render pages

async function loadProducts() {
  try {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error('Failed to fetch products.json');
    const products = await res.json();
    return products;
  } catch (err) {
    // Try relative fallback if hosted from subfolder (GitHub Pages)
    try {
      const res2 = await fetch('../data/products.json');
      if (!res2.ok) throw err;
      const products2 = await res2.json();
      return products2;
    } catch (e) {
      console.error('Could not load products.json', e);
      return [];
    }
  }
}

function createProductCard(p){
  const div = document.createElement('div');
  div.className = 'col-md-4';
  div.innerHTML = `
    <div class="card p-3 h-100">
      <img src="${p.image}" alt="${p.name}" class="product-img mb-3 w-100">
      <h5>${p.name}</h5>
      <div class="mb-2"><span class="badge-cat">${p.category}</span></div>
      <p class="mb-2 text-truncate">${p.description}</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="product-price">₹ ${p.price}</div>
        <a href="product-template.html?id=${p.id}" class="btn btn-outline-primary btn-sm">View</a>
      </div>
    </div>
  `;
  return div;
}

async function renderFeatured(){
  const featuredEl = document.getElementById('featured');
  if(!featuredEl) return;
  const products = await loadProducts();
  // pick unique categories instead of items: show first 3 categories
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
  container.innerHTML = `
    <div class="col-md-6">
      <img src="${p.image}" alt="${p.name}" class="product-img w-100 mb-3">
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

// Initialize appropriate renders depending on the page
document.addEventListener('DOMContentLoaded', async () => {
  await renderFeatured();
  await renderProductList();
  await renderProductDetail();
});
