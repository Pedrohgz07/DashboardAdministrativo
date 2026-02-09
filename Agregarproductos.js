const form = document.getElementById('product-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    title: title.value,
    price: Number(price.value),
    brand: brand.value,
    category: category.value,
    stock: Number(stock.value),
    description: description.value
  };

  if (!product.title || product.price <= 0) {
    alert('Datos inválidos');
    return;
  }

  await request('/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  alert('Producto agregado (simulado)');
  form.reset();
});