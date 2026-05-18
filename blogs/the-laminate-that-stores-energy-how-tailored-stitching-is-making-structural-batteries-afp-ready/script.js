/* ============================================
   STRUCTURAL BATTERY BLOG — JAVASCRIPT
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

  const animatedElements = document.querySelectorAll(".learn-more-card");

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
  var cascade = document.getElementById("sbpcCascade");
  var nodes = [
    document.getElementById("sbpcNode1"),
    document.getElementById("sbpcNode2"),
    document.getElementById("sbpcNode3"),
    document.getElementById("sbpcNode4"),
  ];
  var arrows = [
    document.getElementById("sbpcArrow1"),
    document.getElementById("sbpcArrow2"),
    document.getElementById("sbpcArrow3"),
  ];

  function animateCascade() {
    cascade.classList.add("sbpc-visible");
    nodes.forEach(function (node, i) {
      setTimeout(function () {
        node.classList.add("sbpc-visible");
        if (arrows[i]) {
          setTimeout(function () {
            arrows[i].classList.add("sbpc-visible");
          }, 300);
        }
      }, i * 420);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCascade();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(cascade);
})();
//  <!-- INFOGRAPHIC 2 PLACEHOLDER -->
(function () {
  var table = document.getElementById("slcs3Table");
  var rows = Array.from(table.querySelectorAll("tr"));
  var footer = document.getElementById("slcs3Footer");

  function animate() {
    rows.forEach(function (row, i) {
      setTimeout(function () {
        row.classList.add("slcs3-vis");
      }, i * 110);
    });
    setTimeout(
      function () {
        footer.classList.add("slcs3-vis");
      },
      rows.length * 110 + 200,
    );
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        animate();
        obs.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  obs.observe(table);
})();
//    <!-- INFOGRAPHIC 3 PLACEHOLDER -->
(function () {
  var container = document.getElementById("sdpRows");
  var rows = Array.from(container.querySelectorAll(".sdp-row"));
  var divider = document.getElementById("sdpDivider");
  var axis = document.getElementById("sdpAxis");
  var note = document.getElementById("sdpNote");

  function animateBars(row) {
    row.querySelectorAll(".sdp-bar-fill").forEach(function (fill) {
      var pct = fill.getAttribute("data-pct") || "0";
      fill.style.width = pct + "%";
    });
  }

  function animate() {
    rows.forEach(function (row, i) {
      setTimeout(function () {
        row.classList.add("sdp-vis");
        animateBars(row);
        if (i === 3) {
          setTimeout(function () {
            divider.classList.add("sdp-vis");
          }, 200);
        }
      }, i * 180);
    });
    var total = rows.length * 180 + 300;
    setTimeout(function () {
      axis.classList.add("sdp-vis");
    }, total);
    setTimeout(function () {
      note.classList.add("sdp-vis");
    }, total + 150);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        animate();
        obs.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  obs.observe(container);
})();
//   <!-- INFOGRAPHIC 4 PLACEHOLDER -->
(function () {
  var panel1 = document.getElementById("sivsPanel1");
  var panel2 = document.getElementById("sivsPanel2");
  var junction = document.getElementById("sivsJunction");
  var result = document.getElementById("sivsResult");

  function animate() {
    setTimeout(function () {
      panel1.classList.add("sivs-vis");
    }, 0);
    setTimeout(function () {
      panel2.classList.add("sivs-vis");
    }, 150);
    setTimeout(function () {
      junction.classList.add("sivs-vis");
    }, 480);
    setTimeout(function () {
      result.classList.add("sivs-vis");
    }, 700);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        animate();
        obs.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  obs.observe(document.getElementById("sivsCompare"));
})();
//    <!-- INFOGRAPHIC 5 PLACEHOLDER -->
(function () {
  /* midpoint values for each deflection */
  var labels = ["δ = 0 mm\n(Baseline)", "δ = 1 mm", "δ = 2 mm", "δ = 3 mm"];

  var datasets = [
    {
      label: "Unstitched",
      data: [101.5, 95.5, 60, 35],
      borderColor: "#9d9d9c",
      backgroundColor: "rgba(157,157,156,0.08)",
      borderWidth: 2.5,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.35,
      fill: false,
    },
    {
      label: "Loose (5.0 mm)",
      data: [109, 103.5, 73, 53.5],
      borderColor: "#8fa0bd",
      backgroundColor: "rgba(143,160,189,0.08)",
      borderWidth: 2.5,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.35,
      fill: false,
    },
    {
      label: "Moderate (3.33 mm)",
      data: [117.5, 113.5, 78.5, 61],
      borderColor: "#47577c",
      backgroundColor: "rgba(71,87,124,0.08)",
      borderWidth: 3,
      pointRadius: 7,
      pointHoverRadius: 9,
      tension: 0.35,
      fill: false,
      borderDash: [],
    },
    {
      label: "Dense (2.5 mm)",
      data: [115, 111.5, 82, 67],
      borderColor: "#bf3425",
      backgroundColor: "rgba(191,52,37,0.08)",
      borderWidth: 2.5,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.35,
      fill: false,
    },
  ];

  var ctx = document.getElementById("crbdChart").getContext("2d");

  /* annotation plugin not used — draw deflection zone shading manually via afterDraw */
  var zonePlugin = {
    id: "zoneShading",
    afterDraw: function (chart) {
      var ctx = chart.ctx;
      var xScale = chart.scales.x;
      var yScale = chart.scales.y;
      var x2 = xScale.getPixelForValue(2);
      var x3 = xScale.getPixelForValue(3);
      var top = yScale.top;
      var bottom = yScale.bottom;
      ctx.save();
      ctx.fillStyle = "rgba(191,52,37,0.04)";
      ctx.fillRect(
        x2,
        top,
        x3 - x2 + (xScale.getPixelForValue(3) - xScale.getPixelForValue(2)),
        bottom - top,
      );
      ctx.restore();
    },
  };

  var chart = new Chart(ctx, {
    type: "line",
    plugins: [zonePlugin],
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeInOutQuart",
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          grid: { color: "#f1f4f8" },
          ticks: {
            color: "#374151",
            font: { size: 11, weight: "600", family: "Inter" },
          },
        },
        y: {
          min: 20,
          max: 130,
          grid: { color: "#f1f4f8" },
          ticks: {
            color: "#6b7280",
            font: { size: 11, family: "Inter" },
            callback: function (v) {
              return v + " mAh/g";
            },
          },
          title: {
            display: true,
            text: "Specific Capacity (mAh/g LFP)",
            color: "#9d9d9c",
            font: { size: 11, family: "Inter" },
          },
        },
      },
      plugins: {
        legend: { display: false } /* using custom legend above */,
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#47577c",
          bodyColor: "#374151",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (ctx) {
              return " " + ctx.dataset.label + ": " + ctx.parsed.y + " mAh/g";
            },
          },
        },
      },
    },
  });

  /* Scroll observer for cards + recovery bars */
  var insights = document.getElementById("crbdInsights");
  var recovery = document.getElementById("crbdRecovery");
  var insCards = insights.querySelectorAll(".crbd-insight");
  var recFills = recovery.querySelectorAll(".crbd-rec-fill");

  function animateCards() {
    insCards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add("crbd-vis");
      }, i * 150);
    });
    setTimeout(
      function () {
        recovery.classList.add("crbd-vis");
        setTimeout(function () {
          recFills.forEach(function (fill) {
            fill.style.width = fill.getAttribute("data-w") + "%";
          });
        }, 200);
      },
      insCards.length * 150 + 100,
    );
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        animateCards();
        obs.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  obs.observe(insights);
})();
