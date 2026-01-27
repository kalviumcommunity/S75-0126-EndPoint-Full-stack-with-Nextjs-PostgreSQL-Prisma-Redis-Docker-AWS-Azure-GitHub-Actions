"use client";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/users", label: "Users" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Navigation</h2>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}