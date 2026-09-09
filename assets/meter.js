/* meter.js — usage-reading recorder, shared across Track B lessons.

   Markup contract:
     <div class="meter" data-label="Baseline — before Cowork"></div>

   Readings persist in localStorage, so a later lesson that drops in the same
   widget automatically shows every earlier reading beside the new one. That
   comparison IS the lesson in B2 — the component exists so the spacing effect
   happens on its own rather than depending on the learner keeping notes.

   Storage may throw outright (private windows, blocked site data), so every
   read and write is guarded and the widget still works as a plain form. */
(function () {
  "use strict";
  var KEY = "claude-usage-readings-v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function save(rows) {
    try { localStorage.setItem(KEY, JSON.stringify(rows)); return true; }
    catch (e) { return false; }
  }

  var FIELDS = [
    { k: "session",  label: "Session used",     ph: "e.g. 12%" },
    { k: "left",     label: "Time left in session", ph: "e.g. 3h 40m" },
    { k: "weekly",   label: "Weekly used",      ph: "e.g. 4%" },
    { k: "reset",    label: "Weekly resets",    ph: "e.g. Tue 09:00" }
  ];

  document.querySelectorAll(".meter").forEach(function (root) {
    var label = root.getAttribute("data-label") || "Reading";

    var form = document.createElement("div");
    form.className = "meter-form";
    FIELDS.forEach(function (f) {
      var wrap = document.createElement("label");
      wrap.className = "meter-field";
      var t = document.createElement("span");
      t.textContent = f.label;
      var i = document.createElement("input");
      i.type = "text";
      i.placeholder = f.ph;
      i.setAttribute("data-k", f.k);
      wrap.appendChild(t);
      wrap.appendChild(i);
      form.appendChild(wrap);
    });

    var bar = document.createElement("div");
    bar.className = "meter-bar";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "meter-save";
    btn.textContent = "Save this reading";
    var said = document.createElement("span");
    said.className = "meter-said";
    said.hidden = true;
    bar.appendChild(btn);
    bar.appendChild(said);

    var out = document.createElement("div");
    out.className = "meter-rows";

    root.appendChild(form);
    root.appendChild(bar);
    root.appendChild(out);

    function render() {
      var rows = load();
      out.innerHTML = "";
      if (!rows.length) {
        var p = document.createElement("p");
        p.className = "meter-empty";
        p.textContent = "No readings saved yet.";
        out.appendChild(p);
        return;
      }
      var table = document.createElement("table");
      table.innerHTML =
        "<thead><tr><th>Reading</th><th>Session</th><th>Left</th><th>Weekly</th><th>Resets</th></tr></thead>";
      var tb = document.createElement("tbody");
      rows.forEach(function (r) {
        var tr = document.createElement("tr");
        [r.label + " · " + r.date, r.session, r.left, r.weekly, r.reset].forEach(function (v, i) {
          var td = document.createElement("td");
          td.textContent = v || "—";
          if (i === 0) td.className = "meter-when";
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      var scroll = document.createElement("div");
      scroll.className = "scroll";
      scroll.appendChild(table);
      out.appendChild(scroll);
    }

    btn.addEventListener("click", function () {
      var row = { label: label, date: new Date().toISOString().slice(0, 10) };
      var any = false;
      form.querySelectorAll("input").forEach(function (i) {
        row[i.getAttribute("data-k")] = i.value.trim();
        if (i.value.trim()) any = true;
      });
      if (!any) {
        said.textContent = "Fill in at least one number first.";
        said.hidden = false;
        return;
      }
      var rows = load();
      rows.push(row);
      var ok = save(rows);
      said.textContent = ok
        ? "Saved. It'll still be here in a later lesson."
        : "Saved for now — this browser won't remember it, so write it down too.";
      said.hidden = false;
      form.querySelectorAll("input").forEach(function (i) { i.value = ""; });
      render();
    });

    render();
  });
})();
