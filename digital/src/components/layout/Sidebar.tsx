"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { theme } = useUI();

  const publicLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/contact", label: "Contact", icon: "📧" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/users", label: "Users", icon: "👥" },
    { href: "/business", label: "Business", icon: "🏢" },
    { href: "/business/create", label: "Create Business", icon: "➕" },
    { href: "/business/dashboard", label: "Business Dashboard", icon: "📈" },
    { href: "/admin", label: "Admin Panel", icon: "⚙️" },
  ];

  const links = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className={`w-64 h-screen ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r p-4 overflow-y-auto`}>
      <h2 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Navigation Menu
      </h2>
      
      <nav>
        <ul className="space-y-2">
          {links.map(link => (
            <li key={link.href}>
              <Link 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(link.href) 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : (theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {!isAuthenticated && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Get Started</h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
            Sign up to access all features
          </p>
          <div className="flex flex-col gap-2">
            <Link 
              href="/signup" 
              className="text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Sign Up
            </Link>
            <Link 
              href="/login" 
              className="text-center px-3 py-2 border border-blue-600 text-blue-600 dark:text-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}