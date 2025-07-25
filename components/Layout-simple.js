import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart, User, Menu, Settings, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Static categories to avoid fetch errors
  const categories = [
    { _id: "1", name: "Lawn", slug: "lawn" },
    { _id: "2", name: "Embroidered", slug: "embroidered" },
    { _id: "3", name: "Cotton", slug: "cotton" },
    { _id: "4", name: "Chiffon", slug: "chiffon" },
    { _id: "5", name: "Silk", slug: "silk" },
  ];

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-brand-primary">
                BAREEHAS
              </div>
              <div className="ml-2 text-sm text-brand-secondary">ASSEMBLE</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-brand-primary">
                🏠 Home
              </Link>

              {/* Static Categories (first 4) */}
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-brand-primary"
                >
                  {category.name}
                </Link>
              ))}

              {/* Admin Dashboard with Icon */}
              <Link
                href="/admin-fixed"
                className="text-brand-primary hover:text-brand-primary/80 font-medium flex items-center"
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Link>
            </nav>

            {/* Right Side - Cart and Auth */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-brand-primary"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Auth */}
              {session ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                  {session.user.role === "admin" && (
                    <Link href="/admin-fixed">
                      <Button variant="outline" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-brand-primary">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-brand-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  CATEGORIES
                </h3>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="block py-2 text-gray-700 hover:text-brand-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📁 {category.name}
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4">
                <Link
                  href="/admin-fixed"
                  className="block py-2 text-brand-primary hover:text-brand-primary/80 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Admin Dashboard
                </Link>
              </div>

              <div className="border-t pt-4">
                <Link
                  href="/cart"
                  className="block py-2 text-gray-700 hover:text-brand-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4 inline mr-2" />
                  Cart ({getCartItemCount()})
                </Link>
              </div>

              {/* Mobile Auth */}
              <div className="border-t pt-4">
                {session ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Signed in as: {session.user.name}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut()}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-brand-primary text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">BAREEHAS ASSEMBLE</div>
            <p className="text-brand-warm/80">
              Premium Pakistani Fashion & Lifestyle Collections
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
