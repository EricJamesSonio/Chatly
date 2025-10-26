import React from "react";
import "../css/SearchBar.css";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search friends or messages...",
}) => {
  return (
    <div className="w-full flex justify-center mt-4">
      <input
        type="text"
        placeholder={placeholder}
        className="w-3/4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
