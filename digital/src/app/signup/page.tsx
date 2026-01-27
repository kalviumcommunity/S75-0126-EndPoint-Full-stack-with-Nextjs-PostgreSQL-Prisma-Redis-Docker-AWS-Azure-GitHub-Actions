"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data);
    alert(`Welcome ${data.name}`);
  };

  return (
    <main className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 bg-gray-50 p-6 border rounded space-y-4"
      >
        <h1 className="text-xl font-bold  text-gray-800 text-center">Signup</h1>

        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">Name</label>
          <input
            {...register("name")}
            className={
              `w-full border border-gray-400 p-2 rounded text-black bg-white ` +
              `focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 ` +
              (errors.name ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-red-600 text-sm font-semibold mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">Email</label>
          <input
            {...register("email")}
            className={
              `w-full border border-gray-400 p-2 rounded text-black bg-white ` +
              `focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 ` +
              (errors.email ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-red-600 text-sm font-semibold mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className={
              `w-full border border-gray-400 p-2 rounded text-black bg-white ` +
              `focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 ` +
              (errors.password ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-600 text-sm font-semibold mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}
