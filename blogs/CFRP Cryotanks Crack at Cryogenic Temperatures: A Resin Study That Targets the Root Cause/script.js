
/* ============================================
   CFRP CRYOTANKS BLOG — JAVASCRIPT
   Sidebar Navigation & Interactive Features
   Replicated from the Addcomposites reference build.
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

/* ============================================
   INFOGRAPHIC SCRIPTS
   Per-infographic JS goes here when infographic markup is injected
   into the INFOGRAPHIC SECTION placeholders in the HTML.
   ============================================ */

/* infographic 1 */
(function() {
  // Scroll-reveal
  var wrap = document.getElementById('viscWrap');
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { wrap.classList.add('visc-visible'); io.disconnect(); }
    });
  }, { threshold: 0.15 });
  io.observe(wrap);
 
  // Data points — bath-tub curve matching ASCII spec
  // Points: RT ~800 → drops to ~85 at 60°C → rises back to ~800 at ~105°C then surges
  var tempLabels = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
  var viscData   = [800,600,380,220,145,108, 92, 85, 88, 95,110,135,175,240,340,500,700,820,900,950];
 
  // Threshold line (flat at 850)
  var thresholdData = tempLabels.map(function() { return 850; });
 
  // Processing window fill (plugin)
  var windowPlugin = {
    id: 'processingWindow',
    beforeDraw: function(chart) {
      var ctx = chart.ctx;
      var xAxis = chart.scales.x;
      var yAxis = chart.scales.y;
      var xStart = xAxis.getPixelForValue(25);
      var xEnd   = xAxis.getPixelForValue(120);
      // Find where viscosity crosses 850 on the way up (right side ~104°C approx)
      var xCross = xAxis.getPixelForValue(104);
      var yTop   = chart.chartArea.top;
      var yBottom = yAxis.getPixelForValue(850);
 
      ctx.save();
      ctx.fillStyle = 'rgba(71, 87, 124, 0.07)';
      ctx.fillRect(xStart, yTop, xCross - xStart, yBottom - yTop);
      ctx.restore();
    }
  };
 
  // Annotations (vertical event lines) as a custom plugin
  var eventPlugin = {
    id: 'eventMarkers',
    afterDraw: function(chart) {
      var ctx = chart.ctx;
      var xAxis = chart.scales.x;
      var yAxis = chart.scales.y;
      var chartArea = chart.chartArea;
 
      // Best flow zone label at 60°C
      var x60 = xAxis.getPixelForValue(60);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(71,87,124,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x60, chartArea.top); ctx.lineTo(x60, chartArea.bottom); ctx.stroke();
      ctx.restore();
 
      // Gelation dot at ~120°C, viscosity surging
      var xGel = xAxis.getPixelForValue(120);
      var yGel = yAxis.getPixelForValue(950);
      ctx.save();
      ctx.fillStyle = '#bf3425';
      ctx.beginPath(); ctx.arc(xGel, yGel, 6, 0, Math.PI*2); ctx.fill();
      ctx.restore();
 
      // Exotherm onset dot at ~105°C
      var xExo = xAxis.getPixelForValue(105);
      var yExo = yAxis.getPixelForValue(700);
      ctx.save();
      ctx.fillStyle = '#9d9d9c';
      ctx.beginPath(); ctx.arc(xExo, yExo, 6, 0, Math.PI*2); ctx.fill();
      ctx.restore();
 
      // Labels
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = '#9d9d9c';
      ctx.textAlign = 'center';
      ctx.fillText('Best wet-out', x60, chartArea.top + 14);
      ctx.fillText('~60 °C', x60, chartArea.top + 27);
 
      ctx.fillStyle = '#bf3425';
      ctx.textAlign = 'right';
      ctx.fillText('Gelation', xGel - 10, yGel - 10);
 
      ctx.fillStyle = '#9d9d9c';
      ctx.textAlign = 'right';
      ctx.fillText('Exotherm onset', xExo - 10, yExo - 10);
      ctx.restore();
    }
  };
 
  var ctx = document.getElementById('viscCanvas').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tempLabels,
      datasets: [
        {
          label: 'Viscosity (mPa·s)',
          data: viscData,
          borderColor: '#47577c',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#47577c',
          tension: 0.4,
          order: 1
        },
        {
          label: 'Threshold 850 mPa·s',
          data: thresholdData,
          borderColor: '#bf3425',
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: 'transparent',
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: {
        duration: 1200,
        easing: 'easeInOutQuart'
      },
      scales: {
        x: {
          type: 'linear',
          min: 25,
          max: 120,
          title: {
            display: true,
            text: 'Temperature (°C)',
            color: '#475569',
            font: { size: 12, weight: '600' }
          },
          ticks: {
            color: '#64748b',
            stepSize: 10,
            callback: function(v) { return v + ' °C'; }
          },
          grid: { color: '#f1f5f9' }
        },
        y: {
          type: 'linear',
          min: 0,
          max: 1000,
          title: {
            display: true,
            text: 'Viscosity (mPa·s)',
            color: '#475569',
            font: { size: 12, weight: '600' }
          },
          ticks: {
            color: '#64748b',
            callback: function(v) { return v; }
          },
          grid: { color: '#f1f5f9' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#47577c',
          bodyColor: '#1e293b',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            title: function(items) { return items[0].label + ' °C'; },
            label: function(item) {
              if (item.datasetIndex === 0) return 'Viscosity: ' + item.raw + ' mPa·s';
              return 'Threshold: 850 mPa·s';
            }
          }
        }
      }
    },
    plugins: [windowPlugin, eventPlugin]
  });
})();

/* infographic 2*/

(function() {
  var wrap = document.getElementById('rtpWrap');
  var animated = false;
 
  function animateBars() {
    if (animated) return;
    animated = true;
    var fills = wrap.querySelectorAll('.rtp-bar-fill');
    fills.forEach(function(fill, i) {
      var pct = parseFloat(fill.getAttribute('data-pct'));
      setTimeout(function() {
        fill.style.width = pct + '%';
      }, i * 80);
    });
  }
 
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        wrap.classList.add('rtp-visible');
        setTimeout(animateBars, 300);
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });
  io.observe(wrap);
})();

/*info 3*/
(function() {
  var wrap = document.getElementById('cteWrap');
  var animated = false;
 
  function animateBars() {
    if (animated) return;
    animated = true;
    var fills = wrap.querySelectorAll('.cte-bar-fill');
    fills.forEach(function(fill, i) {
      var pct = parseFloat(fill.getAttribute('data-pct'));
      setTimeout(function() {
        fill.style.width = pct + '%';
      }, i * 120);
    });
  }
 
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        wrap.classList.add('cte-visible');
        setTimeout(animateBars, 300);
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });
  io.observe(wrap);
})();
/*info 4*/
(function() {
  var wrap = document.getElementById('pgWrap');
  var animated = false;
  function animateBars() {
    if (animated) return;
    animated = true;
    wrap.querySelectorAll('.pg-fill').forEach(function(el, i) {
      setTimeout(function() {
        el.style.width = el.getAttribute('data-pct') + '%';
      }, i * 140);
    });
  }
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        wrap.classList.add('pg-visible');
        setTimeout(animateBars, 300);
      }
    });
  }, { threshold: 0.15 }).observe(wrap);
})();
