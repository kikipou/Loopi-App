import LoopiSwiper from "../../components/loopiswiper/loopiswiper";
import type { LoopiProjectCard, MatchEvent } from "../../types/loopiTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import Nav from "../../components/nav/nav";

export default function LoopiPage() {
  const { session } = useSelector((s: RootState) => s.auth);
  const [projects, setProjects] = useState<LoopiProjectCard[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, post_name, post_description, post_professions, post_skills, image_url, user_post_id"
        )
        .order("created_at", { ascending: false });

      if (!error && data) setProjects(data as LoopiProjectCard[]);
    })();
  }, []);

  if (!session?.user) return null;

  return (
    <div className="searchpage-container">
      <Nav />
      <LoopiSwiper
        projects={projects}
        onExhausted={() => console.log("No quedan más proyectos")}
        onLikeSaved={(p) => console.log("Like guardado a:", p.id)}
        onMatch={(m: MatchEvent) =>
          console.log(
            "🎉 Match!",
            m.projectId,
            "con",
            m.withUserId,
            "matchId:",
            m.matchId
          )
        }
      />
    </div>
  );
}
