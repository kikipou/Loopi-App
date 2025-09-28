import './searchpage.css';
import BackButton from '../../components/backbutton/backbutton';
import SearchBar from '../../components/searchbar/searchbar';
import { usePosts } from '../../../contexts/postsContext';

const SearchPage = () => {
  const { filteredPosts, loading, error, searchQuery } = usePosts();

  return (
    <>
      <div className="searchpage-container"> 
        <h1 className="searchpage-title">What are you  for?</h1>
        <h1 className="searchpage-title2">loopi-ing</h1>
        
        <div className="searchpage-search-container">
          <SearchBar />
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
                      : `${filteredPosts.length} resultado${filteredPosts.length !== 1 ? 's' : ''} para "${searchQuery}"`
                    }
                  </h2>
                </div>
              )}

              {filteredPosts.length > 0 ? (
                <div className="searchpage-posts-grid">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="searchpage-post-card">
                      {post.image_url && <img src={post.image_url} alt={post.post_name} />}
                      <h3>{post.post_name}</h3>
                      <p className="post-description">{post.post_description}</p>
                      <p className="post-professions"><strong>Profesiones:</strong> {post.post_professions}</p>
                      <p className="post-skills"><strong>Habilidades:</strong> {post.post_skills}</p>
                      <p className="post-category"><strong>Categoría:</strong> {post.categories}</p>
                    </div>
                  ))}
                </div>
              ) : !searchQuery ? (
                <div className="searchpage-empty">
                  <p>Escribe algo en la barra de búsqueda para encontrar posts</p>
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