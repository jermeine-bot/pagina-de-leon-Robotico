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
    { q: '¿Qué es un taller de robótica educativa?', a: 'Es un espacio donde los niños aprenden robótica, programación y tecnología de forma divertida, construyendo robots y desarrollando su creatividad, lógica y trabajo en equipo.' },
    { q: '¿Los niños necesitan conocimientos previos?', a: 'No. El taller está pensado para iniciar desde cero y avanzar según la edad y el ritmo de cada estudiante.' },
    { q: '¿Qué aprenderán utilizando LEGO y Sparki?', a: '- Fundamentos de Robótica, Diseño y Construcción de Robots Funcionales, Programación aplicada a proyectos Reales, Materiales proporcionados, Pensamiento Lógico, Creatividad, Innovación y Trabajo en Equipo, Certificados de participación' },
    { q: '¿Qué edades pueden participar?', a: 'Entre 7 a 14 años de edad, grados primaria 4to, 5to,6to secundaria 7mo y 8vo' },
    { q: '¿Cómo puedo solicitar información sobre las inscripciones?', a: 'Puedes consultar la página oficial de Facebook de la Alcaldía Municipal de León, donde se publican las fechas de inscripción, requisitos y novedades del taller Leoncito Robótico. También puedes solicitar información directamente con el responsable del taller.' },
    { q: '¿Dónde se encuentra el taller?', a: 'Donde fue asados pelibuey 1/2 hacia abajo' },
  ],
  // Provisional contact placeholders (not official). Remove/replace when confirmed.
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },
}
