/* ============================================
   CFRP CRASH BOX BLOG — JAVASCRIPT
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

// <!-- INFOGRAPHIC 1 PLACEHOLDER -->
(function () {
  var root = document.getElementById("simfeRoot");
  var animated = false;

  function runAnimations() {
    if (animated) return;
    animated = true;

    // Accuracy items
    var accItems = root.querySelectorAll(".simfe-accuracy-item");
    accItems.forEach(function (el) {
      var delay = parseInt(el.getAttribute("data-delay") || 0);
      setTimeout(function () {
        el.classList.add("visible");
      }, delay);
    });

    // Geo rows (run-time)
    var geoRows = root.querySelectorAll(".simfe-geo-row");
    geoRows.forEach(function (el) {
      var delay = parseInt(el.getAttribute("data-delay") || 0);
      setTimeout(function () {
        el.classList.add("visible");
        // Animate bars
        var bars = el.querySelectorAll(".simfe-bar-inner");
        bars.forEach(function (bar, i) {
          setTimeout(function () {
            bar.style.width = bar.getAttribute("data-target") + "%";
          }, i * 120);
        });
      }, delay + 100);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) runAnimations();
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(root);

  // Also trigger if already in view on load
  setTimeout(function () {
    var rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight) runAnimations();
  }, 200);
})();
// <!-- INFOGRAPHIC 2 PLACEHOLDER -->
(function () {
  var root = document.getElementById("cboxRoot");
  var animated = false;

  function runAnim() {
    if (animated) return;
    animated = true;
    var cards = root.querySelectorAll(".cbox-card");
    cards.forEach(function (card) {
      var delay = parseInt(card.getAttribute("data-delay") || 0);
      setTimeout(function () {
        card.classList.add("visible");
      }, delay);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) runAnim();
      });
    },
    { threshold: 0.15 },
  );
  obs.observe(root);

  setTimeout(function () {
    var r = root.getBoundingClientRect();
    if (r.top < window.innerHeight) runAnim();
  }, 200);
})();
// <!-- INFOGRAPHIC 3 PLACEHOLDER -->
(function () {
  var root = document.getElementById("seaRoot");
  var animated = false;

  function runAnim() {
    if (animated) return;
    animated = true;
    var rows = root.querySelectorAll(".sea-row");
    rows.forEach(function (row) {
      var delay = parseInt(row.getAttribute("data-delay") || 0);
      setTimeout(function () {
        row.classList.add("visible");
        var fill = row.querySelector(".sea-bar-fill");
        if (fill) {
          fill.style.width = fill.getAttribute("data-target") + "%";
        }
      }, delay + 80);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) runAnim();
      });
    },
    { threshold: 0.2 },
  );
  obs.observe(root);

  setTimeout(function () {
    if (root.getBoundingClientRect().top < window.innerHeight) runAnim();
  }, 200);
})();
// <!-- INFOGRAPHIC 4 PLACEHOLDER -->
(function () {
  var root = document.getElementById("lvdRoot");
  var chartAnimated = false;

  // Non-tapered: sharp peak around 2–3 mm then decay to ~80 kN plateau
  var nonTaperedData = [
    { x: 0, y: 0 },
    { x: 0.4, y: 18 },
    { x: 0.8, y: 42 },
    { x: 1.2, y: 72 },
    { x: 1.6, y: 108 },
    { x: 2.0, y: 140 },
    { x: 2.3, y: 163 },
    { x: 2.5, y: 165 },
    { x: 2.8, y: 158 },
    { x: 3.2, y: 132 },
    { x: 3.7, y: 102 },
    { x: 4.2, y: 86 },
    { x: 5.0, y: 80 },
    { x: 6.0, y: 81 },
    { x: 7.0, y: 79 },
    { x: 8.0, y: 80 },
    { x: 9.0, y: 81 },
    { x: 10.0, y: 80 },
  ];

  // Tapered: gradual ramp, no sharp spike, settles around 80 kN
  var taperedData = [
    { x: 0, y: 0 },
    { x: 0.5, y: 10 },
    { x: 1.0, y: 22 },
    { x: 1.5, y: 36 },
    { x: 2.0, y: 52 },
    { x: 2.5, y: 63 },
    { x: 3.0, y: 72 },
    { x: 3.5, y: 78 },
    { x: 4.0, y: 81 },
    { x: 4.5, y: 83 },
    { x: 5.0, y: 82 },
    { x: 6.0, y: 80 },
    { x: 7.0, y: 79 },
    { x: 8.0, y: 81 },
    { x: 9.0, y: 80 },
    { x: 10.0, y: 80 },
  ];

  // Mean load reference line
  var meanData = [
    { x: 0, y: 80 },
    { x: 10, y: 80 },
  ];

  function buildChart() {
    if (chartAnimated) return;
    chartAnimated = true;

    new Chart(document.getElementById("lvdChart"), {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Non-tapered",
            data: nonTaperedData,
            borderColor: "#47577c",
            backgroundColor: "transparent",
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            showLine: true,
            tension: 0.35,
            order: 1,
          },
          {
            label: "Tapered",
            data: taperedData,
            borderColor: "#bf3425",
            backgroundColor: "transparent",
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            showLine: true,
            tension: 0.35,
            order: 2,
          },
          {
            label: "Mean load ~80 kN",
            data: meanData,
            borderColor: "#9d9d9c",
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            showLine: true,
            tension: 0,
            order: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: "easeInOutQuart",
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 10,
            grid: { color: "#f1f5f9", lineWidth: 1 },
            border: { color: "#e2e8f0" },
            ticks: {
              color: "#9d9d9c",
              font: { family: "Inter", size: 11, weight: "600" },
              stepSize: 2,
              callback: function (v) {
                return v + " mm";
              },
            },
            title: {
              display: true,
              text: "Displacement (mm)",
              color: "#9d9d9c",
              font: { family: "Inter", size: 11, weight: "600" },
            },
          },
          y: {
            min: 0,
            max: 200,
            grid: { color: "#f1f5f9", lineWidth: 1 },
            border: { color: "#e2e8f0" },
            ticks: {
              color: "#9d9d9c",
              font: { family: "Inter", size: 11, weight: "600" },
              stepSize: 40,
              callback: function (v) {
                return v + " kN";
              },
            },
            title: {
              display: true,
              text: "Load (kN)",
              color: "#9d9d9c",
              font: { family: "Inter", size: 11, weight: "600" },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#47577c",
            bodyColor: "#47577c",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              title: function (items) {
                return "Displacement: " + items[0].parsed.x.toFixed(1) + " mm";
              },
              label: function (item) {
                return (
                  item.dataset.label + ": " + item.parsed.y.toFixed(0) + " kN"
                );
              },
            },
          },
          annotation: {},
        },
      },
    });

    // Animate callouts
    setTimeout(function () {
      root.querySelectorAll(".lvd-callout").forEach(function (el) {
        var delay = parseInt(el.getAttribute("data-delay") || 0);
        setTimeout(function () {
          el.classList.add("visible");
        }, delay);
      });
    }, 600);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) buildChart();
      });
    },
    { threshold: 0.2 },
  );
  obs.observe(root);

  setTimeout(function () {
    if (root.getBoundingClientRect().top < window.innerHeight) buildChart();
  }, 200);
})();
// <!-- INFOGRAPHIC 5 PLACEHOLDER -->
(function () {
  var root = document.getElementById("sea5Root");
  var animated = false;

  function runAnim() {
    if (animated) return;
    animated = true;
    root
      .querySelectorAll(".sea5-col, .sea5-compare-card")
      .forEach(function (el) {
        var delay = parseInt(el.getAttribute("data-delay") || 0);
        setTimeout(function () {
          el.classList.add("visible");
        }, delay);
      });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) runAnim();
      });
    },
    { threshold: 0.15 },
  );
  obs.observe(root);

  setTimeout(function () {
    if (root.getBoundingClientRect().top < window.innerHeight) runAnim();
  }, 200);
})();
// <!-- INFOGRAPHIC 6 PLACEHOLDER -->
(function () {
  var root = document.getElementById("ladderRoot");
  var animated = false;

  function runAnim() {
    if (animated) return;
    animated = true;

    /* Ladder rows */
    root.querySelectorAll(".ladder-row").forEach(function (row) {
      var delay = parseInt(row.getAttribute("data-delay") || 0);
      setTimeout(function () {
        row.classList.add("visible");
        /* Standard fill */
        var fill = row.querySelector(".ladder-fill");
        if (fill) {
          fill.style.width = fill.getAttribute("data-target") + "%";
        }
        /* Range fills (metallic) */
        var rMax = row.querySelector(".ladder-fill-range-max");
        var rMin = row.querySelector(".ladder-fill-range-min");
        if (rMax) rMax.style.width = rMax.getAttribute("data-target") + "%";
        if (rMin) rMin.style.width = rMin.getAttribute("data-target") + "%";
      }, delay + 80);
    });

    /* Divider fade */
    setTimeout(function () {
      var div = root.querySelector(".ladder-div");
      if (div) div.style.opacity = "1";
    }, 200);

    /* Badge cards */
    root.querySelectorAll(".ladder-badge-card").forEach(function (card) {
      var delay = parseInt(card.getAttribute("data-delay2") || 0);
      setTimeout(function () {
        card.classList.add("visible");
      }, delay + 600);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) runAnim();
      });
    },
    { threshold: 0.15 },
  );
  obs.observe(root);

  setTimeout(function () {
    if (root.getBoundingClientRect().top < window.innerHeight) runAnim();
  }, 200);
})();
