/* Interest form. Posts to window.VAM_FORM_ENDPOINT when one is configured,
   otherwise falls back to opening a pre-filled email to the organisers so the
   form is never a dead end on a freshly deployed copy of the site. */
(function () {
  "use strict";

  var form = document.getElementById("interest-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function say(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form__status" + (kind ? " form__status--" + kind : "");
  }

  function collect() {
    var data = new FormData(form);
    var interests = data.getAll("interest");
    return {
      name: (data.get("name") || "").trim(),
      email: (data.get("email") || "").trim(),
      affiliation: (data.get("affiliation") || "").trim(),
      sector: (data.get("sector") || "").trim(),
      interest: interests.join("; "),
      notes: (data.get("notes") || "").trim()
    };
  }

  function mailtoFallback(v) {
    var body = [
      "Name: " + v.name,
      "Email: " + v.email,
      "Affiliation: " + (v.affiliation || "-"),
      "Sector: " + (v.sector || "-"),
      "Interested in: " + (v.interest || "-"),
      "",
      "Notes:",
      v.notes || "-"
    ].join("\n");
    var to = window.VAM_FORM_EMAIL || "";
    var href = "mailto:" + to +
      "?subject=" + encodeURIComponent("VAM Symposium 2027 pre-registration") +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    say("Your email client will open with the details filled in. Press send to complete pre-registration.", "ok");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var v = collect();
    if (!v.name || !v.email || v.email.indexOf("@") < 1 || !v.affiliation || !v.sector) {
      say("Please give us your name, a valid email address, your affiliation, and a sector.", "err");
      return;
    }

    var endpoint = window.VAM_FORM_ENDPOINT;
    if (!endpoint) { mailtoFallback(v); return; }

    say("Sending...");
    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(v)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      say("Thank you. You will be notified when registration opens.", "ok");
    }).catch(function () {
      say("Submission failed. Opening an email instead...", "err");
      setTimeout(function () { mailtoFallback(v); }, 900);
    });
  });
})();

/* Poster abstract form. Same delivery as the interest form: POST to
   window.VAM_POSTER_ENDPOINT (or VAM_FORM_ENDPOINT) when configured, otherwise
   open a pre-filled email to the organisers. */
(function () {
  "use strict";

  var form = document.getElementById("poster-form");
  if (!form) return;
  var status = document.getElementById("poster-status");
  var abstract = document.getElementById("p-abstract");
  var counter = document.getElementById("p-count");
  var LIMIT = 250, HARD = 300;

  function words(t) { t = (t || "").trim(); return t ? t.split(/\s+/).length : 0; }
  function say(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form__status" + (kind ? " form__status--" + kind : "");
  }
  function count() {
    if (!counter) return;
    var n = words(abstract.value);
    counter.textContent = n + (n === 1 ? " word" : " words");
    counter.style.color = n > LIMIT ? "#B3261E" : "";
  }
  if (abstract) { abstract.addEventListener("input", count); count(); }

  function collect() {
    var d = new FormData(form);
    var g = function (k) { return (d.get(k) || "").toString().trim(); };
    return {
      kind: "poster",
      name: g("name"), email: g("email"), affiliation: g("affiliation"), sector: g("sector"),
      stage: g("stage"), coauthors: g("coauthors"), title: g("title"), topic: g("topic"),
      abstract: g("abstract"), demo: d.get("demo") ? "yes" : "no", in_person: d.get("inperson") ? "yes" : "no"
    };
  }

  function mailtoFallback(v) {
    var body = [
      "Poster title: " + v.title,
      "Presenting author: " + v.name + " <" + v.email + ">",
      "Affiliation: " + v.affiliation,
      "Sector: " + v.sector,
      "Career stage: " + (v.stage || "-"),
      "Co-authors: " + (v.coauthors || "-"),
      "Topic area: " + (v.topic || "-"),
      "Live demonstration: " + v.demo,
      "",
      "Abstract (" + words(v.abstract) + " words):",
      v.abstract
    ].join("\n");
    var to = window.VAM_FORM_EMAIL || "";
    window.location.href = "mailto:" + to +
      "?subject=" + encodeURIComponent("VAM 2027 poster abstract: " + v.title) +
      "&body=" + encodeURIComponent(body);
    say("Your email client will open with the abstract filled in. Press send to complete the submission.", "ok");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = collect();
    if (!v.name || !v.email || v.email.indexOf("@") < 1 || !v.affiliation || !v.sector || !v.title || !v.abstract) {
      say("Please complete the presenting author, email, affiliation, sector, title, and abstract.", "err"); return;
    }
    if (v.in_person !== "yes") { say("Please confirm that the presenting author will attend in person.", "err"); return; }
    if (words(v.abstract) > HARD) { say("Please shorten the abstract to about 250 words.", "err"); return; }

    var endpoint = window.VAM_POSTER_ENDPOINT || window.VAM_FORM_ENDPOINT;
    if (!endpoint) { mailtoFallback(v); return; }
    say("Sending...");
    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(v)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset(); count();
      say("Thank you. Your abstract has been received; you will hear from the organizers by January 15, 2027.", "ok");
    }).catch(function () {
      say("Submission failed. Opening an email instead...", "err");
      setTimeout(function () { mailtoFallback(v); }, 900);
    });
  });
})();
