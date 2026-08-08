(function () {
  "use strict";

  var WHATS_NUMBER = "5581993770757"; // (81) 99377-0757

  function waLink(message) {
    return "https://wa.me/" + WHATS_NUMBER + "?text=" + encodeURIComponent(message);
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Default WhatsApp CTAs ----------
  var defaultMsg = "Olá! Vim pelo site da Gráfica Rápida Brandwell e gostaria de solicitar um orçamento.";
  [
    "headerCta", "heroCtaPrimary", "quoteWhatsBtn", "finalCtaBtn",
    "locWhatsLink", "whatsFloat"
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = waLink(defaultMsg);
  });

  var mapsLink = document.getElementById("mapsLink");
  if (mapsLink) {
    mapsLink.href = "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("Av. Conselheiro Aguiar, 4565, Boa Viagem, Recife - PE, 51021-020");
  }

// ---------- Product quote buttons ----------
  document.querySelectorAll(".product-cta").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Usa a mensagem específica do produto quando existir
      var msg = btn.getAttribute("data-msg");
      if (!msg) {
        // Fallback: mensagem simples a partir do nome do produto
        var produto = btn.getAttribute("data-produto");
        msg = "Olá! Gostaria de solicitar um orçamento para " + produto + ".";
      }
      window.open(waLink(msg), "_blank", "noopener");
    });
  });

  // ---------- Quote form ----------
  var quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = quoteForm.nome.value.trim();
      var whats = quoteForm.whatsapp.value.trim();
      var produto = quoteForm.produto.value.trim();
      var qtd = quoteForm.quantidade.value.trim();
      var msg = quoteForm.mensagem.value.trim();

      var lines = ["Olá! Gostaria de solicitar um orçamento pelo site."];
      if (nome) lines.push("Nome: " + nome);
      if (whats) lines.push("Meu WhatsApp: " + whats);
      if (produto) lines.push("Produto/serviço: " + produto);
      if (qtd) lines.push("Quantidade: " + qtd);
      if (msg) lines.push("Mensagem: " + msg);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  // ---------- Header scroll state ----------
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- Generic carousel (scroll-snap + arrows + dots + drag) ----------
  function initCarousel(trackId, prevId, nextId, dotsId, itemSelector) {
    var track = document.getElementById(trackId);
    var prev = document.getElementById(prevId);
    var next = document.getElementById(nextId);
    var dotsWrap = document.getElementById(dotsId);
    if (!track) return;

    var items = Array.prototype.slice.call(track.querySelectorAll(itemSelector));

    // Build dots
    items.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Ir para item " + (i + 1));
      dot.addEventListener("click", function () {
        items[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function step(dir) {
      var card = items[0];
      var gap = parseFloat(getComputedStyle(track).gap) || 20;
      var amount = (card.getBoundingClientRect().width + gap) * dir;
      track.scrollBy({ left: amount, behavior: "smooth" });
    }
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });

    function updateDots() {
      var trackRect = track.getBoundingClientRect();
      var closest = 0, closestDist = Infinity;
      items.forEach(function (item, i) {
        var r = item.getBoundingClientRect();
        var dist = Math.abs(r.left - trackRect.left);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === closest); });
    }
    var scrollTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateDots, 80);
    }, { passive: true });
    updateDots();

    // Drag to scroll (desktop mouse)
    var isDown = false, startX, scrollLeft;
    track.addEventListener("mousedown", function (e) {
      isDown = true;
      track.classList.add("dragging");
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    ["mouseleave", "mouseup"].forEach(function (evt) {
      track.addEventListener(evt, function () { isDown = false; });
    });
    track.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });

    window.addEventListener("resize", updateDots);
  }

  initCarousel("productTrack", "prodPrev", "prodNext", "productDots", ".product-card");
  initCarousel("reviewTrack", "revPrev", "revNext", "reviewDots", ".review-card");

  // ---------- Lightbox ----------
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var full = btn.getAttribute("data-full");
      lightboxImg.src = full;
      lightboxImg.alt = btn.querySelector("img").alt;
      lightbox.classList.add("open");
    });
  });
  function closeLightbox() { lightbox.classList.remove("open"); lightboxImg.src = ""; }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

// ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ============================================================
  // Efeitos adicionais — PC + Mobile
  // ============================================================

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Barra de progresso de rolagem ----------
  var scrollProgress = document.getElementById("scrollProgress");

  // ---------- Botão voltar ao topo ----------
  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function onScrollFX() {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    // Barra de progresso
    if (scrollProgress && total > 0) {
      scrollProgress.style.width = (scrolled / total) * 100 + "%";
    }
    // Botão voltar ao topo
    if (toTop) {
      if (scrolled > 500) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  }
  document.addEventListener("scroll", onScrollFX, { passive: true });
  onScrollFX();

  // ---------- Cursor spotlight (desktop) ---------- 
  var finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var cursorGlow = null;
  if (finePointer && !reduceMotion) {
    cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);
    var glowTimer;
    document.addEventListener("mousemove", function (e) {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
      cursorGlow.classList.add("on");
      clearTimeout(glowTimer);
      glowTimer = setTimeout(function () {
        cursorGlow.classList.remove("on");
      }, 1600);
    }, { passive: true });
  }

  // ---------- Sparkles no clique em botões ----------
  function spawnSparks(x, y) {
    if (reduceMotion) return;
    var colors = ["#E4C877", "#C9A227", "#FFFFFF"];
    for (var i = 0; i < 8; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.background = colors[i % colors.length];
      var angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
      var dist = 40 + Math.random() * 50;
      s.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      document.body.appendChild(s);
      setTimeout(function (el) { el.remove(); }, 750, s);
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("a, button");
    if (t) spawnSparks(e.clientX, e.clientY);
  });

  // ---------- Tilt sutil nos cards (desktop) ----------
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".product-card, .review-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilt");
        card.style.transform = "perspective(700px) rotateY(" + (px * 8) + "deg) rotateX(" + (-py * 8) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt");
        card.style.transform = "";
      });
    });
  }

// ---------- Contador animado ----------
  // Anima o texto para: "5,0" em ".reviews-score-number"
  // e o número ("74") em ".reviews-score-count"
  function animateNumber(el, target, decimals, suffix) {
    var start = null;
    var dur = 1400;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = val.replace(".", ",") + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var scoreNum = document.querySelector(".reviews-score-number");
  var scoreText = document.querySelector(".reviews-score-count");
  var countDone = false;

  if (scoreNum && !reduceMotion) {
    // Guarda o valor final original ("5,0")
    var scoreTarget = parseFloat(scoreNum.textContent.replace(",", ".")) || 5;
    // Extrai o número de avaliações e o texto ao redor ("74 avaliações no Google")
    var countMatch = scoreText ? scoreText.textContent.match(/(\d+)(.*)/) : null;
    var reviewsTotal = countMatch ? parseInt(countMatch[1], 10) : 74;
    var reviewsSuffix = countMatch ? countMatch[2] : " avaliações no Google";

    var ioCount = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countDone) {
          countDone = true;
animateNumber(scoreNum, scoreTarget, 1, "");
          if (scoreText) animateNumber(scoreText, reviewsTotal, 0, reviewsSuffix);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ioCount.observe(scoreNum);
  }
})();
