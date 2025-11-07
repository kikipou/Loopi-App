import { useState, useEffect } from "react";
import "./searchbar.css";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Type here",
  className = "",
}: SearchBarProps) => {
  const [localQuery, setLocalQuery] = useState("");

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    handleSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localQuery);
  };

  useEffect(() => {
    setLocalQuery("");
  }, []);

  return (
    <form
      className={`searchbar-container ${className}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={localQuery}
        onChange={handleInputChange}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch(localQuery);
          }
        }}
      />
      <button
        type="submit"
        className="searchbar-button"
        onClick={() => handleSearch(localQuery)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
