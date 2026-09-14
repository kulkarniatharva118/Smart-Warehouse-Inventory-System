const API_URL = "https://smart-warehouse-inventory-system.onrender.com/products";

const productsTableBody = document.getElementById("productsTableBody");
const message = document.getElementById("message");

const totalProductsElement = document.getElementById("totalProducts");
const totalStockElement = document.getElementById("totalStock");
const lowStockElement = document.getElementById("lowStock");
const inventoryValueElement = document.getElementById("inventoryValue");

const refreshButton = document.getElementById("refreshButton");
const productForm = document.getElementById("productForm");
const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearchButton");
const sortProducts = document.getElementById("sortProducts");
const exportCsvButton = document.getElementById("exportCsvButton");
const formMessage = document.getElementById("formMessage");
const mobileToggle = document.getElementById("mobileToggle");
const sidebar = document.getElementById("sidebar");
// Edit modal elements
const editModal = document.getElementById("editModal");
const closeEditModalButton = document.getElementById("closeEditModal");
const cancelEditButton = document.getElementById("cancelEditButton");
const editProductForm = document.getElementById("editProductForm");
const editFormMessage = document.getElementById("editFormMessage");

const editProductIdInput = document.getElementById("editProductId");
const editNameInput = document.getElementById("editName");
const editSkuInput = document.getElementById("editSku");
const editCategoryInput = document.getElementById("editCategory");
const editPriceInput = document.getElementById("editPrice");
const editStockQuantityInput = document.getElementById("editStockQuantity");

let allProducts = [];

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function readResponse(response) {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            message: text
        };
    }
}

function getProductStock(product) {
    return Number(product.quantity ?? product.stockQuantity ?? 0);
}
function showMessage(text, type = "info") {
    message.textContent = text;
    message.className = `message message-${type}`;
}

function showFormMessage(text, type = "info") {
    formMessage.textContent = text;
    formMessage.className = `form-message form-message-${type}`;
}


// /* ---------------- Mobile Sidebar Navigation Toggle ---------------- */

// if (mobileToggle && sidebar) {
//     mobileToggle.addEventListener("click", () => {
//         const isHidden = sidebar.style.display === "none";
//         sidebar.style.display = isHidden ? "flex" : "none";
//     });
// }



/* ---------------- Navigation ---------------- */

const navigationButtons = document.querySelectorAll("[data-section]");
const navButtons = document.querySelectorAll(".nav-button");
const pageSections = document.querySelectorAll(".page-section");

navigationButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetSection = button.dataset.section;

        pageSections.forEach(section => {
            section.classList.add("hidden");
        });

        const target = document.getElementById(targetSection);

        if (target) {
            target.classList.remove("hidden");
        }

        navButtons.forEach(navButton => {
            navButton.classList.toggle(
                "active",
                navButton.dataset.section === targetSection
            );
        });

        if (targetSection === "products" && allProducts.length === 0) {
            loadProducts();
        }
    });
});

/* ---------------- Load Products ---------------- */

async function loadProducts() {
    showMessage("Loading products...", "info");

    try {
        const response = await fetch(API_URL);

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `Backend returned status ${response.status}`
            );
        }

        const products = Array.isArray(data)
            ? data
            : data.content || [];

        allProducts = products;

        displayLowStockProducts(allProducts);
        displayProducts(allProducts);
        updateStatistics(allProducts);

        showMessage(
            `${products.length} product(s) loaded successfully.`,
            "success"
        );

    } catch (error) {
        console.error("Frontend error:", error);

        allProducts = [];

        displayProducts([]);
        displayLowStockProducts([]);
        updateStatistics([]);

        showMessage(
            "Unable to load products. Check whether the backend is running.",
            "error"
        );
    }
}

/* ---------------- Display Products ---------------- */

