import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    // Listen for auth state
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // Pre-fill form if possible
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            if (nameInput && !nameInput.value) nameInput.value = user.displayName || '';
            if (emailInput && !emailInput.value) emailInput.value = user.email || '';
        }
    });

    const confirmBtn = document.getElementById('confirmBtn');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Get booking data
        const service = document.querySelector('.service-select-card.selected')?.dataset.service;
        const stylist = document.querySelector('.stylist-card.selected')?.dataset.stylist;
        const date = document.getElementById('date').value;
        const time = document.getElementById('selected-time').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const notes = document.getElementById('notes').value;

        if (!service || !stylist || !date || !time || !name || !phone || !email) {
            alert('Please complete all booking steps and contact details.');
            return;
        }

        try {
            // Save to Firestore
            await addDoc(collection(db, "bookings"), {
                userId: currentUser ? currentUser.uid : 'guest',
                service,
                stylist,
                date,
                time,
                clientName: name,
                clientPhone: phone,
                clientEmail: email,
                notes,
                status: 'pending',
                timestamp: serverTimestamp()
            });

            // Navigate to confirmation step
            // This relies on the global currentStep and updateBooking being available
            // but since those are in script.js and we are in a module, 
            // we might need to trigger a custom event or use the DOM directly.

            const bookingSteps = document.querySelectorAll('.booking-step');
            bookingSteps.forEach(step => step.classList.remove('active'));
            document.getElementById('confirmation').classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Booking error:", error);
            alert("Error saving booking: " + error.message);
        }
    });
});
