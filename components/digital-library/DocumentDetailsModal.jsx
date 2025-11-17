"use client";
import React from "react";
import { Modal, Badge, Divider } from "antd";
import { 
  FileText, 
  Calendar, 
  Eye, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Download,
  Share2,
  BookOpen
} from "lucide-react";

const DocumentDetailsModal = ({ 
  doc, 
  isOpen, 
  onClose 
}) => {
  if (!doc) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold">Document Details</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="document-details-modal"
    >
      <div className="space-y-6">
        {/* Document Header */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={doc.thumbnail}
              alt={doc.title}
              className="w-24 h-32 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgOTYgMTI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MiA0OEg2OVY1MEg0MlY0OFpNNDIgNTZINjZWNTgINDBWNTZaTTQyIDY0SDY5VjY2SDQyVjY0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {doc.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {doc.description}
            </p>
            
            {/* Status Badges */}
            <div className="flex items-center gap-2 mb-4">
              <Badge
                color={doc.statusColor}
                text={doc.status}
                className="text-sm"
              />
              
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
                      : "Pending Review"
                  }
                  className="text-sm"
                />
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* Document Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Document Info</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Pages:</span>
              <span>{doc.pages}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Size:</span>
              <span>{doc.size}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Uploaded:</span>
              <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Views:</span>
              <span>{doc.views}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">File Details</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Filename:</span>
              <span className="truncate">{doc.fileName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Sections:</span>
              <span>{doc.sections}</span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Creator Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-3">Creator Information</h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="font-medium">Created by:</span>
            <span>{doc.createdBy || "Unknown"}</span>
          </div>
        </div>

        {/* Review Information */}
        {doc.reviewed && (
          <>
            <Divider />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">Review Information</h3>
              
              {doc.reviewed.reviewedBy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {doc.reviewed.status === "accepted" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : doc.reviewed.status === "rejected" ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="font-medium">Reviewed by:</span>
                  <span>{doc.reviewed.reviewedBy}</span>
                </div>
              )}
              
              {doc.reviewed.reviewedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Review Date:</span>
                  <span>{new Date(doc.reviewed.reviewedAt).toLocaleDateString()}</span>
                </div>
              )}
              
              {doc.reviewed.comment && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Review Comment:</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-200">
                    <p className="text-sm text-gray-700 italic">
                      "{doc.reviewed.comment}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <Divider />
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              if (doc.pdfUrl) {
                window.open(doc.pdfUrl, "_blank");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button
            onClick={() => {
              // Add share functionality here
              navigator.clipboard.writeText(window.location.href);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentDetailsModal;
