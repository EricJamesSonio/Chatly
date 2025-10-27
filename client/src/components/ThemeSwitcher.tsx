import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import type { ThemeType } from "../context/ThemeContext"; //
import "../css/ThemeSwitcher.css";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeType);
  };

  return (
    <div className="theme-switcher">
      <select value={theme} onChange={handleChange}>
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="red">❤️ Red</option>
        <option value="blue">💙 Blue</option>
        <option value="colorblind">👁️ Colorblind</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
