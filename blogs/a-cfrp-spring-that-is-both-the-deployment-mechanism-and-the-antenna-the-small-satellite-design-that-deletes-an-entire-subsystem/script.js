/* ============================================
   CFRP SPRING ANTENNA BLOG — JAVASCRIPT
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
// INFOGRAPHIC 1
(function () {
  var root = document.getElementById("clsaRoot");

  function animateLines() {
    var lines = [
      "clsaLine1",
      "clsaLine2",
      "clsaLine3",
      "clsaLine4",
      "clsaLine5",
    ];
    lines.forEach(function (id, i) {
      setTimeout(
        function () {
          var el = document.getElementById(id);
          if (el) el.style.opacity = "1";
        },
        200 + i * 80,
      );
    });
    setTimeout(function () {
      var a = document.getElementById("clsaArrow");
      var ah = document.getElementById("clsaArrowHead");
      var d = document.getElementById("clsaDot");
      var lbl = document.getElementById("clsaMergeLabel");
      if (a) a.style.opacity = "1";
      if (ah) ah.style.opacity = "1";
      if (d) d.style.opacity = "1";
      if (lbl) {
        lbl.style.opacity = "1";
        lbl.style.transition = "opacity 0.4s ease";
      }
    }, 650);
  }

  function revealCards() {
    var cards = document.querySelectorAll(
      "#clsaComponents .clsa-component-card",
    );
    cards.forEach(function (card) {
      var delay = parseInt(card.getAttribute("data-delay") || "0");
      setTimeout(function () {
        card.classList.add("visible");
      }, delay);
    });
  }

  function revealUnified() {
    var u = document.getElementById("clsaUnified");
    if (u) u.classList.add("visible");
    var items = document.querySelectorAll("#clsaFnList .clsa-function-item");
    items.forEach(function (item) {
      var delay = parseInt(item.getAttribute("data-delay") || "0");
      setTimeout(function () {
        item.classList.add("visible");
      }, delay);
    });
  }

  function revealStats() {
    var s = document.getElementById("clsaStats");
    if (s) s.classList.add("visible");
  }

  var observed = false;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          revealCards();
          animateLines();
          setTimeout(revealUnified, 550);
          setTimeout(revealStats, 1100);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(root);
})();
// infographic 2
(function () {
  var root = document.getElementById("clsa2Root");
  var triggered = false;

  function animateBars() {
    ["clsa2B1", "clsa2B2", "clsa2B3", "clsa2B4", "clsa2B5", "clsa2B6"].forEach(
      function (id, i) {
        var el = document.getElementById(id);
        if (!el) return;
        var target = el.getAttribute("data-target");
        setTimeout(
          function () {
            el.style.width = target + "%";
          },
          i * 120 + 100,
        );
      },
    );
  }

  function animateTraits(listId, startDelay) {
    var items = document.querySelectorAll("#" + listId + " .clsa2-trait");
    items.forEach(function (item) {
      var d = parseInt(item.getAttribute("data-delay") || "0");
      setTimeout(function () {
        item.classList.add("visible");
      }, d);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Panels
          setTimeout(function () {
            document.getElementById("clsa2PanelL").classList.add("visible");
            animateTraits("clsa2TraitsL", 0);
          }, 0);
          setTimeout(function () {
            document.getElementById("clsa2PanelS").classList.add("visible");
            animateTraits("clsa2TraitsS", 0);
          }, 150);

          // Bars
          setTimeout(function () {
            var b = document.getElementById("clsa2Bars");
            if (b) b.classList.add("visible");
            animateBars();
          }, 500);
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(root);
})();
// infographic 3
(function () {
  var root = document.getElementById("clsa3Root");
  var triggered = false;

  function animatePath(id, duration, delay) {
    setTimeout(function () {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.transition =
        "stroke-dashoffset " + duration + "ms cubic-bezier(0.4,0,0.2,1)";
      el.style.strokeDashoffset = "0";
    }, delay);
  }

  function fadeIn(id, delay) {
    setTimeout(function () {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.transition = "opacity 0.4s ease";
      el.style.opacity = "1";
    }, delay);
  }

  function animateBridge(delay) {
    setTimeout(function () {
      var el = document.getElementById("clsa3Bridge");
      if (!el) return;
      el.style.transition = "stroke-dashoffset 0.4s ease";
      el.style.strokeDashoffset = "0";
    }, delay);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Diagram wrapper
          document.getElementById("clsa3Diag").classList.add("visible");

          // Feed dot & label
          fadeIn("clsa3FeedDot", 200);
          fadeIn("clsa3FeedLabel", 300);
          fadeIn("clsa3S1label", 350);

          // Spiral 1 path animates up
          animatePath("clsa3Path1", 1200, 400);
          fadeIn("clsa3Arr1a", 900);
          fadeIn("clsa3Arr1b", 1100);
          fadeIn("clsa3LabelUp", 700);

          // Bridge at apex
          animateBridge(1600);

          // Spiral 2 path animates down
          animatePath("clsa3Path2", 1200, 1700);
          fadeIn("clsa3Arr2a", 2200);
          fadeIn("clsa3Arr2b", 2400);
          fadeIn("clsa3LabelDown", 2000);

          // Open end
          fadeIn("clsa3OpenDot", 2600);
          fadeIn("clsa3OpenLabel", 2700);

          // Cut annotation
          fadeIn("clsa3CutLabel", 1400);
          fadeIn("clsa3CutLine", 1500);

          // Legend cards
          [
            ["clsa3LC1", 700],
            ["clsa3LC2", 850],
            ["clsa3LC3", 1000],
          ].forEach(function (pair) {
            setTimeout(function () {
              var el = document.getElementById(pair[0]);
              if (el) el.classList.add("visible");
            }, pair[1]);
          });
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(root);
})();
// infographic 4
(function () {
  var root = document.getElementById("clsa4Root");
  var triggered = false;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Ports
          setTimeout(function () {
            document.getElementById("clsa4PortSrc").classList.add("visible");
          }, 100);
          setTimeout(function () {
            document.getElementById("clsa4Arr1").classList.add("visible");
          }, 250);

          // Stage bars staggered
          ["clsa4S1", "clsa4S2", "clsa4S3", "clsa4S4"].forEach(
            function (id, i) {
              var el = document.getElementById(id);
              setTimeout(
                function () {
                  if (el) el.style.height = el.getAttribute("data-h") + "px";
                },
                350 + i * 150,
              );
            },
          );

          setTimeout(function () {
            document.getElementById("clsa4Arr2").classList.add("visible");
          }, 950);
          setTimeout(function () {
            document.getElementById("clsa4PortCoax").classList.add("visible");
          }, 1050);

          // Width panel
          setTimeout(function () {
            document.getElementById("clsa4WidthPanel").classList.add("visible");
            ["clsa4T1", "clsa4T2", "clsa4T3", "clsa4T4"].forEach(
              function (id, i) {
                var el = document.getElementById(id);
                setTimeout(function () {
                  if (el) el.style.width = el.getAttribute("data-w") + "%";
                }, i * 120);
              },
            );
          }, 1150);

          // Footer
          setTimeout(function () {
            document.getElementById("clsa4Footer").classList.add("visible");
          }, 1700);
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(root);
})();
// infographic 5
(function () {
  var root = document.getElementById("clsa5Root");
  var triggered = false;

  // Hover linking between cards and SVG layers
  function setupLinking() {
    var layers = root.querySelectorAll(".clsa5-layer");
    var cards = [
      { card: document.getElementById("clsa5C1"), key: "cfrp" },
      { card: document.getElementById("clsa5C2"), key: "coax" },
      { card: document.getElementById("clsa5C3"), key: "inner" },
    ];

    function dim(except) {
      layers.forEach(function (l) {
        l.style.opacity = l.getAttribute("data-layer") === except ? "1" : "0.3";
      });
    }
    function reset() {
      layers.forEach(function (l) {
        l.style.opacity = "1";
      });
    }

    cards.forEach(function (c) {
      if (!c.card) return;
      c.card.addEventListener("mouseenter", function () {
        dim(c.key);
      });
      c.card.addEventListener("mouseleave", reset);
    });

    layers.forEach(function (l) {
      l.addEventListener("mouseenter", function () {
        dim(l.getAttribute("data-layer"));
      });
      l.addEventListener("mouseleave", reset);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          setTimeout(function () {
            document.getElementById("clsa5Svg").classList.add("visible");
          }, 100);

          [
            ["clsa5C1", 400],
            ["clsa5C2", 550],
            ["clsa5C3", 700],
          ].forEach(function (p) {
            setTimeout(function () {
              document.getElementById(p[0]).classList.add("visible");
            }, p[1]);
          });

          setTimeout(function () {
            document.getElementById("clsa5Dims").classList.add("visible");
          }, 900);
          setTimeout(function () {
            document.getElementById("clsa5Banner").classList.add("visible");
          }, 1050);

          setupLinking();
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(root);
})();
// infographic 6
(function () {
  var root = document.getElementById("clsa6Root");
  var triggered = false;

  function positionGap() {
    // Bracket spans the difference between the two bar widths (100% vs 97.2%)
    var bracket = document.getElementById("clsa6Bracket");
    var label = document.getElementById("clsa6GapLabel");
    if (!bracket) return;
    // place bracket from 97.2% to 100% of track
    var startPct = 97.2;
    var widthPct = 100 - 97.2;
    bracket.style.left = startPct + "%";
    bracket.style.width = widthPct + "%";
    label.style.left = startPct + widthPct / 2 + "%";
    // small brackets: if too tight, shift label
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          setTimeout(function () {
            document.getElementById("clsa6Badge").classList.add("visible");
          }, 100);

          setTimeout(function () {
            var b = document.getElementById("clsa6Before");
            if (b) b.style.width = b.getAttribute("data-target") + "%";
          }, 350);

          setTimeout(function () {
            var a = document.getElementById("clsa6After");
            if (a) a.style.width = a.getAttribute("data-target") + "%";
          }, 650);

          setTimeout(function () {
            positionGap();
            document.getElementById("clsa6Gap").classList.add("visible");
          }, 1500);

          setTimeout(function () {
            document.getElementById("clsa6Settle").classList.add("visible");
          }, 1700);
          setTimeout(function () {
            document.getElementById("clsa6Verdict").classList.add("visible");
          }, 1900);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(root);
})();
// infographic 7
(function () {
  var root = document.getElementById("clsa7Root");
  var built = false;

  function buildChart() {
    var ctx = document.getElementById("clsa7Chart");
    if (!ctx) return;

    var freqs = [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

    // Both designs: high at edges, dip near 1.0-1.2 GHz, envelope ~3-6 dBi
    var designLong = [6.0, 5.7, 5.3, 4.9, 4.4, 3.9, 3.7, 3.9, 4.6, 5.3, 6.0];
    var designShort = [5.6, 5.3, 4.9, 4.5, 4.1, 3.6, 3.4, 3.7, 4.3, 5.0, 5.7];

    new Chart(ctx, {
      type: "line",
      data: {
        labels: freqs,
        datasets: [
          {
            label: "Long Design",
            data: designLong,
            borderColor: "#47577c",
            backgroundColor: "rgba(71,87,124,0.06)",
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#47577c",
            fill: false,
          },
          {
            label: "Short Design",
            data: designShort,
            borderColor: "#bf3425",
            backgroundColor: "rgba(191,52,37,0.06)",
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#bf3425",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1400, easing: "easeOutCubic" },
        interaction: { mode: "index", intersect: false },
        scales: {
          y: {
            min: 3,
            max: 6.5,
            title: {
              display: true,
              text: "Realized Gain (dBi)",
              color: "#64748b",
              font: { weight: "600", size: 12 },
            },
            grid: { color: "#f1f5f9" },
            ticks: {
              color: "#64748b",
              stepSize: 1,
              callback: function (v) {
                return v + " dBi";
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "Frequency (MHz)",
              color: "#64748b",
              font: { weight: "600", size: 12 },
            },
            grid: { color: "#f8fafc" },
            ticks: { color: "#64748b" },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#475569",
              font: { family: "Inter", weight: "600", size: 12 },
              usePointStyle: true,
              pointStyle: "line",
            },
          },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#bf3425",
            bodyColor: "#1e293b",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: function (items) {
                return items[0].label + " MHz";
              },
              label: function (item) {
                return item.dataset.label + ": " + item.formattedValue + " dBi";
              },
            },
          },
        },
      },
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !built) {
          built = true;
          buildChart();
          setTimeout(function () {
            document.getElementById("clsa7Chips").classList.add("visible");
          }, 700);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(root);
})();
