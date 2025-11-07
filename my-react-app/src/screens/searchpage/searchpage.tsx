import { useState } from "react";
import { supabase } from "../../database/supabaseClient";
import "./searchpage.css";
import BackButton from "../../components/backbutton/backbutton";
import SearchBar from "../../components/searchbar/searchbar";
import Card from "../../components/card/card";
import type { Post } from "../../types/postTypes"; // 👈 importa tu interfaz Post desde tu archivo de tipado

const SearchPage = () => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = async (query: string): Promise<void> => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredPosts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 🔍 Buscar posts que coincidan con el texto ingresado
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(
          `post_name.ilike.%${query}%, post_description.ilike.%${query}%, post_professions.ilike.%${query}%, post_skills.ilike.%${query}%`
        );

      if (error) throw error;

      setFilteredPosts((data as Post[]) || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al buscar posts");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="searchpage-container">
        <h1 className="searchpage-title">
          What are you <span>loopi-ing</span> for?
        </h1>

        <div className="searchpage-search-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="searchpage-results">
          {loading && (
            <div className="searchpage-loading">
              <p>Buscando...</p>
            </div>
          )}

          {error && (
            <div className="searchpage-error">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {searchQuery && (
                <div className="searchpage-results-header">
                  <h2>
                    {filteredPosts.length === 0
                      ? `No se encontraron resultados para "${searchQuery}"`
                      : `${filteredPosts.length} resultado${
                          filteredPosts.length !== 1 ? "s" : ""
                        } para "${searchQuery}"`}
                  </h2>
                </div>
              )}

              {filteredPosts.length > 0 ? (
                <div className="searchpage-posts-grid">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} post={post} />
                  ))}
                </div>
              ) : !searchQuery ? (
                <div className="searchpage-empty">
                  <p>
                    Escribe algo en la barra de búsqueda para encontrar posts
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <BackButton />
    </>
  );
};

export default SearchPage;
