import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "focus-trap-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOutsideClick = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Size classes mapping
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      closeOnOutsideClick &&
      modalRef.current &&
      e.target === e.currentTarget
    ) {
      onClose();
    }
  };

  // Create Portal for modal
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleOutsideClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <FocusTrap>
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${sizeClasses[size]} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-800 dark:text-white"
                >
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
                  {footer}
                </div>
              )}
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default Modal;
