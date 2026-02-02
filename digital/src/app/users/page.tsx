"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AddUser from "./AddUser";
import RBACWrapper, { RoleBasedRender } from "@/components/RBACWrapper";

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
      <div className="mb-4 flex gap-2">
        <RoleBasedRender allowedRoles={['admin']}>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Delete User
          </button>
        </RoleBasedRender>
        <RoleBasedRender allowedRoles={['admin', 'editor']}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Edit User
          </button>
        </RoleBasedRender>
        <RoleBasedRender allowedRoles={['admin', 'editor', 'viewer']}>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            View Details
          </button>
        </RoleBasedRender>
      </div>
      <ul className="space-y-2">
        {data && data.map((user: any) => (
          <li key={user.id} className="p-2 border-b border-gray-200">
            {user.name} — {user.email}
            <div className="mt-2 flex gap-2">
              <RoleBasedRender allowedRoles={['admin']}>
                <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                  Delete
                </button>
              </RoleBasedRender>
              <RoleBasedRender allowedRoles={['admin', 'editor']}>
                <button className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Edit
                </button>
              </RoleBasedRender>
              <RoleBasedRender allowedRoles={['admin', 'editor', 'viewer']}>
                <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                  View
                </button>
              </RoleBasedRender>
            </div>
          </li>
        ))}
      </ul>
      <RBACWrapper allowedRoles={['admin', 'editor']}>
        <div className="mt-6">
          <AddUser />
        </div>
      </RBACWrapper>
    </main>
  );
}
