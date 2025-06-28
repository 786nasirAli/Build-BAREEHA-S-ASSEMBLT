import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-brand-primary">
                Home
              </Link>
              <Link
                href="/category/lawn"
                className="text-gray-700 hover:text-brand-primary"
              >
                Lawn
              </Link>
              <Link
                href="/category/embroidered"
                className="text-gray-700 hover:text-brand-primary"
              >
                Embroidered
              </Link>
              <Link
                href="/category/cotton"
                className="text-gray-700 hover:text-brand-primary"
              >
                Cotton
              </Link>
              <Link
                href="/admin-direct"
                className="text-brand-primary hover:text-brand-primary/80 font-medium"
              >
                Admin Dashboard
              </Link>
            </nav>

            {/* User Actions */}
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

              {/* Auth */}
              {session ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                  {session.user.role === "admin" && (
                    <Link href="/admin">
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
                <div className="flex items-center space-x-2">
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
