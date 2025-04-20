import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  // Load theme preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored === "dark" || (!stored && systemPrefersDark);
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="text-xl font-semibold">FitTrack Lite</div>

      <NavLink to="/dashboard" className={({ isActive }) =>
        isActive ? "text-blue-500 font-semibold" : "text-gray-500"
      }>
        Dashboard
      </NavLink>
      <NavLink to="/workouts" className={({ isActive }) =>
        isActive ? "text-blue-500 font-semibold" : "text-gray-500"
      }>
        Log
      </NavLink>
      <NavLink to="/history" className={({ isActive }) =>
        isActive ? "text-blue-500 font-semibold" : "text-gray-500"
      }>
        Workout History
      </NavLink>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="transition-all hover:scale-110">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
        </button>

        {user && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
