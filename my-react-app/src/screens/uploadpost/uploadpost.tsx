import "./uploadpost.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../../redux/slices/postSlice";
import { supabase } from "../../database/supabaseClient";
import type { Post } from "../../types/postTypes";
import Button from "../../components/button/button";
import BackButton from "../../components/backbutton/backbutton";
import Nav from "../../components/nav/nav";
import Input from "../../components/input/input";

const UploadPost = () => {
  const [postName, setPostName] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postProfessions, setPostProfessions] = useState("");
  const [postSkills, setPostSkills] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Debes iniciar sesión para subir un post");
        return;
      }

      const { data: userData, error: userTableError } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      if (userTableError || !userData) {
        throw new Error("No se pudo obtener el nombre de usuario");
      }

      let imageUrl: string | null = null;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from("posts")
          .createSignedUrl(fileName, 60 * 60 * 24 * 365);

        if (signedError || !signedData) {
          throw (
            signedError || new Error("No se pudo generar la URL de la imagen")
          );
        }

        imageUrl = signedData.signedUrl;
      }

      const { data: newPostData, error: insertError } = await supabase
        .from("posts")
        .insert([
          {
            user_post_id: user.id,
            username: userData.username,
            post_name: postName,
            post_description: postDescription,
            post_professions: postProfessions,
            post_skills: postSkills,
            categories,
            image_url: imageUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const newPost: Post = {
        id: newPostData.id,
        user_post_id: newPostData.user_post_id,
        username: newPostData.username,
        post_name: newPostData.post_name,
        post_description: newPostData.post_description,
        post_professions: newPostData.post_professions,
        post_skills: newPostData.post_skills,
        image_url: newPostData.image_url,
        categories: newPostData.categories,
        created_at: newPostData.created_at,
      };

      dispatch(addPost(newPost));

      alert("Post creado con éxito");
      setPostName("");
      setPostDescription("");
      setPostProfessions("");
      setPostSkills("");
      setCategories("");
      setImage(null);
    } catch (err) {
      if (err instanceof Error) {
        alert("Error al crear el post: " + err.message);
      } else {
        alert("Error desconocido al crear el post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addpost-page">
      <div className="addpost-container">
        <Nav />
          <section className="back-button-addpost">
            <BackButton />
          </section>

          <h1 className="addpost-title">Create a new post</h1>

          <Input
            type="text"
            placeholder="Post name"
            value={postName}
            onChange={setPostName}
            className="addpost-input"
          />

          <textarea
            placeholder="Description"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            className="addpost-textarea"
          />

          <Input
            type="text"
            placeholder="Professions"
            value={postProfessions}
            onChange={setPostProfessions}
            className="addpost-input"
          />

          <Input
            type="text"
            placeholder="Skills"
            value={postSkills}
            onChange={setPostSkills}
            className="addpost-input"
          />

          <Input
            type="text"
            placeholder="Categories"
            value={categories}
            onChange={setCategories}
            className="addpost-input"
          />

          <label className="addpost-file">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </label>


          <Button
            buttonplaceholder={loading ? "Uploading..." : "Upload Post"}
            onClick={handleUpload}
            buttonid="upload-button"
            disabled={loading}
          />
      </div>
    </div>
  );
};

export default UploadPost;
