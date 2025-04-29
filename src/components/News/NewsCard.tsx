import React from "react";
import { NewsItem } from "@/services/api";

interface NewsCardProps {
  article: NewsItem;
  onClick: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {article.urlToImage ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {article.description || "No description available"}
        </p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{article.source.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
