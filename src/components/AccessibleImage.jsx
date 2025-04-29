// components/AccessibleImage.jsx
import { useState } from "react";

export function AccessibleImage({
  src,
  alt,
  className = "",
  loading = "lazy", // Enable lazy loading by default
  fallback = "/images/placeholder.png", // Fallback image
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  if (process.env.NODE_ENV === "development" && !alt) {
    console.warn("AccessibleImage: Missing alt text for image:", src);
  }

  return (
    <img
      src={imgError ? fallback : src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setImgError(true)}
      {...props}
    />
  );
}
