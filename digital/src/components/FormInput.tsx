interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  register: (name: string) => { [key: string]: unknown };
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-gray-800 font-medium">{label}</label>

      <input
        type={type}
        {...register(name)}
        className={
          `w-full border border-gray-400 p-2 rounded text-black bg-white ` +
          `focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 ` +
          (error ? 'border-red-500' : '')
        }
        aria-invalid={!!error}
      />

      {error && <p className="text-red-600 text-sm font-semibold mt-1">{error}</p>}
    </div>
  );
}
