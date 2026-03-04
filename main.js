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
    
    // ====== REVIEWS SYSTEM ======
    const ratingLabels = ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'];

    // ---- Sample pre-loaded reviews ----
    let allReviews = [
        { name: 'سارة المطيري',    rating: 5, comment: 'متجر رائع! ألعاب آمنة وذات جودة عالية. أطفالي يحبون كل ما اشتريناه من هنا. خدمة العملاء ممتازة جداً.', date: '2026-02-28' },
        { name: 'محمد العتيبي',    rating: 5, comment: 'أفضل متجر ألعاب في المنطقة! التشكيلة واسعة والأسعار معقولة جداً. الفريق متعاون ويساعد دائماً في اختيار الأنسب.', date: '2026-02-25' },
        { name: 'نورة الشمري',     rating: 5, comment: 'مكان مميز للعثور على هدايا الأطفال. الألعاب التعليمية رائعة وقد لاحظت تطور مهارات بناتي بشكل واضح.', date: '2026-02-22' },
        { name: 'خالد الدوسري',    rating: 4, comment: 'تجربة ممتازة من البداية للنهاية. الموظفون محترفون ويفهمون احتياجات الأطفال. سأعود بالتأكيد.', date: '2026-02-20' },
        { name: 'فاطمة القحطاني',  rating: 5, comment: 'اشتريت مجموعة ألعاب تركيب لابني وكان مبهوراً بها. الجودة ممتازة والسعر مناسب جداً.', date: '2026-02-18' },
        { name: 'عبدالله الغامدي', rating: 4, comment: 'متجر منظم وجميل. الألعاب مرتبة بشكل احترافي حسب الفئة العمرية. سهّل علي الاختيار كثيراً.', date: '2026-02-15' },
        { name: 'منى البقمي',      rating: 5, comment: 'أجمل هدية أحضرتها لابنتي من هنا. الدمى والشخصيات الكرتونية موجودة بتشكيلات لا حصر لها.', date: '2026-02-12' },
        { name: 'تركي الحربي',     rating: 3, comment: 'المتجر جيد والمنتجات متنوعة، لكن أتمنى توسعة قسم الألعاب الإلكترونية. بشكل عام تجربة مقبولة.', date: '2026-02-10' },
        { name: 'رانيا السبيعي',   rating: 5, comment: 'تجربة تسوق ممتعة جداً! الموظفون ودودون وصبورون مع الأطفال. المتجر نظيف ومرتب.', date: '2026-02-08' },
        { name: 'حمد الرشيدي',    rating: 4, comment: 'ألعاب مضمونة وآمنة للأطفال. اشتريت ألعاب رضع لابني الصغير وكانت عالية الجودة.', date: '2026-02-06' },
        { name: 'لمى المالكي',     rating: 5, comment: 'متجر يستحق الزيارة بجدارة. الأسعار تنافسية مقارنة بالسوق والخدمة من الدرجة الأولى.', date: '2026-02-04' },
        { name: 'سعيد الزهراني',   rating: 5, comment: 'امتلك ثقة كاملة في منتجاتهم بعد أول زيارة. كل ألعابهم مطابقة لمعايير السلامة الدولية.', date: '2026-02-01' },
        { name: 'هند العسيري',     rating: 4, comment: 'فرعا المتجر في مواقع ممتازة وسهل الوصول إليهما. دائماً أجد ما أبحث عنه بسهولة.', date: '2026-01-29' },
        { name: 'وليد الجهني',     rating: 5, comment: 'اشتريت سيارات التحكم عن بُعد وكانت مذهلة! ابني لا يتوقف عن اللعب بها. شكراً الرفاهية!', date: '2026-01-27' },
        { name: 'أمل الثبيتي',     rating: 4, comment: 'خدمة استثنائية وتجربة تسوق مريحة. أنصح كل الأمهات بزيارة هذا المتجر.', date: '2026-01-25' },
        { name: 'راشد الشهراني',   rating: 5, comment: 'ألعاب فنية رائعة لأطفالي الذين يحبون الرسم والتلوين. محتوى تعليمي حقيقي.', date: '2026-01-22' },
        { name: 'دلال الفيفي',     rating: 3, comment: 'المنتجات جيدة لكن أسعار بعضها مرتفعة قليلاً مقارنة بالمنافسين. مع ذلك الجودة تبرر السعر.', date: '2026-01-20' },
        { name: 'بدر العمري',      rating: 5, comment: 'تجربة شراء متكاملة. الموقع الإلكتروني جميل والمتجر الفعلي أجمل. استمروا في التميز!', date: '2026-01-18' },
        { name: 'شيخة الحازمي',    rating: 5, comment: 'أولادي سعداء جداً بألعابهم الجديدة. الجودة تفوق التوقعات. سأكون زبوناً دائماً.', date: '2026-01-15' },
        { name: 'نايف السلمي',     rating: 4, comment: 'المتجر كبير ومنظم، والعاملون متحمسون لمساعدة العملاء. تجربة تسوق ممتعة.', date: '2026-01-12' },
        { name: 'إيمان الغانمي',   rating: 5, comment: 'أجود الألعاب التعليمية رأيتها في حياتي! أطفالنا يتعلمون وهم يلعبون. هذا هو الهدف.', date: '2026-01-10' },
        { name: 'عمر المعيقل',     rating: 4, comment: 'أتسوق من هنا منذ فترة طويلة ولم أشتكِ مرة واحدة. متجر موثوق ومنتجاته أصلية.', date: '2026-01-08' },
        { name: 'حنان الخثلان',    rating: 5, comment: 'زيارتي الأولى كانت رائعة وستكون لها متابعة! الفريق محترف ومتخصص، يعرفون ما يناسب كل طفل.', date: '2026-01-05' },
        { name: 'مشاري القرني',    rating: 5, comment: 'متجر الرفاهية وفي كل وعوده. أفضل هدية لأطفالنا هي من ألعاب آمنة ومتعة حقيقية!', date: '2026-01-02' },
    ];

    const REVIEWS_PER_PAGE = 6;
    let currentPage = 1;

    // ---- Render stars HTML ----
    function starsHTML(rating, size = '') {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<i class="fas fa-star${i <= rating ? '' : ' star-empty'}" ${size ? `style="font-size:${size}"` : ''}></i>`;
        }
        return html;
    }

    // ---- Format date ----
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // ---- Get initials ----
    function initials(name) {
        return name.trim().charAt(0);
    }

    // ---- Compute average ----
    function computeAvg() {
        if (!allReviews.length) return 0;
        return (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length);
    }

    // ---- Render summary bar ----
    function renderSummary() {
        const avg = computeAvg();
        document.getElementById('avgScore').textContent = avg.toFixed(1);
        document.getElementById('avgStars').innerHTML = starsHTML(Math.round(avg));
        document.getElementById('totalCount').textContent = `${allReviews.length} تقييم`;

        const barsEl = document.getElementById('reviewsBars');
        barsEl.innerHTML = '';
        for (let star = 5; star >= 1; star--) {
            const count = allReviews.filter(r => r.rating === star).length;
            const pct = allReviews.length ? Math.round((count / allReviews.length) * 100) : 0;
            const colorMap = { 5: '#51C348', 4: '#FCC819', 3: '#00B3E9', 2: '#E11F14', 1: '#9e1a14' };
            barsEl.innerHTML += `
                <div class="reviews-bar-row">
                    <span class="reviews-bar-label">${star} <i class="fas fa-star" style="color:${colorMap[star]};font-size:0.8rem;"></i></span>
                    <div class="reviews-bar-track">
                        <div class="reviews-bar-fill" style="width:${pct}%;background:${colorMap[star]};"></div>
                    </div>
                    <span class="reviews-bar-pct">${count}</span>
                </div>`;
        }
    }

    // ---- Avatar color pool ----
    const avatarColors = ['#E11F14','#00B3E9','#FCC819','#51C348','#9C27B0','#FF5722'];

    // ---- Render a single review card ----
    function reviewCardHTML(review, idx) {
        const colorIdx = (review.name.charCodeAt(0) + idx) % avatarColors.length;
        const color = avatarColors[colorIdx];
        return `
            <div class="review-card" style="animation-delay:${(idx % REVIEWS_PER_PAGE) * 0.07}s">
                <div class="review-card-header">
                    <div class="review-avatar" style="background:${color};">${initials(review.name)}</div>
                    <div class="review-card-meta">
                        <div class="review-card-name">${review.name}</div>
                        <div class="review-card-stars">${starsHTML(review.rating)}</div>
                    </div>
                    <div class="review-card-date">${formatDate(review.date)}</div>
                </div>
                <p class="review-card-text">${review.comment}</p>
            </div>`;
    }

    // ---- Render reviews grid ----
    function renderReviews() {
        const grid = document.getElementById('reviewsGrid');
        const start = (currentPage - 1) * REVIEWS_PER_PAGE;
        const pageReviews = allReviews.slice(start, start + REVIEWS_PER_PAGE);

        grid.innerHTML = pageReviews.map((r, i) => reviewCardHTML(r, i)).join('');

        // Pagination
        const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
        const pag = document.getElementById('reviewsPagination');
        pag.innerHTML = '';

        if (totalPages <= 1) return;

        // Prev button
        const prev = document.createElement('button');
        prev.className = 'pag-btn' + (currentPage === 1 ? ' pag-disabled' : '');
        prev.innerHTML = '<i class="fas fa-chevron-right"></i>';
        prev.disabled = currentPage === 1;
        prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderReviews(); scrollToReviews(); } });
        pag.appendChild(prev);

        // Page numbers
        for (let p = 1; p <= totalPages; p++) {
            if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
                if (p === 3 || p === totalPages - 2) {
                    const dots = document.createElement('span');
                    dots.className = 'pag-dots';
                    dots.textContent = '…';
                    pag.appendChild(dots);
                }
                continue;
            }
            const btn = document.createElement('button');
            btn.className = 'pag-btn' + (p === currentPage ? ' pag-active' : '');
            btn.textContent = p;
            btn.addEventListener('click', (pg => () => { currentPage = pg; renderReviews(); scrollToReviews(); })(p));
            pag.appendChild(btn);
        }

        // Next button
        const next = document.createElement('button');
        next.className = 'pag-btn' + (currentPage === totalPages ? ' pag-disabled' : '');
        next.innerHTML = '<i class="fas fa-chevron-left"></i>';
        next.disabled = currentPage === totalPages;
        next.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderReviews(); scrollToReviews(); } });
        pag.appendChild(next);
    }

    function scrollToReviews() {
        const el = document.getElementById('reviewsDisplay');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Update rating text on star selection ----
    const ratingText = document.getElementById('ratingText');
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            ratingText.textContent = `${ratingLabels[this.value]} (${this.value}/5)`;
        });
    });

    // ---- Comment form submit ----
    const commentForm = document.getElementById('commentForm');
    const commentSuccess = document.getElementById('commentSuccess');

    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name    = document.getElementById('commentName').value.trim();
            const comment = document.getElementById('commentText').value.trim();
            const sel     = document.querySelector('input[name="rating"]:checked');

            if (!name)    { showMessage('الرجاء إدخال اسمك', 'error'); return; }
            if (!sel)     { showMessage('الرجاء اختيار تقييمك', 'error'); return; }
            if (!comment) { showMessage('الرجاء كتابة تعليقك', 'error'); return; }

            // Add the new review to the top of the list
            const newReview = {
                name,
                rating: parseInt(sel.value),
                comment,
                date: new Date().toISOString().slice(0, 10)
            };
            allReviews.unshift(newReview);
            currentPage = 1;

            renderSummary();
            renderReviews();

            // Show success, reset form after 3s
            commentForm.style.display = 'none';
            commentSuccess.style.display = 'block';
            setTimeout(() => {
                commentForm.reset();
                if (ratingText) ratingText.textContent = 'اختر تقييمك';
                commentForm.style.display = 'flex';
                commentSuccess.style.display = 'none';
            }, 3500);

            scrollToReviews();
        });
    }

    // Initial render
    renderSummary();
    renderReviews();

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
