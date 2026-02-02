"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

export default function AddUser() {
  const { data } = useSWR("/api/users", fetcher);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingName, setPendingName] = useState("");

  const handleAddUser = () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    setPendingName(name);
    setShowModal(true);
  };

  const confirmAddUser = async () => {
    setShowModal(false);
    setIsLoading(true);

    const toastId = toast.loading("Adding user...");

    try {
      // Optimistic update
      mutate(
        "/api/users",
        [...(data || []), { id: Date.now(), name: pendingName, email: "temp@user.com" }],
        false
      );

      // Actual API call
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pendingName, email: "temp@user.com", age: 25 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      // Revalidate after update
      await mutate("/api/users");
      
      toast.success("User added successfully!", { id: toastId });
      setName("");
      setPendingName("");
    } catch (error) {
      toast.error("Failed to add user. Please try again.", { id: toastId });
      // Revert optimistic update on error
      mutate("/api/users");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAddUser = () => {
    setShowModal(false);
    setPendingName("");
  };

  if (isLoading) {
    return <Loader message="Adding user..." />;
  }

  return (
    <>
      <div className="mt-4">
        <input
          className="border px-2 py-1 mr-2 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          disabled={isLoading}
        />
        <button
          onClick={handleAddUser}
          disabled={isLoading}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Add User
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={cancelAddUser}
        onConfirm={confirmAddUser}
        title="Confirm Add User"
        message={`Are you sure you want to add "${pendingName}"?`}
      />
    </>
  );
}
