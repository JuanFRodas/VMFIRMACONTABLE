"use strict";

/* =============================================================
   VM FIRMA CONTABLE — Configuración central del sitio
   -------------------------------------------------------------
   ÚNICO lugar donde se editan enlaces de WhatsApp, redes,
   publicaciones de Instagram y clientes.
   No requiere backend: es un objeto global leído por el frontend.
   ============================================================= */

window.VM_CONFIG = {
  /* ---------- WhatsApp (conversión principal del sitio) ---------- */
  whatsapp: {
    // Número en formato internacional, solo dígitos.
    numero: "573245921455",
    numeroVisible: "+57 324 5921455",

    // Mensajes prellenados por tipo de CTA.
    mensajes: {
      general:
        "Hola VM FIRMA CONTABLE, vengo desde la página web y quiero más información.",
      asesoria:
        "Hola VM FIRMA CONTABLE, quiero agendar una asesoría contable y tributaria.",
      biografia:
        "Hola Valentina, vi tu perfil en la página web y quiero hablar sobre mi caso.",
      consultaRenta:
        "Hola VM FIRMA CONTABLE, usé la herramienta de consulta de renta en la página web y quiero resolver mi caso.",
    },

    // Comunidad de WhatsApp (enlace de invitación al grupo/comunidad).
    comunidad: "https://chat.whatsapp.com/EwELMxwd1Uo0adixCrLXA1",
  },

  /* ---------- Datos de contacto ---------- */
  contacto: {
    email: "gerencia.vmfirmacontable@gmail.com",
    direccion: "CL 95 N 97 04 AP O 201, Chigorodó, Antioquia",
  },

  /* ---------- Redes sociales ---------- */
  redes: {
    instagram: "https://www.instagram.com/vmfirmacontable/?hl=es",
    linkedin: "https://www.linkedin.com/in/rodasvalentina12",
    facebook:
      "https://www.facebook.com/profile.php?id=61587332335362&ref=PROFILE_EDIT_xav_ig_profile_page_web",
  },

  /* ---------- Instagram: perfil + reels ----------
     La sección "Últimas publicaciones" se pinta como un muro de reels
     (mismo formato vertical 9:16 que Instagram) desde estos datos.

     Cada publicación acepta:
       url    → enlace real al reel/post (obligatorio)
       imagen → miniatura vertical en assets/instagram/ (ideal 720x1280).
                Si el archivo todavía no existe, la tarjeta muestra un
                marcador de posición y el enlace sigue funcionando.
       video  → opcional: .mp4 corto y sin audio en assets/instagram/.
                Si está, se reproduce en bucle al pasar el mouse.
       titulo → opcional: texto corto sobre la miniatura.

     PARA PUBLICAR MINIATURAS: guarda las imágenes con esos nombres en
     assets/instagram/ y listo, no hay que tocar más código.

     `usarEmbedOficial: true` reemplaza el muro por el embed oficial de
     Instagram (carga https://www.instagram.com/embed.js).
     -------------------------------------------------------- */
  instagram: {
    usarEmbedOficial: false,

    perfil: {
      usuario: "vmfirmacontable",
      nombre: "VM FIRMA CONTABLE",
      bio: "Contadora Pública · Esp. en Tributación · Tips contables y tributarios · Chigorodó, Urabá",
      avatar: "assets/logo-vm-96.png",
    },

    publicaciones: [
      {
        url: "https://www.instagram.com/p/DV9wdz0kV8M/?hl=es&img_index=1",
        imagen: "assets/instagram/reel-1.jpg",
        video: null,
        titulo: "",
      },
      {
        url: "https://www.instagram.com/p/DboWuw3mkHX/?hl=es&img_index=1",
        imagen: "assets/instagram/reel-2.jpg",
        video: null,
        titulo: "",
      },
      {
        url: "https://www.instagram.com/p/DW-TcgFka5x/?hl=es&img_index=1",
        imagen: "assets/instagram/reel-3.jpg",
        video: null,
        titulo: "",
      },
    ],
  },

  /* ---------- Clientes: "Ellos confían en nosotros" ----------
     PENDIENTE: quedan 4 marcadores por reemplazar con clientes reales.
     Estructura de cada elemento:

       {
         nombre:      "Nombre del cliente",
         logo:        "assets/clientes/nombre.png",  // null = usa iniciales
         descripcion: "Texto corto opcional",
         url:         "https://...",                 // perfil o web real
         redSocial:   "instagram" | "facebook" | "web",
         esPlaceholder: false                        // quitar al completar
       }

     Mientras `esPlaceholder` sea true, la tarjeta se muestra marcada
     como pendiente y no genera un enlace roto.
     ---------------------------------------------------------- */
  clientes: [
    {
      nombre: "Distribuciones Ferrenaty",
      logo: "assets/clientes/ferrenatyLogo.jpg",
      descripcion:
        "Empresa dedicada a la distribución de materiales para el sector ferretero, con más de 10 años de trayectoria y presencia en Chigorodó.",
      url: "https://www.instagram.com/ferrenaty_/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },
    {
      nombre: "Deposito y Cerámicas el Rodeo",
      logo: "assets/clientes/rodeoLogo.png",
      descripcion:
        "Empresa dedicada a la comercialización de cerámicas y materiales para la construcción, con varias sucursales en el Urabá antioqueño.",
      url: "https://www.instagram.com/depositoyceramicaselrodeo/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },
    {
      nombre: "DAKOTA NAILS",
      logo: "assets/clientes/dakotaLogo.jpg",
      descripcion:
        "Espacio especializado en servicios de cuidado y belleza de uñas, dando una experiencia única en Apartadó",
      url: "https://www.instagram.com/dakota_nailsspa/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },
    {
      nombre: "Jamaica Gourmet",
      logo: "assets/clientes/jamaicaLogo.jpg",
      descripcion:
        "Restaurante ubicado en Apartadó, enfocado en ofrecer una propuesta gastronómica gourmet con una experiencia especial para sus clientes.",
      url: "https://www.instagram.com/jamaicagourmett/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },
    {
      nombre: "EASY VOLEY CLUB",
      logo: "assets/clientes/easyVoleyLogo.jpg",
      descripcion:
        "Club deportivo especializado en voleibol, enfocado en el desarrollo de habilidades deportivas y trabajo en equipo.",
      url: "https://www.instagram.com/easyvoleyclub/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },

    {
      nombre: "JA SERVICIOS GANADEROS",
      logo: "assets/clientes/jaserviciosganaderosLogo.png",
      descripcion:
        "Empresa del sector ganadero en el Urabá antioqueño, enfocada en brindar servicios y soluciones para las actividades del sector pecuario de la región.",
      url: "https://www.instagram.com/jhoandnino/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },

    {
      nombre: "MOTO CARS KMJ",
      logo: "assets/clientes/motocarsLogo.jpg",
      descripcion:
        "Un espacio dedicado a la venta de repuestos y accesorios para motocicletas en Chigorodó.",
      url: "https://www.instagram.com/motocarskmj/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },

    {
      nombre: "PORVENIR PHARMA",
      logo: "assets/clientes/porvenirLogo.jpg",
      descripcion:
        "Droguería en Apartadó que ofrece medicamentos y productos para el cuidado de la salud, con una atención cercana y pensada para las necesidades de sus clientes.",
      url: "https://www.instagram.com/drogueria.porvenir.pharma/?hl=es",
      redSocial: "instagram",
      esPlaceholder: false,
    },
  ],
};

/* =============================================================
   Utilidades compartidas (sin dependencias, sin red)
   ============================================================= */
window.VM = {
  /**
   * Construye un enlace de WhatsApp con mensaje prellenado.
   * @param {string} [mensaje] Texto libre o clave de VM_CONFIG.whatsapp.mensajes
   */
  waLink(mensaje) {
    const cfg = window.VM_CONFIG.whatsapp;
    const texto = cfg.mensajes[mensaje] || mensaje || cfg.mensajes.general;
    return `https://wa.me/${cfg.numero}?text=${encodeURIComponent(texto)}`;
  },
};
