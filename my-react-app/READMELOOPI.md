# Create a README.md file for the user's project and save it for download

readme = r"""# Loopi — plataforma de _match_ en proyectos + tablero compartido de tareas

Loopi es una aplicación web donde una persona **publica un proyecto** y otras pueden **dar “Loopi” (like)**.  
Cuando hay **like recíproco**, se crea un **Match** y ambos usuarios obtienen un **Tablero de Tareas compartido** con **progreso** y **deadlines**.

> Stack: **React + TypeScript + Vite**, **Redux Toolkit**, **React Router**, **Framer Motion** y **Supabase (DB, Auth, RLS)**.

---

## Funcionalidades

- **Explorar & Dar Loopi**: UI tipo “swiper” con animación (Framer Motion).
- **Match automático**: si ambos se gustan, se crea `project_matches`.
- **Perfil**:
  - **Tus proyectos** (publicados por ti).
  - **Loopis with your projects** (matches de proyectos tuyos: ves al partner y accedes al tablero).
  - **Projects you Loopied** (matches donde tú hiciste like a proyectos ajenos).
- **Tablero de tareas por Match** (`/match/:matchId/tasks`):
  - CRUD de tareas compartidas: título, detalles, estado, fecha límite.
  - **Progreso** automático: % según tareas “done”.
  - **Deadlines** del proyecto (fecha + notas) — visibles y editables por ambos.
- **RLS (Row Level Security)**: sólo dueños/miembros del match pueden ver y modificar lo que les corresponde.

---

## Arquitectura (alto nivel)

**Frontend**

- React + TS (Vite)
- Redux Toolkit (estado de sesión y datos UI)
- React Router 7 (rutas SPA)
- Framer Motion (animaciones del swiper)

**Backend (BaaS)**

- Supabase (Postgres + Auth + Storage opcional)
- RLS y Policies para acceso seguro por usuario
- Triggers para crear `project_matches` cuando hay likes recíprocos

---

## Estructura de datos (resumen)

> **Nombres orientativos**. Ajusta si en tu proyecto cambian columnas o constraints.

### `users`

- `id uuid PK`, `username text`, `profile_img_url text`, `user_profession text`, `profile_description text`, `profile_cover_url text`

### `posts` (proyectos publicados)

- `id bigint PK`, `user_post_id uuid FK → users.id`
- `post_name text`, `post_description text`, `post_professions text`, `post_skills text`, `image_url text`, `categories text`
- `created_at timestamptz default now()`

### `projects_likes`

- `id bigint PK`, `user_id uuid`, `project_id bigint`, `project_owner_id uuid`, `created_at timestamptz default now()`
- **Unique**: (`user_id`, `project_id`)

### `project_matches`

- `id bigint PK`, `project_id bigint FK → posts.id`
- `user_a_id uuid`, `user_b_id uuid` _(los dos usuarios ordenados lexicográficamente para unicidad)_
- **Unique**: (`project_id`, `user_a_id`, `user_b_id`)

> **Trigger** (ejemplo conceptual): tras insertar en `projects_likes`, si existe el like inverso se inserta `project_matches` con el par ordenado `(a, b)`.

### `project_tasks`

- `id bigint PK`, `match_id bigint FK → project_matches.id`
- `title text`, `details text`, `status enum('todo','in_progress','done')`, `due_date date`
- `assigned_to uuid NULL`, `created_by uuid`
- `created_at`, `updated_at` (con trigger `updated_at = now()`)

### `project_deadlines`

- `id bigint PK`, `match_id bigint FK → project_matches.id`
- `title text`, `notes text NULL`, `due_date date`
- `created_by uuid`, `created_at`, `updated_at`

---

## RLS & Policies (guía)

Activa RLS en todas las tablas y define políticas como:

- **posts**:
  - `SELECT` público (si listan proyectos para explorar) o filtrado si prefieres privacidad.
  - `INSERT/UPDATE/DELETE` sólo cuando `auth.uid() = posts.user_post_id`.
- **projects_likes**:
  - `INSERT` cuando `auth.uid() = user_id`.
  - `SELECT` para ver los propios likes o para lógica de match.
- **project_matches**:
  - `SELECT` si `auth.uid()` ∈ {`user_a_id`, `user_b_id`} o si `posts.user_post_id = auth.uid()`.
- **project_tasks / project_deadlines**:
  - `SELECT/INSERT/UPDATE/DELETE` sólo si `auth.uid()` participa en el match (`user_a_id` o `user_b_id`).

> Mantén las policies en **migraciones** versionadas para compartilas fácilmente con tu equipo.

---

## Rutas principales

- `/loopi` — Swiper para dar like (“Loopi”).
- `/profile` — Perfil, con tres secciones:
  - **Your projects**: proyectos publicados.
  - **Loopis with your projects**: matches de tus proyectos (botón “Ver tareas”).
  - **Projects you Loopied**: matches donde tú diste like (botón “Ver tareas”).
- `/match/:matchId/tasks` — Tablero compartido de tareas y deadlines.
- `/post/:id` — Vista de proyecto (detalle).
- `/user/:id` — Perfil público de usuario.

---

## Instalación y uso local

### Requisitos

- Node.js **>= 20**
- npm o pnpm
- Cuenta de Supabase

### Clonar e instalar

```bash
git clone <tu-repo>
cd <tu-repo>
npm install
```
