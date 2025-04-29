// components/Header.jsx
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-blue-600">
              PGAGI Analytics
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Analytics
            </Link>
            <Link
              href="/reports"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Reports
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Analytics
              </Link>
              <Link
                href="/reports"
                className="text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Reports
              </Link>
              <Link
                href="/settings"
                className="text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
