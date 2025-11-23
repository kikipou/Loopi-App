import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../database/supabaseClient";
import type { LoopiProjectCard, MatchEvent } from "../../types/loopiTypes";
import "./loopiswiper.css";

type Props = {
  projects: LoopiProjectCard[];
  onExhausted?: () => void;
  onLikeSaved?: (project: LoopiProjectCard) => void;
  onMatch?: (m: MatchEvent) => void;
};

const swipeVariants = {
  enter: { opacity: 0, scale: 0.98, y: 12 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: (dir: "left" | "right") => ({
    x: dir === "left" ? -540 : 540,
    rotate: dir === "left" ? -14 : 14,
    opacity: 0,
  }),
};

const LoopiSwiper: React.FC<Props> = ({ projects, onExhausted, onLikeSaved, onMatch }) => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"left" | "right">("right"); // última dirección

  useEffect(() => setIndex(0), [projects]);

  const current = useMemo(() => projects[index], [projects, index]);

  useEffect(() => {
    if (projects.length > 0 && index >= projects.length) onExhausted?.();
  }, [index, projects.length, onExhausted]);

  const getUid = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Debes iniciar sesión.");
    return data.user.id;
  }, []);

  const saveLike = useCallback(
    async (project: LoopiProjectCard) => {
      const uid = await getUid();
      if (uid === project.user_post_id) throw new Error("No puedes hacer match con tu propio proyecto.");

      const { error } = await supabase
        .from("projects_likes")
        .insert([{ user_id: uid, project_id: project.id, project_owner_id: project.user_post_id }]);

      // ignora duplicado
      if (error && error.code !== "23505") throw error;
      return uid;
    },
    [getUid]
  );

  const tryFetchMatch = useCallback(
    async (project: LoopiProjectCard, currentUserId: string) => {
      const a = currentUserId < project.user_post_id ? currentUserId : project.user_post_id;
      const b = currentUserId < project.user_post_id ? project.user_post_id : currentUserId;

      const { data } = await supabase
        .from("project_matches")
        .select("id")
        .eq("project_id", project.id)
        .eq("user_a_id", a)
        .eq("user_b_id", b)
        .maybeSingle();

      if (data) onMatch?.({ projectId: project.id, withUserId: project.user_post_id, matchId: data.id });
    },
    [onMatch]
  );

  const handleDecision = useCallback(
    async (side: "left" | "right") => {
      if (!current) return;
      setDir(side);

      if (side === "right") {
        try {
          const uid = await saveLike(current);
          onLikeSaved?.(current);
          if (onMatch) await tryFetchMatch(current, uid);
        } catch (e) {
          console.error("Error guardando like:", (e as Error).message);
        }
      }

      // dispara exit del card actual (AnimatePresence) y luego muestra el siguiente
      // pequeño delay para que el exit tome la 'dir' actual antes del cambio de key
      requestAnimationFrame(() => setIndex((i) => i + 1));
    },
    [current, onLikeSaved, onMatch, saveLike, tryFetchMatch]
  );

  if (projects.length === 0) return <div className="ps-empty">No hay proyectos para mostrar.</div>;
  if (!current) return <div className="ps-empty">¡Genial! Ya revisaste todos los proyectos.</div>;

  return (
    <div className="ps-root">
      <div className="ps-stage">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={current.id}           // cambia key ⇒ activa exit/enter
            className="ps-card"
            custom={dir}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.85 }}
          >
            {current.image_url && (
              <img
                src={current.image_url}
                alt={current.post_name ?? "Project image"}
                className="ps-image"
                loading="lazy"
              />
            )}

            <div className="ps-content">
              <h2 className="ps-title">{current.post_name ?? "Proyecto sin título"}</h2>
              {current.post_professions && <p className="ps-profession">{current.post_professions}</p>}
              {current.post_description && <p className="ps-description">{current.post_description}</p>}
              {current.post_skills && (
                <div className="ps-meta">
                  <p><span>Skills:</span> {current.post_skills}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ps-actions">
        <button className="ps-btn ps-btn--skip" onClick={() => handleDecision("left")}>❌ Skip</button>
        <button className="ps-btn ps-btn--like" onClick={() => handleDecision("right")}>✅ Match</button>
      </div>

      <div className="ps-legend">
        <span>Izquierda: omitir</span>
        <span>Derecha: guardar like</span>
      </div>
    </div>
  );
};

export default LoopiSwiper;
