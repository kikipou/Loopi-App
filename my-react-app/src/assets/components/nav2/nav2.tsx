import { usePosts } from "../../../contexts/postsContext";
import "./nav2.css";

const Nav2 = () => {
  const { currentCategory, setCategory, categories } = usePosts();

  const handleCategoryClick = (category: string) => {
    setCategory(category);
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="nav2-container">
      <div className="nav2-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`nav2-category ${currentCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category === "All" ? "All" : capitalizeFirst(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Nav2;