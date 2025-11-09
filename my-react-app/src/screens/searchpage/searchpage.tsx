import "./searchpage.css";
import Nav from "../../components/nav/nav";
import SearchBar from "../../components/searchbar/searchbar";
import Card from "../../components/card/card";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { Post } from "../../types/postTypes";

const SearchPage = () => {
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const results = posts.filter((post) =>
        [
          post.post_name,
          post.post_description,
          post.post_professions,
          post.post_skills,
          post.username,
          post.categories,
        ]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPosts(results);
    }
  };

  return (
    <>
      <div className="searchpage-container">
        <Nav />
          <h1 className="searchpage-title">
            What are you <span>loopi-ing</span> for?
          </h1>

          <div className="searchpage-search-container">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="searchpage-results">
            {isLoading && (
              <div className="searchpage-loading">
                <p>Buscando...</p>
              </div>
            )}

            {!isLoading && (
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
                      Escribe algo en la barra de búsqueda y haz clic en la lupa
                      para encontrar posts
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
    </>
  );
};

export default SearchPage;