function displayProducts(products) {
    productsTableBody.innerHTML = "";

    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-cell">
                    <p>No products found in inventory catalog.</p>
                </td>
            </tr>
        `;

        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");

        const stock = getProductStock(product);
        
        let stockBadgeHtml = "";
        if (stock === 0) {
            stockBadgeHtml = `<span class="stock-badge out-of-stock">Out of Stock (${stock})</span>`;
        } else if (stock <= 10) {
            stockBadgeHtml = `<span class="stock-badge low-stock">Low Stock (${stock})</span>`;
        } else {
            stockBadgeHtml = `<span class="stock-badge in-stock">In Stock (${stock})</span>`;
        }

        const categoryHtml = product.category
            ? `<span class="product-category-badge">${escapeHtml(product.category)}</span>`
            : `<span style="color: var(--muted); font-size: 13px;">Uncategorized</span>`;

        const price = Number(product.price ?? 0);

        const formattedPrice = price.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        row.innerHTML = `
            <td class="product-id-cell">#${escapeHtml(product.id ?? "-")}</td>
            <td class="product-name-cell">${escapeHtml(product.name ?? "-")}</td>
            <td><span class="product-sku-cell">${escapeHtml(product.sku ?? "-")}</span></td>
            <td>${categoryHtml}</td>
            <td class="price-cell">₹${formattedPrice}</td>
            <td>${stockBadgeHtml}</td>

            <td>
                <div class="action-buttons">

                    <button
                        class="action-button edit-button"
                        onclick="editProduct(${product.id})"
                        title="Edit product details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        Edit
                    </button>

                    <div class="stock-actions">
                        <button
                            class="action-button stock-minus-button"
                            onclick="changeStock(${product.id}, -1)"
                            title="Decrease stock">
                            −
                        </button>

                        <button
                            class="action-button stock-button"
                            onclick="updateStock(${product.id})"
                            title="Enter stock quantity">
                            Stock
                        </button>

                        <button
                            class="action-button stock-plus-button"
                            onclick="changeStock(${product.id}, 1)"
                            title="Increase stock">
                            +
                        </button>
                    </div>

                    <button
                        class="action-button delete-button"
                        onclick="deleteProduct(${product.id})"
                        title="Delete product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                    </button>

                </div>
            </td>
        `;

        productsTableBody.appendChild(row);
    });
}

function getSortedProducts(products) {
    const sortValue = sortProducts?.value || "default";

    const sortedProducts = [...products];

    switch (sortValue) {
        case "nameAsc":
            return sortedProducts.sort((a, b) =>
                String(a.name || "").localeCompare(
                    String(b.name || "")
                )
            );

        case "nameDesc":
            return sortedProducts.sort((a, b) =>
                String(b.name || "").localeCompare(
                    String(a.name || "")
                )
            );

        case "priceLow":
            return sortedProducts.sort(
                (a, b) =>
                    Number(a.price ?? 0) -
                    Number(b.price ?? 0)
            );

        case "priceHigh":
            return sortedProducts.sort(
                (a, b) =>
                    Number(b.price ?? 0) -
                    Number(a.price ?? 0)
            );

        case "stockLow":
            return sortedProducts.sort(
                (a, b) =>
                    getProductStock(a) -
                    getProductStock(b)
            );

        case "stockHigh":
            return sortedProducts.sort(
                (a, b) =>
                    getProductStock(b) -
                    getProductStock(a)
            );

        default:
            return sortedProducts;
    }
}

/* ---------------- Statistics ---------------- */

function updateStatistics(products) {
    const totalProducts = products.length;

    const totalStock = products.reduce((sum, product) => {
        const stock = getProductStock(product);

        return sum + Number(stock);
    }, 0);

    const lowStock = products.filter(product => {
        const stock = getProductStock(product);

        return Number(stock) <= 10;
    }).length;

    const inventoryValue = products.reduce((sum, product) => {
        const price = Number(product.price ?? 0);
        const stock = getProductStock(product);

        return sum + (price * stock);
    }, 0);

    totalProductsElement.textContent =
        totalProducts.toLocaleString();

    totalStockElement.textContent =
        totalStock.toLocaleString();

    lowStockElement.textContent =
        lowStock.toLocaleString();

    if (inventoryValueElement) {
        inventoryValueElement.textContent =
            `₹${inventoryValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
    }
}

/* ---------------- Search Products ---------------- */

function searchProducts() {
    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = allProducts.filter(product => {
        const id = String(product.id || "").toLowerCase();
        const name = String(product.name || "").toLowerCase();
        const sku = String(product.sku || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();

        return (
            id.includes(searchText) ||
            name.includes(searchText) ||
            sku.includes(searchText) ||
            category.includes(searchText)
        );
    });

    const sortedProducts = getSortedProducts(filteredProducts);

    displayProducts(sortedProducts);

    message.textContent =
        `${sortedProducts.length} product(s) found.`;
}

/* ---------------- Delete Product ---------------- */

async function deleteProduct(productId) {
    const product = allProducts.find(
        product => String(product.id) === String(productId)
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE"
        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to delete product"
            );
        }

        alert("Product deleted successfully.");

        await loadProducts();

    } catch (error) {
        console.error("Delete error:", error);

        alert(error.message);
    }
}

