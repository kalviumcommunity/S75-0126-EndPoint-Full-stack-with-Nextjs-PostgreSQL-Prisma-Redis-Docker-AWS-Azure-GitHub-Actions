"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { theme } = useUI();

  return (
    <header className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600'} text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4`}>
      <Link href="/" className="font-bold text-xl hover:opacity-90 transition-opacity">
        MyApp
      </Link>
      
      <div className="flex items-center gap-4">
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/" 
                className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
              >
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    href="/dashboard" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/users" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/business" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/login" 
                    className="hover:text-blue-200 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/signup" 
                    className="bg-white text-blue-600 hover:bg-gray-100 transition-colors py-2 px-4 rounded-md font-medium"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <ThemeToggle />
      </div>
    </header>
  );
}