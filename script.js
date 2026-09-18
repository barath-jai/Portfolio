(function () {
  "use strict";

  /* ---- scroll-spy nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".module-nav a"));
  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.dataset.target);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinks.filter(function (l) {
            return l.dataset.target === entry.target.id;
          })[0];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---- copy email button ---- */
  var copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "jaibarath61@gmail.com";
      var done = function () {
        copyBtn.textContent = copyBtn.dataset.copied || "Copied";
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.textContent = copyBtn.dataset.default || "Copy email";
          copyBtn.classList.remove("copied");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, done);
      } else {
        var temp = document.createElement("textarea");
        temp.value = email;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          /* clipboard unavailable, ignore */
        }
        document.body.removeChild(temp);
        done();
      }
    });
  }

  /* ---- pinout diagram interactivity ---- */
  var pinInfo = document.getElementById("pinInfo");
  var pins = Array.prototype.slice.call(document.querySelectorAll(".pin"));

  function setPinInfo(name, desc) {
    if (!pinInfo) return;
    pinInfo.innerHTML =
      '<span class="pin-info-name">' + name + "</span>" +
      '<span class="pin-info-desc">' + desc + "</span>";
  }

  function resetPinInfo() {
    setPinInfo("Hover or tap a pin", "to see what it connects to.");
  }

  pins.forEach(function (pin) {
    pin.setAttribute("tabindex", "0");
    pin.setAttribute("role", "button");
    var name = pin.dataset.pin;
    var desc = pin.dataset.desc;
    pin.setAttribute("aria-label", name + ": " + desc);

    var activate = function () {
      pins.forEach(function (p) {
        p.classList.remove("active");
      });
      pin.classList.add("active");
      setPinInfo(name, desc);
    };

    pin.addEventListener("mouseenter", activate);
    pin.addEventListener("focus", activate);
    pin.addEventListener("click", activate);
    pin.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  var pinoutWrap = document.querySelector(".pinout");
  if (pinoutWrap) {
    pinoutWrap.addEventListener("mouseleave", function () {
      pins.forEach(function (p) {
        p.classList.remove("active");
      });
      resetPinInfo();
    });
  }

  /* ---- expandable project cards ---- */
  var projectHeads = Array.prototype.slice.call(document.querySelectorAll(".project-head"));
  projectHeads.forEach(function (head) {
    head.addEventListener("click", function () {
      var expanded = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!expanded));
    });
  });
})();
