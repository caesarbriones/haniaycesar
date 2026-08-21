// 💕 CONFIGURACIÓN CENTRAL
// Edita prácticamente toda la página modificando SOLO este archivo.
// Las fechas usan formato "YYYY-MM-DD". Mientras una fecha sea "YYYY-MM-DD"
// (placeholder), su sección mostrará un mensaje bonito en vez de números.

export interface Fact {
  icon: string;
  label: string;
  value: string;
}

export interface CityInfo {
  name: string;
  state: string;
  emoji: string;
  lat: number;
  lng: number;
}

export interface TimelineMoment {
  date: string; // "YYYY-MM-DD"
  title: string;
  description: string;
  icon: string;
  image?: string;
}

/** Distancia en píxeles a la que el botón "NO" empieza a huir del cursor/dedo. */
export const NO_ESCAPE_DISTANCE = 120;

/** Textos del botón "NO" según la cantidad de veces que ha escapado. */
export const NO_BUTTON_LABELS: Array<{ minAttempts: number; label: string }> = [
  { minAttempts: 20, label: "Ya sabemos los dos que vas a decir que sí 😭" },
  { minAttempts: 15, label: "JAJAJA dale al SÍ ❤️" },
  { minAttempts: 10, label: "¡No me atrapas! 😂" },
  { minAttempts: 6, label: "Piénsalo otra vez 😭" },
  { minAttempts: 3, label: "¿Segura? 🥺" },
  { minAttempts: 0, label: "No 😈" },
];

