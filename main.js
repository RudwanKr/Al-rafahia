// ========================================
// TOY STORE LANDING PAGE - MAIN JAVASCRIPT
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ====== SMOOTH SCROLLING ======
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a hash link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    
                    // Smooth scroll to target
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ====== STICKY HEADER ON SCROLL ======
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ====== MOBILE MENU TOGGLE ======
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change icon
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // ====== SCROLL ANIMATIONS ======
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // ====== NEWSLETTER FORM ======
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (email && isValidEmail(email)) {
            // Show success message
            showMessage('شكراً لاشتراكك! سنرسل لك آخر العروض قريباً.', 'success');
            
            // Clear input
            emailInput.value = '';
        } else {
            showMessage('الرجاء إدخال بريد إلكتروني صحيح', 'error');
        }
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show message function
    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #14B8A6)' : 'linear-gradient(135deg, #EF4444, #DC2626)'};
            color: white;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    
    // ====== PRODUCT IMAGE CAROUSELS ======
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const carousel = card.querySelector('.product-image-carousel');
        const imagesContainer = card.querySelector('.product-images');
        const images = card.querySelectorAll('.product-image');
        const dotsContainer = card.querySelector('.product-carousel-dots');
        
        if (!carousel || !imagesContainer || images.length <= 1) return;
        
        let currentIndex = 0;
        let autoScrollInterval;
        
        // Create dots
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('product-carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `صورة ${index + 1}`);
            
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
                resetAutoScroll();
            });
            
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.product-carousel-dot');
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            const offset = index * 100;
            imagesContainer.style.transform = `translateX(${offset}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            goToSlide(currentIndex);
        }
        
        // Auto scroll
        function startAutoScroll() {
            autoScrollInterval = setInterval(nextSlide, 5000); // Change image every 3 seconds
        }
        
        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }
        
        // Pause on hover
        card.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        card.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
        
        // Start auto scroll
        startAutoScroll();
        
        // Pause when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(autoScrollInterval);
            } else {
                startAutoScroll();
            }
        });
    });
    
    // ====== BRANCH CARD INTERACTIONS ======
    const branchCards = document.querySelectorAll('.branch-card');
    
    branchCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ====== PARALLAX EFFECT FOR HERO SHAPES ======
    const heroShapes = document.querySelectorAll('.shape');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // ====== ACTIVE NAV LINK ON SCROLL ======
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - header.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ====== BUTTON RIPPLE EFFECT ======
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ====== LOADING ANIMATION ======
    // Add a simple loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    console.log('🧸 الرفاهية للألعاب - Landing Page Loaded Successfully!');
});
