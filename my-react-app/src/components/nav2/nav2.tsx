// src/components/nav2/Nav2.tsx
import "./nav2.css";

interface Nav2Props {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const Nav2: React.FC<Nav2Props> = ({
  categories,
  currentCategory,
  onCategoryChange,
}) => {
  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="nav2-container">
      <div className="nav2-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`nav2-category ${
              currentCategory === category ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category === "All" ? "All" : capitalizeFirst(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Nav2;
