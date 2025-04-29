import React, { useState, useRef, useCallback } from "react";
import { NewsCard } from "./NewsCard";
import { NewsModal } from "./NewsModal";
import { useGetNewsQuery, NewsItem } from "@/services/api";

const NewsFeed = () => {
  const [category, setCategory] = useState("general");
  const [page, setPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const { data, isLoading, isFetching } = useGetNewsQuery({
    category,
    page,
  });

  // Setup for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.articles.length) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, data?.articles.length]
  );

  // Category options
  const categories = [
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded ${
              category === cat ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.articles.map((article, index) => {
          if (index === data.articles.length - 1) {
            return (
              <div ref={lastArticleRef} key={index}>
                <NewsCard
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              </div>
            );
          } else {
            return (
              <NewsCard
                key={index}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            );
          }
        })}
      </div>

      {isLoading && <div className="text-center mt-4">Loading articles...</div>}

      {/* Article detail modal */}
      <NewsModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};

export default NewsFeed;
