interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark dark:hover:bg-brand-light"
      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <button onClick={onClick} className={styles}>
      {label}
    </button>
  );
}