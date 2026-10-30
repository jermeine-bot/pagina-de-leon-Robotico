# Taller Municipal de Robótica — Landing Page + CMS

Landing page educativa premium para el **Taller Municipal de Robótica** (programa de la Alcaldía) donde los niños aprenden tecnología, programación y robótica con LEGO y Sparki. Incluye un **panel de administración (CMS)** para gestionar todo el contenido del sitio.

## 🚀 Stack

- **React 19** + **Vite 6** + **TypeScript**
- **Tailwind CSS 3** (paleta institucional educativa)
- **motion** (Framer Motion) — animaciones y microinteracciones
- **Three.js** — modelo 3D del robot (LEGO SPIKE) en el Hero
- **localStorage** como almacenamiento del CMS (listo para migrar a backend)

## 📁 Estructura

```
src/
├── App.tsx                 # Router por hash (#admin → panel, resto → sitio)
├── main.tsx
├── index.css
├── config/site.ts          # Contenido por defecto
├── cms/
│   ├── store.ts            # Datos por defecto + load/save (localStorage)
│   ├── CmsContext.tsx      # Provider + useCms()
│   └── AdminApp.tsx        # Panel admin institucional
├── components/
│   ├── Navbar.tsx          # Doble clic en el logo → panel admin
│   ├── HeroSection.tsx     # Hero con robot 3D
│   ├── LegoRobot3D.tsx     # Modelo 3D detallado (Three.js)
│   ├── Preloader.tsx       # Pantalla de carga "León Robótico"
│   ├── MarqueeStrip.tsx
│   ├── LearningCards.tsx
│   ├── LearningJourney.tsx
│   ├── WorkshopGallery.tsx # + lightbox
│   ├── ActivityCarousel.tsx
│   ├── ProjectsSection.tsx
│   ├── KidsRobots.tsx
│   ├── InstitutionalSection.tsx
│   ├── FAQSection.tsx
│   ├── RegistrationForm.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   ├── ScrollProgress.tsx
│   └── FloatingCTA.tsx
```

## ✨ Características

### Sitio público
- Hero con robot 3D animado (idle, saludo, seguimiento del cursor, sombra).
- Secciones: Aprender, Proceso, Galería, Carrusel de momentos, Proyectos, Robots de los niños, Institucional, FAQ, Inscripción, Footer.
- Paleta: azul eléctrico `#2563EB`, cian `#37C8E8`, amarillo `#FFD500`, magenta `#E83E99`, blanco cálido `#FAFAF7`, grafito `#202638`.
- Responsive, accesible (`prefers-reduced-motion`, foco visible, contraste).
- Preloader personalizado "León Robótico" con progreso y confeti.
- Barra de progreso de scroll y botón flotante "Inscribirme".

### Panel admin (CMS)
- Acceso: doble clic en el logo del Navbar/Footer, o ir a `#admin`.
- Login: usuario `admin` / contraseña `admin123$`.
- Sidebar institucional (azul marino) con secciones agrupadas, colapsable y drawer móvil.
- Dashboard con métricas, accesos rápidos y actividad reciente.
- Editores para: General, Hero, Aprender, Proceso, Galería, Proyectos, Robots niños, Institucional, FAQ.
- Soporte de imágenes (URL o subida de archivo → base64) en Galería, Proyectos, Robots, Hero e Institucional.
- Persistencia en localStorage; restaurar valores por defecto.
- Toast de confirmación al guardar.

## 🛠️ Instalación y uso

```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # compilación de producción
npm run preview    # vista previa del build
```

## 🔐 Acceso al panel

1. Abre el sitio.
2. Haz **doble clic** en el logo "Taller Municipal de Robótica" del Navbar o Footer.
3. Ingresa usuario `admin` y contraseña `admin123$`.

## 🗄️ Almacenamiento y backend

El CMS usa `localStorage` (`cms_data_v1`). La capa de datos está en `src/cms/store.ts` y el contexto en `src/cms/CmsContext.tsx`. Para conectar un backend real, reemplaza `store.ts` por llamadas a la API; los editores y el sitio público ya consumen `useCms()`, por lo que no requieren cambios.

## 📝 Notas

- No se inventan fotografías de participantes: la galería usa placeholders hasta que se suban imágenes reales.
- Los datos institucionales (ubicación, horarios, edades) son provisionales hasta que la Alcaldía los confirme.
- Los `tsbuildinfo` y `node_modules` están en `.gitignore`.

## 📄 Licencia

Proyecto institucional. Todos los derechos reservados.
