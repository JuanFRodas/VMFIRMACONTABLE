"use strict";

/* =============================================================
   Preguntas de la herramienta "¿Estás obligado a declarar renta?"
   Año gravable 2025 · UVT 2025 = $49.799
   -------------------------------------------------------------
   Contenido separado de la lógica. Editable a mano.

   tipo:     "siNo"
   determina: true  → un "Sí" activa la obligación de declarar
              false → pregunta informativa, no cambia el resultado
   resumen:  etiqueta corta usada en el mensaje de WhatsApp
   ============================================================= */

window.PREGUNTAS_RENTA = [
  {
    id: "iva",
    tipo: "siNo",
    pregunta: "¿Eres responsable de IVA?",
    ayuda: "",
    determina: false,
    resumen: "Responsable de IVA",
    nota: "Ser responsable de IVA implica obligaciones formales adicionales que conviene revisar con tu contador (Art. 591 y 592 ET).",
  },
  {
    id: "activosExterior",
    tipo: "siNo",
    pregunta: "¿Tienes activos, cuentas, inversiones o criptoactivos en el exterior?",
    ayuda: "No define por sí solo tu obligación, pero puede implicar la Declaración de Activos en el Exterior.",
    determina: false,
    resumen: "Activos en el exterior",
    nota: "Tener activos en el exterior puede implicar presentar la Declaración de Activos en el Exterior, independiente de la declaración de renta.",
  },
  {
    id: "ingresos",
    tipo: "siNo",
    pregunta: "¿Tus ingresos brutos totales en 2025 fueron iguales o superiores a $69.718.600?",
    ayuda: "1.400 UVT (Art. 592 y 594-3 ET). UVT 2025 = $49.799.",
    determina: true,
    resumen: "Ingresos brutos ≥ 1.400 UVT ($69.718.600)",
  },
  {
    id: "patrimonio",
    tipo: "siNo",
    pregunta: "¿Tu patrimonio bruto al 31 de diciembre de 2025 superó $224.095.500?",
    ayuda: "4.500 UVT (Art. 592 y 593 ET).",
    determina: true,
    resumen: "Patrimonio bruto > 4.500 UVT ($224.095.500)",
  },
  {
    id: "tarjetaCredito",
    tipo: "siNo",
    pregunta: "¿Tus consumos con tarjeta de crédito en 2025 fueron iguales o superiores a $69.718.600?",
    ayuda: "1.400 UVT (Art. 594-3, literal a, ET).",
    determina: true,
    resumen: "Consumos con tarjeta de crédito ≥ 1.400 UVT",
  },
  {
    id: "compras",
    tipo: "siNo",
    pregunta: "¿Tus compras y consumos totales en 2025 fueron iguales o superiores a $69.718.600?",
    ayuda: "1.400 UVT (Art. 594-3, literal b, ET).",
    determina: true,
    resumen: "Compras y consumos ≥ 1.400 UVT",
  },
  {
    id: "consignaciones",
    tipo: "siNo",
    pregunta: "¿Tus consignaciones bancarias, depósitos o inversiones financieras en 2025 fueron iguales o superiores a $69.718.600?",
    ayuda: "1.400 UVT (Art. 594-3, literal c, ET).",
    determina: true,
    resumen: "Consignaciones o depósitos ≥ 1.400 UVT",
  },
];
