import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// This module syncs the Firebase Auth state with the global UI (handled by script.js via localStorage)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.displayName || 'Queen');
        localStorage.setItem('userEmail', user.email);
    } else {
        // User is signed out
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    }

    // Trigger any UI updates if necessary (though updateNavigation runs on load)
    // If you're on a page and log in/out, you might need a page refresh or a manual call.
});
