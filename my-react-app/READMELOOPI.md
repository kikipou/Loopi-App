# Create a README.md file for the user's project and save it for download

readme = r"""# Loopi — project matching platform + shared task board

Loopi is a web app where someone can **publish a project** and others can **give a “Loopi” (like)**.  
When there’s a **reciprocal like**, a **Match** is created and both users get a **Shared Task Board** with **progress** and **deadlines**.

> Stack: **React + TypeScript + Vite**, **Redux Toolkit**, **React Router**, **Framer Motion**, and **Supabase (DB, Auth, RLS)**.

---

## Features

- **Explore & Give Loopi**: Tinder-style “swiper” UI with animation (Framer Motion).
- **Automatic Match**: if both like each other, a `project_matches` row is created.
- **Profile**:
  - **Your projects** (published by you).
  - **Loopis on your projects** (matches on your own projects: see the partner and open the board).
  - **Projects you Loopied** (matches where you liked other people’s projects).
- **Match Task Board** (`/match/:matchId/tasks`):
  - Shared task CRUD: title, details, status, due date.
  - **Automatic progress**: % based on “done” tasks.
  - **Project deadlines** (date + notes) — visible and editable by both.
- **RLS (Row Level Security)**: only owners/participants of the match can read and modify what belongs to them.

---

## Architecture (high level)

**Frontend**

- React + TS (Vite)
- Redux Toolkit (session and UI data state)
- React Router 7 (SPA routes)
- Framer Motion (swiper animations)

**Backend (BaaS)**

- Supabase (Postgres + Auth + optional Storage)
- RLS & Policies for per-user secure access
- Triggers to create `project_matches` when there are reciprocal likes

---

## Data model (summary)

> **Indicative names.** Adjust if your project uses different columns or constraints.

### `users`

- `id uuid PK`, `username text`, `profile_img_url text`, `user_profession text`, `profile_description text`, `profile_cover_url text`

### `posts` (published projects)

- `id bigint PK`, `user_post_id uuid FK → users.id`
- `post_name text`, `post_description text`, `post_professions text`, `post_skills text`, `image_url text`, `categories text`
- `created_at timestamptz default now()`

### `projects_likes`

- `id bigint PK`, `user_id uuid`, `project_id bigint`, `project_owner_id uuid`, `created_at timestamptz default now()`
- **Unique**: (`user_id`, `project_id`)

### `project_matches`

- `id bigint PK`, `project_id bigint FK → posts.id`
- `user_a_id uuid`, `user_b_id uuid` _(both users sorted lexicographically for uniqueness)_
- **Unique**: (`project_id`, `user_a_id`, `user_b_id`)

> **Trigger** (conceptual example): after inserting into `projects_likes`, if the inverse like exists, insert into `project_matches` with the ordered pair `(a, b)`.

### `project_tasks`

- `id bigint PK`, `match_id bigint FK → project_matches.id`
- `title text`, `details text`, `status enum('todo','in_progress','done')`, `due_date date`
- `assigned_to uuid NULL`, `created_by uuid`
- `created_at`, `updated_at` (with trigger `updated_at = now()`)

### `project_deadlines`

- `id bigint PK`, `match_id bigint FK → project_matches.id`
- `title text`, `notes text NULL`, `due_date date`
- `created_by uuid`, `created_at`, `updated_at`

---

## RLS & Policies (guide)

Enable RLS on all tables and define policies such as:

- **posts**:
  - `SELECT` public (if you list projects for exploration) or filtered if you prefer privacy.
  - `INSERT/UPDATE/DELETE` only when `auth.uid() = posts.user_post_id`.
- **projects_likes**:
  - `INSERT` when `auth.uid() = user_id`.
  - `SELECT` to view own likes or to support match logic.
- **project_matches**:
  - `SELECT` if `auth.uid()` ∈ {`user_a_id`, `user_b_id`} or if `posts.user_post_id = auth.uid()`.
- **project_tasks / project_deadlines**:
  - `SELECT/INSERT/UPDATE/DELETE` only if `auth.uid()` participates in the match (`user_a_id` or `user_b_id`).

> Keep policies in versioned **migrations** to share easily with your team.

---

## Main routes

- `/loopi` — Swiper to like (“Loopi”).
- `/profile` — Profile with three sections:
  - **Your projects**: projects you published.
  - **Loopis on your projects**: matches on your projects (button “View tasks”).
  - **Projects you Loopied**: matches where you liked others’ projects (button “View tasks”).
- `/match/:matchId/tasks` — Shared board of tasks and deadlines.
- `/post/:id` — Project detail view.
- `/user/:id` — Public user profile.

---

## Local installation & usage

### Requirements

- Node.js **>= 20**
- npm or pnpm
- Supabase account

### Clone & install

```bash
git clone <your-repo>
cd <your-repo>
npm install
