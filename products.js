import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyD9UlTCC7QjZXnhruo-VtLjmnQgF8Pbuv8",
    authDomain: "quiz-app-ea723.firebaseapp.com",
    projectId: "quiz-app-ea723",
    storageBucket: "quiz-app-ea723.firebasestorage.app",
    messagingSenderId: "724625799620",
    appId: "1:724625799620:web:4e2ab0bd4a0f5246784c91",
    measurementId: "G-ZH5Z3NXZYQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let isDeleting = false; 

const productCards = document.getElementById("productCards");
const updateModal = document.getElementById("updateModal");
const updateForm = document.getElementById("updateForm");
let currentProductId = null;

updateModal.style.display = "none";

async function fetchProducts() {
    try {
        productCards.innerHTML = ""; 

        const querySnapshot = await getDocs(collection(db, "products"));

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.setAttribute('data-id', doc.id); 

            card.innerHTML = `
                <h2>${product.productName}</h2>
                <p>Category: ${product.category}</p>
                <p>Price: $${product.price}</p>
                <div class="actions">
                    <button onclick="openModal('${doc.id}', '${product.productName}', '${product.category}', ${product.price})">Update</button>
                    <button onclick="deleteProduct('${doc.id}')">Delete</button>
                </div>
            `;
            productCards.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

window.deleteProduct = async (id) => {
    if (isDeleting) return;

    isDeleting = true;

    try {
        const deleteButton = document.querySelector(`[data-id="${id}"]`).querySelector("button");
        if (deleteButton) deleteButton.disabled = true;

        await deleteDoc(doc(db, "products", id));

        const productCard = document.querySelector(`[data-id="${id}"]`);
        if (productCard) productCard.remove();

        console.log("Product deleted successfully!");

    } catch (error) {
        console.error("Error deleting product:", error);
    } finally {
        isDeleting = false;
    }
};

window.onload = () => {
    updateModal.style.display = "none";
    updateModal.style.visibility = "hidden";
    updateModal.style.opacity = 0;
};

window.openModal = (id, name, category, price) => {
    currentProductId = id;

    if (updateModal.style.display === "flex") return;

    document.getElementById("updateProductName").value = name;
    document.getElementById("updateCategory").value = category;
    document.getElementById("updatePrice").value = price;

    updateModal.style.display = "flex";
    setTimeout(() => {
        updateModal.style.visibility = "visible";
        updateModal.style.opacity = 1;
    }, 10);

    document.getElementById("updateForm").querySelector('button[type="submit"]').disabled = false;
};

window.closeModal = () => {
    updateModal.style.opacity = 0;
    updateModal.style.visibility = "hidden";
    setTimeout(() => {
        updateModal.style.display = "none";
    }, 300);
};

updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = document.getElementById("updateForm").querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const updatedName = document.getElementById("updateProductName").value;
    const updatedCategory = document.getElementById("updateCategory").value;
    const updatedPrice = parseFloat(document.getElementById("updatePrice").value);

    try {
        await updateDoc(doc(db, "products", currentProductId), {
            productName: updatedName,
            category: updatedCategory,
            price: updatedPrice,
        });

        console.log("Product updated successfully!");
        closeModal();
        fetchProducts();
    } catch (error) {
        console.error("Error updating product:", error);
    } finally {
        submitButton.disabled = false;
    }
});

fetchProducts();
