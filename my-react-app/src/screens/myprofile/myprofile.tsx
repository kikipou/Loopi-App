import "./myprofile.css";
import Nav from "../../components/nav/nav";
import Button from "../../components/button/button";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";
import { supabase } from "../../database/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post } from "../../types/postTypes";

type UserRow = {
  id: string;
  username: string | null;
  profile_img_url: string | null;
  user_profession: string | null;
  profile_description: string | null;
  profile_cover_url: string | null;
};

type UserProfile = {
  username: string | null;
  profile_img_url: string | null;
  user_profession: string | null;
  profile_description: string | null;
  profile_cover_url: string | null;
};

type ProjectMatchItem = {
  match_id: number;
  project_id: number;
  created_at: string;
  partner_id: string;
  partner_username: string | null;
  partner_avatar: string | null;
  post_name: string | null;
  image_url: string | null;
};

type LikedMatchItem = {
  match_id: number;
  project_id: number;
  created_at: string;
  owner_id: string;
  owner_username: string | null;
  owner_avatar: string | null;
  post_name: string | null;
  image_url: string | null;
};

const MyProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state: RootState) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [myMatches, setMyMatches] = useState<ProjectMatchItem[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [likedMatches, setLikedMatches] = useState<LikedMatchItem[]>([]);
  const [loadingLikedMatches, setLoadingLikedMatches] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      setLoadingProfile(true);

      const { data, error } = await supabase
        .from("users")
        .select("id, username, profile_img_url, user_profession, profile_description, profile_cover_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(
          "Error getting profile from table users:",
          error.message
        );
        setProfile(null);
      } else if (data) {
        const user = data as UserRow;
        console.log("MyProfile fetch user:", user);
        setProfile({
          username: user.username,
          profile_img_url: user.profile_img_url,
          user_profession: user.user_profession,
          profile_description: user.profile_description,
          profile_cover_url: user.profile_cover_url,
        });
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [session]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!session?.user) return;

      setLoadingPosts(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username, user_post_id"
        )
        .eq("user_post_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getting user posts:", error.message);
        setMyPosts([]);
      } else {
        setMyPosts((data ?? []) as Post[]);
      }

      setLoadingPosts(false);
    };

    fetchMyPosts();
  }, [session]);

  useEffect(() => {
    const fetchOwnerMatches = async () => {
      if (!session?.user) return;
      setLoadingMatches(true);

      const { data: rows, error } = await supabase
        .from("project_matches")
        .select(`
          id, created_at, project_id, user_a_id, user_b_id, posts!inner(id, user_post_id, post_name, image_url)
        `)
        .eq("posts.user_post_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getting matches:", error.message);
        setMyMatches([]);
        setLoadingMatches(false);
        return;
      }

      const partnerIds = Array.from(
        new Set(
          (rows ?? []).map((r: any) =>
            r.user_a_id === session.user.id ? r.user_b_id : r.user_a_id
          )
        )
      );

      let byId = new Map<string, any>();
      if (partnerIds.length > 0) {
        const { data: usersData, error: usersErr } = await supabase
          .from("users")
          .select("id, username, profile_img_url")
          .in("id", partnerIds);

        if (usersErr) {
          console.error("Error getting profiles:", usersErr.message);
        }

        byId = new Map((usersData ?? []).map((u) => [u.id, u]));
      }

      const mapped: ProjectMatchItem[] = (rows ?? []).map((r: any) => {
        const partnerId =
          r.user_a_id === session.user.id ? r.user_b_id : r.user_a_id;
        const partner = byId.get(partnerId);
        return {
          match_id: r.id,
          project_id: r.project_id,
          created_at: r.created_at,
          partner_id: partnerId,
          partner_username: partner?.username ?? null,
          partner_avatar: partner?.profile_img_url ?? null,
          post_name: r.posts?.post_name ?? null,
          image_url: r.posts?.image_url ?? null,
        };
      });

      setMyMatches(mapped);
      setLoadingMatches(false);
    };

    fetchOwnerMatches();
  }, [session]);

  useEffect(() => {
    const fetchILikedMatches = async () => {
      if (!session?.user) return;
      setLoadingLikedMatches(true);
      const uid = session.user.id;

      const { data: matches, error: mErr } = await supabase
        .from("project_matches")
        .select("id, created_at, project_id, user_a_id, user_b_id")
        .or(`user_a_id.eq.${uid},user_b_id.eq.${uid}`)
        .order("created_at", { ascending: false });

      if (mErr) {
        console.error("Error leyendo project_matches:", mErr.message);
        setLikedMatches([]);
        setLoadingLikedMatches(false);
        return;
      }

      const projectIds = Array.from(new Set((matches ?? []).map((m) => m.project_id)));
      if (projectIds.length === 0) {
        setLikedMatches([]);
        setLoadingLikedMatches(false);
        return;
      }

      const { data: postsData, error: pErr } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, image_url, user_post_id"
        )
        .in("id", projectIds)
        .neq("user_post_id", uid);

      if (pErr) {
        console.error("Error leyendo posts de matches (yo):", pErr.message);
        setLikedMatches([]);
        setLoadingLikedMatches(false);
        return;
      }

      const posts = postsData as Array<{
        id: number;
        created_at: string | null;
        post_name: string | null;
        image_url: string | null;
        user_post_id: string;
      }>;

      const ownerByProject = new Map<number, string>(
        posts.map((p) => [p.id, p.user_post_id])
      );

      const matchByProjectOwner = new Map<number, { id: number; created_at: string }>();
      (matches ?? []).forEach((m) => {
        const ownerId = ownerByProject.get(m.project_id);
        if (!ownerId) return;
        const partner = m.user_a_id === uid ? m.user_b_id : m.user_a_id;
        if (partner === ownerId && !matchByProjectOwner.has(m.project_id)) {
          matchByProjectOwner.set(m.project_id, { id: m.id, created_at: m.created_at });
        }
      });

      const ownerIds = Array.from(new Set(posts.map((p) => p.user_post_id)));
      let ownersById = new Map<string, any>();
      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from("users")
          .select("id, username, profile_img_url")
          .in("id", ownerIds);
        ownersById = new Map((owners ?? []).map((o) => [o.id, o]));
      }

      const mapped: LikedMatchItem[] = posts.map((p) => {
        const m = matchByProjectOwner.get(p.id);
        const owner = ownersById.get(p.user_post_id);
        return {
          match_id: m?.id ?? 0,
          project_id: p.id,
          created_at: m?.created_at ?? (p.created_at ?? new Date().toISOString()),
          owner_id: p.user_post_id,
          owner_username: owner?.username ?? null,
          owner_avatar: owner?.profile_img_url ?? null,
          post_name: p.post_name ?? null,
          image_url: p.image_url ?? null,
        };
      });

      setLikedMatches(mapped);
      setLoadingLikedMatches(false);
    };

    fetchILikedMatches();
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      dispatch(clearSession());
      console.log("User logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  const handleAddPost = () => {
    navigate("/upload");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const displayName = profile?.username || "Your profile";
  const avatarUrl = profile?.profile_img_url ?? null;
  const coverUrl = profile?.profile_cover_url ?? null;

  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : "");

  return (
    <div className="myprofile-container">
      <Nav />
      {coverUrl && (
      <div className="myprofile-cover-container">
        <img
          src={coverUrl}
          alt="Profile cover"
          className="myprofile-cover-img"
        />
      </div>
      )}
        <div className="myprofile-header">
          {loadingProfile ? (
            <div className="myprofile-avatar skeleton" />
          ) : avatarUrl ? (
            <img
            src={avatarUrl}
            alt={displayName}
            className="myprofile-avatar-img"
          />
          ) : (
            <div className="myprofile-avatar placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="myprofile-info">
            <h1 className="myprofile-title">{displayName}</h1>

            {profile?.user_profession && (
            <p className="myprofile-profession">
              {profile.user_profession}
            </p>
          )}

            {profile?.profile_description && (
            <p className="myprofile-description">
              {profile.profile_description}
            </p>
          )}

            {session?.user.email && (
              <p className="myprofile-email">{session.user.email}</p>
          )}
          </div>
        </div>
          
          <section className="myprofile-editbutton">
            <Button
              buttonplaceholder="Edit Profile"
              buttonid="edit-profile-button"
              onClick={handleEditProfile}
            />
          </section>

          <section className="myprofile-addpostbutton">
            <Button
              buttonplaceholder="Add Post"
              buttonid="add-button"
              onClick={handleAddPost}
            />
          </section>
          
          <section className="myprofile-logoutbutton">
            <Button
              buttonplaceholder="Log out"
              buttonid="logout-button"
              onClick={handleLogout}
            />
          </section>

        <section className="myprofile-posts-section">
          <h2 className="myprofile-subtitle">Your projects</h2>

          {loadingPosts ? (
            <p>Loading your projects...</p>
          ) : myPosts.length === 0 ? (
            <p className="myprofile-no-posts">
              You haven't created any projects yet.
            </p>
          ) : (
            <div className="myprofile-posts-grid">
              {myPosts.map((post) => {
                const formattedDate = post.created_at
                  ? new Date(post.created_at).toLocaleString()
                  : "";

                return (
                  <div key={post.id} className="myprofile-post-card">
                    {post.image_url && (
                      <img
                        src={post.image_url || undefined}
                        alt={post.post_name ?? "Post image"}
                        className="myprofile-post-image"
                      />
                    )}

                    <div className="myprofile-post-main">
                      <div className="myprofile-post-header">
                        <h3 className="myprofile-post-title">{post.post_name}</h3>
                        {formattedDate && (
                          <span className="myprofile-post-date">
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {post.post_description && (
                        <p className="myprofile-post-description">
                          {post.post_description}
                        </p>
                      )}

                      {post.categories && (
                        <p className="myprofile-post-meta">
                          <strong>Category:</strong> {post.categories}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <section className="myprofile-matches-section">
        <h2 className="myprofile-subtitle">Loopis with your projects</h2>

        {loadingMatches ? (
          <p>Loading matches…</p>
        ) : myMatches.length === 0 ? (
          <p className="myprofile-no-posts">You don't have Loopis yet.</p>
        ) : (
          <div className="myprofile-matches-grid">
            {myMatches.map((m) => {
              const when = m.created_at
                ? new Date(m.created_at).toLocaleString()
                : "";
              return (
                <div key={m.match_id} className="myprofile-match-card">
                  {m.image_url && (
                    <img
                      src={m.image_url || undefined}
                      alt={m.post_name ?? "Project image"}
                      className="myprofile-match-image"
                    />
                  )}

                  <div className="myprofile-match-main">
                    <div className="myprofile-match-header">
                      <h3 className="myprofile-post-title">{m.post_name ?? "Proyecto"}</h3>
                      {when && <span className="myprofile-post-date">{when}</span>}
                    </div>

                    <div className="myprofile-match-partner">
                      <div className="myprofile-match-partner-avatar">
                        {m.partner_avatar ? (
                          <img
                            src={m.partner_avatar}
                            alt={m.partner_username ?? "User"}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {(m.partner_username ?? "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="myprofile-match-partner-info">
                        <Link className="partner-link" to={`/user/${m.partner_id}`}>
                          {m.partner_username ?? "Usuario"}
                        </Link>
                        <div className="myprofile-match-actions">
                          <Link className="link-button-card" to={`/post/${m.project_id}`}>
                            View project
                          </Link>
                          <Link className="link-button-card" to={`/match/${m.match_id}/tasks`}>
                            View tasks
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <section className="myprofile-myloopis-section">
        <h2 className="myprofile-subtitle">Projects you Loopied</h2>

        {loadingLikedMatches ? (
          <p className="myprofile-no-posts">Loading your Loopis...</p>
        ) : likedMatches.length === 0 ? (
          <p className="myprofile-no-posts">You haven't do Loopi with any project yet.</p>
        ) : (
          <div className="myprofile-matches-grid">
            {likedMatches.map((p) => {
              const when = fmt(p.created_at);
              return (
                <div key={`match-${p.match_id}`} className="myprofile-match-card">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.post_name ?? "Project image"}
                      className="myprofile-match-image"
                    />
                  )}

                  <div className="myprofile-match-main">
                    <div className="myprofile-match-header">
                      <h3 className="myprofile-post-title">{p.post_name ?? "Untitled project"}</h3>
                      {when && <span className="myprofile-post-date">{when}</span>}
                    </div>

                    <div className="myprofile-match-partner">
                      <div className="myprofile-match-partner-avatar">
                        {p.owner_avatar ? (
                          <img src={p.owner_avatar} alt={p.owner_username ?? "Owner"} />
                        ) : (
                          <div className="avatar-placeholder">
                            {(p.owner_username ?? "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="myprofile-match-partner-info">
                        <Link to={`/user/${p.owner_id}`} className="partner-link">
                          {p.owner_username ?? "User"}
                        </Link>
                        <div className="myprofile-match-actions">
                          <Link to={`/post/${p.project_id}`} className="link-button-card">
                            View project
                          </Link>
                          <Link to={`/match/${p.match_id}/tasks`} className="link-button-card">
                            View tasks
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyProfile;
