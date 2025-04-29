import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownOption {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  width?: string | number;
  renderOption?: (option: DropdownOption) => React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  error,
  disabled = false,
  className = "",
  width = "auto",
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption = options.find((option) => option.value === value);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    if (onChange) {
      onChange(option.value);
    }

    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "ArrowDown" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      style={{ width }}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={toggleDropdown}
        className={`relative w-full bg-white dark:bg-gray-800 border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm ${
          disabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            : ""
        } ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            role="listbox"
          >
            <ul className="py-1">
              {options.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  className={`
                    cursor-pointer select-none relative py-2 pl-3 pr-9
                    ${
                      value === option.value
                        ? "bg-primary bg-opacity-10 text-primary"
                        : "text-gray-900 dark:text-gray-200"
                    }
                    ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelect(option);
                    }
                  }}
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      <span
                        className={`block truncate ${
                          value === option.value ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {value === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            className="h-5 w-5 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
