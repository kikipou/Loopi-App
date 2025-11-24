import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../database/supabaseClient";
import Nav from "../../components/nav/nav";
import Button from "../../components/button/button";
import "./projectTasks.css";

type TaskStatus = "todo" | "in_progress" | "done";

type ProjectTask = {
  id: number;
  match_id: number;
  title: string;
  details: string | null;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
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

type ProjectDeadline = {
  id: number;
  match_id: number;
  title: string;
  notes: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

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
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [due, setDue] = useState<string>("");

  const [deadlines, setDeadlines] = useState<ProjectDeadline[]>([]);
  const [loadingDeadlines, setLoadingDeadlines] = useState(true);
  const [dlTitle, setDlTitle] = useState("");
  const [dlNotes, setDlNotes] = useState("");
  const [dlDate, setDlDate] = useState("");

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = useMemo(
    () => (total === 0 ? 0 : Math.round((done / total) * 100)),
    [done, total]
  );

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setMe(auth.user?.id ?? null);

      if (!mid || Number.isNaN(mid)) return;

      setLoading(true);

      const { data: mdata, error: merr } = await supabase
        .from("project_matches")
        .select(
          `
                id, project_id, user_a_id, user_b_id,
                post:posts!inner ( id, post_name, image_url )
                `
        )
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

  useEffect(() => {
    (async () => {
      if (!mid || Number.isNaN(mid)) return;
      setLoadingDeadlines(true);

      const { data, error } = await supabase
        .from("project_deadlines")
        .select(
          "id, match_id, title, notes, due_date, created_by, created_at, updated_at"
        )
        .eq("match_id", mid)
        .order("due_date", { ascending: true });

      if (error) {
        console.error("Error cargando deadlines:", error.message);
        setDeadlines([]);
      } else {
        setDeadlines((data ?? []) as ProjectDeadline[]);
      }
      setLoadingDeadlines(false);
    })();
  }, [mid]);

  const sortedDeadlines = useMemo(() => {
    return [...deadlines].sort((a, b) =>
      (a.due_date ?? "").localeCompare(b.due_date ?? "")
    );
  }, [deadlines]);

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
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? (data as ProjectTask) : t))
    );
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

  const addDeadline = async () => {
    if (!me || !mid || !dlDate || !dlTitle.trim()) return;

    const { data, error } = await supabase
      .from("project_deadlines")
      .insert([
        {
          match_id: mid,
          title: dlTitle.trim(),
          notes: dlNotes.trim() || null,
          due_date: dlDate,
          created_by: me,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creando deadline:", error.message);
      return;
    }
    setDeadlines((prev) => [...prev, data as ProjectDeadline]);
    setDlTitle("");
    setDlNotes("");
    setDlDate("");
  };

  const updateDeadline = async (
    id: number,
    patch: Partial<ProjectDeadline>
  ) => {
    const { data, error } = await supabase
      .from("project_deadlines")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando deadline:", error.message);
      return;
    }
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? (data as ProjectDeadline) : d))
    );
  };

  const deleteDeadline = async (id: number) => {
    const { error } = await supabase
      .from("project_deadlines")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando deadline:", error.message);
      return;
    }
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) {
    return (
      <div className="mt-container">
        <Nav />
        <div className="mt-body">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="mt-container">
        <Nav />
        <div className="mt-body">
          <p>Couldn't find this Loopi/Match.</p>
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
            <div
              className="mt-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-progress-label">
            {done}/{total} tasks completed · {progress}%
          </p>

          <div className="mt-hero-actions">
            <Link className="link-button" to={`/post/${match.project_id}`}>
              View project
            </Link>
            <Link className="link-button" to="/profile">
              Back to my profile
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-body">
        <h2 className="mt-subtitle-tasks">Tasks</h2>
        <div className="mt-form">
          <input
            className="mt-input-title"
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="mt-input-date"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>

        <div className="mt-form">
          <textarea
            className="mt-textarea"
            placeholder="Details or comments"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <Button
            buttonplaceholder="Add task"
            buttonid="mt-btn"
            onClick={addTask}
          />
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
                  onChange={(e) =>
                    updateTask(task.id, { title: e.target.value })
                  }
                />
              </div>

              <textarea
                className="mt-card-details"
                placeholder="Details..."
                value={task.details ?? ""}
                onChange={(e) =>
                  updateTask(task.id, { details: e.target.value })
                }
              />

              <div className="mt-card-footer">
                <input
                  className="mt-date-card"
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
                  <option value="todo">To Do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <button className="mt-del" onClick={() => removeTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="mt-empty">No tasks created yet.</p>
          )}
        </div>

        <section className="mt-deadlines">
          <h2 className="mt-subtitle-deadlines">Deadlines</h2>

          <div className="dl-form">
            <input
              className="mt-input"
              type="date"
              value={dlDate}
              onChange={(e) => setDlDate(e.target.value)}
            />
            <input
              className="mt-input"
              type="text"
              placeholder="Título del deadline"
              value={dlTitle}
              onChange={(e) => setDlTitle(e.target.value)}
            />
            <input
              className="mt-input"
              type="text"
              placeholder="Notas (opcional)"
              value={dlNotes}
              onChange={(e) => setDlNotes(e.target.value)}
            />
            <Button
              buttonplaceholder="Add deadline"
              buttonid="mt-btn"
              onClick={addDeadline}
            />
          </div>

          {loadingDeadlines ? (
            <p>Loading deadlines…</p>
          ) : sortedDeadlines.length === 0 ? (
            <p className="mt-empty">No deadlines yet.</p>
          ) : (
            <ul className="dl-list">
              {sortedDeadlines.map((d) => (
                <li key={d.id} className="dl-item">
                  <input
                    className="dl-title"
                    value={d.title}
                    onChange={(e) =>
                      updateDeadline(d.id, { title: e.target.value })
                    }
                  />
                  <input
                    className="dl-date"
                    type="date"
                    value={d.due_date ?? ""}
                    onChange={(e) =>
                      updateDeadline(d.id, { due_date: e.target.value })
                    }
                  />
                  <input
                    className="dl-notes"
                    type="text"
                    placeholder="Comments"
                    value={d.notes ?? ""}
                    onChange={(e) =>
                      updateDeadline(d.id, { notes: e.target.value })
                    }
                  />
                  <button
                    className="mt-del"
                    onClick={() => deleteDeadline(d.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectTasksPage;
