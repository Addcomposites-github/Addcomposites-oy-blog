/* ============================================
   BIO-INSPIRED JOINTS BLOG — JAVASCRIPT
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
// <!-- INFOGRAPHICS START 1 -->
(function () {
  var cards = document.querySelectorAll(".jt-card");
  var comparison = document.getElementById("jtComparison");

  function animateBars(container) {
    container
      .querySelectorAll(".jt-bar-fill, .jt-rank-fill")
      .forEach(function (bar) {
        var pct = bar.getAttribute("data-pct");
        if (pct) bar.style.width = pct + "%";
      });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("jt-card")) {
          var delay = parseInt(el.getAttribute("data-delay") || 0) * 110;
          setTimeout(function () {
            el.classList.add("jt-visible");
            animateBars(el);
          }, delay);
        } else if (el.classList.contains("jt-comparison")) {
          el.classList.add("jt-visible");
          setTimeout(function () {
            animateBars(el);
          }, 200);
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  cards.forEach(function (c) {
    observer.observe(c);
  });
  observer.observe(comparison);
})();
// <!-- INFOGRAPHICS START 2 -->
(function () {
  var cards = document.querySelectorAll(".nj-card");
  var comparison = document.getElementById("njComparison");

  function animateBars(container) {
    container
      .querySelectorAll(".nj-bar-fill, .nj-compare-fill")
      .forEach(function (bar) {
        var pct = bar.getAttribute("data-pct");
        if (pct) bar.style.width = pct + "%";
      });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("nj-card")) {
          var delay = parseInt(el.getAttribute("data-delay") || 0) * 130;
          setTimeout(function () {
            el.classList.add("nj-visible");
            animateBars(el);
          }, delay);
        } else if (el.classList.contains("nj-comparison")) {
          el.classList.add("nj-visible");
          setTimeout(function () {
            animateBars(el);
          }, 250);
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  cards.forEach(function (c) {
    observer.observe(c);
  });
  observer.observe(comparison);
})();
//   <!-- INFOGRAPHICS START 3 -->
(function () {
  var rows = document.querySelectorAll(".uts-row");
  var footer = document.getElementById("utsFooter");

  function animateRow(el) {
    el.classList.add("uts-visible");
    el.querySelectorAll(".uts-bar-fill").forEach(function (bar) {
      var pct = bar.getAttribute("data-pct");
      if (pct) bar.style.width = pct + "%";
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("uts-row")) {
          var delay = parseInt(el.getAttribute("data-delay") || 0) * 100;
          setTimeout(function () {
            animateRow(el);
          }, delay);
        } else if (el.id === "utsFooter") {
          el.classList.add("uts-visible");
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.1 },
  );

  rows.forEach(function (r) {
    observer.observe(r);
  });
  observer.observe(footer);
})();
//   <!-- INFOGRAPHICS START 4 -->
(function () {
  var panels = document.querySelectorAll(".st-panel");
  var insight = document.getElementById("stInsight");

  function animatePanel(panel) {
    panel.classList.add("st-visible");
    var rows = panel.querySelectorAll(".st-row");
    rows.forEach(function (row) {
      var d = parseInt(row.getAttribute("data-delay") || 0) * 90;
      setTimeout(function () {
        row.classList.add("st-visible");
        row.querySelectorAll(".st-bar-fill").forEach(function (bar) {
          var pct = bar.getAttribute("data-pct");
          if (pct) bar.style.width = pct + "%";
        });
      }, d + 120);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("st-panel")) {
          var pd = parseInt(el.getAttribute("data-panel-delay") || 0) * 160;
          setTimeout(function () {
            animatePanel(el);
          }, pd);
        } else if (el.id === "stInsight") {
          el.classList.add("st-visible");
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.12 },
  );

  panels.forEach(function (p) {
    observer.observe(p);
  });
  observer.observe(insight);
})();
//   <!-- INFOGRAPHICS START 5 -->
(function () {
  var card = document.getElementById("njsCard");
  var footnote = document.getElementById("njsFootnote");

  function animateRows(container) {
    container.querySelectorAll(".njs-row").forEach(function (row) {
      var d = parseInt(row.getAttribute("data-delay") || 0) * 85;
      setTimeout(function () {
        row.classList.add("njs-visible");
        row.querySelectorAll(".njs-bar-fill").forEach(function (bar) {
          var pct = bar.getAttribute("data-pct");
          if (pct) bar.style.width = pct + "%";
        });
      }, d);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.id === "njsCard") {
          animateRows(el);
        } else if (el.id === "njsFootnote") {
          el.classList.add("njs-visible");
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.08 },
  );

  observer.observe(card);
  observer.observe(footnote);
})();
