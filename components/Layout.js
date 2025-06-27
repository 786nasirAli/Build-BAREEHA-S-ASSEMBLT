import Link from "next/link";
import { Button } from "./ui/button";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-brand-primary">SAYA</div>
              <div className="ml-2 text-sm text-brand-secondary">FASHION</div>
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
            </nav>

            {/* Admin Link */}
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
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
            <div className="text-xl font-bold mb-2">SAYA FASHION</div>
            <p className="text-brand-warm/80">
              Premium Pakistani Fashion & Lawn Collections
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
