import type { Post } from '../../types/postTypes';
import './card.css';

interface CardProps {
  post: Post;
}

const Card = ({ post }: CardProps) => {
  return (
    <div className="card">
      {post.image_url && <img src={post.image_url} alt={post.post_name} />}
      <h3>{post.post_name}</h3>
      <p className="post-description">{post.post_description}</p>
      <p className="post-professions"><strong>Profesiones:</strong> {post.post_professions}</p>
      <p className="post-skills"><strong>Habilidades:</strong> {post.post_skills}</p>
      <p className="post-category"><strong>Categoría:</strong> {post.categories}</p>
    </div>
  );
};

export default Card;