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
