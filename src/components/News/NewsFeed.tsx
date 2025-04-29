import React, { useState, useRef, useCallback } from "react";
import { NewsCard } from "./NewsCard";
import { useNewsData } from "@/hooks/useNewsData";
import { NewsItem } from "@/services/api";

interface NewsFeedProps {
  onArticleClick: (article: NewsItem) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ onArticleClick }) => {
  const [category, setCategory] = useState("general");
  const { data, isLoading, isFetching } = useNewsData(category);

  // Setup for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.length) {
          // Load more articles if needed
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, data]
  );

  // List of available news categories
  const categories = [
    "general",
    "business",
    "technology",
    "science",
    "health",
    "sports",
    "entertainment",
  ];

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full ${
              category === cat
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            } transition-colors duration-200`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="grid grid-cols-1 gap-4">
        {data?.map((article, index) => {
          if (index === data.length - 1) {
            return (
              <div ref={lastArticleRef} key={index}>
                <NewsCard
                  article={article}
                  onClick={() => onArticleClick(article)}
                />
              </div>
            );
          } else {
            return (
              <NewsCard
                key={index}
                article={article}
                onClick={() => onArticleClick(article)}
              />
            );
          }
        })}
      </div>

      {isLoading && <div className="text-center mt-4">Loading articles...</div>}
    </div>
  );
};

export default NewsFeed;
