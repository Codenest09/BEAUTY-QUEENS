import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsAgree = document.getElementById('terms-agree').checked;

        // Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!termsAgree) {
            alert('Please agree to the Terms & Conditions');
            return;
        }

        try {
            // 1. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile with Name
            await updateProfile(user, { displayName: name });

            // 3. Store additional data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                phone: phone,
                createdAt: new Date().toISOString()
            });

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = '✓ Account created successfully! Redirecting...';
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
            signupForm.appendChild(successMsg);

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error("Signup error:", error);
            alert("Error: " + error.message);
        }
    });
});
