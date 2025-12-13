// ARC International Seva - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const backToTopBtn = document.getElementById('backToTop');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-menu') && 
                !event.target.closest('.mobile-menu-btn') && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Handle mobile dropdowns
        const dropdownParents = document.querySelectorAll('.nav-menu li:has(.dropdown) > a');
        dropdownParents.forEach(parent => {
            parent.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const dropdown = this.nextElementSibling;
                    dropdown.classList.toggle('active');
                    
                    // Rotate icon
                    const icon = this.querySelector('.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = dropdown.classList.contains('active') 
                            ? 'rotate(180deg)' 
                            : 'rotate(0deg)';
                    }
                }
            });
        });
    }

    // Back to Top Button
    window.addEventListener('scroll', function() {
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                } else {
                    field.style.borderColor = '#cbd5e0';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && !validateEmail(emailField.value)) {
                emailField.style.borderColor = 'red';
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation
            const phoneField = this.querySelector('input[type="tel"]');
            if (phoneField && !validatePhone(phoneField.value)) {
                phoneField.style.borderColor = 'red';
                alert('Please enter a valid phone number.');
                return;
            }
            
            // Show success message
            showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
            
            // Here you would normally send data to a server
            console.log('Form submitted:', formObject);
            
            // Reset form
            this.reset();
        });
    }

    // Newsletter Subscription
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would send the email to your server
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            this.reset();
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu) {
                        navMenu.classList.remove('active');
                        body.classList.remove('no-scroll');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                }
            }
        });
    });

    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === '')) {
            link.classList.add('active');
        }
    });

    // Initialize animations for elements with fade-in class
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements to animate
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.classList.add('loading');
        }
        img.addEventListener('load', function() {
            this.classList.remove('loading');
        });
    });
});

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\D/g, ''));
}

function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--primary-color);
        }
        .notification.success {
            border-left-color: #48bb78;
        }
        .notification.error {
            border-left-color: #f56565;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .notification-content i {
            font-size: 1.5rem;
        }
        .notification.success .notification-content i {
            color: #48bb78;
        }
        .notification.error .notification-content i {
            color: #f56565;
        }
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-light);
            font-size: 1.2rem;
            margin-left: 15px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }
    }, 5000);
}

// Product Manager for future enhancements
const ProductManager = {
    products: [],
    
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            this.products = await response.json();
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    },
    
    filterByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(product => product.category === category);
    },
    
    searchProducts(query) {
        return this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }
};

// Initialize on window load
window.addEventListener('load', function() {
    // Add loaded class to body for transitions
    document.body.classList.add('loaded');
    
    // Initialize any external libraries
    if (typeof Swiper !== 'undefined') {
        // Initialize Swiper sliders if needed
        const swiper = new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
            },
        });
    }
});
