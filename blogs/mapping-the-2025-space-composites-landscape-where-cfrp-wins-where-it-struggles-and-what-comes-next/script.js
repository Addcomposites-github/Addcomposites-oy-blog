/* ============================================
   SPACE COMPOSITES LANDSCAPE BLOG — JAVASCRIPT
   Sidebar Navigation & Interactive Features
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ─── Elements ───────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".blog-sidebar-link");
  const sidebar = document.querySelector(".blog-sidebar");
  const menuToggle = document.querySelector(".mobile-nav-toggle");
  const closeBtn = document.querySelector(".sidebar-close");

  // ─── Sidebar open/close helpers ─────────────────────────────────────────────
  function openSidebar() {
    if (sidebar) sidebar.classList.add("active");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("active");
  }

  // ─── Active Section Highlighting ────────────────────────────────────────────
  function highlightActiveSection() {
    let scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Throttle with rAF
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    scrollTimeout = window.requestAnimationFrame(highlightActiveSection);
  });

  highlightActiveSection();

  // ─── Smooth Scrolling for Sidebar Links ─────────────────────────────────────
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const headerOffset = 40;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        closeSidebar();

        setTimeout(function () {
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }, 80);

        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  // ─── Mobile Menu Toggle ──────────────────────────────────────────────────────
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }

  // ─── Close Menu Button (inside sidebar) ─────────────────────────────────────
  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeSidebar();
    });
  }

  // Close sidebar when clicking outside of it on mobile
  document.addEventListener("click", function (e) {
    if (
      sidebar &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      menuToggle &&
      !menuToggle.contains(e.target)
    ) {
      closeSidebar();
    }
  });

  // Close sidebar on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  // ─── Card Animations (IntersectionObserver) ──────────────────────────────────
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".stat-card, .learn-more-card, .feature-item",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

  // Immediate viewport check so items visible on load animate in
  setTimeout(function () {
    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  }, 50);

  // ─── Image Hover Effects ─────────────────────────────────────────────────────
  const images = document.querySelectorAll(
    ".full-width-image, .split-image img",
  );
  images.forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      this.style.transform = "scale(1.01)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    });
    img.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
    });
  });

  // ─── Table Row Hover ─────────────────────────────────────────────────────────
  const tableRows = document.querySelectorAll(".data-table tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      this.style.backgroundColor = "#f1f5f9";
    });
    row.addEventListener("mouseleave", function () {
      this.style.backgroundColor = "";
    });
  });

  // ─── Back to Top Button ──────────────────────────────────────────────────────
  const createBackToTop = () => {
    const button = document.createElement("button");
    button.innerHTML = "↑";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Scroll back to top");
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #bf3425 0%, #9d2a1e 100%);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(191, 52, 37, 0.3);
    `;

    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 8px 25px rgba(191, 52, 37, 0.4)";
    });
    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 15px rgba(191, 52, 37, 0.3)";
    });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(button);

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 500) {
        button.style.opacity = "1";
        button.style.visibility = "visible";
      } else {
        button.style.opacity = "0";
        button.style.visibility = "hidden";
      }
    });
  };

  createBackToTop();

  // ─── Reading Progress Bar ────────────────────────────────────────────────────
  const createProgressBar = () => {
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #bf3425, #47577c);
      z-index: 9999;
      transition: width 0.1s linear;
      width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", function () {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + "%";
    });
  };

  createProgressBar();
});

/* ============================================================
   INFOGRAPHIC INITIALISATION SCRIPTS
   Add the JS for each infographic below its marker when you
   inject the corresponding infographic HTML/CSS.
   ============================================================ */

// <!-- INFOGRAPHIC 1 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var dots = entry.target.querySelectorAll(".lcm-dot");
        dots.forEach(function (dot, i) {
          setTimeout(function () {
            dot.classList.add("animate-in");
          }, i * 28);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("lcmWrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 2 PLACEHOLDER -->
(function () {
  var cards = ["capCard1", "capCard2", "capCard3", "capCard4"];
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cards.forEach(function (id, i) {
          var el = document.getElementById(id);
          if (el)
            setTimeout(function () {
              el.classList.add("animate-in");
            }, i * 100);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  var wrap = document.getElementById("capWrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 3 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var fills = entry.target.querySelectorAll(".afp3-bar-fill");
        fills.forEach(function (el, i) {
          setTimeout(function () {
            el.style.width = el.getAttribute("data-pct") + "%";
          }, i * 55);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("afp3Wrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 4 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var cards = entry.target.querySelectorAll(".smf-card");
        cards.forEach(function (card) {
          var delay = parseInt(card.getAttribute("data-delay")) || 0;
          setTimeout(function () {
            card.classList.add("animate-in");
          }, delay);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("smfWrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 5 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // animate axis fill
        var fill = document.getElementById("hviAxisFill");
        if (fill)
          setTimeout(function () {
            fill.style.width = "100%";
          }, 100);

        // animate cards
        var cards = entry.target.querySelectorAll(".hvi-card");
        cards.forEach(function (card) {
          var delay = parseInt(card.getAttribute("data-delay")) || 0;
          setTimeout(function () {
            card.classList.add("animate-in");
          }, 300 + delay);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("hviWrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 6 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var cards = entry.target.querySelectorAll(".rsr-card");
        cards.forEach(function (card) {
          var delay = parseInt(card.getAttribute("data-delay")) || 0;
          setTimeout(function () {
            card.classList.add("animate-in");
          }, delay);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("rsrWrap");
  if (wrap) observer.observe(wrap);
})();
// <!-- INFOGRAPHIC 7 PLACEHOLDER -->
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // grow spine
        var spine = document.getElementById("edu2SpineFill");
        if (spine)
          setTimeout(function () {
            spine.style.height = "100%";
          }, 100);

        // reveal rows
        var rows = entry.target.querySelectorAll(".edu2-row");
        rows.forEach(function (row) {
          var delay = parseInt(row.getAttribute("data-delay")) || 0;
          setTimeout(function () {
            row.classList.add("animate-in");
          }, 200 + delay);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  var wrap = document.getElementById("edu2Wrap");
  if (wrap) observer.observe(wrap);
})();
