import React from "react";
import { NewsItem } from "@/services/api";

interface NewsModalProps {
  article: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>

          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>{article.source.name}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>

          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 object-cover mb-4 rounded"
            />
          )}

          <p className="text-gray-800 mb-6">
            {article.content?.split("[+")[0] || article.description}
          </p>

          <div className="flex justify-between">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Read full article
            </a>

            <button
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
