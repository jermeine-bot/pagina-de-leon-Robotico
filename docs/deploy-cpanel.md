# Despliegue en cPanel

Guía para publicar la landing y el CMS en un hosting compartido con cPanel, Apache y PHP 8.1+. La API y el frontend se sirven desde el **mismo dominio** para que la cookie de sesión y el CSRF funcionen sin configurar CORS.

## 1. Resultado esperado

```
/home/USUARIO/
├── robotica-config/
│   └── .env                    # 600 · fuera de public_html
└── public_html/
    ├── index.html              # build de Vite
    ├── assets/                 # JS/CSS con hash
    └── api/                    # contenido de backend/
        ├── index.php
        ├── .htaccess
        ├── bin/  migrations/  src/  storage/  uploads/
        └── ...
```

- El sitio se abre en `https://tudominio.com/`.
- La API se abre en `https://tudominio.com/api/`.
- Las imágenes se sirven desde `https://tudominio.com/api/uploads/AAAA/MM/archivo.ext`.

> No subas la carpeta `backend/` dentro de `public_html/api/backend/`. Sube **el contenido** de `backend/` directamente en `public_html/api/`.

## 2. Requisitos en cPanel

1. **MultiPHP Manager**: selecciona PHP 8.3 o superior para el dominio.
2. **Select PHP Version → Extensions**: activa `pdo_mysql`, `fileinfo`, `json`, `session`, `openssl` y, si está disponible, `mbstring`.
3. **MySQL Databases**: crea una base y un usuario con todos los privilegios sobre ella. Anota nombre, usuario, contraseña y host (normalmente `localhost`).
4. **SSL/TLS**: instala el certificado y fuerza HTTPS.
5. Verifica que `mod_rewrite` está activo (lo está por defecto en cPanel/Apache).

## 3. Compilar el frontend

En tu equipo, desde la raíz del repositorio:

```bash
npm ci
npm run build
```

Sube **el contenido** de `dist/` a `public_html/` con el Administrador de archivos o FTP. No subas `dist/` como carpeta si el dominio apunta a `public_html`: `index.html` debe quedar en la raíz.

Si la API va a vivir en otro dominio o ruta, define la URL antes del build:

```bash
VITE_API_BASE=https://api.tudominio.com npm run build
```

En ese caso también tendrías que configurar CORS y cookies de sesión entre dominios; la configuración recomendada y probada es la de mismo origen.

## 4. Subir el backend

Sube el contenido de `backend/` a `public_html/api/`:

```text
public_html/api/index.php
public_html/api/.htaccess
public_html/api/src/...
public_html/api/migrations/...
public_html/api/bin/...
public_html/api/uploads/.htaccess
public_html/api/storage/logs/
```

Comprueba que el Administrador de archivos muestra los archivos ocultos (`.htaccess`) y que **no** has subido:

- `backend/.env` (se crea uno nuevo en el servidor).
- `backend/storage/logs/app.log`.
- Imágenes de prueba de `backend/uploads/`.
- `node_modules`, `dist` o archivos `.ts`.

## 5. Crear el archivo `.env` fuera del webroot

Crea `/home/USUARIO/robotica-config/.env` (fuera de `public_html`) con permisos `600`:

```dotenv
APP_ENV=production
APP_BASE_PATH=/api

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_robotica
DB_USER=cpaneluser_robotica
DB_PASS=CAMBIA_ESTA_CONTRASENA
DB_CHARSET=utf8mb4

SESSION_NAME=robotica_cms
SESSION_LIFETIME=7200
SESSION_SECURE=true

UPLOAD_MAX_BYTES=5242880
UPLOAD_BASE_PATH=/api/uploads

SEED_ADMIN_USER=admin
SEED_ADMIN_PASSWORD=CAMBIA_ESTA_CONTRASENA_LARGA
SEED_ADMIN_NAME=Administrador
```

### Indicar a PHP dónde está el `.env`

`index.php` busca primero `CMS_ENV_FILE`. Usa **una** de estas opciones:

**A. Variables de entorno de cPanel** (si tu plan tiene esa interfaz): añade

```text
CMS_ENV_FILE=/home/USUARIO/robotica-config/.env
```

**B. `.htaccess`** (Apache con `mod_env`): añade al inicio de `public_html/api/.htaccess`

```apache
SetEnv CMS_ENV_FILE /home/USUARIO/robotica-config/.env
```

**C. Terminal durante la instalación**: exporta la variable en la sesión de SSH/Terminal (solo afecta a ese comando):

```bash
export CMS_ENV_FILE=/home/USUARIO/robotica-config/.env
```

Sustituye `USUARIO` por tu usuario real de cPanel. Después de cambiar `.htaccess` o las variables, prueba `https://tudominio.com/api/health`.

> Si ves `503 Servicio temporalmente no disponible`, revisa `public_html/api/storage/logs/app.log`: normalmente indica que el `.env` no se encontró o que las credenciales de MySQL son incorrectas.

## 6. Crear el esquema y el administrador

Con **Terminal** o SSH:

```bash
cd ~/public_html/api
export CMS_ENV_FILE=/home/USUARIO/robotica-config/.env
php bin/setup.php
```

El script:

