# Taller Municipal de Robótica — Landing Page + CMS

## Acceso al CMS

- **URL local:** `http://localhost:5173/#admin`
- **Usuario:** `admin`
- **Contraseña:** `robotica-local-2026`

También se abre con doble clic en el logo del sitio. En producción, crea el usuario con `php bin/setup.php` y usa la contraseña definida en `SEED_ADMIN_PASSWORD`; cámbiala desde *Configuración → Cambiar contraseña* después del primer acceso.

---

Landing page educativa para el **Taller Municipal de Robótica** (programa de la Alcaldía de León) y un **CMS propio** para administrar todo el contenido del sitio. El contenido se guarda en **MySQL/MariaDB** a través de una **API PHP**, no en el navegador.

## Stack

- **React 19** + **Vite 6** + **TypeScript**
- **Tailwind CSS 3** (paleta institucional educativa)
- **motion** (Framer Motion) — animaciones y microinteracciones
- **Three.js** — modelo 3D del robot LEGO en el Hero
- **PHP 8.1+** con PDO — API sin framework, compatible con cPanel
- **MySQL 8.0+ / MariaDB 10.6+** — contenido versionado, usuarios, multimedia y auditoría

## Estructura

```
├── backend/                     # API PHP (document root en producción)
│   ├── index.php                # Front controller y rutas
│   ├── router.php               # Router para `php -S` en local
│   ├── .htaccess                # Rewrite + bloqueo de archivos internos
│   ├── bin/setup.php            # Crea esquema, admin y contenido inicial
│   ├── content/                 # Contenido inicial (default-content.json)
│   ├── migrations/001_schema.sql
│   ├── src/
│   │   ├── Auth.php             # Login, sesión, cambio de contraseña
│   │   ├── Controllers/         # Auth, contenido, media, health
│   │   ├── Services/            # Reglas de contenido y subidas
│   │   ├── Repositories/        # PDO: usuarios, contenido, media, auditoría
│   │   ├── Validation/          # Validación por sección
│   │   └── Http/                # Request, response, router, sesión, CSRF
│   └── uploads/                 # Imágenes subidas (servidas por la API)
├── src/
│   ├── api/client.ts            # Cliente tipado de la API
│   ├── cms/
│   │   ├── CmsContext.tsx       # Contenido, sesión, edición y multimedia
│   │   ├── AdminApp.tsx         # Panel: dashboard, navegación, login
│   │   ├── useSectionEditor.ts  # Borrador, guardado y conflictos
│   │   ├── types.ts             # Tipos y constantes del contenido
│   │   ├── defaults.ts          # Respaldo local si la API no responde
│   │   ├── ui/                  # Field, ImageField, EditorShell
│   │   └── editors/             # Un editor por sección
│   └── components/              # Sitio público
├── docs/deploy-cpanel.md        # Guía de despliegue paso a paso
└── README.md
```

## Características

### Sitio público

- Hero dinámico: título con resaltado y acento editables, botones e imagen opcional.
- Secciones: Aprender, Proceso, Momentos, Galería con lightbox, Proyectos, Robots de los niños, Institucional con aliados, FAQ, Inscripción y Footer.
- Datos de contacto (teléfono, WhatsApp, dirección, correo) y anuncios emergentes editables.
- La galería usa degradados con etiqueta cuando todavía no hay fotografía real.
- Responsive, accesible y con soporte de `prefers-reduced-motion`.
- Si la API no está disponible, muestra el contenido de respaldo de `backend/content/default-content.json`.

### Panel de administración

- Acceso en `#admin` o con doble clic en el logo del Navbar/Footer.
- Login real contra la base de datos con sesión `HttpOnly`, `SameSite=Strict` y token CSRF.
- Dashboard con métricas reales, accesos rápidos y auditoría de actividad.
- Editores: Inicio/Hero, Introducción, Aprender, Proceso, Momentos, Galería, Anuncios, Proyectos, Robots, Institucional, FAQ y Configuración. El editor de Momentos administra sus textos; Galería administra sus imágenes.
- Subida de imágenes a `uploads/` con validación de tipo, tamaño y dimensiones. No se guardan base64 en la base de datos.
- **Guardado versionado por sección**: si otra persona guardó antes, la API responde `409` y el editor permite recargar la versión actual.
- Exportar/importar el contenido completo en JSON y restaurar los valores iniciales.
- Cambio de contraseña desde el panel.
- Registro de auditoría: inicios de sesión, cambios de contenido y operaciones con imágenes.

## Requisitos

- Node.js 20+ y npm.
- PHP 8.1 o superior con `pdo_mysql`, `fileinfo`, `json`, `session` y `openssl`.
  - Se recomienda PHP 8.3+; si Argon2id no está disponible se usa bcrypt con coste 12.
- MySQL 8.0+ o MariaDB 10.6+.
- `mod_rewrite` en Apache/cPanel (o reglas equivalentes en Nginx).

## Desarrollo local

### 1. Base de datos

