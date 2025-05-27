import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const Settings = () => {
  const { theme, setTheme } = useAuthStore();

  useEffect(() => {
    // Update theme attribute on document
    document.documentElement.setAttribute("data-theme", theme);
    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6">Settings</h2>

          {/* Theme Selection */}
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text text-lg font-medium">Theme</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h3 className="card-title">Primary</h3>
                <p>Primary color preview</p>
              </div>
            </div>

            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h3 className="card-title">Secondary</h3>
                <p>Secondary color preview</p>
              </div>
            </div>

            <div className="card bg-accent text-accent-content">
              <div className="card-body">
                <h3 className="card-title">Accent</h3>
                <p>Accent color preview</p>
              </div>
            </div>

            <div className="card bg-neutral text-neutral-content">
              <div className="card-body">
                <h3 className="card-title">Neutral</h3>
                <p>Neutral color preview</p>
              </div>
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title">Base</h3>
                <p>Base color preview</p>
              </div>
            </div>

            <div className="card bg-info text-info-content">
              <div className="card-body">
                <h3 className="card-title">Info</h3>
                <p>Info color preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
