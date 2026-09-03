/* ============================================================
   CONFIGURACIÓN DEL SITIO  —  edita SOLO este archivo
   ------------------------------------------------------------
   Todos los datos de contacto, horarios y servicios se leen
   desde aquí. No hace falta tocar el HTML.
   ============================================================ */

window.SITE = {
  /* --- Identidad ------------------------------------------- */
  nombre: "Alejandro Ruiz",
  claim: "Acupuntura y Osteopatía",
  ciudad: "Irún",

  /* --- Contacto (DATOS DE EJEMPLO: sustituir) --------------- */
  telefono: "+34 664 49 38 38",         // se muestra tal cual
  telefonoLink: "+34664493838",         // sin espacios, para tel:
  whatsapp: "34664493838",              // solo dígitos con prefijo país
  email: "hola@alejandroruiz.example",
  direccion: "Calle Ejemplo 1, 2º B",
  codigoPostal: "20301 Irún (Gipuzkoa)",
  mapsQuery: "Calle Ejemplo 1, Irún, Gipuzkoa",
  instagram: "",                        // p.ej. "alejandroruiz.salud" ("" = oculto)

  /* --- Horario --------------------------------------------- */
  horario: [
    { dias: "Lunes a viernes", horas: "09:00 – 14:00 · 16:00 – 20:00" },
    { dias: "Sábado",          horas: "09:00 – 14:00" },
    { dias: "Domingo",         horas: "Cerrado" }
  ],

  /* Franjas reservables por día de la semana (0 = domingo) */
  franjas: {
    1: ["09:00","10:00","11:00","12:00","13:00","16:00","17:00","18:00","19:00"],
    2: ["09:00","10:00","11:00","12:00","13:00","16:00","17:00","18:00","19:00"],
    3: ["09:00","10:00","11:00","12:00","13:00","16:00","17:00","18:00","19:00"],
    4: ["09:00","10:00","11:00","12:00","13:00","16:00","17:00","18:00","19:00"],
    5: ["09:00","10:00","11:00","12:00","13:00","16:00","17:00","18:00","19:00"],
    6: ["09:00","10:00","11:00","12:00","13:00"],
    0: []
  },

  /* Días concretos cerrados (vacaciones, festivos) YYYY-MM-DD */
  cerrado: ["2026-12-25", "2027-01-01"],

  /* Cuántos días vista se pueden reservar */
  diasReservables: 45,

  /* --- Servicios ------------------------------------------- */
  servicios: [
    {
      id: "acupuntura",
      titulo: "Acupuntura",
      duracion: "50 min",
      precio: "45 €",
      resumen: "Regulación del dolor, el sueño y el estrés mediante puntos seleccionados según la Medicina Tradicional China.",
      detalle: [
        "Historia clínica y diagnóstico por lengua y pulso",
        "Agujas estériles de un solo uso",
        "Indicada en dolor crónico, ansiedad, insomnio y digestiones"
      ]
    },
    {
      id: "osteopatia",
      titulo: "Osteopatía estructural",
      duracion: "50 min",
      precio: "50 €",
      resumen: "Terapia manual sobre articulaciones, músculo y fascia para devolver movilidad y descargar tensiones.",
      detalle: [
        "Valoración postural y de la movilidad",
        "Técnicas articulares, miofasciales y de energía muscular",
        "Cervicalgias, lumbalgias, hombro y cadera"
      ]
    },
    {
      id: "visceral-craneal",
      titulo: "Osteopatía visceral y craneal",
      duracion: "50 min",
      precio: "50 €",
      resumen: "Trabajo suave y profundo sobre diafragma, vísceras y base craneal. Muy indicada en digestiones y cefaleas.",
      detalle: [
        "Técnicas de muy baja intensidad",
        "Cefaleas tensionales, reflujo, estreñimiento",
        "Apta para embarazo y personas sensibles"
      ]
    },
    {
      id: "puncion-seca",
      titulo: "Punción seca",
      duracion: "30 min",
      precio: "35 €",
      resumen: "Desactivación de puntos gatillo miofasciales para contracturas resistentes y dolor referido.",
      detalle: [
        "Punción profunda o superficial según el caso",
        "Combinable con osteopatía en la misma sesión",
        "Pautas de estiramiento posteriores"
      ]
    },
    {
      id: "moxa-ventosas",
      titulo: "Moxibustión y ventosas",
      duracion: "40 min",
      precio: "40 €",
      resumen: "Calor terapéutico y succión para mejorar la circulación local, la rigidez y la recuperación muscular.",
      detalle: [
        "Moxa sin humo disponible",
        "Ventosa fija o deslizante",
        "Ideal como sesión de mantenimiento"
      ]
    },
    {
      id: "primera-visita",
      titulo: "Primera visita",
      duracion: "70 min",
      precio: "60 €",
      resumen: "Valoración completa, plan de tratamiento personalizado y primera sesión combinada.",
      detalle: [
        "Entrevista clínica extensa",
        "Exploración osteopática y diagnóstico MTC",
        "Tratamiento el mismo día"
      ]
    }
  ],

  /* --- Motivos de consulta frecuentes ---------------------- */
  motivos: [
    "Dolor de espalda y cuello", "Ciática y lumbalgia", "Migrañas y cefaleas",
    "Ansiedad y estrés", "Insomnio", "Lesiones deportivas",
    "Digestiones lentas", "Dolor articular", "Recuperación postparto"
  ],

  /* --- Testimonios ----------------------------------------- */
  testimonios: [
    { texto: "Llevaba dos años con dolor lumbar y en cinco sesiones he recuperado mi vida normal. Explica cada paso y transmite muchísima calma.", autor: "Marta G." },
    { texto: "Fui muy escéptico con la acupuntura. Salí de la primera sesión durmiendo mejor que en meses.", autor: "Javier L." },
    { texto: "Trato cercano y profesional. El espacio es tranquilo y nunca te sientes una consulta más.", autor: "Elena P." }
  ],

  /* --- Base de datos de citas (Supabase) -------------------- */
  /* Déjalo vacío y el formulario enviará la solicitud por
     WhatsApp. Rellénalo y las citas se guardarán en la agenda.
     Instrucciones completas en README.md                      */
  supabase: {
    url: "",       // p.ej. "https://xxxxxxxx.supabase.co"
    anonKey: ""    // clave pública "anon" del proyecto
  }
};
