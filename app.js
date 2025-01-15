import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

var firebaseConfig = {
    apiKey: "AIzaSyD9UlTCC7QjZXnhruo-VtLjmnQgF8Pbuv8",
    authDomain: "quiz-app-ea723.firebaseapp.com",
    projectId: "quiz-app-ea723",
    storageBucket: "quiz-app-ea723.firebasestorage.app",
    messagingSenderId: "724625799620",
    appId: "1:724625799620:web:4e2ab0bd4a0f5246784c91",
    measurementId: "G-ZH5Z3NXZYQ"
};

var app = initializeApp(firebaseConfig);
var db = getFirestore(app);

var productForm = document.getElementById("productForm");
var productList = document.getElementById("productList");

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    var productName = document.getElementById("productName").value;
    var category = document.getElementById("category").value;
    var price = parseFloat(document.getElementById("price").value);

    try {
        await addDoc(collection(db, "products"), {
            productName,
            category,
            price,
        });

        console.log("Product added successfully!");
        productForm.reset();
        fetchProducts();
    } catch (error) {
        console.error("Error adding product: ", error);
    }
});

async function fetchProducts() {
    productList.innerHTML = "";
try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const li = document.createElement("li");

        li.innerHTML = `
            <span>Name: ${product.productName}, Category: ${product.category}, Price: $${product.price}</span>
            <div class="actions">
                <i class="fas fa-edit" onclick="updateProduct('${doc.id}', '${product.productName}', '${product.category}', ${product.price})"></i>
                <i class="fas fa-trash" onclick="deleteProduct('${doc.id}')"></i>
            </div>
        `;
        productList.appendChild(li);
    });
} catch (error) {
    console.error("Error fetching products: ", error);
}

}


window.deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, "products", id));
        console.log("Product deleted successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product: ", error);
    }
};

window.updateProduct = async (id, currentName, currentCategory, currentPrice) => {
    var newName = prompt("Enter new name:", currentName) || currentName;
    var newCategory = prompt("Enter new category:", currentCategory) || currentCategory;
    var newPrice = parseFloat(prompt("Enter new price:", currentPrice)) || currentPrice;

    try {
        await updateDoc(doc(db, "products", id), {
            productName: newName,
            category: newCategory,
            price: newPrice,
        });
        console.log("Product updated successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error updating product: ", error);
    }
};

fetchProducts();
