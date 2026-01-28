"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AddUser from "./AddUser";

export default function UsersPage() {
  const { data } = useSWR("/api/users", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
    onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {data && data.map((user: any) => (
          <li key={user.id} className="p-2 border-b border-gray-200">
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
      <AddUser />
    </main>
  );
}