/* ---------------- Add Product ---------------- */

productForm.addEventListener("submit", async event => {
    event.preventDefault();

    formMessage.textContent = "Adding product...";
    formMessage.style.color = "#4f46e5";
    formMessage.style.backgroundColor = "#eef2ff";

    const productData = {
        name: document.getElementById("name").value,
        sku: document.getElementById("sku").value,
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        quantity: Number(
            document.getElementById("stockQuantity").value
        )
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(productData)
        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to add product"
            );
        }

        formMessage.textContent =
            "Product added successfully.";

        formMessage.style.color = "#059669";
        formMessage.style.backgroundColor = "#ecfdf5";

        productForm.reset();

        await loadProducts();

    } catch (error) {
        console.error("Add product error:", error);

        formMessage.textContent = error.message;
        formMessage.style.color = "#dc2626";
        formMessage.style.backgroundColor = "#fef2f2";
    }
});

/* ---------------- Refresh Button ---------------- */

refreshButton.addEventListener("click", loadProducts);

searchInput.addEventListener("input", searchProducts);

if (sortProducts) {
    sortProducts.addEventListener("change", searchProducts);
}

clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";

    if (sortProducts) {
        sortProducts.value = "default";
    }

    displayProducts(allProducts);

    message.textContent =
        `${allProducts.length} product(s) loaded successfully.`;
});

function exportProductsToCsv() {
    if (allProducts.length === 0) {
        alert("There are no products to export.");
        return;
    }

    const headers = [
        "ID",
        "Name",
        "SKU",
        "Category",
        "Price",
        "Stock"
    ];

    const rows = allProducts.map(product => [
        product.id ?? "",
        product.name ?? "",
        product.sku ?? "",
        product.category ?? "",
        product.price ?? 0,
        getProductStock(product)
    ]);

    const csvContent = [
        headers,
        ...rows
    ]
        .map(row =>
            row
                .map(value =>
                    `"${String(value).replace(/"/g, '""')}"`
                )
                .join(",")
        )
        .join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "warehouse-products.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

if (exportCsvButton) {
    exportCsvButton.addEventListener(
        "click",
        exportProductsToCsv
    );
}

/* ---------------- Edit Product Modal ---------------- */

function openEditModal(productId) {
    const product = allProducts.find(
        product => product.id === productId
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    editProductIdInput.value = product.id;
    editNameInput.value = product.name ?? "";
    editSkuInput.value = product.sku ?? "";
    editCategoryInput.value = product.category ?? "";
    editPriceInput.value = product.price ?? 0;
    editStockQuantityInput.value = getProductStock(product);

    editFormMessage.textContent = "";
    editFormMessage.style.backgroundColor = "";
    editFormMessage.style.color = "";

    editModal.classList.remove("hidden");
    editModal.setAttribute("aria-hidden", "false");

    editNameInput.focus();
}

function closeEditModal() {
    editModal.classList.add("hidden");
    editModal.setAttribute("aria-hidden", "true");
    editProductForm.reset();

    editFormMessage.textContent = "";
    editFormMessage.style.backgroundColor = "";
    editFormMessage.style.color = "";
}

async function editProduct(productId) {
    openEditModal(productId);
}

editProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const productId = editProductIdInput.value;

    const name = editNameInput.value.trim();
    const sku = editSkuInput.value.trim();
    const category = editCategoryInput.value.trim();
    const price = Number(editPriceInput.value);
    const stockQuantity = Number(editStockQuantityInput.value);

    if (!name || !sku || !category) {
        editFormMessage.textContent =
            "Product name, SKU, and category are required.";

        editFormMessage.style.color = "var(--danger-dark)";
        editFormMessage.style.backgroundColor = "var(--danger-light)";
        return;
    }

    if (!Number.isFinite(price) || price < 0) {
        editFormMessage.textContent =
            "Please enter a valid non-negative price.";

        editFormMessage.style.color = "var(--danger-dark)";
        editFormMessage.style.backgroundColor = "var(--danger-light)";
        return;
    }

    if (
        !Number.isFinite(stockQuantity) ||
        stockQuantity < 0 ||
        !Number.isInteger(stockQuantity)
    ) {
        editFormMessage.textContent =
            "Stock must be a non-negative whole number.";

        editFormMessage.style.color = "var(--danger-dark)";
        editFormMessage.style.backgroundColor = "var(--danger-light)";
        return;
    }

    const duplicateSku = allProducts.some(product => {
        return (
            String(product.sku).toLowerCase() === sku.toLowerCase() &&
            String(product.id) !== String(productId)
        );
    });

    if (duplicateSku) {
        editFormMessage.textContent =
            "Another product already uses this SKU.";

        editFormMessage.style.color = "var(--danger-dark)";
        editFormMessage.style.backgroundColor = "var(--danger-light)";
        return;
    }

    const updatedProduct = {
        name: name,
        sku: sku,
        category: category,
        price: price,
        quantity: stockQuantity
    };

    editFormMessage.textContent = "Saving changes...";
    editFormMessage.style.color = "var(--primary)";
    editFormMessage.style.backgroundColor = "var(--primary-light)";

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedProduct)
        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to update product"
            );
        }

        editFormMessage.textContent =
            "Product updated successfully.";
        editFormMessage.style.color = "var(--success-dark)";
        editFormMessage.style.backgroundColor = "var(--success-light)";

        await loadProducts();

        setTimeout(() => {
            closeEditModal();
        }, 700);

    } catch (error) {
        console.error("Edit error:", error);

        editFormMessage.textContent = error.message;
        editFormMessage.style.color = "var(--danger-dark)";
        editFormMessage.style.backgroundColor = "var(--danger-light)";
    }
});

