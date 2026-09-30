/* VAM Symposium - site behaviour. No dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");

  function isMobile() { return window.matchMedia("(max-width: 940px)").matches; }

  function syncNav() {
    if (!toggle || !links) return;
    if (isMobile()) {
      links.hidden = toggle.getAttribute("aria-expanded") !== "true";
    } else {
      links.hidden = false;
    }
  }

  if (toggle && links) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      syncNav();
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && isMobile()) {
        toggle.setAttribute("aria-expanded", "false");
        syncNav();
      }
    });
    window.addEventListener("resize", syncNav);
    syncNav();
  }

  /* ------------------------------------------------------ reveal on scroll */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------- countdown */
  var cd = document.getElementById("countdown");
  if (cd && cd.dataset.target) {
    var target = new Date(cd.dataset.target).getTime();
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) { cd.textContent = "Happening now"; return; }
      var days = Math.floor(diff / 86400000);
      cd.textContent = days + (days === 1 ? " day to go" : " days to go");
    };
    tick();
    setInterval(tick, 3600000);
  }


  /* ----------------------------------- nav highlight follows the section */
  // Several nav items point into the same page (Program + Speakers, Attend + Venue).
  // Underline the one whose section is on screen; fall back to the page's own link.
  if (links) {
    var here = location.pathname.split("/").pop() || "index.html";
    var items = [];
    links.querySelectorAll("a:not(.btn)").forEach(function (a) {
      var url = new URL(a.getAttribute("href"), location.href);
      if ((url.pathname.split("/").pop() || "index.html") !== here) return;
      var id = url.hash.slice(1);
      items.push({ a: a, el: id ? document.getElementById(id) : null });
    });
    if (items.length) {
      var pageLink = items.filter(function (i) { return !i.el; })[0];
      var sectioned = items.filter(function (i) { return i.el; });
      var header = document.querySelector(".site-header");
      var spy = function () {
        var line = (header ? header.offsetHeight : 70) + 24;
        var active = null;
        sectioned.forEach(function (i) {
          var r = i.el.getBoundingClientRect();
          if (r.top <= line && r.bottom > line) active = i;
        });
        if (!active) active = pageLink || null;
        items.forEach(function (i) {
          if (i === active) i.a.setAttribute("aria-current", "page");
          else i.a.removeAttribute("aria-current");
        });
      };
      var queued = false;
      window.addEventListener("scroll", function () {
        if (queued) return; queued = true;
        requestAnimationFrame(function () { queued = false; spy(); });
      }, { passive: true });
      window.addEventListener("hashchange", spy);
      window.addEventListener("load", spy);
      spy();
    }
  }

})();
