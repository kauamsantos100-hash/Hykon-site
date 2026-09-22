(function () {
  "use strict";

  /* ---------------------------------------------------------
     Ano no rodapé
  --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* ---------------------------------------------------------
     Header: leve mudança de fundo ao rolar
  --------------------------------------------------------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScrollHeader = function () {
      if (window.scrollY > 12) {
        header.style.background = "rgba(7, 11, 18, 0.92)";
      } else {
        header.style.background = "rgba(7, 11, 18, 0.72)";
      }
    };
    document.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------------------------------------------------------
     Link ativo no menu conforme a seção visível
  --------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = "#" + entry.target.id;
          var link = navLinks.find(function (l) { return l.getAttribute("href") === id; });
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     Revelação suave de seções ao rolar
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".about-card, .service-card, .project-card, .solucoes-list li, .diferenciais-list li, .section-head, .contato-form, .contato-copy"
  );

  revealTargets.forEach(function (el) { el.classList.add("reveal-up"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     Sequência de entrada do hero
  --------------------------------------------------------- */
  var hero = document.getElementById("hero");
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add("hero-ready");
    });
  }

  /* ---------------------------------------------------------
     Fundo de circuito / partículas no hero
  --------------------------------------------------------- */
  var canvas = document.getElementById("circuit-canvas");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, nodes;
    var NODE_COUNT = 46;
    var LINK_DIST = 150;

    function resize() {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = "rgba(53, 231, 199," + (0.14 * (1 - dist / LINK_DIST)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      for (var j = 0; j < nodes.length; j++) {
        ctx.fillStyle = "rgba(233, 238, 245, 0.5)";
        ctx.beginPath();
        ctx.arc(nodes[j].x, nodes[j].y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        makeNodes();
      }, 200);
    });
  }

  /* ---------------------------------------------------------
     Formulário de contato (validação e feedback local)
  --------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = "Preencha os campos obrigatórios antes de enviar.";
        status.style.color = "#e07a5f";
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      // Local apenas: não há backend configurado neste projeto.
      // Para receber os envios de verdade, integre este formulário
      // com um serviço como Formspree, EmailJS ou uma API própria.
      setTimeout(function () {
        status.style.color = "";
        status.textContent = "Mensagem pronta para envio! Conecte este formulário a um serviço de e-mail (veja o README) para recebê-la de verdade.";
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensagem";
        form.reset();
      }, 700);
    });
  }
})();
