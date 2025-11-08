import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../../redux/slices/postSlice";
import { supabase } from "../../database/supabaseClient";
import type { Post } from "../../types/postTypes";
import Button from "../../components/button/button";
import "./uploadpost.css";

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

      // ✅ Obtener usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Debes iniciar sesión para subir un post");
        return;
      }

      // ✅ Obtener el user_name desde la tabla 'users'
      const { data: userData, error: userTableError } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      if (userTableError || !userData) {
        throw new Error("No se pudo obtener el nombre de usuario");
      }

      // ✅ Subir imagen al bucket 'posts'
      let imageUrl: string | null = null;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        // 1. Subimos el archivo
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // 2. Generamos una URL firmada (porque el bucket es privado) 🔥
        const { data: signedData, error: signedError } = await supabase.storage
          .from("posts")
          // segundo parámetro = segundos de validez (aquí 1 año aprox) 🔥
          .createSignedUrl(fileName, 60 * 60 * 24 * 365);

        if (signedError || !signedData) {
          throw (
            signedError || new Error("No se pudo generar la URL de la imagen")
          );
        }

        imageUrl = signedData.signedUrl; // 🔥 URL tipo /object/sign/...token=...
      }

      // ✅ Crear el post en la tabla 'posts'
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

      // ✅ Crear objeto Post con el tipo correcto
      const newPost: Post = {
        id: newPostData.id,
        // ojo aquí: usas user_post_id en el insert, así que leo user_post_id 🔥
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

      // ✅ Guardar en Redux
      dispatch(addPost(newPost));

      alert("Post creado con éxito 🎉");
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
    <div className="addpost-container">
      <h1 className="addpost-title">Create a new post</h1>

      <input
        type="text"
        placeholder="Post name"
        value={postName}
        onChange={(e) => setPostName(e.target.value)}
        className="addpost-input"
      />

      <textarea
        placeholder="Description"
        value={postDescription}
        onChange={(e) => setPostDescription(e.target.value)}
        className="addpost-textarea"
      />

      <input
        type="text"
        placeholder="Professions"
        value={postProfessions}
        onChange={(e) => setPostProfessions(e.target.value)}
        className="addpost-input"
      />

      <input
        type="text"
        placeholder="Skills"
        value={postSkills}
        onChange={(e) => setPostSkills(e.target.value)}
        className="addpost-input"
      />

      <input
        type="text"
        placeholder="Categories"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        className="addpost-input"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="addpost-file"
      />

      <Button
        buttonplaceholder={loading ? "Uploading..." : "Upload Post"}
        onClick={handleUpload}
        buttonid="upload-button"
        disabled={loading}
      />
    </div>
  );
};

export default UploadPost;
