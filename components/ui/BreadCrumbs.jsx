"use client";

import React from "react";
import {
  Home,
  ChevronRight,
  Book,
  FileText,
  Settings,
  User,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const BreadcrumbsShowcase = ({
  items,
  variant = "default",
  className = "",
}) => {
  const BreadcrumbItem = ({ item, isLast, variant = "default" }) => {
    const IconComponent = item.icon;

    const getItemStyles = () => {
      switch (variant) {
        case "modern":
          return {
            link: `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md ${
              item.current ? "text-white shadow-lg" : "hover:scale-105"
            }`,
            linkStyle: item.current
              ? { backgroundColor: "#0F7490" }
              : { color: "#202938" },
            hoverStyle: !item.current
              ? {
                  backgroundColor: "rgba(15, 116, 144, 0.05)",
                  color: "#0F7490",
                }
              : {},
          };
        case "pill":
          return {
            link: `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              item.current
                ? "text-white shadow-lg transform scale-105 !bg-[#075260]"
                : "hover:scale-105 border border-opacity-20"
            }`,
            linkStyle: item.current
              ? { backgroundColor: "#8B5CF6" }
              : { color: "#202938", borderColor: "#202938" },
            hoverStyle: !item.current
              ? {
                  backgroundColor: "rgba(139, 92, 246, 0.05)",
                  color: "#075260",
                  borderColor: "#075260",
                }
              : {},
          };
        case "minimal":
          return {
            link: `inline-flex items-center text-sm font-medium transition-all duration-200 pb-1 border-b-2 border-transparent ${
              item.current ? "" : "hover:border-opacity-50"
            }`,
            linkStyle: item.current
              ? { color: "#C9AE6C", borderBottomColor: "#C9AE6C" }
              : { color: "#202938" },
            hoverStyle: !item.current
              ? {
                  color: "#0F7490",
                  borderBottomColor: "#0F7490",
                }
              : {},
          };
        default:
          return {
            link: `inline-flex items-center text-sm font-medium transition-colors duration-200 ${
              item.current ? "" : "hover:underline"
            }`,
            linkStyle: item.current
              ? { color: "#0F7490" }
              : { color: "#6B7280" },
            hoverStyle: !item.current ? { color: "#0F7490" } : {},
          };
      }
    };
    const styles = getItemStyles();

    return (
      <li className="flex items-center">
        <Link
          href={item?.href || "#"}
          className={styles.link}
          style={styles.linkStyle}
          onMouseEnter={(e) => {
            if (!item.current && styles.hoverStyle) {
              Object.assign(e.target.style, styles.hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!item.current) {
              Object.assign(e.target.style, styles.linkStyle);
            }
          }}
        >
          {IconComponent && (
            <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">{item.label}</span>
        </Link>

        {!isLast && (
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
        )}
      </li>
    );
  };

  const Breadcrumb = ({ items, variant = "default", className = "" }) => {
    return (
      <nav className={`flex ${className} pb-10`} aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
          {items.map((item, index) => (
            <BreadcrumbItem
              key={index}
              item={item}
              isLast={index === items.length - 1}
              variant={variant}
            />
          ))}
        </ol>
      </nav>
    );
  };

  return <Breadcrumb items={items} variant={variant} className={className} />;
};

export default BreadcrumbsShowcase;
