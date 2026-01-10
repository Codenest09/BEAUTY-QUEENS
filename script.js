// ===================================
// BEAUTY QUEENS - Interactive Features
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===================================
    // Testimonial Slider
    // ===================================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (testimonialTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        const testimonials = testimonialTrack.querySelectorAll('.testimonial-card');
        const totalSlides = testimonials.length;

        function updateSlider() {
            const slideWidth = testimonials[0].offsetWidth;
            const style = window.getComputedStyle(testimonialTrack);
            const gap = parseFloat(style.gap) || 0;
            const offset = -currentSlide * (slideWidth + gap);
            testimonialTrack.style.transform = `translateX(${offset}px)`;
        }

        nextBtn.addEventListener('click', function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', function () {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // Auto-play slider
        setInterval(function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);

        // Update on resize to fix pixel values
        window.addEventListener('resize', updateSlider);
    }

    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Scroll Animations (Intersection Observer)
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .info-item, .feature-card').forEach(el => {
        observer.observe(el);
    });

    // ===================================
    // Gallery Lightbox (if on gallery page)
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="" class="lightbox-img">
        <button class="lightbox-prev">‹</button>
        <button class="lightbox-next">›</button>
      </div>
    `;
        document.body.appendChild(lightbox);

        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => item.querySelector('img'));

        function showLightboxImage(index) {
            const img = lightbox.querySelector('.lightbox-img');
            img.src = images[index].src;
            img.alt = images[index].alt;
            currentIndex = index;
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function () {
                lightbox.classList.add('active');
                showLightboxImage(index);
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showLightboxImage(currentIndex);
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % images.length;
            showLightboxImage(currentIndex);
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ===================================
    // Form Validation (Contact & Booking)
    // ===================================
    const forms = document.querySelectorAll('form:not(#loginForm):not(#signupForm)');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });

            // Email validation
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    emailInput.style.borderColor = 'red';
                }
            }

            // Phone validation
            const phoneInput = form.querySelector('input[type="tel"]');
            if (phoneInput && phoneInput.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(phoneInput.value)) {
                    isValid = false;
                    phoneInput.style.borderColor = 'red';
                }
            }

            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = '✓ Your request has been submitted successfully!';
                successMsg.style.cssText = `
          background: linear-gradient(135deg, #FFB6C9, #E6D5E8);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
          font-weight: 600;
        `;

                form.appendChild(successMsg);
                form.reset();

                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            } else {
                // Show error message
                alert('Please fill in all required fields correctly.');
            }
        });
    });

    // ===================================
    // Booking System Multi-Step (if on booking page)
    // ===================================
    const bookingSteps = document.querySelectorAll('.booking-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.querySelector('.progress-fill');

    if (bookingSteps.length > 0) {
        let currentStep = 0;

        function updateBooking() {
            bookingSteps.forEach((step, index) => {
                if (index === currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            // Update progress bar
            if (progressBar) {
                const progress = ((currentStep + 1) / bookingSteps.length) * 100;
                progressBar.style.width = progress + '%';
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        nextButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                if (currentStep < bookingSteps.length - 1) {
                    currentStep++;
                    updateBooking();
                }
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                if (currentStep > 0) {
                    currentStep--;
                    updateBooking();
                }
            });
        });

        // Service selection
        const serviceCards = document.querySelectorAll('.service-select-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', function () {
                serviceCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');

                // Auto-advance to next step
                setTimeout(() => {
                    if (currentStep < bookingSteps.length - 1) {
                        currentStep++;
                        updateBooking();
                    }
                }, 500); // 500ms delay for visual feedback
            });
        });

        // Stylist selection
        const stylistCards = document.querySelectorAll('.stylist-card');
        stylistCards.forEach(card => {
            card.addEventListener('click', function () {
                stylistCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');

                // Auto-advance to next step
                setTimeout(() => {
                    if (currentStep < bookingSteps.length - 1) {
                        currentStep++;
                        updateBooking();
                    }
                }, 500); // 500ms delay for visual feedback
            });
        });

        // Time slot selection
        const timeSlotCards = document.querySelectorAll('.time-slot-card');
        const selectedTimeInput = document.getElementById('selected-time');

        timeSlotCards.forEach(card => {
            card.addEventListener('click', function () {
                // Remove selected class from all cards
                timeSlotCards.forEach(c => c.classList.remove('selected'));

                // Add selected to clicked card
                this.classList.add('selected');

                // Update hidden input with selected time
                const timeValue = this.getAttribute('data-time');
                if (selectedTimeInput) {
                    selectedTimeInput.value = timeValue;
                }

                // Add a nice pulse animation
                this.style.animation = 'selected-pulse 0.6s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            });
        });
    }

    // ===================================
    // Add Active State to Current Page Navigation
    // ===================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});

// ===================================
// Utility Functions
// ===================================

// Add floating animation to elements
function addFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// Call on page load
window.addEventListener('load', function () {
    addFloatingAnimation('.hero-floral, .floral-bg');
});

/* ===================================
   Estimator Page Logic
   =================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Only run if on estimator page
    const checkboxes = document.querySelectorAll('.checkbox-input');
    if (checkboxes.length === 0) return;

    const cartBadge = document.getElementById('cartBadge');
    const floatingCart = document.getElementById('floatingCart');

    function calculateTotal() {
        let total = 0;
        checkboxes.forEach(box => {
            if (box.checked) {
                total += parseInt(box.getAttribute('data-price'));
            }
        });
        // Update cart badge
        if (total > 0) {
            cartBadge.innerText = '₹' + (total / 1000).toFixed(1) + 'K';
            floatingCart.classList.add('has-items');
        } else {
            cartBadge.innerText = '₹0';
            floatingCart.classList.remove('has-items');
        }
    }

    checkboxes.forEach(box => {
        box.addEventListener('change', calculateTotal);
    });

    // Cart click to show modal with selected items
    floatingCart.addEventListener('click', function () {
        if (floatingCart.classList.contains('has-items')) {
            const cartItemsContainer = document.getElementById('cartItems');
            const modalTotal = document.getElementById('modalTotal');
            const cartModal = document.getElementById('cartModal');
            const closeModal = document.getElementById('closeModal');

            cartItemsContainer.innerHTML = '';
            let total = 0;

            checkboxes.forEach(box => {
                if (box.checked) {
                    const price = parseInt(box.getAttribute('data-price'));
                    total += price;
                    const label = box.parentElement.textContent.trim();

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = '<span class="cart-item-name">' + label + '</span><span class="cart-item-price">₹' + price.toLocaleString('en-IN') + '</span>';
                    cartItemsContainer.appendChild(itemDiv);
                }
            });

            modalTotal.innerText = '₹' + total.toLocaleString('en-IN');
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            closeModal.onclick = function () {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            };

            cartModal.onclick = function (e) {
                if (e.target === cartModal) {
                    cartModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            };
        }
    });
});

/* ===================================
   Authentication Pages Logic
   =================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const identifier = document.getElementById('login-identifier').value;
            const password = document.getElementById('login-password').value;

            // Basic validation
            if (!identifier || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Email or Phone validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;

            const isEmail = emailRegex.test(identifier);
            const isPhone = phoneRegex.test(identifier) && identifier.replace(/\D/g, '').length >= 10;

            if (!isEmail && !isPhone) {
                alert('Please enter a valid email address or mobile number');
                return;
            }

            // Show success message
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

            // Store user login state
            let userName = 'Queen';
            let userEmail = '';

            if (isEmail) {
                userName = identifier.split('@')[0];
                userEmail = identifier;
            } else {
                userName = 'User ' + identifier.slice(-4);
                userEmail = identifier; // Store phone as email identifier for now
            }

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);

            // Simulate redirect (in real app, this would authenticate with backend)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
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

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Password validation
            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Terms agreement
            if (!termsAgree) {
                alert('Please agree to the Terms & Conditions');
                return;
            }

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = '✓ Account created successfully! Redirecting to login...';
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

            // Store user login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);

            // Simulate redirect (in real app, this would create account on backend)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // ===================================
    // Authentication State Management
    // ===================================

    // Check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Log out user
    function logoutUser() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        alert('✓ You have been logged out successfully!');
        window.location.href = 'index.html';
    }

    // Update navigation based on auth state
    function updateNavigation() {
        const loginLinks = document.querySelectorAll('a[href="login.html"]');

        if (loginLinks.length > 0 && isUserLoggedIn()) {
            const userName = localStorage.getItem('userName') || 'Queen';

            loginLinks.forEach(loginLink => {
                // Replace Login with Logout
                loginLink.textContent = `Logout (${userName})`;
                loginLink.href = '#';
                loginLink.classList.add('logout-link');

                loginLink.onclick = (e) => {
                    e.preventDefault();
                    logoutUser();
                };
            });
        }
    }

    // Initialize navigation on page load
    updateNavigation();
});
