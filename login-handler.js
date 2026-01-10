import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const identifier = document.getElementById('login-identifier').value; // Could be email or phone (logic below)
        const password = document.getElementById('login-password').value;

        if (!identifier || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            // Note: Firebase Auth primarily uses email/password. 
            // If the user entered a phone number, we would need a different flow (Phone Auth) 
            // or a mapping. For now, we'll assume identifier is email to keep it simple with Firebase.
            // In a more advanced setup, we'd query Firestore to find the email associated with the phone number.

            let email = identifier;
            if (!identifier.includes('@')) {
                // Potential phone number - in a real app, you'd fetch the email from Firestore here
                alert("Login with phone number requires additional backend mapping. Please use your email address for now.");
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = '✓ Login successful! Redirecting...';
            successMsg.style.cssText = `
                background: linear-gradient(135deg, #FFB6C9, #E6D5E8);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: center;
                font-weight: 600;
                animation: fadeIn 0.5s ease;
            `;
            loginForm.appendChild(successMsg);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            alert("Error: " + error.message);
        }
    });
});
