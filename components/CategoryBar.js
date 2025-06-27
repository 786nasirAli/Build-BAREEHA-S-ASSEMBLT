import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "../lib/utils";

export default function CategoryBar({ categories }) {
  const router = useRouter();
  const currentCategory = router.query.category;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto">
          <Link href="/">
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                !currentCategory
                  ? "bg-brand-primary text-white"
                  : "text-gray-700 hover:text-brand-primary hover:bg-brand-primary/10",
              )}
            >
              All Collections
            </button>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <button
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  currentCategory === category.id
                    ? "bg-brand-primary text-white"
                    : "text-gray-700 hover:text-brand-primary hover:bg-brand-primary/10",
                )}
              >
                {category.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
