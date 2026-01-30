"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Schema
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`Welcome ${data.name}! Account created successfully.`);
        router.push('/login');
      } else {
        toast.error(result.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Failed to create account');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Join us today to get started</p>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            {...register("name")}
            className={
              `w-full px-4 py-3 rounded-lg border ` +
              `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
              `bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ` +
              (errors.name ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-red-600 text-sm font-semibold mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            {...register("email")}
            className={
              `w-full px-4 py-3 rounded-lg border ` +
              `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
              `bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ` +
              (errors.email ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-red-600 text-sm font-semibold mt-1 text-left">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className={
              `w-full px-4 py-3 rounded-lg border ` +
              `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
              `bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ` +
              (errors.phone ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.phone}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-600 text-sm font-semibold mt-1 text-left">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            {...register("password")}
            className={
              `w-full px-4 py-3 rounded-lg border ` +
              `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
              `bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ` +
              (errors.password ? 'border-red-500' : '')
            }
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-600 text-sm font-semibold mt-1 text-left">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}