Crea una base y un usuario (ejemplo con MySQL/MariaDB local):

```sql
CREATE DATABASE robotica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'robotica'@'127.0.0.1' IDENTIFIED BY 'robotica_dev_pass';
GRANT ALL PRIVILEGES ON robotica.* TO 'robotica'@'127.0.0.1';
FLUSH PRIVILEGES;
```

### 2. Configuración del backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env`: host, puerto, base de datos, usuario, contraseña y `SEED_ADMIN_PASSWORD` (mínimo 12 caracteres). Para desarrollo con el servidor embebido usa `APP_ENV=development` y `SESSION_SECURE=false`.

Aplica el esquema y crea el administrador y el contenido inicial:

```bash
php backend/bin/setup.php
```

### 3. Arrancar API y frontend

En dos terminales:

```bash
# API en http://127.0.0.1:8787
php -S 127.0.0.1:8787 -t backend backend/router.php
```

```bash
npm install
npm run dev
```

Vite sirve la app en `http://localhost:5173` y reenvía `/api` a `http://127.0.0.1:8787` (ver `vite.config.ts`). Abre `http://localhost:5173/#admin` e inicia sesión con el usuario y contraseña definidos al ejecutar `setup.php`.

### 4. Comprobaciones

```bash
npm run build                      # typecheck + build de producción
curl http://127.0.0.1:8787/api/health
```

## API

Todas las rutas viven bajo `/api`. Las respuestas de error tienen la forma `{"error":{"status":422,"message":"..."}}` y los errores de validación incluyen `errors` por campo.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | No | Estado del servicio y de la base de datos |
| GET | `/api/content` | No | Contenido público + versiones por sección |
| PUT | `/api/content/{section}` | Sí + CSRF | Guarda una sección con versión esperada |
| GET | `/api/content/export` | Sí | Descarga del contenido completo |
| POST | `/api/content/import` | Sí + CSRF | Importa un respaldo JSON |
| POST | `/api/content/reset` | Sí + CSRF | Restaura el contenido inicial |
| GET | `/api/content/activity` | Sí | Últimas acciones de auditoría |
| GET | `/api/auth/csrf` | No | Token CSRF inicial |
| POST | `/api/auth/login` | No | Inicia sesión (rate limit: 5 fallos/15 min) |
| GET | `/api/auth/me` | No | Usuario y token CSRF de la sesión actual |
| POST | `/api/auth/logout` | Sí + CSRF | Cierra la sesión |
| PUT | `/api/auth/password` | Sí + CSRF | Cambia la contraseña |
| POST | `/api/media` | Sí + CSRF | Sube una imagen (`multipart/form-data`, campo `file`) |
| GET | `/api/media` | Sí | Lista las imágenes subidas |
| DELETE | `/api/media/{id}` | Sí + CSRF | Elimina una imagen y su archivo |

El guardado usa control de concurrencia optimista: el cuerpo es `{"content": {...}, "version": 3}`. Si la versión actual es distinta, responde `409` con `error.current.content` y `error.current.version`.

## Modelo de datos

- `users`: administradores/editores, hash de contraseña y último acceso.
- `content_sections`: una fila por sección (`section_key`), documento JSON validado y `version`.
- `media`: metadatos de imágenes subidas (ruta, MIME, tamaño, dimensiones).
- `audit_log`: acciones con usuario, IP y metadatos.
- `login_attempts`: intentos fallidos para el rate limiting.

Las secciones válidas son: `settings`, `hero`, `intro`, `journey`, `learningCards`, `gallery`, `moments`, `projects`, `kidsRobots`, `institutional`, `faqs`, `contact` y `announcements`. El backend valida y normaliza cada una antes de guardar; el frontend comparte los valores iniciales mediante `backend/content/default-content.json`.

## Seguridad

- Contraseñas con **Argon2id** (o bcrypt coste 12 si el hosting no soporta Argon2).
- Sesión en cookie `HttpOnly`, `Secure` en producción, `SameSite=Strict`, rotada al iniciar sesión y al cambiar la contraseña.
- CSRF en todas las escrituras autenticadas.
- Consultas preparadas con PDO y validación por esquema en todos los límites.
- Subidas limitadas a JPG/PNG/WEBP/GIF, verificadas con `finfo` y `getimagesize`; los scripts en `uploads/` se bloquean con `.htaccess`.
- Rate limiting de login y auditoría de acciones.
- El directorio `backend/src`, `migrations`, `bin`, `storage` y los archivos `.env` quedan bloqueados por `.htaccess`.

## Despliegue

Consulta **[docs/deploy-cpanel.md](docs/deploy-cpanel.md)** para publicar en cPanel: ubicación de `backend/`, `.env` fuera del webroot, permisos, límites de subida, SSL y verificación.

## Notas

- No se inventan fotografías de participantes: la galería usa placeholders hasta que se suban imágenes reales.
- Los datos institucionales (horarios, edades, convenios) deben confirmarse con la Alcaldía.
- No se versiona `backend/.env`, las imágenes subidas ni los logs.
