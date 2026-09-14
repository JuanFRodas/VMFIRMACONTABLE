"use strict";

/* Iconos SVG reutilizados por el muro de reels. Viven fuera del
   listener para que estén disponibles en cuanto corren los módulos. */
const ICONO_INSTAGRAM =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none"/></svg>';

const ICONO_REEL =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3.6 8.5h16.8"/><path d="M8.5 3.2l3 5.3M14 3.2l3 5.3"/><path d="M10.6 12.4l4 2.2-4 2.2z" fill="currentColor" stroke="none"/></svg>';

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Cada módulo es independiente: si uno falla, los demás siguen
     funcionando (los enlaces de WhatsApp y la navegación son la ruta
     de conversión del sitio y no deben depender de los otros). */
  [
    initHeader,
    initMobileNav,
    initActiveNav,
    initScrollSpy,
    initRevealAnimations,
    initCounters,
    initWhatsAppLinks,
    initInstagramFeed,
    initToTop,
    initClientesCarousel,
    initContactForm,
  ].forEach((init) => {
    try {
      init();
    } catch (error) {
      console.error(`[VM] ${init.name} falló:`, error);
    }
  });

  /* ---------------------------------------------------------
     Sticky header shadow on scroll
     --------------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    const toggleShadow = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    toggleShadow();
    window.addEventListener("scroll", toggleShadow, { passive: true });
  }

  /* ---------------------------------------------------------
     Botón flotante "volver arriba"
     Aparece al bajar y devuelve al inicio de la página.
     --------------------------------------------------------- */
  function initToTop() {
    const boton = document.querySelector("[data-to-top]");
    if (!boton) return;

    const alternar = () => {
      boton.classList.toggle("is-visible", window.scrollY > 500);
    };

    boton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      /* Devuelve el foco al logo para quien navega con teclado:
         enfocar el enlace de salto lo haría aparecer en pantalla. */
      const marca = document.querySelector(".site-header .brand");
      if (marca) marca.focus({ preventScroll: true });
    });

    alternar();
    window.addEventListener("scroll", alternar, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile navigation toggle
     --------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú de navegación");
    };

    const openNav = () => {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú de navegación");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1140) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------------------------------------------------
     Página actual activa en el menú (páginas internas)
     --------------------------------------------------------- */
  function initActiveNav() {
    const pagina = document.body.dataset.page;
    if (!pagina) return;
    document
      .querySelectorAll(`.main-nav__list a[data-page="${pagina}"]`)
      .forEach((link) => {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      });
  }

  /* ---------------------------------------------------------
     Scroll-spy: highlight active nav link (solo en el home)
     --------------------------------------------------------- */
  function initScrollSpy() {
    if (document.body.dataset.page !== "inicio") return;

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll('.main-nav__list a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const linkFor = (id) =>
      document.querySelector(`.main-nav__list a[href="#${id}"]`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("is-active"));
            const activeLink = linkFor(entry.target.id);
            if (activeLink) activeLink.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------
     Fade-in-on-scroll reveal animations (progressive enhancement)
     --------------------------------------------------------- */
  function initRevealAnimations() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    revealEls.forEach((el) => el.classList.add("reveal-armed"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = prefersReducedMotion
        ? "0ms"
        : `${Math.min(index % 4, 3) * 80}ms`;
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Animated stat counters
     --------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll(".stat__number");
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.countTarget, 10);
      const suffix = el.dataset.suffix || "";
      if (Number.isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = `${target.toLocaleString("es-CO")}${suffix}`;
        return;
      }

      const duration = 1600;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = `${current.toLocaleString("es-CO")}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${target.toLocaleString("es-CO")}${suffix}`;
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ---------------------------------------------------------
     Enlaces de WhatsApp centralizados (js/config.js)
     · [data-wa]           → enlace directo al chat, con mensaje
                             prellenado (clave de VM_CONFIG o texto libre)
     · [data-wa-comunidad] → enlace a la comunidad de WhatsApp
     El href escrito en el HTML funciona como respaldo sin JS.
     --------------------------------------------------------- */
  function initWhatsAppLinks() {
    if (!window.VM_CONFIG || !window.VM) return;

    document.querySelectorAll("[data-wa]").forEach((link) => {
      link.href = window.VM.waLink(link.dataset.wa);
      link.target = "_blank";
      link.rel = "noopener";
    });

    document.querySelectorAll("[data-wa-comunidad]").forEach((link) => {
      link.href = window.VM_CONFIG.whatsapp.comunidad;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  /* ---------------------------------------------------------
     Instagram: muro de reels desde js/config.js
     Miniaturas verticales 9:16 + cabecera de perfil + CTA,
     en el mismo formato en el que se publican los reels.
     --------------------------------------------------------- */
  function initInstagramFeed() {
    const mount = document.querySelector("[data-instagram-grid]");
    if (!mount || !window.VM_CONFIG) return;

    const cfg = window.VM_CONFIG.instagram || {};
    const publicaciones = cfg.publicaciones || [];
    if (!publicaciones.length) {
      mount.hidden = true;
      return;
    }

    if (cfg.usarEmbedOficial) {
      renderEmbedsOficiales(mount, publicaciones);
      return;
    }

    const perfil = cfg.perfil || {};
    const perfilUrl =
      (window.VM_CONFIG.redes && window.VM_CONFIG.redes.instagram) ||
      "https://www.instagram.com/";

    mount.classList.add("reels-wall");
    mount.appendChild(construirCabeceraPerfil(perfil, perfilUrl));

    const grid = document.createElement("div");
    grid.className = "reels-wall__grid";
    publicaciones.forEach((post, indice) => {
      grid.appendChild(construirReel(post, indice));
    });
    mount.appendChild(grid);

    const pie = document.createElement("div");
    pie.className = "reels-wall__foot";
    const seguir = document.createElement("a");
    seguir.className = "btn btn--primary reels-wall__follow";
    seguir.href = perfilUrl;
    seguir.target = "_blank";
    seguir.rel = "noopener";
    seguir.innerHTML = ICONO_INSTAGRAM + "<span>¡Sígueme en Instagram!</span>";
    pie.appendChild(seguir);
    mount.appendChild(pie);
  }

  function construirCabeceraPerfil(perfil, perfilUrl) {
    const head = document.createElement("a");
    head.className = "reels-wall__head";
    head.href = perfilUrl;
    head.target = "_blank";
    head.rel = "noopener";
    head.setAttribute(
      "aria-label",
      `Abrir el perfil de Instagram de ${perfil.nombre || "VM Firma Contable"}`,
    );

    const avatar = document.createElement("span");
    avatar.className = "reels-wall__avatar";
    if (perfil.avatar) {
      const img = document.createElement("img");
      img.src = perfil.avatar;
      img.alt = "";
      img.width = 96;
      img.height = 96;
      img.loading = "lazy";
      img.decoding = "async";
      avatar.appendChild(img);
    } else {
      avatar.innerHTML = ICONO_INSTAGRAM;
    }

    const datos = document.createElement("span");
    datos.className = "reels-wall__id";

    const usuario = document.createElement("span");
    usuario.className = "reels-wall__user";
    usuario.textContent = perfil.usuario ? `@${perfil.usuario}` : perfil.nombre || "";
    datos.appendChild(usuario);

    if (perfil.bio) {
      const bio = document.createElement("span");
      bio.className = "reels-wall__bio";
      bio.textContent = perfil.bio;
      datos.appendChild(bio);
    }

    head.appendChild(avatar);
    head.appendChild(datos);
    return head;
  }

  function construirReel(post, indice) {
    const card = document.createElement("a");
    card.className = "reel-card";
    card.href = post.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.style.setProperty("--reel-delay", `${indice * 90}ms`);
    card.setAttribute(
      "aria-label",
      post.titulo
        ? `Ver en Instagram: ${post.titulo}`
        : "Ver esta publicación en Instagram",
    );

    const media = document.createElement("span");
    media.className = "reel-card__media";

    if (post.video) {
      media.appendChild(construirVideoReel(post, card));
    } else if (post.imagen) {
      media.appendChild(construirImagenReel(post.imagen, media));
    } else {
      marcarReelPendiente(media);
    }

    /* Capas fijas de la tarjeta: play, etiqueta de reel y pie. */
    const capas = document.createElement("span");
    capas.className = "reel-card__overlay";

    const tipo = document.createElement("span");
    tipo.className = "reel-card__type";
    tipo.setAttribute("aria-hidden", "true");
    tipo.innerHTML = ICONO_REEL;

    const play = document.createElement("span");
    play.className = "reel-card__play";
    play.setAttribute("aria-hidden", "true");
    play.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.2l9.5 5.8L9 17.8z" fill="currentColor"/></svg>';

    const pie = document.createElement("span");
    pie.className = post.titulo
      ? "reel-card__caption"
      : "reel-card__caption reel-card__caption--soft";
    pie.textContent = post.titulo || "Ver publicación";

    capas.appendChild(tipo);
    capas.appendChild(play);
    capas.appendChild(pie);
    media.appendChild(capas);

    card.appendChild(media);
    return card;
  }

  function construirImagenReel(src, media) {
    const img = document.createElement("img");
    img.className = "reel-card__img";
    img.src = src;
    img.alt = "Publicación de VM Firma Contable en Instagram sobre contabilidad e impuestos";
    img.width = 640;
    img.height = 853;
    img.loading = "lazy";
    img.decoding = "async";
    /* La miniatura puede no estar cargada todavía en assets/instagram/:
       en ese caso la tarjeta cae al marcador y el enlace sigue vivo. */
    img.addEventListener("error", () => {
      img.remove();
      marcarReelPendiente(media);
    });
    return img;
  }

  function construirVideoReel(post, card) {
    const video = document.createElement("video");
    video.className = "reel-card__video";
    video.src = post.video;
    if (post.imagen) video.poster = post.imagen;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-hidden", "true");

    if (!prefersReducedMotion) {
      const reproducir = () => {
        const intento = video.play();
        if (intento && intento.catch) intento.catch(() => {});
      };
      const pausar = () => {
        video.pause();
        video.currentTime = 0;
      };
      card.addEventListener("pointerenter", reproducir);
      card.addEventListener("focus", reproducir);
      card.addEventListener("pointerleave", pausar);
      card.addEventListener("blur", pausar);
    }

    return video;
  }

  function marcarReelPendiente(media) {
    media.classList.add("is-placeholder");
    const marcador = document.createElement("span");
    marcador.className = "reel-card__placeholder";
    marcador.setAttribute("aria-hidden", "true");
    marcador.innerHTML = ICONO_INSTAGRAM;
    media.insertBefore(marcador, media.firstChild);
  }

  function renderEmbedsOficiales(grid, publicaciones) {
    grid.classList.add("ig-grid--embed");
    publicaciones.forEach((post) => {
      const quote = document.createElement("blockquote");
      quote.className = "instagram-media";
      quote.setAttribute("data-instgrm-permalink", post.url);
      quote.setAttribute("data-instgrm-version", "14");
      const enlace = document.createElement("a");
      enlace.href = post.url;
      enlace.target = "_blank";
      enlace.rel = "noopener";
      enlace.textContent = "Ver esta publicación en Instagram";
      quote.appendChild(enlace);
      grid.appendChild(quote);
    });

    if (!document.getElementById("instagramEmbedScript")) {
      const script = document.createElement("script");
      script.id = "instagramEmbedScript";
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }

  /* ---------------------------------------------------------
     Carrusel de clientes ("Ellos confían en nosotros")
     --------------------------------------------------------- */
  function initClientesCarousel() {
    const carousel = document.querySelector("[data-clientes]");
    if (!carousel || !window.VM_CONFIG) return;

    const track = carousel.querySelector("[data-clientes-track]");
    const prev = carousel.querySelector("[data-clientes-prev]");
    const next = carousel.querySelector("[data-clientes-next]");
    const clientes = window.VM_CONFIG.clientes || [];

    if (!clientes.length) {
      track.innerHTML =
        '<p class="clientes__empty">Pronto compartiremos aquí las empresas que confían en nosotros.</p>';
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      return;
    }

    clientes.forEach((cliente) => {
      track.appendChild(construirTarjetaCliente(cliente));
    });

    const scrollPorPaso = () => Math.max(track.clientWidth * 0.8, 240);

    const actualizarControles = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const desbordado = max > 0;
      if (prev) {
        prev.hidden = !desbordado;
        prev.disabled = track.scrollLeft <= 2;
      }
      if (next) {
        next.hidden = !desbordado;
        next.disabled = track.scrollLeft >= max;
      }
    };

    const mover = (direccion) => {
      track.scrollBy({
        left: direccion * scrollPorPaso(),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    if (prev) prev.addEventListener("click", () => mover(-1));
    if (next) next.addEventListener("click", () => mover(1));
    track.addEventListener("scroll", actualizarControles, { passive: true });
    window.addEventListener("resize", actualizarControles);
    actualizarControles();
  }

  function construirTarjetaCliente(cliente) {
    const tieneEnlace = Boolean(cliente.url) && !cliente.esPlaceholder;
    const card = document.createElement(tieneEnlace ? "a" : "div");
    card.className = "cliente-card";

    if (tieneEnlace) {
      card.href = cliente.url;
      card.target = "_blank";
      card.rel = "noopener";
      card.setAttribute("aria-label", `Visitar el perfil de ${cliente.nombre}`);
    }
    if (cliente.esPlaceholder) card.classList.add("is-placeholder");

    const logo = document.createElement("div");
    logo.className = "cliente-card__logo";
    if (cliente.logo) {
      const img = document.createElement("img");
      img.src = cliente.logo;
      img.alt = `Logo de ${cliente.nombre}`;
      img.width = 150;
      img.height = 150;
      img.loading = "lazy";
      img.decoding = "async";
      logo.appendChild(img);
    } else {
      logo.classList.add("is-empty");
      logo.textContent = iniciales(cliente.nombre);
    }
    card.appendChild(logo);

    const nombre = document.createElement("p");
    nombre.className = "cliente-card__name";
    nombre.textContent = cliente.nombre;
    card.appendChild(nombre);

    if (cliente.descripcion) {
      const desc = document.createElement("p");
      desc.className = "cliente-card__desc";
      desc.textContent = cliente.descripcion;
      card.appendChild(desc);
    }

    if (tieneEnlace) {
      const red = document.createElement("span");
      red.className = "cliente-card__link";
      red.textContent =
        cliente.redSocial === "web"
          ? "Visitar sitio web →"
          : `Ver en ${cliente.redSocial === "facebook" ? "Facebook" : "Instagram"} →`;
      card.appendChild(red);
    } else if (cliente.esPlaceholder) {
      const aviso = document.createElement("span");
      aviso.className = "cliente-card__link";
      aviso.textContent = "Pendiente de completar";
      card.appendChild(aviso);
    }

    return card;
  }

  function iniciales(nombre) {
    return (nombre || "")
      .replace(/[^\p{L}\p{N} ]/gu, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
  }

  /* ---------------------------------------------------------
     Contact form validation + submit feedback
     --------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const status = document.getElementById("formStatus");

    const fields = [
      {
        input: form.elements["name"],
        error: document.getElementById("nameError"),
        message: "Por favor ingresa tu nombre.",
      },
      {
        input: form.elements["email"],
        error: document.getElementById("emailError"),
        message: "Ingresa un correo electrónico válido.",
      },
      {
        input: form.elements["phone"],
        error: document.getElementById("phoneError"),
        message: "Ingresa un número de teléfono válido.",
      },
      {
        input: form.elements["message"],
        error: document.getElementById("messageError"),
        message: "Cuéntanos brevemente qué necesitas.",
      },
    ];

    function validate() {
      let isValid = true;

      fields.forEach(({ input, error, message }) => {
        if (!input.checkValidity()) {
          error.textContent = message;
          isValid = false;
        } else {
          error.textContent = "";
        }
      });

      return isValid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!validate()) {
        status.textContent = "Revisa los campos marcados antes de continuar.";
        status.className = "form-status is-error";
        return;
      }

      const nombre = form.elements["name"].value.trim();
      const correo = form.elements["email"].value.trim();
      const telefono = form.elements["phone"].value.trim();
      const empresa = form.elements["company"].value.trim();
      const mensaje = form.elements["message"].value.trim();

      const texto =
        "Nueva consulta desde la página web\n\n" +
        "Nombre: " +
        nombre +
        "\n" +
        "Correo: " +
        correo +
        "\n" +
        "Teléfono: " +
        telefono +
        "\n" +
        "Empresa: " +
        (empresa || "No especificada") +
        "\n\n" +
        "Mensaje:\n" +
        mensaje;

      // Número tomado de js/config.js (single source of truth).
      window.location.href = window.VM
        ? window.VM.waLink(texto)
        : "https://wa.me/573245921455?text=" + encodeURIComponent(texto);
    });
  }
});