closeEditModalButton.addEventListener(
    "click",
    closeEditModal
);

cancelEditButton.addEventListener(
    "click",
    closeEditModal
);

editModal.addEventListener("click", event => {
    if (event.target === editModal) {
        closeEditModal();
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        !editModal.classList.contains("hidden")
    ) {
        closeEditModal();
    }
});

/* ---------------- Update Stock ---------------- */

async function updateStock(productId) {
    const product = allProducts.find(
        product => product.id === productId
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const currentStock =
        getProductStock(product);

    const stockInput = prompt(
        `Enter new stock quantity. Current stock: ${currentStock}`,
        currentStock
    );

    if (stockInput === null) {
        return;
    }

    const quantity = Number(stockInput);

    if (
        Number.isNaN(quantity) ||
        quantity < 0 ||
        !Number.isInteger(quantity)
    ) {
        alert("Stock must be a non-negative whole number.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${productId}/stock`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    quantity: quantity
                })
            }
        );

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to update stock"
            );
        }

        alert("Stock updated successfully.");

        await loadProducts();

    } catch (error) {
        console.error("Stock update error:", error);

        alert(error.message);
    }
}

/* ---------------- Increase / Decrease Stock ---------------- */

async function changeStock(productId, change) {
    const product = allProducts.find(
        product => product.id === productId
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const currentStock = getProductStock(product);
    const newStock = currentStock + change;

    if (newStock < 0) {
        alert("Stock cannot be negative.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${productId}/stock`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    quantity: newStock
                })
            }
        );

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to update stock"
            );
        }

        await loadProducts();

    } catch (error) {
        console.error("Stock change error:", error);
        alert(error.message);
    }
}

function displayLowStockProducts(products) {
    const lowStockList = document.getElementById("lowStockList");
    const lowStockCount = document.getElementById("lowStockCount");

    if (!lowStockList) {
        return;
    }

    const lowStockProducts = products.filter(product => {
        const stock = getProductStock(product);
        return stock >= 0 && stock <= 10;
    });

    if (lowStockCount) {
        lowStockCount.textContent = lowStockProducts.length;
    }

    if (lowStockProducts.length === 0) {
        lowStockList.innerHTML = `
            <p class="empty-message">No low-stock products</p>
        `;
        return;
    }

    lowStockList.innerHTML = lowStockProducts.map(product => {
        const stock = getProductStock(product);

        return `
            <div class="low-stock-item">
                <strong>${escapeHtml(product.name)}</strong>
                <span>SKU: ${escapeHtml(product.sku)}</span>
                <span class="stock-value">
                    ${stock} units left
                </span>
            </div>
        `;
    }).join("");
}

/* ---------------- Initial Load ---------------- */

loadProducts();