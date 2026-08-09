/* ==========================================================================
   SLS TECHTRADE — main.js (v2)
   Nav scroll state, mobile nav, scroll-reveal, animated counters,
   quote-form submission to Google Sheets via Apps Script Web App.
   ========================================================================== */
(function () {
  "use strict";

  /* =========================================================
     CONFIG — Google Sheets (Apps Script Web App) endpoint
     Replace GOOGLE_SHEET_ENDPOINT with your deployed Web App
     URL (see /google-apps-script.gs and /GOOGLE_SHEETS_SETUP.md
     for the exact copy-paste script + step-by-step setup).
     ========================================================= */
  var GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Sticky nav background on scroll ---------- */
    var nav = document.getElementById("siteNav");
    if (nav) {
      var onScrollNav = function () {
        if (window.scrollY > 12) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      };
      onScrollNav();
      window.addEventListener("scroll", onScrollNav, { passive: true });
    }

    /* ---------- Mobile nav toggle ---------- */
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");

    function closeMobileNav() {
      if (navToggle) navToggle.classList.remove("open");
      if (navLinks) navLinks.classList.remove("open");
      document.body.classList.remove("nav-open");
    }
    function openMobileNav() {
      if (navToggle) navToggle.classList.add("open");
      if (navLinks) navLinks.classList.add("open");
      document.body.classList.add("nav-open");
    }

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        if (navLinks.classList.contains("open")) closeMobileNav();
        else openMobileNav();
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMobileNav);
      });
    }
    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    /* ---------- Scroll-reveal ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
      } else {
        revealEls.forEach(function (el) { el.classList.add("in"); });
      }
    }

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length && "IntersectionObserver" in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count")) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1200, start = null;
          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            el.textContent = Math.floor(progress * target) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
            else el.textContent = target + suffix;
          }
          window.requestAnimationFrame(step);
          countIo.unobserve(el);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countIo.observe(el); });
    }

    /* ---------- Smooth-scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var hashIndex = href.indexOf("#");
      var path = href.substring(0, hashIndex);
      var hash = href.substring(hashIndex);
      if (hash === "#" || hash.length < 2) return;
      var samePage = path === "" || path === window.location.pathname.split("/").pop();
      if (!samePage) return;
      var targetEl = document.querySelector(hash);
      if (!targetEl) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var y = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });

    /* =========================================================
       Quote / Enquiry form -> Google Sheets
       ========================================================= */
    var quoteForm = document.getElementById("quoteForm");
    if (quoteForm) {
      var statusEl = document.getElementById("formStatus");
      var submitBtn = quoteForm.querySelector('button[type="submit"]');

      quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!quoteForm.checkValidity()) {
          quoteForm.reportValidity();
          return;
        }

        var formData = new FormData(quoteForm);
        formData.append("page_source", window.location.href);
        formData.append("submitted_at", new Date().toISOString());

        var originalLabel = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
        setStatus(null);

        var isConfigured = GOOGLE_SHEET_ENDPOINT.indexOf("REPLACE_WITH_YOUR_DEPLOYMENT_ID") === -1;

        if (!isConfigured) {
          // Endpoint not wired up yet — show success UI locally so the
          // form still feels functional during development/preview.
          console.warn("SLS Techtrade: GOOGLE_SHEET_ENDPOINT is not configured yet. " +
            "See GOOGLE_SHEETS_SETUP.md to connect this form to a live Google Sheet.");
          finishSubmit(true, originalLabel);
          return;
        }

        fetch(GOOGLE_SHEET_ENDPOINT, {
          method: "POST",
          mode: "no-cors", // Apps Script Web Apps don't return CORS headers
          body: formData
        })
          .then(function () {
            // no-cors responses are opaque; treat network success as success
            finishSubmit(true, originalLabel);
          })
          .catch(function (err) {
            console.error("SLS Techtrade form submit error:", err);
            finishSubmit(false, originalLabel);
          });
      });

      function finishSubmit(success, originalLabel) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        setStatus(success);
        if (success) quoteForm.reset();
      }

      function setStatus(success) {
        if (!statusEl) return;
        statusEl.classList.remove("show", "ok", "err");
        if (success === null) return;
        if (success) {
          statusEl.textContent = "✓ Enquiry received — our team will reach out shortly.";
          statusEl.classList.add("show", "ok");
        } else {
          statusEl.textContent = "✗ Something went wrong. Please call/WhatsApp +91 91829 60315 or email contact@slstechtrade.com.";
          statusEl.classList.add("show", "err");
        }
      }
    }

  });
})();
