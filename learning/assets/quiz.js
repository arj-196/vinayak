/* quiz.js — shared retrieval-practice widget for all lessons.
   Markup contract:
     <div class="check">
       <div class="q" data-answer="a">
         <p>Question?</p>
         <div class="opts">
           <button class="opt" data-k="a" type="button">…</button>
         </div>
         <p class="why" hidden>Explanation shown after answering.</p>
       </div>
     </div>
   One attempt per question, immediate feedback, correct answer always revealed. */
(function () {
  "use strict";
  var qs = document.querySelectorAll(".check .q");
  for (var i = 0; i < qs.length; i++) {
    (function (q) {
      var right = q.getAttribute("data-answer");
      var opts = q.querySelectorAll(".opt");
      var why = q.querySelector(".why");
      for (var j = 0; j < opts.length; j++) {
        opts[j].addEventListener("click", function () {
          if (q.dataset.done) return;
          q.dataset.done = "1";
          var picked = this.getAttribute("data-k");
          for (var k = 0; k < opts.length; k++) {
            var o = opts[k];
            o.disabled = true;
            if (o.getAttribute("data-k") === right) o.classList.add("right");
            else if (o.getAttribute("data-k") === picked) o.classList.add("wrong");
          }
          if (why) why.hidden = false;
        });
      }
    })(qs[i]);
  }
})();
