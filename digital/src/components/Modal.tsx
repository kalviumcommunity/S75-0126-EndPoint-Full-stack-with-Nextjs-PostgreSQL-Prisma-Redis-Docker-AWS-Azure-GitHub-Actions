"use client";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      confirmButtonRef.current?.focus();
    } else {
      dialog.close();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    dialog.addEventListener("keydown", handleEscape);
    return () => dialog.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      aria-modal="true"
      className="backdrop:bg-black backdrop:bg-opacity-50 rounded-lg p-6 shadow-xl max-w-md"
    >
      <div className="space-y-4">
        <h2 id="modal-title" className="text-xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
