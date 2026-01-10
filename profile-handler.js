import { auth, db } from './firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const activityList = document.querySelector('.activity-list');
    const logoutBtn = document.getElementById('logoutBtn');

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
            return;
        }

        // 1. Fetch User Profile Data from Firestore
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (profileName) profileName.textContent = userData.name || user.displayName || 'Beauty Queen';
                if (profileEmail) profileEmail.textContent = userData.email || user.email;
                if (profilePhone) profilePhone.textContent = userData.phone || '+91 - Not Set';
            } else {
                // Fallback to Auth data if doc doesn't exist
                if (profileName) profileName.textContent = user.displayName || 'Beauty Queen';
                if (profileEmail) profileEmail.textContent = user.email;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }

        // 2. Fetch Booking History
        try {
            const bookingsQuery = query(
                collection(db, "bookings"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(bookingsQuery);

            if (activityList) {
                // Clear loading state/mock data
                activityList.innerHTML = '';

                if (querySnapshot.empty) {
                    activityList.innerHTML = '<li class="activity-item"><p>No bookings found yet. Ready for your first glow up? ✨</p></li>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const booking = doc.data();
                        const date = new Date(booking.date).toLocaleDateString();

                        const li = document.createElement('li');
                        li.className = 'activity-item';
                        li.innerHTML = `
                            <span class="activity-icon">📅</span>
                            <div class="activity-text">
                                <h4>${booking.service.charAt(0).toUpperCase() + booking.service.slice(1)} Appointment</h4>
                                <p>${date} at ${booking.time} - Status: ${booking.status}</p>
                            </div>
                        `;
                        activityList.appendChild(li);
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            if (activityList) {
                activityList.innerHTML = '<li class="activity-item"><p>Error loading activity. Please try again later.</p></li>';
            }
        }
    });

    // Logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                // Auth observer will handle local storage cleanup
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout error:", error);
                alert("Error logging out: " + error.message);
            }
        });
    }
});
