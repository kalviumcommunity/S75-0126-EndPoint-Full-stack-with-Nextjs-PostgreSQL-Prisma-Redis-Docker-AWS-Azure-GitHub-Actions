"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useUI();

  return (
    <main
      className={`flex flex-col items-center gap-4 mt-10 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold">Context & Hooks Demo</h1>

      {/* AUTH */}
      {isAuthenticated ? (
        <>
          <p>Logged in as: {user}</p>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => login("KalviumUser")}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Login
        </button>
      )}

      {/* UI */}
      <button
        onClick={toggleTheme}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Toggle Theme
      </button>
    </main>
  );
}
