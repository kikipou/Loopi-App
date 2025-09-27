
import { useState } from "react";
import "./nav2.css";

const Nav2 = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Design", 
    "Development",
    "Engineering",
    "Chemistry",
    "Physics",
    "Finance",
    "Marketing"
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Aquí se puede agregar lógica para filtrar contenido
    console.log("Selected category:", category);
  };

  return (
    <div className="nav2-container">
      <div className="nav2-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`nav2-category ${activeCategory === category ? 'active' : ''}`}
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