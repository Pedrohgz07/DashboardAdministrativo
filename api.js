const API_URL = "https://dummyjson.com/products";

let skip = 0;
const limit = 10;
let currentPage = 1;
let totalProducts = 0;

let currentMode = "all";
let currentValue = "";

const tableBody = document.getElementById("productsTable");
const pageInfo = document.getElementById("pageInfo");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const loadProducts = () => {
    let url = "";

    if (currentMode === "all") {
        url = `${API_URL}?limit=${limit}&skip=${skip}`;
    }

    if (currentMode === "search") {
        url = `${API_URL}/search?q=${currentValue}&limit=${limit}&skip=${skip}`;
    }

    if (currentMode === "category") {
        url = `${API_URL}/category/${currentValue}?limit=${limit}&skip=${skip}`;
    }

    if (sortSelect.value) {
        const [campo, orden] = sortSelect.value.split("-");
        url += `&sortBy=${campo}&order=${orden}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            totalProducts = data.total;
            renderTable(data.products);
            updatePagination();
        })
        .catch(err => console.error("Error al cargar productos", err));
};

const renderTable = (products) => {
    tableBody.innerHTML = "";

    products.forEach(p => {
        tableBody.innerHTML += `
            <tr id="row-${p.id}">
                <td>${p.id}</td>
                <td><img src="${p.thumbnail}" alt="${p.title}"></td>
                <td>${p.title}</td>
                <td>$${p.price}</td>
                <td>${p.category}</td>
                <td>
                    <a href="add-product.html?action=edit&id=${p.id}">
                        <i class="fi fi-sr-pencil"></i>
                    </a>
                    <button onclick="deleteProduct(${p.id})">
                        <i class="fi fi-sr-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
};

const updatePagination = () => {
    pageInfo.textContent = `Página ${currentPage}`;
    prevBtn.disabled = skip === 0;
    nextBtn.disabled = skip + limit >= totalProducts;
};

prevBtn.onclick = () => {
    if (skip === 0) return;
    skip -= limit;
    currentPage--;
    loadProducts();
};

nextBtn.onclick = () => {
    if (skip + limit >= totalProducts) return;
    skip += limit;
    currentPage++;
    loadProducts();
};

searchBtn.onclick = () => {
    const q = searchInput.value.trim();
    if (!q) return;

    currentMode = "search";
    currentValue = q;
    skip = 0;
    currentPage = 1;
    loadProducts();
};

categorySelect.onchange = () => {
    if (!categorySelect.value) {
        currentMode = "all";
    } else {
        currentMode = "category";
        currentValue = categorySelect.value;
    }

    skip = 0;
    currentPage = 1;
    loadProducts();
};

sortSelect.onchange = () => {
    skip = 0;
    currentPage = 1;
    loadProducts();
};

window.deleteProduct = (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmDelete) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
            document.getElementById(`row-${id}`).remove();
            alert("Producto eliminado correctamente (simulación)");
        })
        .catch(err => console.error("Error al eliminar producto", err));
};

const loadCategories = () => {
    fetch(`${API_URL}/category-list`)
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat;
                opt.textContent = cat;
                categorySelect.appendChild(opt);
            });
        })
        .catch(err => console.error("Error al cargar categorías", err));
};


loadCategories();
loadProducts();