export const relationshipConfig = {
  partnerName: "Hannia",
  yourName: "César",

  // Fechas importantes (formato "YYYY-MM-DD"; el cumpleaños admite "MM-DD" sin año)
  metDate: "2026-08-10", // El día que se conocieron (3:30 p. m.) ✨
  relationshipStartDate: "2026-08-20", // Oficialmente novios 💕
  anniversaryDate: "2026-08-20",
  partnerBirthday: "03-05", // 5 de marzo 🎂
  yourBirthday: "04-17", // 17 de abril 🎂
  careerStartDate: "2023-08-21", // Fecha estimada: inicio de una carrera de 4 años
  graduationDate: "2027-07-25", // 25 de julio de 2027 🎓

  // 👩 Datos sobre Hannia
  partnerFacts: [
    { icon: "☕", label: "Bebida favorita", value: "Limonada de limón" },
    { icon: "🎵", label: "Canción favorita", value: "Champagne Ghost — Blood Orange" },
    { icon: "🍕", label: "Comida favorita", value: "Pasta (Fettuccine)" },
    { icon: "🎨", label: "Color favorito", value: "Rojo vino" },
    { icon: "🌸", label: "Flor favorita", value: "Lirios" },
    { icon: "🎬", label: "Película favorita", value: "Interestelar" },
    { icon: "🎮", label: "Juego favorito", value: "Roblox" },
    { icon: "🐶", label: "Animal favorito", value: "Perros" },
    { icon: "🧠", label: "Qué estudia", value: "Psicología" },
    { icon: "💗", label: "Cómo es", value: "Muy sensible y empática" },
    { icon: "🐊", label: "Algo que tiene", value: "Un llavero de Gummigoo" },
    { icon: "🎮", label: "Cómo nos conocimos", value: "En Roblox" },
    { icon: "😂", label: "Algo que siempre hace", value: "Ser hermosota" },
    { icon: "❤️", label: "Algo que me encanta de ella", value: "Su existencia ❤️" },
    { icon: "💭", label: "Su sueño", value: "Tener una cafetería" },
    { icon: "✨", label: "Algo especial sobre ella", value: "Su empatía" },
  ] satisfies Fact[],

  // 👨 Datos sobre César
  yourFacts: [
    { icon: "🎵", label: "Canción favorita", value: "Walk — Foo Fighters" },
    { icon: "🍕", label: "Comida favorita", value: "Enchiladas suizas" },
    { icon: "🎮", label: "Juego favorito", value: "League of Legends" },
    { icon: "☕", label: "Bebida favorita", value: "Café" },
    { icon: "😂", label: "Algo que hago mucho", value: "Mover el pie derecho jsjs" },
    { icon: "🤓", label: "Algo raro sobre mí", value: "Me lavo las manos muchas veces D:" },
    { icon: "🎯", label: "Algo que quiero lograr", value: "Tener mi cafetería" },
    { icon: "💭", label: "Algo que sueño hacer juntos", value: "Casarnos" },
    { icon: "❤️", label: "Algo que me encanta de Hannia", value: "Sus ojazos negros" },
  ] satisfies Fact[],

  // 🫂 Frases de César para cuando Hannia necesite un poquito de ánimo.
  comfortMessages: [
    "Oye, mi niña, hoy no tienes que ser fuerte todo el tiempo. Aquí estoy contigo.",
    "Respira tantito, Hannia. Esto se siente pesado, pero no tienes que cargarlo sola.",
    "No tienes que resolver toda tu vida hoy; con pasar este momento basta.",
    "Si hoy solo puedes descansar, eso también cuenta. No te quiero menos por eso.",
    "Ven, cuéntame todo aunque no tenga sentido. Yo te escucho.",
    "No eres una carga por necesitar cariño; eres mi persona y quiero estar aquí.",
    "Te creo. No tienes que convencerme de que te duele.",
    "Un día feo no cambia lo increíble que eres.",
    "No tienes que disculparte por sentir mucho; conmigo puedes ser tú.",
    "Estoy orgulloso de ti incluso en los días en que tú no ves nada bueno.",
    "Vamos de poquito en poquito; no hay prisa.",
    "Si se te acaba la energía, yo te presto un poquito de la mía.",
    "No estás sola, mensa. Aquí está tu César.",
    "Te abrazo aunque sea a distancia, y no te suelto.",
    "No importa si hoy no salió nada bien; mañana lo intentamos juntos.",
    "Tu tristeza no me asusta ni hace que me vaya.",
    "Puedes llorar, enojarte o quedarte en silencio; yo me quedo.",
    "No tienes que tener una explicación perfecta para que te cuide.",
    "Eres mucho más que este momento difícil.",
    "Vamos por agua, respiramos y luego vemos qué hacemos. Paso por paso.",
    "No te voy a arreglar a la fuerza; solo quiero acompañarte.",
    "Quédate conmigo un ratito, aunque sea sin decir nada.",
    "Aunque hoy no te sientas fuerte, sigues siendo mi persona favorita.",
    "Tu día malo no tiene permiso de decidir cuánto vales.",
    "Te quiero en tus días brillantes y en tus días de cobijita.",
    "Si el mundo pesa, lo cargamos entre los dos.",
    "No tienes que pedir permiso para descansar.",
    "Estoy aquí, de verdad. No es una frase bonita y ya.",
    "Te amo más que a cualquier problema que tengas hoy.",
    "Mañana puede esperar; por ahora ven, yo te cuido un poquito.",
  ] satisfies string[],

  // 📖 Nuestra historia (se ordena automáticamente por fecha)
  timeline: [
    {
      date: "2026-08-10",
      title: "Nos conocimos",
      description: "El día que empezó todo ❤️ — nos conocimos en Roblox, 3:30 p. m., para que quede constancia oficial",
      icon: "✨",
    },
    {
      date: "YYYY-MM-DD",
      title: "Primera cita",
      description: "PENDIENTE 🥹",
      icon: "🌹",
    },
    {
      date: "YYYY-MM-DD",
      title: "Nuestro primer viaje",
      description: "PENDIENTE ✈️",
      icon: "🧳",
    },
    {
      date: "2026-08-20",
      title: "Dijo que sí 💍",
      description:
        "Y oficialmente empezamos a ser novios 💕 (obviamente no tenía opción, el botón de NO escapaba)",
      icon: "💍",
    },
  ] satisfies TimelineMoment[],

  // 🗺️ El mapa de nuestro amor: de dónde es cada quien.
  // La distancia y los tiempos de viaje se calculan automáticamente.
  distance: {
    partnerCity: {
      name: "Mérida",
      state: "Yucatán",
      emoji: "🌺",
      lat: 21.0326,
      lng: -89.6285,
    },
    yourCity: {
      name: "Aguascalientes",
      state: "Aguascalientes",
      emoji: "♨️",
      lat: 21.8818,
      lng: -102.2916,
    },
  } satisfies { partnerCity: CityInfo; yourCity: CityInfo },

  // 📊 Estadísticas manuales (edítalas libremente, no vienen de ninguna API)
  stats: {
    messages: 0,
    dates: 0,
    photos: 0,
    songs: 0,
    laughs: 0,
    lateNightTalks: 0,
    meals: 0,
    coffees: 0,
  },

  // 💌 Carta final (separa los párrafos con una línea en blanco)
  loveLetter: `Hannia,

A veces pienso en lo difícil que fue que coincidiéramos.

Tú en Yucatán, yo en Aguascalientes. Entre tantos kilómetros, tantas personas y tantas posibilidades, terminamos conociéndonos en Roblox. Y de todas las personas con las que pude haber coincidido ahí, apareciste tú.

Lo más sorprendente es que, mientras más te conozco, más cosas encuentro que tenemos en común. Nuestros gustos, nuestra forma de ser y, claramente, nuestro increíble nivel de retraso 😂.

Es como si, después de tantos caminos distintos, hubiéramos terminado encontrándonos por alguna razón.

Me gusta pensar que eres mi hilo rojo. Ese hilo invisible que tuvo que recorrer kilómetros, pasar por un juego y esperar el momento correcto para llevarme hasta ti.

Y sinceramente, qué suerte tuve de encontrarte.

Porque entre todas las posibilidades, coincidí contigo. Y ahora no quiero soltarte. ❤️

Con amor,
César ❤️`,
};

export type RelationshipConfig = typeof relationshipConfig;
