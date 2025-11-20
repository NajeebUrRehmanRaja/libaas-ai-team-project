import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-gray-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
              />
            </svg>
          </div>
          <Link 
            href="/" 
            className="text-xl font-bold"
          >
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              LibaasAI
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link 
            href="/" 
            className="text-sm font-medium text-black transition-colors hover:text-green-600"
          >
            Home
          </Link>
          <Link 
            href="/my-wardrobe" 
            className="text-sm font-medium text-black transition-colors hover:text-green-600"
          >
            My Wardrobe
          </Link>
          <Link 
            href="/get-started" 
            className="text-sm font-medium text-black transition-colors hover:text-green-600"
          >
            Generate Look
          </Link>
          <Link 
            href="/profile" 
            className="text-sm font-medium text-black transition-colors hover:text-green-600"
          >
            Profile
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

