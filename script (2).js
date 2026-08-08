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
})();
