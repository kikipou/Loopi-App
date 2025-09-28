
import { usePosts } from "../../../contexts/postsContext";
import "./nav2.css";

const Nav2 = () => {
  const { currentCategory, setCategory } = usePosts();

  const categories = [
    "All",
    "design", 
    "development",
    "engineering",
    "chemistry",
    "physics",
    "finance",
    "marketing"
  ];

  const handleCategoryClick = (category: string) => {
    setCategory(category);
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
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Nav2;