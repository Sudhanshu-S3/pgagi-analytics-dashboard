import { useState, useRef, useEffect } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile"
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
          <span className="text-sm font-medium">JD</span>
        </div>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <p className="text-sm">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              user@example.com
            </p>
          </div>

          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Settings
          </a>
          <a
            href="/logout"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
