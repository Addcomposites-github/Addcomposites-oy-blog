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

/* ============================================================
   LIGHTNING / PAINTED CFRP BLOG — interactive behaviour
   reading-flow reveal + 5 interactive infographics.
   Runs at end of <body>; every block guards its own elements.
   ============================================================ */
(function () {
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reading-flow reveal ---------- */
  (function () {
    if (reduceMotion) return; // CSS already shows everything
    var sel = [
      "section > h2",
      "section > p",
      "section > ul",
      "section > ol",
      "section > .full-width-image",
      "section > .image-caption",
      "section > .perspective-box",
      "section > .cta-section",
      "section > .references-list",
      "section > .author-card",
    ]
      .map(function (s) {
        return ".blog-content " + s;
      })
      .join(", ");
    var els = [].slice.call(document.querySelectorAll(sel));
    if (!els.length || !("IntersectionObserver" in window)) return;
    els.forEach(function (el) {
      el.classList.add("reveal-init");
    });
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
    // reveal anything already in view on load
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom >= 0) {
          el.classList.add("reveal-in");
        }
      });
    }, 40);
  })();

  /* ---------- generic scroll-in observer for infographic roots ---------- */
  function lgtnObserve(rootId, animClass, onFirst) {
    var root = document.getElementById(rootId);
    if (!root) return null;
    if (typeof onFirst === "function") onFirst(root);
    var fire = function () {
      root.classList.add(animClass);
    };
    if (!("IntersectionObserver" in window)) {
      fire();
      return root;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fire();
            obs.unobserve(root);
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(root);
    var rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      fire();
      obs.unobserve(root);
    }
    return root;
  }

  /* ---------- 1. lstk · clickable load decomposition ---------- */
  (function () {
    var root = lgtnObserve("lstk-root", "lstk-animated");
    if (!root) return;
    var btns = [].slice.call(root.querySelectorAll(".lstk-tag-btn"));
    var active = null;
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var load = btn.getAttribute("data-load");
        var turnOff = active === load;
        root.classList.remove("lstk-focus-surface", "lstk-focus-core");
        btns.forEach(function (b) {
          b.classList.remove("lstk-tag-on");
          b.setAttribute("aria-pressed", "false");
        });
        if (turnOff) {
          active = null;
          return;
        }
        active = load;
        root.classList.add("lstk-focus-" + load);
        btn.classList.add("lstk-tag-on");
        btn.setAttribute("aria-pressed", "true");
      });
    });
  })();

  /* ---------- 2. lcfg · click a row to select ---------- */
  (function () {
    var root = lgtnObserve("lcfg-root", "lcfg-animated");
    if (!root) return;
    var rows = [].slice.call(root.querySelectorAll(".lcfg-row"));
    rows.forEach(function (row) {
      row.addEventListener("click", function () {
        var was = row.classList.contains("lcfg-row-sel");
        rows.forEach(function (r) {
          r.classList.remove("lcfg-row-sel");
        });
        if (!was) row.classList.add("lcfg-row-sel");
      });
    });
  })();

  /* ---------- 3. lcsn · C-Scan vs destructive reveal toggle ---------- */
  (function () {
    var root = lgtnObserve("lcsn-root", "lcsn-animated");
    if (!root) return;
    var tabs = [].slice.call(root.querySelectorAll(".lcsn-tab"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var mode = tab.getAttribute("data-mode");
        root.classList.remove("lcsn-mode-cscan", "lcsn-mode-reveal");
        root.classList.add("lcsn-mode-" + mode);
        tabs.forEach(function (t) {
          t.classList.toggle("lcsn-tab-active", t === tab);
        });
      });
    });
  })();

  /* ---------- 4. larea · paint-thickness slider ---------- */
  (function () {
    var root = lgtnObserve("larea-root", "larea-animated", function (r) {
      r.querySelectorAll(".larea-row").forEach(function (row) {
        var pct = row.getAttribute("data-pct");
        var fill = row.querySelector(".larea-fill");
        if (fill && pct !== null) fill.style.setProperty("--w", pct + "%");
      });
    });
    if (!root) return;
    var slider = document.getElementById("larea-slider");
    var bigEl = document.getElementById("larea-big");
    var paintEl = document.getElementById("larea-paintnow");
    var blob = document.getElementById("larea-blob");
    var rows = [].slice.call(root.querySelectorAll(".larea-row"));
    if (!slider) return;

    // measured points: [paint µm, delaminated cm²]
    var PTS = [
      [0, 0.0],
      [250, 40.2],
      [400, 119.6],
      [1000, 411.6],
    ];
    var MAX = 411.6;

    function interp(t) {
      if (t <= PTS[0][0]) return PTS[0][1];
      if (t >= PTS[PTS.length - 1][0]) return PTS[PTS.length - 1][1];
      for (var i = 0; i < PTS.length - 1; i++) {
        var a = PTS[i],
          b = PTS[i + 1];
        if (t >= a[0] && t <= b[0]) {
          var f = (t - a[0]) / (b[0] - a[0]);
          return a[1] + f * (b[1] - a[1]);
        }
      }
      return 0;
    }

    function nearestRow(t) {
      var best = null,
        bd = Infinity;
      rows.forEach(function (row) {
        var thk = parseFloat(row.getAttribute("data-thk"));
        var d = Math.abs(thk - t);
        if (d < bd) {
          bd = d;
          best = row;
        }
      });
      return best;
    }

    function update() {
      var t = parseFloat(slider.value);
      var area = interp(t);
      if (bigEl) bigEl.textContent = area.toFixed(1);
      if (paintEl)
        paintEl.textContent = t === 0 ? "No paint" : t + " µm paint";
      if (blob) {
        var dim = Math.sqrt(area / MAX) * 100; // area-true scaling
        blob.style.width = dim + "%";
        blob.style.height = dim + "%";
      }
      var near = nearestRow(t);
      rows.forEach(function (row) {
        row.classList.toggle("larea-row-active", row === near);
      });
    }

    slider.addEventListener("input", update);
    update();
  })();

  /* ---------- 5. ldep · normal vs extreme burn-depth toggle ---------- */
  (function () {
    var root = lgtnObserve("ldep-root", "ldep-animated");
    if (!root) return;
    var tabs = [].slice.call(root.querySelectorAll(".ldep-tab"));
    var rows = [].slice.call(root.querySelectorAll(".ldep-row"));
    var note = document.getElementById("ldep-note");
    var NOTE = {
      normal:
        "At usual aircraft paint thickness (250–400 µm): only <strong>Ply 1</strong> burns — which is why the plate's overall stiffness is not meaningfully changed.",
      extreme:
        "Even in this deliberately severe 1000 µm case, the burn halts at <strong>ply 4</strong> (~508 µm, ~31% of the stack): carbon's resistance reroutes the current back to the foil before it can bore deeper.",
    };

    function apply(mode) {
      root.classList.remove("ldep-mode-normal", "ldep-mode-extreme");
      root.classList.add("ldep-mode-" + mode);
      tabs.forEach(function (t) {
        t.classList.toggle(
          "ldep-tab-active",
          t.getAttribute("data-mode") === mode,
        );
      });
      rows.forEach(function (row) {
        var pct = parseFloat(row.getAttribute("data-" + mode)) || 0;
        var fill = row.querySelector(".ldep-fill");
        var state = row.querySelector(".ldep-state");
        if (fill) fill.style.setProperty("--w", pct + "%");
        if (state)
          state.innerHTML = row.getAttribute("data-state-" + mode) || "";
        row.classList.toggle("ldep-empty", pct === 0);
      });
      if (note) note.innerHTML = NOTE[mode];
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        apply(tab.getAttribute("data-mode"));
      });
    });
    apply("normal");
  })();
})();
