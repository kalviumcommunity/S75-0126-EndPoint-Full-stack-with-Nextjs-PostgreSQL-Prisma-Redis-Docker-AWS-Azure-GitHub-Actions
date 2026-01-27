"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  return (
    <header className="w-full bg-brand text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="font-semibold text-lg">MyApp</h1>
      <div className="flex items-center gap-4">
        <nav className="hidden sm:block">
          <ul className="flex gap-4">
            <li><Link href="/">Home</Link></li>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}