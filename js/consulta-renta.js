"use strict";

/* =============================================================
   VM FIRMA CONTABLE — Herramientas de /consulta-renta
   -------------------------------------------------------------
   100% frontend. Sin backend, sin base de datos, sin autenticación
   y sin llamadas a APIs externas (tampoco a la DIAN).

   Fuentes de datos (archivos estáticos locales):
     · js/data/preguntas-renta.js        → PREGUNTAS_RENTA
     · js/data/documentos-por-opcion.js  → OPCIONES_CHECKLIST,
                                           DOCUMENTOS_POR_OPCION,
                                           DOCUMENTOS_GENERALES

   Las respuestas del usuario viven solo en memoria del navegador:
   no se guardan, no se envían y se pierden al recargar la página.
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initQuizRenta();
  initChecklistDocumentos();

  /* ---------------------------------------------------------
     Utilidades comunes
     --------------------------------------------------------- */
  function ensureVisible(node) {
    if (!node) return;
    const top = node.getBoundingClientRect().top;
    if (top < 88 || top > window.innerHeight - 140) {
      window.scrollTo({
        top: window.scrollY + top - 110,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }

  function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    // Respaldo para contextos sin Clipboard API (http:// o file://).
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  /* =========================================================
     HERRAMIENTA 1 — ¿Estás obligado a declarar renta?
     ========================================================= */
  function initQuizRenta() {
    const root = document.getElementById("quizRenta");
    if (!root || !Array.isArray(window.PREGUNTAS_RENTA)) return;

    const preguntas = window.PREGUNTAS_RENTA;

    const stepsWrap = root.querySelector("[data-quiz-steps]");
    const resultWrap = root.querySelector("[data-quiz-result]");
    const progressFill = root.querySelector("[data-quiz-progress]");
    const progressLabel = root.querySelector("[data-quiz-step-label]");
    const progressBar = root.querySelector("[data-quiz-progressbar]");
    const formWrap = root.querySelector("[data-quiz-form]");

    /* Respuestas en memoria (nunca se persisten). */
    const respuestas = {};
    let pasoActual = 0;

    render();

    function render() {
      stepsWrap.innerHTML = "";
      preguntas.forEach((pregunta, index) => {
        stepsWrap.appendChild(construirPaso(pregunta, index));
      });
      mostrarPaso(0, { scroll: false });
    }

    function construirPaso(pregunta, index) {
      const paso = document.createElement("fieldset");
      paso.className = "quiz-step";
      paso.dataset.step = String(index);
      paso.hidden = true;

      const legend = document.createElement("legend");
      legend.className = "quiz-step__question";
      legend.textContent = pregunta.pregunta;
      paso.appendChild(legend);

      if (pregunta.ayuda) {
        const ayuda = document.createElement("p");
        ayuda.className = "quiz-step__help";
        ayuda.textContent = pregunta.ayuda;
        paso.appendChild(ayuda);
      }

      paso.appendChild(construirOpcionesSiNo(pregunta, index));

      paso.appendChild(construirNavegacion(pregunta, index));
      return paso;
    }

    function construirOpcionesSiNo(pregunta, index) {
      const grupo = document.createElement("div");
      grupo.className = "quiz-options";

      [
        { valor: true, etiqueta: "Sí" },
        { valor: false, etiqueta: "No" },
      ].forEach(({ valor, etiqueta }) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "quiz-option";
        boton.dataset.valor = String(valor);
        boton.setAttribute("aria-pressed", "false");
        boton.innerHTML =
          '<span class="quiz-option__mark" aria-hidden="true"></span>';
        const texto = document.createElement("span");
        texto.textContent = etiqueta;
        boton.appendChild(texto);

        boton.addEventListener("click", () => {
          respuestas[pregunta.id] = valor;
          grupo.querySelectorAll(".quiz-option").forEach((b) => {
            const activo = b === boton;
            b.classList.toggle("is-selected", activo);
            b.setAttribute("aria-pressed", String(activo));
          });

          const esUltima = index === preguntas.length - 1;
          if (esUltima) {
            const submit = grupo
              .closest(".quiz-step")
              .querySelector("[data-quiz-submit]");
            if (submit) submit.disabled = false;
          } else {
            window.setTimeout(
              () => avanzar(index + 1),
              prefersReducedMotion ? 0 : 220,
            );
          }
        });

        grupo.appendChild(boton);
      });

      return grupo;
    }

    function construirNavegacion(pregunta, index) {
      const nav = document.createElement("div");
      nav.className = "quiz-step__nav";

      if (index > 0) {
        const atras = document.createElement("button");
        atras.type = "button";
        atras.className = "btn btn--ghost btn--sm";
        atras.textContent = "Atrás";
        atras.addEventListener("click", () => mostrarPaso(index - 1));
        nav.appendChild(atras);
      }

      if (index === preguntas.length - 1) {
        const enviar = document.createElement("button");
        enviar.type = "button";
        enviar.className = "btn btn--primary";
        enviar.dataset.quizSubmit = "";
        enviar.textContent = "Ver mi resultado";
        enviar.disabled = true;
        enviar.addEventListener("click", mostrarResultado);
        nav.appendChild(enviar);
      }

      return nav;
    }

    function avanzar(index) {
      mostrarPaso(index);
    }

    function mostrarPaso(index, opciones) {
      const scroll = !opciones || opciones.scroll !== false;
      pasoActual = index;

      stepsWrap.querySelectorAll(".quiz-step").forEach((paso, i) => {
        paso.hidden = i !== index;
        if (i === index) paso.classList.add("is-entering");
      });

      const total = preguntas.length;
      const porcentaje = Math.round(((index + 1) / total) * 100);
      progressFill.style.width = `${porcentaje}%`;
      progressLabel.textContent = `Pregunta ${index + 1} de ${total}`;
      progressBar.setAttribute("aria-valuenow", String(index + 1));

      if (scroll) ensureVisible(root);

      const primerControl = stepsWrap.querySelector(
        `.quiz-step[data-step="${index}"] input, .quiz-step[data-step="${index}"] .quiz-option`,
      );
      if (scroll && primerControl && !prefersReducedMotion) {
        window.setTimeout(
          () => primerControl.focus({ preventScroll: true }),
          120,
        );
      }
    }

    /* ---- Resultado: solo condicionales, sin cálculo ---- */
    function mostrarResultado() {
      const determinantes = preguntas.filter((p) => p.determina);
      const marcadas = determinantes.filter((p) => respuestas[p.id] === true);
      const obligado = marcadas.length > 0;

      formWrap.hidden = true;
      resultWrap.hidden = false;
      resultWrap.innerHTML = "";
      resultWrap.appendChild(construirTarjetaResultado({ obligado, marcadas }));
      ensureVisible(resultWrap);
      const titulo = resultWrap.querySelector(".tool-result__title");
      if (titulo) titulo.focus();
    }

    function construirTarjetaResultado(datos) {
      const { obligado, marcadas } = datos;

      const card = document.createElement("div");
      card.className = `tool-result__card ${obligado ? "is-obligado" : "is-no-obligado"}`;

      const badge = document.createElement("p");
      badge.className = "tool-result__badge";
      badge.textContent = "Validación preliminar";
      card.appendChild(badge);

      const titulo = document.createElement("h3");
      titulo.className = "tool-result__title";
      titulo.tabIndex = -1;
      titulo.textContent = obligado
        ? "Según lo que nos cuentas, sí estarías obligado a declarar renta"
        : "Según lo que nos cuentas, no identificamos obligación de declarar renta";
      card.appendChild(titulo);

      if (obligado) {
        const fecha = document.createElement("p");
        fecha.className = "tool-result__lead";
        fecha.innerHTML =
          'La fecha límite depende de los últimos dígitos de tu documento y del calendario tributario del año. <span class="tool-result__pending">¡Si quieres conocer tu fecha exacta, escríbeme y la confirmamos!.</span>';
        card.appendChild(fecha);

        if (marcadas.length) {
          const subtitulo = document.createElement("p");
          subtitulo.className = "tool-result__subtitle";
          subtitulo.textContent = "Criterios que marcaste:";
          card.appendChild(subtitulo);

          const lista = document.createElement("ul");
          lista.className = "tool-result__list";
          marcadas.forEach((p) => {
            const li = document.createElement("li");
            li.textContent = p.resumen;
            lista.appendChild(li);
          });
          card.appendChild(lista);
        }
      } else {
        const lead = document.createElement("p");
        lead.className = "tool-result__lead";
        lead.textContent =
          "Con las respuestas que diste, no se identifica obligación de declarar renta por el año gravable 2025 bajo los criterios de topes de ingresos, patrimonio, consumos, compras y consignaciones.";
        card.appendChild(lead);
      }

      /* Notas informativas (no cambian la determinación). */
      const notas = preguntas
        .filter((p) => p.nota && respuestas[p.id] === true)
        .map((p) => p.nota);

      if (notas.length) {
        const notasWrap = document.createElement("div");
        notasWrap.className = "tool-result__notes";
        const notasTitulo = document.createElement("p");
        notasTitulo.className = "tool-result__subtitle";
        notasTitulo.textContent = "Ten en cuenta además:";
        notasWrap.appendChild(notasTitulo);
        const lista = document.createElement("ul");
        lista.className = "tool-result__list tool-result__list--info";
        notas.forEach((nota) => {
          const li = document.createElement("li");
          li.textContent = nota;
          lista.appendChild(li);
        });
        notasWrap.appendChild(lista);
        card.appendChild(notasWrap);
      }

      const disclaimer = document.createElement("p");
      disclaimer.className = "tool-disclaimer";
      disclaimer.innerHTML =
        "<strong>Esto es una orientación preliminar, no una determinación tributaria oficial.</strong> Validación con base en los Art. 591, 592, 593 y 594-3 del Estatuto Tributario (UVT 2025 = $49.799). Revisa tu caso puntual con tu contador.";
      card.appendChild(disclaimer);

      const cierre = document.createElement("p");
      cierre.className = "tool-result__cta-text";
      cierre.textContent = "¿Quieres que revisemos tu caso?";
      card.appendChild(cierre);

      const acciones = document.createElement("div");
      acciones.className = "tool-actions";

      const wa = document.createElement("a");
      wa.className = "btn btn--primary btn--lg";
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.href = window.VM.waLink(mensajeWhatsAppRenta({ obligado, marcadas }));
      wa.textContent = "Consultar por WhatsApp";
      acciones.appendChild(wa);

      const reiniciar = document.createElement("button");
      reiniciar.type = "button";
      reiniciar.className = "btn btn--ghost btn--lg";
      reiniciar.textContent = "Volver a empezar";
      reiniciar.addEventListener("click", () => {
        Object.keys(respuestas).forEach((k) => delete respuestas[k]);
        resultWrap.hidden = true;
        resultWrap.innerHTML = "";
        formWrap.hidden = false;
        render();
        ensureVisible(root);
      });
      acciones.appendChild(reiniciar);

      card.appendChild(acciones);
      return card;
    }

    function mensajeWhatsAppRenta(datos) {
      const { obligado, marcadas } = datos;
      const lineas = [
        "Hola VM FIRMA CONTABLE 👋",
        "Usé la herramienta de consulta de renta y este fue mi resultado:",
        "",
        obligado
          ? "Resultado: SÍ estaría obligado(a) a declarar renta (año gravable 2025)."
          : "Resultado: según mis respuestas, no se identifica obligación de declarar renta (año gravable 2025).",
      ];

      if (obligado) {
        lineas.push("Quiero saber cuál sería mi fecha límite para declarar.");
        if (marcadas.length) {
          lineas.push("", "Criterios que marqué:");
          marcadas.forEach((p) => lineas.push(`✓ ${p.resumen}`));
        }
      }

      lineas.push("", "Quiero revisar mi caso con ustedes.");
      return lineas.join("\n");
    }
  }

  /* =========================================================
     HERRAMIENTA 2 — Checklist de documentos
     ========================================================= */
  function initChecklistDocumentos() {
    const root = document.getElementById("checklistDocumentos");
    if (!root || !Array.isArray(window.OPCIONES_CHECKLIST)) return;

    const opciones = window.OPCIONES_CHECKLIST;
    const porOpcion = window.DOCUMENTOS_POR_OPCION || {};
    const generales = window.DOCUMENTOS_GENERALES || [];

    const grid = root.querySelector("[data-checklist-grid]");
    const formWrap = root.querySelector("[data-checklist-form]");
    const resultWrap = root.querySelector("[data-checklist-result]");
    const generar = root.querySelector("[data-checklist-submit]");
    const aviso = root.querySelector("[data-checklist-error]");
    const contador = root.querySelector("[data-checklist-count]");

    opciones.forEach((opcion, index) => {
      grid.appendChild(construirTarjetaOpcion(opcion, index));
    });
    actualizarContador();

    function construirTarjetaOpcion(opcion, index) {
      const label = document.createElement("label");
      label.className = "check-card";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "check-card__input";
      input.value = opcion.id;
      input.id = `opcion-${opcion.id}`;
      input.addEventListener("change", () => {
        label.classList.toggle("is-checked", input.checked);
        actualizarContador();
        if (input.checked) aviso.textContent = "";
      });

      const marca = document.createElement("span");
      marca.className = "check-card__box";
      marca.setAttribute("aria-hidden", "true");

      const texto = document.createElement("span");
      texto.className = "check-card__text";
      texto.textContent = opcion.etiqueta;

      const numero = document.createElement("span");
      numero.className = "check-card__num";
      numero.setAttribute("aria-hidden", "true");
      numero.textContent = String(index + 1).padStart(2, "0");

      label.appendChild(input);
      label.appendChild(marca);
      label.appendChild(texto);
      label.appendChild(numero);
      return label;
    }

    function seleccionadas() {
      return Array.from(grid.querySelectorAll("input:checked")).map(
        (i) => i.value,
      );
    }

    function actualizarContador() {
      const total = seleccionadas().length;
      contador.textContent =
        total === 0
          ? "Ninguna opción seleccionada"
          : total === 1
            ? "1 opción seleccionada"
            : `${total} opciones seleccionadas`;
    }

    generar.addEventListener("click", () => {
      const ids = seleccionadas();
      if (!ids.length) {
        aviso.textContent =
          "Marca al menos una opción para generar tu listado.";
        return;
      }
      aviso.textContent = "";

      /* Solo combinación de arrays: documentos marcados + generales. */
      const documentos = ids
        .flatMap((id) => porOpcion[id] || [])
        .concat(generales);
      const listado = Array.from(new Set(documentos));

      formWrap.hidden = true;
      resultWrap.hidden = false;
      resultWrap.innerHTML = "";
      resultWrap.appendChild(construirResultado(listado));
      ensureVisible(resultWrap);
      const titulo = resultWrap.querySelector(".tool-result__title");
      if (titulo) titulo.focus();
    });

    function construirResultado(listado) {
      const card = document.createElement("div");
      card.className = "tool-result__card is-documentos";

      const estado = document.createElement("p");
      estado.className = "form-status";
      estado.setAttribute("role", "status");

      const badge = document.createElement("p");
      badge.className = "tool-result__badge";
      badge.textContent = `${listado.length} documentos`;
      card.appendChild(badge);

      const titulo = document.createElement("h3");
      titulo.className = "tool-result__title";
      titulo.tabIndex = -1;
      titulo.textContent = "Este es tu listado de documentos";
      card.appendChild(titulo);

      const lead = document.createElement("p");
      lead.className = "tool-result__lead";
      lead.textContent =
        "Guárdalo, y si quieres que lo revisemos juntos, escríbenos por WhatsApp.";
      card.appendChild(lead);

      const lista = document.createElement("ul");
      lista.className = "tool-result__list tool-result__list--check";
      listado.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc;
        lista.appendChild(li);
      });
      card.appendChild(lista);

      const acciones = document.createElement("div");
      acciones.className = "tool-actions";

      const copiar = document.createElement("button");
      copiar.type = "button";
      copiar.className = "btn btn--dark btn--lg";
      copiar.textContent = "Copiar mensaje";
      copiar.addEventListener("click", () => {
        copiarAlPortapapeles(mensajeDocumentos(listado))
          .then(() => {
            copiar.textContent = "¡Mensaje copiado!";
            estado.textContent = "El mensaje quedó en tu portapapeles.";
          })
          .catch(() => {
            estado.textContent =
              "No pudimos copiar automáticamente. Selecciona el listado y cópialo a mano.";
          })
          .finally(() => {
            window.setTimeout(
              () => (copiar.textContent = "Copiar mensaje"),
              2600,
            );
          });
      });
      acciones.appendChild(copiar);

      const wa = document.createElement("a");
      wa.className = "btn btn--primary btn--lg";
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.href = window.VM.waLink(mensajeDocumentos(listado));
      wa.textContent = "Consultar con VM FIRMA CONTABLE";
      acciones.appendChild(wa);

      const reiniciar = document.createElement("button");
      reiniciar.type = "button";
      reiniciar.className = "btn btn--ghost btn--lg";
      reiniciar.textContent = "Modificar selección";
      reiniciar.addEventListener("click", () => {
        resultWrap.hidden = true;
        resultWrap.innerHTML = "";
        formWrap.hidden = false;
        ensureVisible(root);
      });
      acciones.appendChild(reiniciar);

      card.appendChild(acciones);
      card.appendChild(estado);
      return card;
    }

    function mensajeDocumentos(listado) {
      const lineas = [
        "Hola VM FIRMA CONTABLE 👋",
        "Generé mi listado de documentos para la declaración de renta en la página web:",
        "",
      ];
      listado.forEach((doc) => lineas.push(`✓ ${doc}`));
      lineas.push("", "Quiero que revisemos juntos mi declaración.");
      return lineas.join("\n");
    }
  }
});
