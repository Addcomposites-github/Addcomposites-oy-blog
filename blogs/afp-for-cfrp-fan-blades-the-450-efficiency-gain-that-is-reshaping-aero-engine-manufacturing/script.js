/* ============================================
   AFP FAN BLADES BLOG — JAVASCRIPT
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
//    <!-- INFOGRAPHIC 1: BYPASS RATIO EVOLUTION & FAN BLADE MATERIAL PROGRESSION -->
(function () {
  /* ── Data ── */
  var engines = [
    {
      label: "Trent 700 / CF6 era",
      year: 1972,
      bpr: 5,
      era: "metal",
      note: "Titanium / Metal",
    },
    {
      label: "GE90",
      year: 1995,
      bpr: 6,
      era: "early",
      note: "1st CFRP in service, hand layup",
    },
    { label: "GEnx", year: 2006, bpr: 8, era: "advanced", note: "CFRP" },
    {
      label: "LEAP-X",
      year: 2013,
      bpr: 10,
      era: "advanced",
      note: "CFRP / RTM",
    },
    {
      label: "GE9X",
      year: 2018,
      bpr: 12,
      era: "advanced",
      note: "4th-gen CFRP",
    },
    {
      label: "UltraFan",
      year: 2030,
      bpr: 15,
      era: "advanced",
      note: "CFRP / AFP",
    },
  ];

  var eraColors = {
    metal: "#9d9d9c",
    early: "rgba(71,87,124,0.55)",
    advanced: "#47577c",
  };

  var xLabels = engines.map(function (e) {
    return e.year;
  });
  var yValues = engines.map(function (e) {
    return e.bpr;
  });
  var pointBgs = engines.map(function (e) {
    return eraColors[e.era];
  });

  /* ── Chart.js custom plugin: animated background bands ── */
  var eraBandPlugin = {
    id: "eraBands",
    beforeDraw: function (chart) {
      var ctx = chart.ctx;
      var xScale = chart.scales.x;
      var yScale = chart.scales.y;
      var top = chart.chartArea.top;
      var bottom = chart.chartArea.bottom;

      var bands = [
        {
          x1: 1965,
          x2: 1992,
          color: "rgba(157,157,156,0.08)",
          label: "Metal era",
        },
        {
          x1: 1992,
          x2: 2002,
          color: "rgba(71,87,124,0.06)",
          label: "Early CFRP",
        },
        {
          x1: 2002,
          x2: 2034,
          color: "rgba(71,87,124,0.12)",
          label: "Advanced CFRP",
        },
      ];

      bands.forEach(function (b) {
        var x1 = xScale.getPixelForValue(b.x1);
        var x2 = xScale.getPixelForValue(b.x2);
        ctx.fillStyle = b.color;
        ctx.fillRect(x1, top, x2 - x1, bottom - top);
      });
    },
  };

  var ctx = document.getElementById("bprChart").getContext("2d");

  /* Gradient for line fill */
  var gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(71,87,124,0.18)");
  gradient.addColorStop(1, "rgba(71,87,124,0)");

  var chart = new Chart(ctx, {
    type: "line",
    plugins: [eraBandPlugin],
    data: {
      labels: xLabels,
      datasets: [
        {
          label: "Bypass Ratio",
          data: yValues,
          borderColor: "#47577c",
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: pointBgs,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2.5,
          pointRadius: 8,
          pointHoverRadius: 11,
          pointHoverBorderWidth: 3,
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
          min: 1965,
          max: 2034,
          ticks: {
            color: "#64748b",
            font: { size: 11, family: "Inter" },
            callback: function (v) {
              return v;
            },
            stepSize: 10,
          },
          grid: { color: "#f1f5f9" },
          title: {
            display: true,
            text: "Year of Entry to Service",
            color: "#9d9d9c",
            font: { size: 11, family: "Inter" },
          },
        },
        y: {
          min: 0,
          max: 17,
          ticks: {
            color: "#64748b",
            font: { size: 11, family: "Inter" },
            stepSize: 3,
          },
          grid: { color: "#f1f5f9" },
          title: {
            display: true,
            text: "Bypass Ratio (BPR)",
            color: "#9d9d9c",
            font: { size: 11, family: "Inter" },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#47577c",
          bodyColor: "#1e293b",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function (items) {
              var idx = items[0].dataIndex;
              return engines[idx].label;
            },
            label: function (item) {
              var idx = item.dataIndex;
              var e = engines[idx];
              return [
                "BPR: " + e.bpr,
                "Year: ~" + e.year,
                "Material: " + e.note,
              ];
            },
          },
        },
      },
    },
  });

  /* ── Custom point labels (engine names) ── */
  var labelPlugin = {
    id: "engineLabels",
    afterDatasetsDraw: function (ch) {
      var ctx2 = ch.ctx;
      var ds = ch.getDatasetMeta(0);
      var data = ds.data;

      ctx2.save();
      ctx2.font = "bold 10px Inter, sans-serif";
      ctx2.textAlign = "left";

      var offsets = [
        { dx: -90, dy: -16 }, // Trent 700
        { dx: 12, dy: -14 }, // GE90
        { dx: 12, dy: -14 }, // GEnx
        { dx: 12, dy: 18 }, // LEAP-X
        { dx: 12, dy: -14 }, // GE9X
        { dx: -85, dy: -14 }, // UltraFan
      ];

      data.forEach(function (pt, i) {
        var e = engines[i];
        ctx2.fillStyle = eraColors[e.era];
        var off = offsets[i];
        ctx2.fillText(e.label, pt.x + off.dx, pt.y + off.dy);
      });

      ctx2.restore();
    },
  };

  Chart.register(labelPlugin);
  chart.update();

  /* ── Scroll-reveal for legend pills ── */
  var legendEl = document.getElementById("bprLegend");
  var pills = legendEl.querySelectorAll(".bpr-era-block");

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          pills.forEach(function (p) {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
            p.style.transition =
              "opacity 0.45s ease " +
              p.style.transitionDelay +
              ", transform 0.45s ease " +
              p.style.transitionDelay;
          });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  obs.observe(legendEl);
})();
// <!-- INFOGRAPHIC 2: MANUFACTURING PROCESS CAPABILITY COMPARISON -->
(function () {
  /* ── Row definitions ── */
  var rows = [
    {
      label: "Layup Efficiency\n(relative)",
      type: "dots",
      values: [
        { dots: 1, isAfp: false },
        { dots: 3, isAfp: false },
        { dots: 0, na: true },
        { dots: 5, isAfp: true },
      ],
    },
    {
      label: "Material Waste\n(lower is better)",
      type: "bar",
      note: "lower = better",
      values: [
        { pct: 100, isAfp: false },
        { pct: 50, isAfp: false },
        { pct: 38, isAfp: false },
        { pct: 25, isAfp: true },
      ],
    },
    {
      label: "Complex 3D Geometry\n(double-curved twist)",
      type: "dots",
      values: [
        { dots: 3, isAfp: false },
        { dots: 1, isAfp: false },
        { dots: 2, isAfp: false },
        { dots: 5, isAfp: true },
      ],
    },
    {
      label: "Fiber Angle Control\n(steering precision)",
      type: "dots",
      values: [
        { dots: 2, isAfp: false },
        { dots: 2, isAfp: false },
        { dots: 0, na: true },
        { dots: 5, isAfp: true },
      ],
    },
    {
      label: "Thermoset / Thermoplastic\nCapable",
      type: "text",
      values: [
        { text: "Both", isAfp: false },
        { text: "Both", isAfp: false },
        { text: "Thermoset only", isAfp: false },
        { text: "Both", isAfp: true },
      ],
    },
    {
      label: "Defect Detectability\n(in-process)",
      type: "text",
      values: [
        { text: "Low (human)", isAfp: false },
        { text: "Medium", isAfp: false },
        { text: "Post-cure only", isAfp: false },
        { text: "High (in-situ)", isAfp: true },
      ],
    },
    {
      label: "Scale-up to\nHigh Volume",
      type: "text",
      values: [
        { text: "Very low", isAfp: false },
        { text: "Low", isAfp: false },
        { text: "Medium", isAfp: false },
        { text: "High", isAfp: true },
      ],
    },
  ];

  /* ── Build dots HTML ── */
  function makeDots(count, isAfp, isNa) {
    if (isNa) return '<span class="mpc-badge neutral">n/a</span>';
    var html = '<div class="mpc-dots">';
    for (var i = 0; i < 5; i++) {
      var cls = i < count ? "filled" + (isAfp ? " red" : "") : "";
      html += '<div class="mpc-dot ' + cls + '"></div>';
    }
    html += "</div>";
    return html;
  }

  /* ── Build bar HTML ── */
  function makeBar(pct, isAfp) {
    var cls = isAfp ? "red" : "navy";
    return (
      '<div class="mpc-bar-wrap">' +
      '<div class="mpc-bar-track"><div class="mpc-bar-fill ' +
      cls +
      '" data-pct="' +
      pct +
      '"></div></div>' +
      "</div>"
    );
  }

  /* ── Build text badge HTML ── */
  function makeBadge(text, isAfp) {
    var cls = isAfp ? "highlight" : "";
    return '<span class="mpc-badge ' + cls + '">' + text + "</span>";
  }

  /* ── Render rows ── */
  var tbody = document.getElementById("mpcBody");
  rows.forEach(function (row, ri) {
    var tr = document.createElement("tr");

    // Label cell
    var labelTd = document.createElement("td");
    labelTd.innerHTML =
      row.label.replace(
        "\n",
        '<br><span style="font-size:11px;font-weight:400;color:#9d9d9c">',
      ) + "</span>";
    tr.appendChild(labelTd);

    // Value cells
    row.values.forEach(function (v) {
      var td = document.createElement("td");
      if (v.isAfp) td.classList.add("mpc-afp-cell");

      if (row.type === "dots") {
        td.innerHTML = makeDots(v.dots, v.isAfp, v.na);
      } else if (row.type === "bar") {
        td.innerHTML = makeBar(v.pct, v.isAfp);
      } else {
        td.innerHTML = makeBadge(v.text, v.isAfp);
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  /* ── Intersection-triggered row reveal ── */
  var trs = tbody.querySelectorAll("tr");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        trs.forEach(function (tr, i) {
          setTimeout(function () {
            tr.classList.add("mpc-visible");
          }, i * 90);
        });
        // Animate bars once rows are visible
        setTimeout(
          function () {
            document.querySelectorAll(".mpc-bar-fill").forEach(function (bar) {
              bar.style.width = bar.dataset.pct + "%";
            });
          },
          trs.length * 90 + 100,
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(document.getElementById("mpcRoot"));

  /* ── Hover dot pulse ── */
  tbody.addEventListener("mouseover", function (e) {
    var row = e.target.closest("tr");
    if (!row) return;
    row.querySelectorAll(".mpc-dot.filled").forEach(function (d, i) {
      setTimeout(function () {
        d.style.transform = "scale(1.35)";
        setTimeout(function () {
          d.style.transform = "";
        }, 200);
      }, i * 35);
    });
  });
})();
//  <!-- INFOGRAPHIC 3: AFP FAN BLADE MANUFACTURING CHALLENGE TOPOLOGY -->
(function () {
  var root = document.getElementById("ctRoot");
  var topNode = document.getElementById("ctTopNode");
  var bottomNode = document.getElementById("ctBottomNode");
  var cards = document.querySelectorAll("#ctCards .ct-card");

  var fired = false;

  var obs = new IntersectionObserver(
    function (entries) {
      if (fired) return;
      if (!entries[0].isIntersecting) return;
      fired = true;
      obs.unobserve(root);

      /* 1. Top node */
      setTimeout(function () {
        topNode.style.opacity = "1";
        topNode.style.transform = "translateY(0)";
      }, 80);

      /* 2. Cards staggered */
      cards.forEach(function (card, i) {
        setTimeout(
          function () {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

            /* 3. Bullets within each card, staggered */
            var bullets = card.querySelectorAll(".ct-bullet");
            bullets.forEach(function (b, j) {
              setTimeout(function () {
                b.style.opacity = "1";
                b.style.transform = "translateX(0)";
              }, j * 70);
            });
          },
          300 + i * 130,
        );
      });

      /* 4. Bottom node */
      setTimeout(
        function () {
          bottomNode.style.opacity = "1";
          bottomNode.style.transform = "translateY(0)";
        },
        300 + cards.length * 130 + 300,
      );
    },
    { threshold: 0.18 },
  );

  obs.observe(root);

  /* Hover: re-pulse bullets on card hover */
  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      var bullets = card.querySelectorAll(".ct-bullet");
      bullets.forEach(function (b, i) {
        b.style.transition = "none";
        b.style.transform = "translateX(-5px)";
        b.style.opacity = "0.6";
        setTimeout(function () {
          b.style.transition =
            "opacity 0.3s ease " +
            i * 50 +
            "ms, transform 0.3s ease " +
            i * 50 +
            "ms";
          b.style.transform = "translateX(0)";
          b.style.opacity = "1";
        }, 20);
      });
    });
  });
})();
//    <!-- INFOGRAPHIC 4: IRDM-AFP INTEGRATED DEVELOPMENT LOOP -->
(function () {
  var root = document.getElementById("irdmRoot");
  var fired = false;

  var obs = new IntersectionObserver(
    function (entries) {
      if (fired || !entries[0].isIntersecting) return;
      fired = true;
      obs.unobserve(root);

      /* 1. Virtual domain panel */
      setTimeout(function () {
        document.getElementById("irdmVirtual").style.opacity = "1";
        document.getElementById("irdmVirtual").style.transform =
          "translateY(0)";
      }, 80);

      /* 2. Virtual nodes + arrows staggered */
      var vNodes = document.querySelectorAll('[data-domain="v"]');
      var vArrows = document.querySelectorAll(".irdm-virtual .irdm-arrow svg");
      vNodes.forEach(function (n, i) {
        setTimeout(
          function () {
            n.style.opacity = "1";
            n.style.transform = "translateX(0)";
            if (vArrows[i]) vArrows[i].style.opacity = "1";
          },
          280 + i * 130,
        );
      });

      var vDelay = 280 + vNodes.length * 130;

      /* 3. Bridge 1 */
      setTimeout(function () {
        document.getElementById("irdmVline1").style.opacity = "1";
        document.getElementById("irdmBarrow1").style.opacity = "1";
      }, vDelay + 80);

      /* 4. Physical domain panel */
      setTimeout(function () {
        document.getElementById("irdmPhysical").style.opacity = "1";
        document.getElementById("irdmPhysical").style.transform =
          "translateY(0)";
      }, vDelay + 220);

      /* 5. Physical nodes (reversed — AFP first, then inspection, then sensors) */
      var pNodes = document.querySelectorAll('[data-domain="p"]');
      var pArrows = document.querySelectorAll(".irdm-physical .irdm-arrow svg");
      /* Visual order in DOM is reversed due to flex-direction: row-reverse */
      var pOrder = [2, 1, 0]; /* AFP → inspection → sensors */
      pOrder.forEach(function (domIdx, seqIdx) {
        setTimeout(
          function () {
            pNodes[domIdx].style.opacity = "1";
            pNodes[domIdx].style.transform = "translateX(0)";
            if (pArrows[seqIdx]) pArrows[seqIdx].style.opacity = "1";
          },
          vDelay + 380 + seqIdx * 130,
        );
      });

      var pDelay = vDelay + 380 + pOrder.length * 130;

      /* 6. Bridge 2 */
      setTimeout(function () {
        document.getElementById("irdmVline2").style.opacity = "1";
        document.getElementById("irdmBarrow2").style.opacity = "1";
      }, pDelay + 80);

      /* 7. Data domain */
      setTimeout(function () {
        document.getElementById("irdmData").style.opacity = "1";
        document.getElementById("irdmData").style.transform = "translateY(0)";
      }, pDelay + 220);
    },
    { threshold: 0.15 },
  );

  obs.observe(root);

  /* Hover pulse on nodes */
  document.querySelectorAll(".irdm-node").forEach(function (node) {
    node.addEventListener("mouseenter", function () {
      node.style.transition =
        "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease";
    });
  });
})();
