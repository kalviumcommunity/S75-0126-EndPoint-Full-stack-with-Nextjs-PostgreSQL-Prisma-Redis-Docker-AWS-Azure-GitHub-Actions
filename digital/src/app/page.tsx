"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import Link from "next/link";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme } = useUI();

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to MyApp</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            A comprehensive full-stack application with authentication, role-based access control, and modern UI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className={`rounded-xl p-6 shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Secure Authentication</h3>
            <p className="text-gray-700 dark:text-gray-300">
              JWT-based authentication with role-based access control
            </p>
          </div>
          
          <div className={`rounded-xl p-6 shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">User Management</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Comprehensive user management with different permission levels
            </p>
          </div>
          
          <div className={`rounded-xl p-6 shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Modern UI/UX</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Responsive design with dark/light mode support
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Explore Our Features</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/users"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              User Management
            </Link>
            <Link 
              href="/business"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Business
            </Link>
            <Link 
              href="/admin"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        <div className={`rounded-xl p-8 max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">About This Application</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This is a full-stack application built with Next.js, PostgreSQL, Prisma, Redis, and more. 
            It includes authentication, role-based access control, data management, and responsive UI.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <p className="self-center">Logged in as: <span className="font-semibold">{typeof user === 'string' ? user : 'User'}</span></p>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
                <Link 
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/signup"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
