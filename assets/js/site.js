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

  /* ------------------------------------- hero: tomographic projection field
     A slow sweep of parallel light sheets around a central vial - the same
     geometry a VAM printer uses to build a part from many angles at once.  */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var angle = 0;
    var RAYS = 34;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var cx = w * 0.5;
      var cy = (h - 46) * 0.5;
      // leave headroom for the caption strip along the bottom
      var R = Math.min(w * 0.34, (h - 70) * 0.46);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // projected light sheets
      for (var i = 0; i < RAYS; i++) {
        var t = i / (RAYS - 1);
        var y = (t - 0.5) * 2 * R;
        var half = Math.sqrt(Math.max(0, R * R - y * y));
        // intensity envelope: brighter toward the middle of the sinogram
        var a = 0.16 + 0.52 * Math.pow(Math.cos((t - 0.5) * Math.PI), 2);
        ctx.beginPath();
        ctx.moveTo(-half, y);
        ctx.lineTo(half, y);
        ctx.strokeStyle = "rgba(23,189,212," + a.toFixed(3) + ")";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.restore();

      // second, counter-rotating pass in gold
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 0.62 + 0.8);
      for (var j = 0; j < 18; j++) {
        var t2 = j / 17;
        var y2 = (t2 - 0.5) * 2 * (R * 0.72);
        var half2 = Math.sqrt(Math.max(0, (R * 0.72) * (R * 0.72) - y2 * y2));
        ctx.beginPath();
        ctx.moveTo(-half2, y2);
        ctx.lineTo(half2, y2);
        ctx.strokeStyle = "rgba(245,180,55,0.30)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();

      // the vial
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(251,243,228,0.55)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.26, 0, Math.PI * 2);
      ctx.fillStyle = "#E8493B";
      ctx.fill();
      ctx.strokeStyle = "rgba(251,243,228,0.9)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    /* Only animate while the hero is actually on screen and the tab is
       visible - an always-on rAF loop burns battery for nothing. */
    var running = false;
    var onScreen = true;

    function loop() {
      if (!running) return;
      angle += 0.0022;
      draw();
      requestAnimationFrame(loop);
    }

    function sync() {
      var should = onScreen && !document.hidden && !reduceMotion;
      if (should === running) return;
      running = should;
      if (running) requestAnimationFrame(loop); else draw();
    }

    resize();
    draw();
    window.addEventListener("resize", function () { resize(); draw(); });
    document.addEventListener("visibilitychange", sync);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(canvas);
    }
    sync();
  }
})();
