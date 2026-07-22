document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // HEADER & NAVIGATION
  // ==============================

  const header = document.getElementById("header");
  const navMenu = document.getElementById("navMenu");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // ---- Sticky Header ----
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.pageYOffset > 100);
  });

  // ---- Mobile Menu Toggle ----
  mobileMenuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    const icon = this.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });

  document.addEventListener("click", function (event) {
    if (
      !navMenu.contains(event.target) &&
      !mobileMenuToggle.contains(event.target) &&
      navMenu.classList.contains("active")
    ) {
      navMenu.classList.remove("active");
      const icon = mobileMenuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // ---- Smooth Scroll ----
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (!this.getAttribute("href").startsWith("#")) return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      navMenu.classList.remove("active");
      window.scrollTo({
        top: target.offsetTop - header.offsetHeight,
        behavior: "smooth",
      });
    });
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach((section) => {
      if (
        pageYOffset >=
        section.offsetTop - header.offsetHeight - 100
      ) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  });

  // ==============================
  // SCROLL ANIMATIONS
  // ==============================

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // ==============================
  // REVIEWS SYSTEM
  // ==============================

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyyrJRFrtz3fH9V2zM6LpUThDsCQn5dOC2ZCF1utVlvEYtYjriFk4x7EML3e6AsJ2ZaiA/exec";
  const REVIEWS_PER_PAGE = 6;
  const ratingLabels = ["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"];
  const avatarColors = [
    "#E11F14",
    "#00B3E9",
    "#FCC819",
    "#51C348",
    "#9C27B0",
    "#FF5722",
  ];

  let allReviews = [];
  let currentPage = 1;

  const ratingText = document.getElementById("ratingText");
  const commentForm = document.getElementById("commentForm");
  const commentSuccess = document.getElementById("commentSuccess");

  // ---- Helpers ----
  function starsHTML(rating, size) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<i class="fas fa-star${i <= rating ? "" : " star-empty"}"${size ? ` style="font-size:${size}"` : ""}></i>`;
    }
    return html;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function initials(name) {
    return name.trim().charAt(0);
  }

  function computeAvg() {
    if (!allReviews.length) return 0;
    return (
      allReviews.reduce((s, r) => s + Number(r.rating), 0) / allReviews.length
    );
  }

  function scrollToReviews() {
    const el = document.getElementById("reviewsDisplay");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---- Render Summary ----
  function renderSummary() {
    const avg = computeAvg();
    const el = (id) => document.getElementById(id);
    const avgScoreEl = el("avgScore");
    const avgStarsEl = el("avgStars");
    const totalCountEl = el("totalCount");
    const barsEl = el("reviewsBars");

    if (avgScoreEl) avgScoreEl.textContent = avg.toFixed(1);
    if (avgStarsEl) avgStarsEl.innerHTML = starsHTML(Math.round(avg));
    if (totalCountEl)
      totalCountEl.textContent = `${allReviews.length} تقييم`;

    if (!barsEl) return;
    barsEl.innerHTML = "";
    const colorMap = {
      5: "#51C348",
      4: "#FCC819",
      3: "#00B3E9",
      2: "#E11F14",
      1: "#9e1a14",
    };

    for (let star = 5; star >= 1; star--) {
      const count = allReviews.filter((r) => Number(r.rating) === star).length;
      const pct = allReviews.length
        ? Math.round((count / allReviews.length) * 100)
        : 0;
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

  // ---- Render Review Card ----
  function reviewCardHTML(review, idx) {
    const colorIdx =
      (review.name.charCodeAt(0) + idx) % avatarColors.length;
    return `
      <div class="review-card" style="animation-delay:${(idx % REVIEWS_PER_PAGE) * 0.07}s">
        <div class="review-card-header">
          <div class="review-avatar" style="background:${avatarColors[colorIdx]};">${initials(review.name)}</div>
          <div class="review-card-meta">
            <div class="review-card-name">${review.name}</div>
            <div class="review-card-stars">${starsHTML(Number(review.rating))}</div>
          </div>
          <div class="review-card-date">${formatDate(review.date)}</div>
        </div>
        <p class="review-card-text">${review.comment}</p>
      </div>`;
  }

  // ---- Render Reviews Grid ----
  function renderReviews() {
    const grid = document.getElementById("reviewsGrid");
    if (!grid) return;

    if (!allReviews.length) {
      grid.innerHTML =
        '<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#666;">لا توجد تقييمات متاح حالياً.</p>';
      return;
    }

    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    grid.innerHTML = allReviews
      .slice(start, start + REVIEWS_PER_PAGE)
      .map((r, i) => reviewCardHTML(r, i))
      .join("");

    // Pagination
    const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
    const pag = document.getElementById("reviewsPagination");
    if (!pag || totalPages <= 1) return;

    pag.innerHTML = "";

    const pageBtn = (label, cls, disabled, cb) => {
      const btn = document.createElement("button");
      btn.className = "pag-btn" + cls;
      btn.innerHTML = label;
      btn.disabled = disabled;
      btn.addEventListener("click", cb);
      pag.appendChild(btn);
      return btn;
    };

    pageBtn(
      '<i class="fas fa-chevron-right"></i>',
      currentPage === 1 ? " pag-disabled" : "",
      currentPage === 1,
      () => {
        if (currentPage > 1) {
          currentPage--;
          renderReviews();
          scrollToReviews();
        }
      }
    );

    for (let p = 1; p <= totalPages; p++) {
      if (
        totalPages > 7 &&
        p > 2 &&
        p < totalPages - 1 &&
        Math.abs(p - currentPage) > 1
      ) {
        if (p === 3 || p === totalPages - 2) {
          const dots = document.createElement("span");
          dots.className = "pag-dots";
          dots.textContent = "…";
          pag.appendChild(dots);
        }
        continue;
      }
      pageBtn(
        p,
        p === currentPage ? " pag-active" : "",
        false,
        ((pg) => () => {
          currentPage = pg;
          renderReviews();
          scrollToReviews();
        })(p)
      );
    }

    pageBtn(
      '<i class="fas fa-chevron-left"></i>',
      currentPage === totalPages ? " pag-disabled" : "",
      currentPage === totalPages,
      () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderReviews();
          scrollToReviews();
        }
      }
    );
  }

  // ---- Load Remote Reviews ----
  async function loadRemoteReviews() {
    try {
      const res = await fetch(SCRIPT_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) allReviews = data;
      }
    } catch (err) {
      console.error("Failed to load reviews from Google Sheet.", err);
    } finally {
      renderSummary();
      renderReviews();
    }
  }

  // ---- Star Rating Input ----
  document.querySelectorAll('input[name="rating"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (ratingText)
        ratingText.textContent = `${ratingLabels[this.value]} (${this.value}/5)`;
    });
  });

  // ---- Form Submit ----
  if (commentForm) {
    commentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name =
        document.getElementById("commentName").value.trim() || "مجهول";
      const comment = document.getElementById("commentText").value.trim();
      const sel = document.querySelector('input[name="rating"]:checked');

      if (!sel) {
        showMessage("الرجاء اختيار تقييمك", "error");
        return;
      }
      if (!comment) {
        showMessage("الرجاء كتابة تعليقك", "error");
        return;
      }

      const submitBtn = commentForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await fetch(SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            name,
            comment,
            rating: parseInt(sel.value),
            date: new Date().toISOString().slice(0, 10),
          }),
        });
        location.reload();
      } catch (err) {
        console.error("Submission failed", err);
        showMessage("حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.", "error");
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  loadRemoteReviews();

  // ---- Toast Notification ----
  function showMessage(message, type) {
    const msg = document.createElement("div");
    msg.style.cssText = `
      position: fixed; top: 100px; right: 20px; padding: 1rem 1.5rem;
      border-radius: 0.5rem; color: white; font-weight: 600; z-index: 10000;
      background: ${type === "success" ? "linear-gradient(135deg,#10B981,#14B8A6)" : "linear-gradient(135deg,#EF4444,#DC2626)"};
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease; max-width: 300px;
    `;
    msg.textContent = message;
    document.body.appendChild(msg);
    setTimeout(() => {
      msg.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => document.body.removeChild(msg), 300);
    }, 3000);
  }

  // Inject toast keyframes
  const toastStyle = document.createElement("style");
  toastStyle.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  `;
  document.head.appendChild(toastStyle);

  // ==============================
  // BRANCH CARDS
  // ==============================

  document.querySelectorAll(".branch-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // ==============================
  // PARALLAX HERO SHAPES
  // ==============================

  const heroShapes = document.querySelectorAll(".shape");
  window.addEventListener("mousemove", function (e) {
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    heroShapes.forEach((shape, i) => {
      const s = (i + 1) * 5;
      shape.style.transform = `translate(${mx * s}px, ${my * s}px)`;
    });
  });

  // ==============================
  // BUTTON RIPPLE EFFECT
  // ==============================

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute; width: ${size}px; height: ${size}px;
        border-radius: 50%; background: rgba(255,255,255,0.5);
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        pointer-events: none; animation: ripple 0.6s ease-out;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);

  // ==============================
  // LOADING ANIMATION
  // ==============================

  window.addEventListener("load", function () {
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);
  });

  console.log("🧸 الرفاهية للألعاب - Landing Page Loaded Successfully!");
});
