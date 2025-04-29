"use client";

import React, { useState } from "react";
import NewsFeed from "./NewsFeed";
import { NewsItem } from "@/services/api";
import { NewsModal } from "./NewsModal";

export default function NewsWidget() {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Latest News</h3>
      <NewsFeed onArticleClick={handleArticleClick} />
      <NewsModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={handleCloseModal}
      />
    </div>
  );
}
