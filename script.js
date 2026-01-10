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

        // Multi-Step Service Selection with Sub-services
        const serviceCards = document.querySelectorAll('.service-select-card');
        const subServiceItems = document.querySelectorAll('.sub-service-item');

        serviceCards.forEach(card => {
            card.addEventListener('click', function () {
                const category = this.getAttribute('data-category');
                const subList = document.getElementById(`sub-${category}`);

                // If already active, just collapse
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    if (subList) subList.classList.remove('active');
                    return;
                }

                // Collapse all others
                serviceCards.forEach(c => c.classList.remove('active'));
                document.querySelectorAll('.sub-services-list').forEach(list => list.classList.remove('active'));

                // Expand this one
                this.classList.add('active');
                if (subList) subList.classList.add('active');

                // Scroll to the list for better mobile experience
                setTimeout(() => {
                    subList.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });

        subServiceItems.forEach(item => {
            item.addEventListener('click', function () {
                // Clear all previous selections
                subServiceItems.forEach(i => i.classList.remove('selected'));
                serviceCards.forEach(c => c.classList.remove('selected'));

                // Select this item
                this.classList.add('selected');

                // Add "selected" to parent card for booking-handler compatibility
                const parentGroup = this.closest('.service-category-group');
                const parentCard = parentGroup.querySelector('.service-select-card');
                parentCard.classList.add('selected');
                parentCard.dataset.service = this.getAttribute('data-service');

                // Auto-advance to next step
                setTimeout(() => {
                    if (currentStep < bookingSteps.length - 1) {
                        currentStep++;
                        updateBooking();
                    }
                }, 600);
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

        // ===================================
        // Booking Page Cart Integration
        // ===================================
        const bookingSelectedServices = document.getElementById('bookingSelectedServices');
        const cartItemsList = document.getElementById('cartItemsList');
        const bookingTotal = document.getElementById('bookingTotal');

        if (bookingSelectedServices && cartItemsList) {
            let cart = JSON.parse(localStorage.getItem('beautyQueensCart')) || [];

            function updateBookingPageUI() {
                if (cart.length > 0) {
                    bookingSelectedServices.style.display = 'block';
                    cartItemsList.innerHTML = '';
                    let total = 0;

                    cart.forEach((item, index) => {
                        total += parseInt(item.price);
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'booking-cart-item';
                        itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);';
                        itemDiv.innerHTML = `
                            <div>
                                <span style="display: block; font-weight: 500;">${item.name}</span>
                                <span style="color: var(--color-rose); font-size: 0.9rem;">₹${parseInt(item.price).toLocaleString('en-IN')}</span>
                            </div>
                            <button class="remove-booking-item" data-index="${index}" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.1rem; padding: 0.3rem;">✕</button>
                        `;
                        cartItemsList.appendChild(itemDiv);
                    });

                    bookingTotal.innerText = '₹' + total.toLocaleString('en-IN');

                    // Stylist Selection Logic for Cart Section
                    const miniStylistCards = document.querySelectorAll('.stylist-card-mini');
                    miniStylistCards.forEach(miniCard => {
                        miniCard.addEventListener('click', function () {
                            miniStylistCards.forEach(c => c.classList.remove('selected'));
                            this.classList.add('selected');

                            // Sync with main stylist selection cards
                            const stylist = this.dataset.stylist;
                            const mainCard = document.querySelector(`.stylist-card[data-stylist="${stylist}"]`);
                            if (mainCard) {
                                document.querySelectorAll('.stylist-card').forEach(c => c.classList.remove('selected'));
                                mainCard.classList.add('selected');
                            }
                        });
                    });

                    // Modify Cart Proceed Button Behavior
                    const cartProceedBtn = document.getElementById('cartProceedBtn');
                    if (cartProceedBtn) {
                        cartProceedBtn.onclick = function () {
                            const selectedMiniStylist = document.querySelector('.stylist-card-mini.selected');
                            if (!selectedMiniStylist) {
                                alert('Please select a stylist before proceeding ✨');
                                return;
                            }

                            // Jump to Step 3
                            currentStep = 2;
                            updateBooking();
                        };
                    }

                    // Add remove listeners for booking page
                    document.querySelectorAll('.remove-booking-item').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const index = parseInt(this.getAttribute('data-index'));
                            cart.splice(index, 1);
                            localStorage.setItem('beautyQueensCart', JSON.stringify(cart));
                            updateBookingPageUI();
                        });
                    });
                } else {
                    bookingSelectedServices.style.display = 'none';
                }
            }

            updateBookingPageUI();
        }
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
    const checkboxes = document.querySelectorAll('.checkbox-input');
    if (checkboxes.length === 0) return;

    const cartBadge = document.getElementById('cartBadge');
    const floatingCart = document.getElementById('floatingCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const modalTotal = document.getElementById('modalTotal');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('beautyQueensCart')) || [];

    function updateCartUI() {
        let total = 0;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center" style="padding: 2rem; color: #999;">Your cart is empty 👑</p>';
            cartBadge.innerText = '₹0';
            floatingCart.classList.remove('has-items');
            modalTotal.innerText = '₹0';
            return;
        }

        cart.forEach((item, index) => {
            total += parseInt(item.price);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee;';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name" style="font-weight: 500; display: block;">${item.name}</span>
                    <span class="cart-item-price" style="color: var(--color-rose); font-weight: bold;">₹${parseInt(item.price).toLocaleString('en-IN')}</span>
                </div>
                <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.2rem; padding: 0.5rem;" title="Remove">🗑️</button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Update badge and modal
        cartBadge.innerText = '₹' + (total / 1000).toFixed(1) + 'K';
        floatingCart.classList.add('has-items');
        modalTotal.innerText = '₹' + total.toLocaleString('en-IN');

        // Add remove listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const removedItem = cart[index];
                cart.splice(index, 1);

                // Uncheck corresponding checkbox if it exists on page
                const checkbox = document.querySelector(`.checkbox-input[data-id="${removedItem.id}"]`);
                if (checkbox) checkbox.checked = false;

                saveCart();
                updateCartUI();
            });
        });
    }

    function saveCart() {
        localStorage.setItem('beautyQueensCart', JSON.stringify(cart));
    }

    // Initialize checkboxes from cart
    checkboxes.forEach(box => {
        const id = box.getAttribute('data-id');
        if (cart.find(item => item.id === id)) {
            box.checked = true;
        }

        box.addEventListener('change', function () {
            const id = this.getAttribute('data-id');
            const name = this.parentElement.textContent.trim();
            const price = this.getAttribute('data-price');

            if (this.checked) {
                if (!cart.find(item => item.id === id)) {
                    cart.push({ id, name, price });
                }
            } else {
                cart = cart.filter(item => item.id !== id);
            }
            saveCart();
            updateCartUI();
        });
    });

    // Cart click to show modal
    floatingCart.addEventListener('click', function () {
        updateCartUI();
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (closeModal) {
        closeModal.onclick = function () {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        };
    }

    if (cartModal) {
        cartModal.onclick = function (e) {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };
    }

    // Initial UI update
    updateCartUI();
});

/* ===================================
   Authentication Pages Logic
   =================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Note: Login and Signup logic moved to individual module handlers (login-handler.js, signup-handler.js)
    // and integrates with Firebase.


    // ===================================
    // Authentication State Management
    // ===================================

    // Check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Log out user
    function logoutUser() {
        // Clear local storage (UI fallback)
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        // Firebase logout will be handled by auth state observer if we can trigger it
        // Since we can't easily import auth here, we'll suggest a refresh or rely on observer.
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

    // ===================================
    // Password Visibility Toggle
    // ===================================
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈'; // Hide icon
            } else {
                input.type = 'password';
                this.textContent = '👁️'; // Show icon
            }
        });
    });

});
