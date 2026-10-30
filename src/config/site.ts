// Centralized editable content. Replace provisional values with official data
// provided by the Municipality (Alcaldía) when available.
export const siteConfig = {
  programName: 'Taller Municipal de Robótica',
  municipality: 'Alcaldía Municipal', // PROVISIONAL: replace with official name
  tagline: 'Pequeños inventores, grandes ideas',
  hero: {
    eyebrow: 'INNOVACIÓN · EDUCACIÓN · FUTURO',
    title: 'El futuro se construye jugando',
    highlight: 'se construye',
    subtitle:
      'Un espacio donde las ideas cobran vida. Los niños descubren la robótica, aprenden a programar y construyen sus propios inventos con LEGO y Sparki.',
    badge: 'Aprender, construir y experimentar',
    ctaPrimary: 'Conoce nuestro taller',
    ctaSecondary: 'Quiero inscribirme',
  },
  intro: {
    title: 'Mucho más que jugar. Aprender creando',
    text: 'Los niños desarrollan pensamiento lógico, creatividad, resolución de problemas y trabajo en equipo mediante experiencias prácticas con piezas, sensores y programación.',
  },
  journey: [
    { step: '01', title: 'IMAGINAR', text: 'Los niños identifican un reto y proponen ideas.' },
    { step: '02', title: 'CONSTRUIR', text: 'Utilizan piezas, estructuras y componentes para crear sus modelos.' },
    { step: '03', title: 'PROGRAMAR', text: 'Aprenden a controlar movimientos y comportamientos.' },
    { step: '04', title: 'EXPERIMENTAR', text: 'Prueban, detectan errores y mejoran sus creaciones.' },
    { step: '05', title: 'COMPARTIR', text: 'Presentan sus inventos y aprenden a colaborar.' },
  ],
  projects: [
    { title: 'Robot que detecta obstáculos', level: 'Básico', desc: 'Uso de sensores para evitar choques.' },
    { title: 'Vehículo construido con LEGO', level: 'Básico', desc: 'Mecanismos y tracción.' },
    { title: 'Sistema de sensores', level: 'Intermedio', desc: 'Lectura del entorno.' },
    { title: 'Robot que sigue una ruta', level: 'Intermedio', desc: 'Secuencias y control de movimiento.' },
    { title: 'Mecanismos y estructuras móviles', level: 'Intermedio', desc: 'Engranajes y palancas.' },
    { title: 'Desafíos de programación por equipos', level: 'Avanzado', desc: 'Trabajo colaborativo y algoritmos.' },
  ],
  faqs: [
    { q: '¿Qué es un taller de robótica educativa?', a: 'Es un espacio donde los niños aprenden ciencia y tecnología construyendo y programando robots con materiales como LEGO y Sparki.' },
    { q: '¿Los niños necesitan conocimientos previos?', a: 'No. El taller está pensado para iniciar desde cero y avanzar según la edad y el ritmo de cada estudiante.' },
    { q: '¿Qué aprenderán utilizando LEGO y Sparki?', a: 'Construcción, mecanismos, sensores, secuencias, algoritmos básicos y trabajo en equipo.' },
    { q: '¿Qué edades pueden participar?', a: 'Las edades oficiales se confirmarán con la Alcaldía. Por favor consulta directamente con el programa.' },
    { q: '¿Cómo puedo solicitar información sobre las inscripciones?', a: 'Completa el formulario de esta página o contacta a la Alcaldía a través de sus canales oficiales.' },
    { q: '¿Dónde se encuentra el taller?', a: 'La ubicación oficial se confirmará con la Alcaldía. Consulta los canales institucionales.' },
  ],
  // Provisional contact placeholders (not official). Remove/replace when confirmed.
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },
}
