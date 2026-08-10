"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initHeader();
  initMobileNav();
  initScrollSpy();
  initRevealAnimations();
  initCounters();
  initContactForm();

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
     Scroll-spy: highlight active nav link
     --------------------------------------------------------- */
  function initScrollSpy() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".main-nav__list a");
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

      const whatsappURL =
        "https://wa.me/573245921455?text=" + encodeURIComponent(texto);

      window.location.href = whatsappURL;
    });
  }
});
