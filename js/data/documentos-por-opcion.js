"use strict";

/* =============================================================
   Checklist de documentos para la declaración de renta
   -------------------------------------------------------------
   TABLAS DE DATOS FIJAS, editables a mano. Sin backend.
   El componente solo combina los arrays de las opciones marcadas
   con DOCUMENTOS_GENERALES (.flatMap). No hay reglas adicionales.
   ============================================================= */

/* Opciones del checklist, en el orden en que se muestran. */
window.OPCIONES_CHECKLIST = [
  { id: "salario", etiqueta: "Recibí ingresos por salario o contrato laboral" },
  { id: "independiente", etiqueta: "Trabajé como independiente (honorarios, servicios)" },
  { id: "pension", etiqueta: "Recibí pensión" },
  { id: "inversionesColombia", etiqueta: "Tengo cuentas de ahorro, CDT o inversiones en Colombia" },
  { id: "dividendos", etiqueta: "Recibí dividendos de empresas colombianas" },
  { id: "arriendos", etiqueta: "Recibí ingresos por arriendo de inmuebles o bienes" },
  { id: "activosExterior", etiqueta: "Tengo activos en el exterior (cuentas, inversiones, criptoactivos)" },
  { id: "inmuebles", etiqueta: "Tengo inmuebles a mi nombre" },
  { id: "vehiculos", etiqueta: "Tengo vehículos a mi nombre" },
  { id: "deudas", etiqueta: "Tengo deudas o créditos vigentes al 31 de diciembre de 2025" },
  { id: "creditoVivienda", etiqueta: "Pagué intereses de crédito de vivienda" },
  { id: "medicinaPrepagada", etiqueta: "Pagué medicina prepagada" },
  { id: "dependientes", etiqueta: "Tengo dependientes económicos (hijos, cónyuge, padres)" },
  { id: "aportesAfc", etiqueta: "Hice aportes voluntarios a pensión o cuentas AFC" },
  { id: "ventasHerencias", etiqueta: "Vendí bienes, recibí herencias o gané loterías/rifas en 2025" },
];

/* Documentos asociados a cada opción. EDITAR MANUALMENTE. */
window.DOCUMENTOS_POR_OPCION = {
  salario: [
    "Certificado de ingresos y retenciones",
    "Certificados laborales o documentos relacionados",
  ],
  independiente: [
    "Certificados de ingresos",
    "Soportes relacionados con honorarios y servicios",
  ],
  pension: [
    "Certificado de ingresos por pensión",
    "Soportes de aportes a salud descontados, cuando corresponda",
  ],
  inversionesColombia: [
    "Certificados bancarios de saldos al 31 de diciembre de 2025",
    "Certificados de rendimientos financieros y retenciones practicadas",
  ],
  dividendos: [
    "Certificado de dividendos y participaciones",
    "Soportes de retenciones practicadas sobre dividendos",
  ],
  arriendos: [
    "Certificados o soportes de los ingresos por arriendo recibidos",
    "Contratos de arrendamiento vigentes, cuando corresponda",
  ],
  activosExterior: [
    "Certificados o soportes de cuentas, inversiones o activos correspondientes",
  ],
  inmuebles: [
    "Certificado de tradición o escritura del inmueble",
    "Impuesto predial del año correspondiente (avalúo catastral)",
  ],
  vehiculos: [
    "Tarjeta de propiedad",
    "Valor según RUNT u otros soportes correspondientes",
  ],
  deudas: [
    "Certificados de saldo de deudas o créditos vigentes al 31 de diciembre de 2025",
  ],
  creditoVivienda: ["Certificado de intereses pagados"],
  medicinaPrepagada: ["Certificado de pagos realizados"],
  dependientes: [
    "Documentos que soporten la condición de dependiente, cuando corresponda",
  ],
  aportesAfc: [
    "Certificado de aportes voluntarios a pensión",
    "Certificado de aportes a cuentas AFC",
  ],
  ventasHerencias: [
    "Soportes de la venta, herencia o ganancia ocasional recibida",
    "Documentos del bien enajenado y su costo fiscal, cuando corresponda",
  ],
};

/* Documentos que siempre aplican. */
window.DOCUMENTOS_GENERALES = [
  "Estar inscrito en la DIAN",
  "Contar con usuario y clave de ingreso a la DIAN",
];
