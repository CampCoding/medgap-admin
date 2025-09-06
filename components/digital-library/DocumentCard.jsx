"use client";
import React, { useState } from "react";
import { Badge } from "antd";
import { FileText, Calendar, Eye, Info } from "lucide-react";
import DocumentDetailsModal from "./DocumentDetailsModal";

const DocumentCard = ({ doc, isSelected, onSelect }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  return (
    <div
      onClick={() => onSelect(doc.id)}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all mb-3 border ${
        isSelected
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "hover:bg-gray-50 border-transparent hover:shadow-sm"
      }`}
    >
      <div className="flex-shrink-0">
        <img
          src={doc.thumbnail}
          alt={doc.title}
          className="w-16 h-20 object-cover rounded-md shadow-sm"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzMkg0NlYzNEgyOFYzMlpNMjggMzhINDJWNDBIMjhWMzhaTTI4IDQ0SDQ2VjQ2SDI4VjQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
          {doc.title}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {doc.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              color={doc.statusColor}
              text={doc.status}
              className="text-xs"
            />
            
            {/* Review Status Badge */}
            {doc.reviewed?.status && (
              <Badge
                color={
                  doc.reviewed.status === "accepted" 
                    ? "green" 
                    : doc.reviewed.status === "rejected" 
                    ? "red" 
                    : "orange"
                }
                text={
                  doc.reviewed.status === "accepted" 
                    ? "Approved" 
                    : doc.reviewed.status === "rejected" 
                    ? "Rejected" 
                    : "Pending"
                }
                className="text-xs"
              />
            )}
          </div>
          
          {/* Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailsModal(true);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {doc.pages} pages
          </div>
          <div>{doc.size}</div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(doc.uploadDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {doc.views}
          </div>
        </div>
      </div>
      
      {/* Details Modal */}
      <DocumentDetailsModal
        doc={doc}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default DocumentCard;
