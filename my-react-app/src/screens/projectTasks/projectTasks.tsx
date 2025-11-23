import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../database/supabaseClient";
import Nav from "../../components/nav/nav";
import "./projectTasks.css";

type TaskStatus = "todo" | "in_progress" | "done";

type ProjectTask = {
  id: number;
  match_id: number;
  title: string;
  details: string | null;
  status: TaskStatus;
  due_date: string | null;        // 'YYYY-MM-DD'
  assigned_to: string | null;     // uuid
  created_by: string;             // uuid
  created_at: string;
  updated_at: string;
};

type MatchInfo = {
  id: number;
  project_id: number;
  user_a_id: string;
  user_b_id: string;
  post_name: string | null;
  image_url: string | null;
};

// Helper: si el join viene como array, toma el primero; si viene como objeto, úsalo tal cual
function asOne<T>(rel: T | T[] | null | undefined): T | null {
  if (!rel) return null;
  return Array.isArray(rel) ? rel[0] ?? null : rel;
}

const ProjectTasksPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const mid = Number(matchId);

  const [me, setMe] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [due, setDue] = useState<string>("");

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = useMemo(
    () => (total === 0 ? 0 : Math.round((done / total) * 100)),
    [done, total]
  );

  useEffect(() => {
    (async () => {
      // quién soy
      const { data: auth } = await supabase.auth.getUser();
      setMe(auth.user?.id ?? null);

      if (!mid || Number.isNaN(mid)) return;

      setLoading(true);

      // 1) Info del match + post (alias 'post' para evitar ambigüedad)
      const { data: mdata, error: merr } = await supabase
        .from("project_matches")
        .select(`
          id, project_id, user_a_id, user_b_id,
          post:posts!inner ( id, post_name, image_url )
        `)
        .eq("id", mid)
        .single();

      if (merr || !mdata) {
        console.error("Error cargando match:", merr?.message);
        setMatch(null);
      } else {
        const post = asOne(mdata.post);
        setMatch({
          id: mdata.id,
          project_id: mdata.project_id,
          user_a_id: mdata.user_a_id,
          user_b_id: mdata.user_b_id,
          post_name: post?.post_name ?? null,
          image_url: post?.image_url ?? null,
        });
      }

      // 2) Tareas del match
      const { data: tdata, error: terr } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("match_id", mid)
        .order("status", { ascending: true })
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (terr) {
        console.error("Error cargando tareas:", terr.message);
        setTasks([]);
      } else {
        setTasks((tdata ?? []) as ProjectTask[]);
      }

      setLoading(false);
    })();
  }, [mid]);

  const addTask = async () => {
    if (!title.trim() || !me || !mid || Number.isNaN(mid)) return;

    const { data, error } = await supabase
      .from("project_tasks")
      .insert([
        {
          match_id: mid,
          title: title.trim(),
          details: details.trim() || null,
          status: "todo" as TaskStatus,
          due_date: due || null,
          created_by: me,
          assigned_to: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creando tarea:", error.message);
      return;
    }

    setTasks((prev) => [...prev, data as ProjectTask]);
    setTitle("");
    setDetails("");
    setDue("");
  };

  const toggleDone = async (task: ProjectTask) => {
    const next: TaskStatus = task.status === "done" ? "todo" : "done";
    const { error } = await supabase
      .from("project_tasks")
      .update({ status: next })
      .eq("id", task.id);

    if (error) {
      console.error("Error actualizando estado:", error.message);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );
  };

  const updateTask = async (taskId: number, patch: Partial<ProjectTask>) => {
    const { error, data } = await supabase
      .from("project_tasks")
      .update(patch)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando tarea:", error.message);
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === taskId ? (data as ProjectTask) : t)));
  };

  const removeTask = async (taskId: number) => {
    const { error } = await supabase
      .from("project_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Error eliminando tarea:", error.message);
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (loading) {
    return (
      <div className="mt-container">
        <Nav />
        <div className="mt-body">
          <p>Cargando tablero…</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="mt-container">
        <Nav />
        <div className="mt-body">
          <p>No se encontró este Loopi/Match.</p>
          <Link className="mt-link" to="/profile">
            Volver a mi perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-container">
      <Nav />

      <div className="mt-hero">
        {match.image_url && (
          <img
            className="mt-hero-img"
            src={match.image_url}
            alt={match.post_name ?? "Project"}
          />
        )}
        <div className="mt-hero-info">
          <h1 className="mt-title">{match.post_name ?? "Proyecto"}</h1>

          <div className="mt-progress">
            <div className="mt-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-progress-label">
            {done}/{total} tareas · {progress}%
          </p>

          <div className="mt-hero-actions">
            <Link className="link-button" to={`/post/${match.project_id}`}>
              Ver proyecto
            </Link>
            <Link className="link-button" to="/profile">
              Volver a mi perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-body">
        <div className="mt-form">
          <input
            className="mt-input"
            type="text"
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="mt-input"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <textarea
            className="mt-textarea"
            placeholder="Detalles (opcional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button className="mt-btn" onClick={addTask}>
            Agregar tarea
          </button>
        </div>

        <div className="mt-grid">
          {tasks.map((task) => (
            <div key={task.id} className="mt-card">
              <div className="mt-card-row">
                <label className="mt-check">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => toggleDone(task)}
                  />
                  <span />
                </label>

                <input
                  className={`mt-card-title ${
                    task.status === "done" ? "is-done" : ""
                  }`}
                  value={task.title}
                  onChange={(e) => updateTask(task.id, { title: e.target.value })}
                />
              </div>

              <textarea
                className="mt-card-details"
                placeholder="Detalles…"
                value={task.details ?? ""}
                onChange={(e) => updateTask(task.id, { details: e.target.value })}
              />

              <div className="mt-card-footer">
                <input
                  className="mt-date"
                  type="date"
                  value={task.due_date ?? ""}
                  onChange={(e) =>
                    updateTask(task.id, { due_date: e.target.value || null })
                  }
                />
                <select
                  className="mt-status"
                  value={task.status}
                  onChange={(e) =>
                    updateTask(task.id, {
                      status: e.target.value as TaskStatus,
                    })
                  }
                >
                  <option value="todo">Por hacer</option>
                  <option value="in_progress">En progreso</option>
                  <option value="done">Hecha</option>
                </select>
                <button className="mt-del" onClick={() => removeTask(task.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="mt-empty">No hay tareas aún. ¡Crea la primera! 🌱</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksPage;
