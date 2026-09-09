/* budget.js — turns two meter readings into "how many runs do I get?".

   Markup contract:
     <div class="budget-calc"></div>

   B2 exists to convert one felt experience (a Cowork run) into a number the
   learner can plan with. Doing that means subtracting percentages and dividing,
   which nobody does in their head mid-lesson — so the widget does the
   arithmetic and the learner supplies only what their screen showed.

   The output that matters is WHICH CLOCK BINDS FIRST. That is the
   non-obvious part and the thing that prevents being ambushed. */
(function () {
  "use strict";

  var FIELDS = [
    { k: "sBefore", label: "Session before", ph: "e.g. 12" },
    { k: "sAfter",  label: "Session after",  ph: "e.g. 47" },
    { k: "wBefore", label: "Weekly before",  ph: "e.g. 4" },
    { k: "wAfter",  label: "Weekly after",   ph: "e.g. 9" }
  ];

  function num(v) {
    var n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
    return isFinite(n) ? n : null;
  }

  document.querySelectorAll(".budget-calc").forEach(function (root) {
    var form = document.createElement("div");
    form.className = "meter-form";
    FIELDS.forEach(function (f) {
      var w = document.createElement("label");
      w.className = "meter-field";
      var t = document.createElement("span");
      t.textContent = f.label + " (%)";
      var i = document.createElement("input");
      i.type = "text";
      i.inputMode = "decimal";
      i.placeholder = f.ph;
      i.setAttribute("data-k", f.k);
      w.appendChild(t); w.appendChild(i);
      form.appendChild(w);
    });

    var bar = document.createElement("div");
    bar.className = "meter-bar";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "meter-save";
    btn.textContent = "Work it out";
    bar.appendChild(btn);

    var out = document.createElement("div");
    out.className = "verdict";
    out.hidden = true;

    root.appendChild(form);
    root.appendChild(bar);
    root.appendChild(out);

    btn.addEventListener("click", function () {
      var v = {};
      form.querySelectorAll("input").forEach(function (i) {
        v[i.getAttribute("data-k")] = num(i.value);
      });

      var sCost = (v.sAfter != null && v.sBefore != null) ? v.sAfter - v.sBefore : null;
      var wCost = (v.wAfter != null && v.wBefore != null) ? v.wAfter - v.wBefore : null;

      if (sCost == null || wCost == null) {
        out.hidden = false;
        out.innerHTML = '<p class="verdict-line">Fill in all four numbers — just the digits, no % sign needed.</p>';
        return;
      }
      if (sCost <= 0 || wCost <= 0) {
        out.hidden = false;
        out.innerHTML = '<p class="verdict-line">The "after" numbers should be higher than the "before" ones. ' +
          'If they are not, the meter may not have refreshed yet — wait a minute and read it again.</p>';
        return;
      }

      var perSession = Math.floor(100 / sCost);
      var perWeek = Math.floor(100 / wCost);
      var binds = perSession <= perWeek ? "session" : "weekly";

      out.hidden = false;
      out.innerHTML =
        '<p class="verdict-line">That one run cost <b>' + sCost.toFixed(1) + '%</b> of a session ' +
        'and <b>' + wCost.toFixed(1) + '%</b> of your week.</p>' +
        '<div class="verdict-nums">' +
          '<div><dt>Runs per session</dt><dd>' + perSession + '</dd></div>' +
          '<div><dt>Runs per week</dt><dd>' + perWeek + '</dd></div>' +
        '</div>' +
        '<p class="verdict-line verdict-key">' +
          (binds === "session"
            ? 'Your <b>session</b> clock binds first — you will be stopped mid-day, and waiting a few hours fixes it. Plan around the five-hour reset.'
            : 'Your <b>weekly</b> clock binds first — the more awkward one. Being stopped here means waiting until your fixed weekly reset, so spread big runs across the week rather than stacking them.') +
        '</p>' +
        '<p class="verdict-note">Rough arithmetic on one sample, not a promise — a bigger job costs more. Treat it as an order of magnitude: is it three runs a week, or thirty?</p>';
    });
  });
})();
