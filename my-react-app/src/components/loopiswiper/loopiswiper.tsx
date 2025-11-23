import React, { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "../../database/supabaseClient";
import type { LoopiProjectCard, MatchEvent } from "../../types/loopiTypes";
import "./loopiswiper.css";

type Props = {
    projects: LoopiProjectCard[];
    onExhausted?: () => void;
    onLikeSaved?: (project: LoopiProjectCard) => void;
    onMatch?: (m: MatchEvent) => void;
};

const LoopiSwiper: React.FC<Props> = ({ projects, onExhausted, onLikeSaved, onMatch }) => {
  const [index, setIndex] = useState(0); 
  const [busy, setBusy] = useState(false); 

  useEffect(() => {
    setIndex(0);
  }, [projects]);

  const current = useMemo(() => projects[index], [projects, index]);

  useEffect(() => {
    if (projects.length > 0 && index >= projects.length) {
      onExhausted?.();
    }
  }, [index, projects.length, onExhausted]);

  const getUid = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Debes iniciar sesión.");
    return data.user.id;
  }, []);

  const saveLike = useCallback(
    async (project: LoopiProjectCard) => {
      const uid = await getUid();

      if (uid === project.user_post_id) {
        throw new Error("No puedes hacer match con tu propio proyecto.");
      }

      const { error } = await supabase
        .from("projects_likes")
        .insert([
          {
            user_id: uid,
            project_id: project.id,
            project_owner_id: project.user_post_id,
          },
        ]);

      if (error && error.code !== "23505") {
        throw error;
      }

      return uid;
    },
    [getUid]
  );

  const tryFetchMatch = useCallback(
    async (project: LoopiProjectCard, currentUserId: string) => {
      const a = currentUserId < project.user_post_id ? currentUserId : project.user_post_id;
      const b = currentUserId < project.user_post_id ? project.user_post_id : currentUserId;

      const { data, error } = await supabase
        .from("project_matches")
        .select("id")
        .eq("project_id", project.id)
        .eq("user_a_id", a)
        .eq("user_b_id", b)
        .maybeSingle();

      if (!error && data) {
        onMatch?.({ projectId: project.id, withUserId: project.user_post_id, matchId: data.id });
      } else {

      }
    },
    [onMatch]
  );

  const handleDecision = useCallback(
    async (dir: "left" | "right") => {
      if (!current || busy) return;

      try {
        setBusy(true);

        if (dir === "right") {
          const uid = await saveLike(current);
          onLikeSaved?.(current);
          if (onMatch) {
            await tryFetchMatch(current, uid);
          }
        }

        setIndex((i) => i + 1);
      } catch (e) {
        console.error("Error guardando like:", (e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [current, busy, onLikeSaved, onMatch, saveLike, tryFetchMatch]
  );

  // Render
  if (projects.length === 0) {
    return <div className="ps-empty">No hay proyectos para mostrar.</div>;
  }

  if (!current) {
    return <div className="ps-empty">¡Genial! Ya revisaste todos los proyectos.</div>;
  }

  return (
    <div className="ps-container">
      <div className="ps-card">
        {current.image_url && (
          <img
            src={current.image_url}
            alt={current.post_name ?? "Project image"}
            className="ps-image"
          />
        )}

        <div className="ps-content">
          <h2 className="ps-title">{current.post_name ?? "Proyecto sin título"}</h2>

          {current.post_professions && (
            <p className="ps-profession">{current.post_professions}</p>
          )}

          {current.post_description && (
            <p className="ps-description">{current.post_description}</p>
          )}

          {current.post_skills && (
            <div className="ps-meta">
              <p>
                <span>Skills:</span> {current.post_skills}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="ps-actions">
        <button
          className="ps-btn ps-btn--skip"
          disabled={busy}
          onClick={() => handleDecision("left")}
        >
          ❌ Skip
        </button>

        <button
          className="ps-btn ps-btn--like"
          disabled={busy}
          onClick={() => handleDecision("right")}
        >
          ✅ Match
        </button>
      </div>

      <div className="ps-legend">
        <span>Izquierda: omitir</span>
        <span>Derecha: guardar like (el trigger crea el match)</span>
      </div>
    </div>
  );
};

export default LoopiSwiper;