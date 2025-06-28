import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

export default function MakeAdmin() {
  const [email, setEmail] = useState("na9334974@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Success: ${data.message}`);
        toast.success("Admin access granted!");
      } else {
        setResult(`❌ Error: ${data.message}`);
        toast.error(data.message);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
      toast.error("Failed to make admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-brand-primary">
            Admin Setup
          </h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. First create an account using Sign Up</li>
              <li>2. Then use this form to get admin access</li>
              <li>3. Sign in and access the Admin dashboard</li>
            </ol>
          </div>

          <form onSubmit={handleMakeAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Setting up admin..." : "Make Admin"}
            </Button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              After getting admin access:
            </p>
            <div className="space-y-2">
              <a
                href="/auth/signin"
                className="block text-brand-primary hover:underline text-sm"
              >
                → Sign In
              </a>
              <a
                href="/admin"
                className="block text-brand-primary hover:underline text-sm"
              >
                → Access Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
