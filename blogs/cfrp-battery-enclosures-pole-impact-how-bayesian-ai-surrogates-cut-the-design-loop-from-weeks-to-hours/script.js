/* ============================================
   CFRP BATTERY ENCLOSURE BLOG — JAVASCRIPT
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
// INFOGRAPHIC PLACEHOLDER 1
(function () {
  var els = document.querySelectorAll(".tb-reveal");
  if (!els.length) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("tb-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach(function (el) {
    observer.observe(el);
  });
})();
// <!-- INFOGRAPHIC PLACEHOLDER 2 -->
(function () {
  /* ── dot grid builder ── */
  function buildDots(id, total, filled, cls) {
    var el = document.getElementById(id);
    if (!el) return;
    for (var i = 0; i < total; i++) {
      var d = document.createElement("div");
      d.className = "sc-dot";
      if (i < filled) d.dataset.color = cls;
      el.appendChild(d);
    }
  }
  buildDots("scDots1", 37, 37, "filled-navy");
  buildDots("scDots2", 42, 42, "filled-mid"); // show cumulative
  buildDots("scDots3", 47, 47, "filled-gray");
  buildDots("scDots4", 3, 3, "filled-red");

  /* ── IntersectionObserver reveal + animate ── */
  var filled = false;
  var reveals = document.querySelectorAll(".sc-reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("sc-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });

  /* Animate budget bar + dots when container enters viewport */
  var budgetObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !filled) {
          filled = true;
          /* budget bar: 47/50 = 94% active; 3/50 = 6% hold-out */
          setTimeout(function () {
            var fill = document.getElementById("scBudgetFill");
            if (fill) fill.style.width = "100%";
          }, 300);
          /* animate dots staggered */
          var allDots = document.querySelectorAll(".sc-dot[data-color]");
          allDots.forEach(function (dot, i) {
            setTimeout(
              function () {
                dot.classList.add(dot.dataset.color);
              },
              600 + i * 18,
            );
          });
        }
      });
    },
    { threshold: 0.2 },
  );
  var container = document.querySelector(".sc-container");
  if (container) budgetObs.observe(container);
})();
//   <!-- INFOGRAPHIC PLACEHOLDER 3 -->
(function () {
  var labels = ["37 runs", "42 runs", "47 runs"];

  var commonTooltip = {
    backgroundColor: "#ffffff",
    titleColor: "#47577c",
    bodyColor: "#1e293b",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    padding: 12,
    displayColors: true,
    callbacks: {
      label: function (ctx) {
        return " " + ctx.dataset.label + ": " + ctx.parsed.y.toFixed(3);
      },
    },
  };

  new Chart(document.getElementById("nrmseChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Stress (S)",
          data: [0.541, 0.545, 0.523],
          borderColor: "#bf3425",
          backgroundColor: "rgba(191,52,37,0.08)",
          pointBackgroundColor: "#bf3425",
          pointRadius: 6,
          pointHoverRadius: 9,
          borderWidth: 2.5,
          tension: 0.25,
          fill: false,
        },
        {
          label: "Mass (M)",
          data: [0.165, 0.091, 0.18],
          borderColor: "#9d9d9c",
          backgroundColor: "rgba(157,157,156,0.08)",
          pointBackgroundColor: "#9d9d9c",
          pointRadius: 6,
          pointHoverRadius: 9,
          borderWidth: 2.5,
          borderDash: [6, 3],
          tension: 0.25,
          fill: false,
        },
        {
          label: "Intrusion L (L)",
          data: [0.22, 0.17, 0.071],
          borderColor: "#47577c",
          backgroundColor: "rgba(71,87,124,0.08)",
          pointBackgroundColor: "#47577c",
          pointRadius: 6,
          pointHoverRadius: 9,
          borderWidth: 2.5,
          tension: 0.25,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1100,
        easing: "easeInOutCubic",
      },
      scales: {
        x: {
          grid: { color: "#f1f5f9" },
          ticks: {
            color: "#475569",
            font: { weight: "bold", size: 12 },
          },
          title: {
            display: true,
            text: "Cumulative FE Runs",
            color: "#9d9d9c",
            font: { size: 11, weight: "600" },
            padding: { top: 8 },
          },
        },
        y: {
          min: 0,
          max: 0.62,
          grid: { color: "#f1f5f9" },
          ticks: {
            color: "#475569",
            font: { size: 11 },
            callback: function (val) {
              return val.toFixed(2);
            },
          },
          title: {
            display: true,
            text: "NRMSE  (lower = better)",
            color: "#9d9d9c",
            font: { size: 11, weight: "600" },
            padding: { bottom: 8 },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "#475569",
            font: { family: "Inter", weight: "600", size: 12 },
            boxWidth: 14,
            boxHeight: 14,
            borderRadius: 3,
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: commonTooltip,
        /* annotation-style: draw a horizontal "target zone" band */
      },
    },
    plugins: [
      {
        id: "sc-zones",
        afterDraw: function (chart) {
          var ctx = chart.ctx;
          var yAxis = chart.scales.y;
          var xAxis = chart.scales.x;
          var left = xAxis.left;
          var right = xAxis.right;

          /* shaded "acceptable" zone: NRMSE < 0.20 */
          var yTop = yAxis.getPixelForValue(0.2);
          var yBottom = yAxis.getPixelForValue(0);
          ctx.save();
          ctx.fillStyle = "rgba(71,87,124,0.045)";
          ctx.fillRect(left, yTop, right - left, yBottom - yTop);

          /* dashed threshold line at 0.20 */
          ctx.beginPath();
          ctx.strokeStyle = "#c5cde0";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.moveTo(left, yTop);
          ctx.lineTo(right, yTop);
          ctx.stroke();
          ctx.setLineDash([]);

          /* label */
          ctx.font = "600 10px Inter, sans-serif";
          ctx.fillStyle = "#9d9d9c";
          ctx.fillText("NRMSE < 0.20  (acceptable zone)", left + 6, yTop - 5);
          ctx.restore();
        },
      },
    ],
  });

  /* reveal observer */
  var els = document.querySelectorAll(".nrmse-reveal");
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("nrmse-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  els.forEach(function (el) {
    obs.observe(el);
  });
})();
//    <!-- INFOGRAPHIC PLACEHOLDER 4 -->
(function () {
  var els = document.querySelectorAll(".gate-reveal");
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("gate-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  els.forEach(function (el) {
    obs.observe(el);
  });
})();
//   <!-- INFOGRAPHIC PLACEHOLDER 5 -->
(function () {
  /* ── Generate synthetic Pareto branch points matching the described ranges ── */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function rand() {
    return Math.random();
  }

  /* Branch I: M in [100.6, 104.8], L in [5.430, 5.516], n=106, negative correlation */
  var branchI = [];
  for (var i = 0; i < 106; i++) {
    var t = i / 105;
    var noise = (rand() - 0.5) * 0.008;
    var m = lerp(100.6, 104.8, t) + (rand() - 0.5) * 0.3;
    var l = lerp(5.516, 5.43, t) + noise;
    branchI.push({ x: +m.toFixed(3), y: +l.toFixed(4) });
  }
  /* sort by M for clean front */
  branchI.sort(function (a, b) {
    return a.x - b.x;
  });

  /* Branch II: M in [110.7, 115.1], L in [5.362, 5.430], n=94, negative correlation */
  var branchII = [];
  for (var j = 0; j < 94; j++) {
    var t2 = j / 93;
    var noise2 = (rand() - 0.5) * 0.006;
    var m2 = lerp(110.7, 115.1, t2) + (rand() - 0.5) * 0.25;
    var l2 = lerp(5.43, 5.362, t2) + noise2;
    branchII.push({ x: +m2.toFixed(3), y: +l2.toFixed(4) });
  }
  branchII.sort(function (a, b) {
    return a.x - b.x;
  });

  /* ── Custom plugin: gap annotation + branch labels ── */
  var gapPlugin = {
    id: "gapAnnotation",
    afterDraw: function (chart) {
      var ctx = chart.ctx;
      var xAxis = chart.scales.x;
      var yAxis = chart.scales.y;

      /* Gap shaded region: M from ~104.8 to ~110.7 */
      var gapLeft = xAxis.getPixelForValue(105.0);
      var gapRight = xAxis.getPixelForValue(110.5);
      var gapTop = yAxis.getPixelForValue(5.52);
      var gapBot = yAxis.getPixelForValue(5.34);

      ctx.save();
      ctx.fillStyle = "rgba(157,157,156,0.10)";
      ctx.fillRect(gapLeft, gapTop, gapRight - gapLeft, gapBot - gapTop);

      /* Gap label */
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "#d0d5dd";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(gapLeft, gapTop + 10);
      ctx.lineTo(gapLeft, gapBot - 10);
      ctx.moveTo(gapRight, gapTop + 10);
      ctx.lineTo(gapRight, gapBot - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      var midGap = (gapLeft + gapRight) / 2;
      var midY = (gapTop + gapBot) / 2;
      ctx.font = "600 10px Inter, sans-serif";
      ctx.fillStyle = "#9d9d9c";
      ctx.textAlign = "center";
      ctx.fillText("PoF gap", midGap, midY - 6);
      ctx.fillText("(filtered)", midGap, midY + 8);

      /* Branch I label */
      var b1x = xAxis.getPixelForValue(101.8);
      var b1y = yAxis.getPixelForValue(5.514);
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillStyle = "#47577c";
      ctx.textAlign = "left";
      ctx.fillText("Branch I", b1x, b1y - 10);
      ctx.font = "500 10px Inter, sans-serif";
      ctx.fillStyle = "#9d9d9c";
      ctx.fillText("low mass", b1x, b1y + 2);

      /* Branch II label */
      var b2x = xAxis.getPixelForValue(111.2);
      var b2y = yAxis.getPixelForValue(5.425);
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillStyle = "#bf3425";
      ctx.textAlign = "left";
      ctx.fillText("Branch II", b2x, b2y - 10);
      ctx.font = "500 10px Inter, sans-serif";
      ctx.fillStyle = "#9d9d9c";
      ctx.fillText("low intrusion", b2x, b2y + 2);

      ctx.restore();
    },
  };

  new Chart(document.getElementById("paretoChart"), {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Branch I (Low Mass)",
          data: branchI,
          backgroundColor: "rgba(71,87,124,0.70)",
          pointRadius: 4,
          pointHoverRadius: 7,
          pointStyle: "circle",
        },
        {
          label: "Branch II (Low Intrusion)",
          data: branchII,
          backgroundColor: "rgba(191,52,37,0.70)",
          pointRadius: 4,
          pointHoverRadius: 7,
          pointStyle: "circle",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: "easeOutCubic" },
      scales: {
        x: {
          min: 99,
          max: 117,
          grid: { color: "#f1f5f9" },
          ticks: {
            color: "#475569",
            font: { size: 11 },
            stepSize: 2,
            callback: function (v) {
              return v % 2 === 0 ? v : "";
            },
          },
          title: {
            display: true,
            text: "Mass M (kg)",
            color: "#64748b",
            font: { size: 12, weight: "700" },
            padding: { top: 8 },
          },
        },
        y: {
          min: 5.33,
          max: 5.54,
          grid: { color: "#f1f5f9" },
          ticks: {
            color: "#475569",
            font: { size: 11 },
            callback: function (v) {
              return v.toFixed(2);
            },
          },
          title: {
            display: true,
            text: "Intrusion L (mm)",
            color: "#64748b",
            font: { size: 12, weight: "700" },
            padding: { bottom: 8 },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "#475569",
            font: { family: "Inter", weight: "600", size: 12 },
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#47577c",
          bodyColor: "#1e293b",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            title: function (items) {
              return items[0].dataset.label;
            },
            label: function (ctx) {
              return [
                " Mass: " + ctx.parsed.x.toFixed(2) + " kg",
                " Intrusion: " + ctx.parsed.y.toFixed(4) + " mm",
              ];
            },
          },
        },
      },
    },
    plugins: [gapPlugin],
  });

  /* reveal */
  var els = document.querySelectorAll(".pareto-reveal");
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("pareto-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  els.forEach(function (el) {
    obs.observe(el);
  });
})();
//  <!-- INFOGRAPHIC PLACEHOLDER 6 -->
(function () {
  var animated = false;

  function animateBars() {
    if (animated) return;
    animated = true;
    /* main fills */
    document
      .querySelectorAll(".fev-bar-fill[data-width]")
      .forEach(function (el) {
        setTimeout(function () {
          el.style.width = el.dataset.width + "%";
        }, 200);
      });
    /* overflow */
    document
      .querySelectorAll(".fev-bar-overflow[data-width]")
      .forEach(function (el) {
        setTimeout(function () {
          el.style.width = el.dataset.width + "%";
        }, 500);
      });
  }

  /* reveal + bar trigger */
  var els = document.querySelectorAll(".fev-reveal");
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("fev-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  els.forEach(function (el) {
    obs.observe(el);
  });

  /* trigger bars when container visible */
  var container = document.querySelector(".fev-container");
  var barObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateBars();
          barObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 },
  );
  if (container) barObs.observe(container);
})();
//   <!-- INFOGRAPHIC PLACEHOLDER 7 -->
(function () {
  var animated = false;
  function animateBars() {
    if (animated) return;
    animated = true;
    setTimeout(function () {
      var fe = document.getElementById("feBar");
      var sr = document.getElementById("surrBar");
      if (fe) fe.style.width = fe.dataset.width + "%";
      if (sr) sr.style.width = sr.dataset.width + "%";
    }, 250);
  }

  var els = document.querySelectorAll(".spd-reveal");
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("spd-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  els.forEach(function (el) {
    obs.observe(el);
  });

  var container = document.querySelector(".spd-container");
  var barObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateBars();
          barObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 },
  );
  if (container) barObs.observe(container);
})();
