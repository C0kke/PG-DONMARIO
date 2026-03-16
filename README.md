## Tienda Don Mario - Web

Proyecto didáctico: una tienda de barrio ficticia llamada **Don Mario**. Este repositorio se usa como material para estudiantes en gestión de proyectos y análisis de deuda técnica. La aplicación muestra un catálogo para clientes y contiene un **Módulo de Administración** para la gestión básica de inventario.

## Stack Tecnológico

La arquitectura del proyecto utiliza servicios modernos en la nube:

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Authentication)
- **Gestión de Media:** [Cloudinary](https://cloudinary.com/) (Almacenamiento y optimización de imágenes)

### Infraestructura y Despliegue
- **Hosting Web:** [Vercel](https://vercel.com/) (CI/CD automático desde GitHub).
- **DNS & Seguridad:** [Cloudflare](https://www.cloudflare.com/) (Proxy, SSL y protección DDoS).

## Requisitos Previos

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Acceso a las credenciales de Supabase y Cloudinary si se desea conectar servicios externos.

## Configuración de Variables de Entorno (.env)

Para que la app funcione localmente (y se conecte a la BD y a las imágenes), configura las credenciales.

1. Crear el archivo:
En la raíz del proyecto, duplica el archivo `.env.example` (si existe) o crea uno nuevo llamado `.env.local`.

2. Agregar las claves: copia y pega el siguiente contenido, reemplazando los valores con tus datos de Supabase y Cloudinary:

```bash
# --- Supabase Config ---
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-public-anon-key-aqui

# --- Cloudinary Config ---
VITE_CLOUDINARY_CLOUD_NAME=nombre-de-tu-cloud
VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset

# --- Admin Config (Opcional) ---
VITE_ADMIN_SECRET_CODE=codigo-secreto-temporal

# Nota: Nunca subas el archivo .env.local al repositorio (debe estar en el .gitignore).
```

## Instalación y Uso

1. Clonar e instalar:

```bash
git clone <repo-url>
cd <repositorio>
pnpm install
```

2. Levantar servidor local:

```bash
cd maranatha
pnpm run dev
```

La app estará disponible en http://localhost:5173.

3. Acceso al Admin: Para acceder al módulo de administración, navega a `/login` e inicia sesión con las credenciales de administrador configuradas en Supabase.

## Despliegue (Build)

El despliegue puede automatizarse mediante Vercel al hacer push a la rama `main`.
Para generar la build y probarla localmente:

```bash
pnpm run build
pnpm run preview
```

## Estructura Clave
- `/src/components`: Componentes reutilizables de la interfaz.
- `/src/pages/admin`: Módulo de Administración (vistas protegidas).
- `/src/services`: Lógica de conexión con Supabase y Cloudinary.
- `/public`: Assets estáticos (sitemap.xml, robots.txt).

Proyecto didáctico: Tienda Don Mario.
