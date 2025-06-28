import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        router.push("/auth/signin?message=Registration successful");
      } else {
        setError(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error("Google sign up failed");
      } else {
        toast.success("Successfully signed up with Google!");
        router.push("/");
      }
    } catch (error) {
      toast.error("Google sign up failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-brand-primary">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
          >
            <FcGoogle className="mr-3 h-5 w-5" />
            {isGoogleLoading ? "Creating account..." : "Continue with Google"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                minLength="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                minLength="6"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-brand-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
