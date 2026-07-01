/* ============================================
   MILITARY COMPOSITES BLOG — JAVASCRIPT
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
    ".learn-more-card, .highlight-box, .infographic-placeholder",
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
//   <!-- INFOGRAPHIC PLACEHOLDER 1 -->
(function () {
  var rows = document.querySelectorAll(".cmkt-row");
  var animated = false;

  function animate() {
    if (animated) return;
    animated = true;
    rows.forEach(function (row, i) {
      var pct = parseFloat(row.getAttribute("data-pct"));
      var fill = row.querySelector(".cmkt-bar-fill");
      setTimeout(function () {
        fill.style.width = pct + "%";
        fill.classList.add("cmkt-animated");
      }, i * 90);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) animate();
      });
    },
    { threshold: 0.2 },
  );

  var root = document.getElementById("cmkt-root");
  if (root) obs.observe(root);
  else animate();
})();
//    <!-- INFOGRAPHIC PLACEHOLDER 2 -->
(function () {
  var MIN_MPa = 1800;
  var MAX_MPa = 6200;
  var RANGE = MAX_MPa - MIN_MPa;

  var materials = [
    {
      label: "CFRP",
      lo: 3500,
      hi: 6000,
      color: "#47577c",
      tip: "CFRP: 3,500 – 6,000 MPa",
    },
    {
      label: "Kevlar-alumina",
      lo: 3000,
      hi: 5000,
      color: "#bf3425",
      tip: "Kevlar-alumina: 3,000 – 5,000 MPa",
    },
    {
      label: "Boron epoxy",
      lo: 3500,
      hi: 4000,
      color: "#47577c",
      tip: "Boron epoxy: 3,500 – 4,000 MPa",
      alpha: "99",
    },
    {
      label: "AFRP (Kevlar)",
      lo: 3000,
      hi: 3600,
      color: "#9d9d9c",
      tip: "AFRP (Kevlar): 3,000 – 3,600 MPa",
    },
    {
      label: "GFRP",
      lo: 2000,
      hi: 3500,
      color: "#c8cdd8",
      tip: "GFRP: 2,000 – 3,500 MPa",
    },
  ];

  var ticks = [2000, 3000, 4000, 5000, 6000];

  function pct(v) {
    return (((v - MIN_MPa) / RANGE) * 100).toFixed(3) + "%";
  }

  var axisEl = document.getElementById("tsrc-axis-labels");
  ticks.forEach(function (t) {
    var span = document.createElement("span");
    span.className = "tsrc-axis-tick";
    span.style.left = pct(t);
    span.textContent = t.toLocaleString();
    axisEl.appendChild(span);
  });

  var wrap = document.getElementById("tsrc-rows-wrap");

  materials.forEach(function (m, i) {
    var leftPct = ((m.lo - MIN_MPa) / RANGE) * 100;
    var widthPct = ((m.hi - m.lo) / RANGE) * 100;
    var rightPct = leftPct + widthPct;

    var row = document.createElement("div");
    row.className = "tsrc-row";
    row.style.marginLeft = "160px";
    row.style.height = "44px";
    row.style.position = "relative";

    var lbl = document.createElement("div");
    lbl.className = "tsrc-row-label";
    lbl.textContent = m.label;
    row.appendChild(lbl);

    var track = document.createElement("div");
    track.className = "tsrc-track";
    track.style.position = "relative";
    track.style.width = "100%";
    track.style.height = "44px";

    ticks.forEach(function (t) {
      var gl = document.createElement("div");
      gl.style.cssText =
        "position:absolute;top:0;bottom:0;width:1px;background:#f1f5f9;left:" +
        pct(t);
      track.appendChild(gl);
    });

    var bar = document.createElement("div");
    bar.className = "tsrc-range-bar";
    bar.style.left = leftPct.toFixed(3) + "%";
    bar.style.width = widthPct.toFixed(3) + "%";
    bar.style.top = "50%";
    bar.style.transform = "translateY(-50%)";
    bar.style.background = m.color;
    track.appendChild(bar);

    var barLabel = document.createElement("div");
    barLabel.className = "tsrc-range-label";
    barLabel.style.left = leftPct.toFixed(3) + "%";
    barLabel.style.width = widthPct.toFixed(3) + "%";
    barLabel.style.top = "50%";
    barLabel.style.transform = "translateY(-50%)";
    barLabel.style.position = "absolute";
    barLabel.textContent =
      m.lo.toLocaleString() + " – " + m.hi.toLocaleString() + " MPa";
    track.appendChild(barLabel);

    var tip = document.createElement("div");
    tip.className = "tsrc-tooltip";
    tip.textContent = m.tip;
    tip.style.left = (leftPct + widthPct / 2).toFixed(3) + "%";
    track.appendChild(tip);

    row.appendChild(track);
    wrap.appendChild(row);
    m._bar = bar;
    m._barLabel = barLabel;
  });

  var animated = false;
  function animate() {
    if (animated) return;
    animated = true;
    materials.forEach(function (m, i) {
      setTimeout(function () {
        m._bar.classList.add("tsrc-visible");
        m._barLabel.classList.add("tsrc-visible");
      }, i * 130);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) animate();
      });
    },
    { threshold: 0.2 },
  );
  var root = document.getElementById("tsrc-root");
  if (root) obs.observe(root);
  else animate();
})();
//   <!-- INFOGRAPHIC PLACEHOLDER 3 -->
(function () {
  var cells = document.querySelectorAll(".uavts-cell");
  var animated = false;

  cells.forEach(function (cell) {
    var tip = cell.getAttribute("data-tip");
    if (tip) {
      var tt = document.createElement("div");
      tt.style.cssText = [
        "position:absolute",
        "bottom:calc(100% + 8px)",
        "left:50%",
        "transform:translateX(-50%)",
        "background:#1e293b",
        "color:#fff",
        "font-size:11px",
        "line-height:1.5",
        "padding:7px 11px",
        "border-radius:8px",
        "white-space:nowrap",
        "max-width:220px",
        "white-space:normal",
        "text-align:center",
        "pointer-events:none",
        "display:none",
        "z-index:30",
        "width:200px",
      ].join(";");
      tt.textContent = tip;
      cell.appendChild(tt);

      cell.addEventListener("mouseenter", function () {
        tt.style.display = "block";
      });
      cell.addEventListener("mouseleave", function () {
        tt.style.display = "none";
      });
    }
  });

  function animate() {
    if (animated) return;
    animated = true;
    cells.forEach(function (cell) {
      var delay = parseInt(cell.getAttribute("data-delay") || "0", 10);
      setTimeout(function () {
        cell.classList.add("uavts-revealed");
      }, delay);
    });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) animate();
      });
    },
    { threshold: 0.15 },
  );
  var root = document.getElementById("uavts-root");
  if (root) obs.observe(root);
  else animate();
})();
//  <!-- INFOGRAPHIC PLACEHOLDER 4 -->
(function () {
  var animated = false;
  function animate() {
    if (animated) return;
    animated = true;
    document.getElementById("bhev-spine-fill").style.width = "100%";
    document
      .querySelectorAll(
        ".bhev-era-pill, .bhev-node-dot, .bhev-node-year, .bhev-node-name, .bhev-node-desc, .bhev-band-card",
      )
      .forEach(function (el) {
        el.classList.add("bhev-vis");
      });
  }
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) animate();
      });
    },
    { threshold: 0.15 },
  );
  var root = document.getElementById("bhev-root");
  if (root) obs.observe(root);
  else animate();
})();
//  <!-- INFOGRAPHIC PLACEHOLDER 5 -->
(function () {
  var animated = false;

  function drawLines() {
    var svg = document.getElementById("ngdc-svg");
    var col = document.getElementById("ngdc-connector-col");
    var hub = document.getElementById("ngdc-hub");
    var branches = document.querySelectorAll(".ngdc-branch");
    if (!svg || !col || !hub || !branches.length) return;

    svg.innerHTML = "";
    var colRect = col.getBoundingClientRect();
    var hubRect = hub.getBoundingClientRect();
    var startX = hubRect.right - colRect.left;
    var startY = hubRect.top + hubRect.height / 2 - colRect.top;

    var midX = startX + 36;

    branches.forEach(function (branch, i) {
      var branchRect = branch.getBoundingClientRect();
      var endX = branchRect.left - colRect.left + 52;
      var endY = branchRect.top + branchRect.height / 2 - colRect.top;

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      var d =
        "M " +
        startX +
        " " +
        startY +
        " L " +
        midX +
        " " +
        startY +
        " L " +
        midX +
        " " +
        endY +
        " L " +
        endX +
        " " +
        endY;
      path.setAttribute("d", d);
      path.setAttribute("stroke", "#d1d8e8");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-dasharray", "4 3");
      path.setAttribute("opacity", "0");
      path.style.transition = "opacity 0.4s " + (0.1 + i * 0.1) + "s";
      svg.appendChild(path);

      var dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      dot.setAttribute("cx", endX);
      dot.setAttribute("cy", endY);
      dot.setAttribute("r", "4");
      dot.setAttribute("fill", "#47577c");
      dot.setAttribute("opacity", "0");
      dot.style.transition = "opacity 0.3s " + (0.25 + i * 0.1) + "s";
      svg.appendChild(dot);

      if (animated) {
        path.setAttribute("opacity", "1");
        dot.setAttribute("opacity", "1");
      }
    });
  }

  function animate() {
    if (animated) return;
    animated = true;
    document.getElementById("ngdc-hub").classList.add("ngdc-vis");
    document.querySelectorAll(".ngdc-branch").forEach(function (el) {
      el.classList.add("ngdc-vis");
    });
    document
      .querySelectorAll("#ngdc-svg path, #ngdc-svg circle")
      .forEach(function (el) {
        el.setAttribute("opacity", "1");
      });
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          drawLines();
          setTimeout(animate, 80);
        }
      });
    },
    { threshold: 0.1 },
  );

  var root = document.getElementById("ngdc-root");
  if (root) {
    obs.observe(root);
    window.addEventListener("resize", function () {
      drawLines();
    });
  }
})();
//  <!-- INFOGRAPHIC PLACEHOLDER 6 -->
(function () {
  var animated = false;
  function animate() {
    if (animated) return;
    animated = true;
    document.querySelectorAll(".csd-card").forEach(function (el) {
      el.classList.add("csd-vis");
    });
  }
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) animate();
      });
    },
    { threshold: 0.1 },
  );
  var root = document.getElementById("csd-root");
  if (root) obs.observe(root);
  else animate();
})();
