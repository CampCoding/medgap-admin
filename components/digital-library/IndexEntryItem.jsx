"use client";
import React, { useState } from "react";
import { Input, Select, Button } from "antd";
import { Edit, Trash2, Save, X } from "lucide-react";

const { Option } = Select;

const IndexEntryItem = ({ entry, onPageClick, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: entry.title,
    page: entry.page,
    level: entry.level,
  });

  const handleSave = () => {
    onEdit(entry.id, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({ title: entry.title, page: entry.page, level: entry.level });
    setIsEditing(false);
  };

  return (
    <div
      className="group flex items-start gap-2 p-2 rounded transition-colors mb-1 hover:bg-gray-50"
      style={{ marginLeft: `${entry.level * 8}px` }}
    >
      {isEditing ? (
        <div className="flex-1 space-y-2">
          <Input
            value={editValues.title}
            onChange={(e) =>
              setEditValues({ ...editValues, title: e.target.value })
            }
            size="small"
            placeholder="Index title"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              value={editValues.page}
              onChange={(e) =>
                setEditValues({ ...editValues, page: e.target.value })
              }
              className="w-16"
              size="small"
            />
            <Select
              value={editValues.level}
              onChange={(value) =>
                setEditValues({ ...editValues, level: value })
              }
              className="w-20"
              size="large"
            >
              <Option value={0}>L1</Option>
              <Option value={1}>L2</Option>
              <Option value={2}>L3</Option>
            </Select>
            <Button
              type="primary"
              icon={<Save className="w-3 h-3" />}
              onClick={handleSave}
              size="small"
            />
            <Button
              type="default"
              icon={<X className="w-3 h-3" />}
              onClick={handleCancel}
              size="small"
            />
          </div>
        </div>
      ) : (
        <>
          <span
            className="text-xs text-gray-400 mt-1 min-w-[16px] cursor-pointer hover:text-blue-600"
            onClick={() => onPageClick(entry.page)}
          >
            {entry.page}
          </span>
          <span
            className={`text-xs flex-1 cursor-pointer ${
              entry.type === "custom" ? "font-medium" : ""
            }`}
            title={entry.title}
            onClick={() => onPageClick(entry.page)}
          >
            {entry.title}
          </span>
          <div className="flex gap-1">
            <Button
              type="text"
              icon={<Edit className="w-3 h-3" />}
              onClick={() => setIsEditing(true)}
              size="small"
              className="opacity-0 group-hover:opacity-100"
            />
            <Button
              type="text"
              icon={<Trash2 className="w-3 h-3" />}
              onClick={() => onDelete(entry.id)}
              size="small"
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IndexEntryItem;
