// components/SkipLink.jsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      Skip to main content
    </a>
  );
}

// Then in your layout:
<>
  <SkipLink />
  <header>...</header>
  <main id="main-content">{/* Page content */}</main>
</>;
