import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

var firebaseConfig = {
    apiKey: "AIzaSyD9UlTCC7QjZXnhruo-VtLjmnQgF8Pbuv8",
    authDomain: "quiz-app-ea723.firebaseapp.com",
    projectId: "quiz-app-ea723",
    storageBucket: "quiz-app-ea723.firebasestorage.app",
    messagingSenderId: "724625799620",
    appId: "1:724625799620:web:4e2ab0bd4a0f5246784c91",
    measurementId: "G-ZH5Z3NXZYQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);

    const submitButton = document.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        await addDoc(collection(db, "products"), { productName, category, price });

        console.log("Product added successfully!");
        e.target.reset(); 
        fetchProducts();
    } catch (error) {
        console.error("Error adding product:", error);
    } finally {
        submitButton.disabled = false;
    }
});