1. Aplica `migrations/001_schema.sql` (es idempotente: usa `CREATE TABLE IF NOT EXISTS`).
2. Crea el usuario administrador si no existe.
3. Inserta el contenido inicial de `content/default-content.json` en `content_sections`.
4. Crea `uploads/` y `storage/logs/`.

Después de entrar al panel, **cambia la contraseña** desde *Configuración → Cambiar contraseña* y elimina `SEED_ADMIN_PASSWORD` del `.env`.

Si no tienes Terminal, pide a tu proveedor que ejecute el script o importa el esquema con phpMyAdmin y usa el panel para cargar el contenido; el usuario administrador debe crearse con el hash generado por PHP (no escribas contraseñas en texto plano en SQL).

## 7. Permisos

Ajusta propietario y permisos según cómo ejecute PHP tu hosting (usuario de cPanel o `www-data`):

```bash
chmod 600 ~/robotica-config/.env
find ~/public_html/api -type d -exec chmod 755 {} \;
find ~/public_html/api -type f -exec chmod 644 {} \;
chmod -R 775 ~/public_html/api/uploads ~/public_html/api/storage/logs
```

- `uploads/` y `storage/logs/` deben ser escribibles por PHP.
- `uploads/.htaccess` impide ejecutar scripts subidos.
- No des permisos `777`.

## 8. Límites de subida de PHP

La API acepta hasta `UPLOAD_MAX_BYTES` (5 MB por defecto), pero PHP y Apache también tienen límites. Crea `public_html/api/.user.ini`:

```ini
upload_max_filesize = 8M
post_max_size = 12M
memory_limit = 256M
max_execution_time = 60
```

Si el hosting ignora `.user.ini`, ajusta los valores en *MultiPHP INI Editor*. Reinicia PHP-FPM desde cPanel si el cambio no se aplica.

Regla: `UPLOAD_MAX_BYTES` debe ser menor o igual que `upload_max_filesize`, y `post_max_size` debe ser mayor que la imagen + formulario.

## 9. Verificación después del despliegue

```bash
curl -s https://tudominio.com/api/health
# {"ok":true,"database":"up","php":"8.3.x","time":"..."}

curl -s https://tudominio.com/api/content | head -c 200
```

En el navegador:

1. Abre `https://tudominio.com/` y comprueba que el contenido viene de la API.
2. Entra a `https://tudominio.com/#admin` e inicia sesión.
3. Edita una sección, guarda y recarga: el cambio debe persistir.
4. Sube una imagen y confirma que se ve en la vista previa y en el sitio público.
5. Exporta un respaldo JSON desde *Configuración*.
6. Cierra sesión y verifica que el panel vuelve al login.

## 10. Seguridad y mantenimiento

- `APP_ENV=production` evita mostrar mensajes internos de error al cliente.
- `SESSION_SECURE=true` exige HTTPS. Si haces pruebas sin SSL, usa `false` solo en local.
- Las rutas de escritura exigen sesión + CSRF; no las expongas con proxies que eliminen cookies.
- `backend/.htaccess` bloquea `src`, `migrations`, `bin`, `storage`, `.env` y archivos `.sql`/`.log`.
- Revisa `storage/logs/app.log` y rota los logs periódicamente.
- Respalda la base y las imágenes:

```bash
mysqldump -u cpaneluser_robotica -p cpaneluser_robotica > robotica-$(date +%F).sql
tar -czf uploads-$(date +%F).tar.gz ~/public_html/api/uploads
```

- Para actualizar el sitio: sube el nuevo `dist/` a `public_html/` y los archivos PHP modificados a `public_html/api/`. No sobrescribas `uploads/` ni `storage/`.
- Si añades una migración nueva, ejecútala antes de desplegar el frontend que la necesita.

## 11. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `503` en `/api/health` | `.env` no encontrado o MySQL caído | Revisa `CMS_ENV_FILE`, credenciales y `storage/logs/app.log` |
| `404` en `/api/content` | `mod_rewrite` inactivo o `.htaccess` no subido | Activa rewrite y confirma el `.htaccess` en `api/` |
| `419` al guardar | Sesión expirada o token CSRF perdido | Recarga la página e inicia sesión de nuevo |
| `401` al guardar | Cookie bloqueada o `SESSION_SECURE=true` sin HTTPS | Usa HTTPS o ajusta `SESSION_SECURE` en local |
| `409` al guardar | Otra persona guardó la misma sección | Usa “Recargar versión actual” y vuelve a aplicar cambios |
| `413` al subir | Límite de PHP/Apache | Sube `upload_max_filesize` y `post_max_size` |
| Imagen subida pero `404` | Ruta o permisos de `uploads/` | Verifica `UPLOAD_BASE_PATH=/api/uploads` y permisos 775 |
| El sitio muestra contenido viejo | Caché del navegador o build antiguo | Recompila, sube `dist/` y recarga sin caché |

## 12. Nota sobre el entorno local

En desarrollo se usa el servidor embebido de PHP en el puerto `8787` y Vite en `5173`, con proxy `/api`. Eso **no** se usa en producción: en cPanel todo se sirve desde `public_html` y la API desde `public_html/api` con el `.htaccess` incluido.
