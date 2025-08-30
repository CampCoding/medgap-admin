"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Users,
  FileText,
  HelpCircle,
  Calendar,
  Check,
  X,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Clock,
  UserPlus,
  BookOpen,
  AlertTriangle,
  Star,
  Archive,
  Trash2,
  Eye,
  CheckCheck,
  Pill,
  BarChart3,
  Download,
  Volume2,
  VolumeX,
  Pin,
  PinOff,
  Reply,
  Forward,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  SortAsc,
  SortDesc,
  Calendar as CalendarIcon,
  Share2,
  MessageSquare,
  ExternalLink,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";

const NotificationsPageClient = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [pinnedNotifications, setPinnedNotifications] = useState([]);
  const [bookmarkedNotifications, setBookmarkedNotifications] = useState([]);
  const [archivedNotifications, setArchivedNotifications] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [exportFormat, setExportFormat] = useState("json");

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: darkMode ? "#1F2937" : "#F9FAFC",
    text: darkMode ? "#F3F4F6" : "#202938",
    cardBg: darkMode ? "#374151" : "#FFFFFF",
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "student",
      title: "New Student Enrolled",
      message: "Ahmed Youssef joined your 'Cardiology' class.",
      time: "2 hours ago",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      priority: "medium",
      category: "enrollment",
      avatar: "AY",
      actionable: true,
      source: "Student Management System",
    },
    {
      id: 2,
      type: "exam",
      title: "Upcoming Exam",
      message: "Neurology midterm exam is scheduled for August 10.",
      time: "1 day ago",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
      priority: "high",
      category: "exam",
      avatar: null,
      actionable: true,
      source: "Exam Scheduler",
      dueDate: "August 10, 2025",
    },
    {
      id: 3,
      type: "question",
      title: "Question Submitted for Review",
      message: "1 new question added by the system needs your validation.",
      time: "3 days ago",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
      priority: "medium",
      category: "review",
      avatar: null,
      actionable: true,
      source: "Question Bank",
    },
    {
      id: 4,
      type: "workshop",
      title: "Teacher Workshop",
      message: "You're invited to a training workshop on adaptive testing.",
      time: "1 week ago",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isRead: true,
      priority: "low",
      category: "training",
      avatar: null,
      actionable: true,
      source: "Training Department",
    },
    {
      id: 5,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 2:00 AM to 4:00 AM.",
      time: "5 hours ago",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      priority: "high",
      category: "system",
      avatar: null,
      actionable: false,
      source: "System Administration",
    },
    {
      id: 6,
      type: "grade",
      title: "Grading Complete",
      message: "Physics Quiz has been automatically graded for 28 students.",
      time: "3 days ago",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
      priority: "medium",
      category: "grading",
      avatar: null,
      actionable: true,
      source: "Grading System",
    },
  ]);

  // Auto-refresh notifications
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
        // Simulate new notifications occasionally
        if (Math.random() > 0.8) {
          playNotificationSound();
        }
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const categories = [
    { value: "all", label: "All Notifications", count: notifications.filter(n => !archivedNotifications.includes(n.id)).length },
    {
      value: "enrollment",
      label: "Student Enrollment",
      count: notifications.filter((n) => n.category === "enrollment" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "exam",
      label: "Exams & Tests",
      count: notifications.filter((n) => n.category === "exam" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "review",
      label: "Reviews",
      count: notifications.filter((n) => n.category === "review" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "training",
      label: "Training",
      count: notifications.filter((n) => n.category === "training" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "system",
      label: "System",
      count: notifications.filter((n) => n.category === "system" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "grading",
      label: "Grading",
      count: notifications.filter((n) => n.category === "grading" && !archivedNotifications.includes(n.id)).length,
    },
    {
      value: "archived",
      label: "Archived",
      count: archivedNotifications.length,
    },
    {
      value: "pinned",
      label: "Pinned",
      count: pinnedNotifications.length,
    },
    {
      value: "bookmarked",
      label: "Bookmarked",
      count: bookmarkedNotifications.length,
    },
  ];

  const playNotificationSound = () => {
    if (soundEnabled && 'AudioContext' in window) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case "student":
        return <UserPlus {...iconProps} />;
      case "exam":
        return <FileText {...iconProps} />;
      case "question":
        return <HelpCircle {...iconProps} />;
      case "workshop":
        return <Calendar {...iconProps} />;
      case "system":
        return <Settings {...iconProps} />;
      case "grade":
        return <BookOpen {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "student":
        return colors.primary;
      case "exam":
        return colors.secondary;
      case "question":
        return colors.accent;
      case "workshop":
        return "#10B981";
      case "system":
        return "#6B7280";
      case "grade":
        return "#F59E0B";
      default:
        return colors.primary;
    }
  };

  const getPriorityColor = (priority) => {
    const baseClasses = darkMode ? "border-opacity-50" : "";
    switch (priority) {
      case "high":
        return `bg-red-100 text-red-600 border-red-200 ${baseClasses}`;
      case "medium":
        return `bg-yellow-100 text-yellow-600 border-yellow-200 ${baseClasses}`;
      case "low":
        return `bg-green-100 text-green-600 border-green-200 ${baseClasses}`;
      default:
        return `bg-gray-100 text-gray-600 border-gray-200 ${baseClasses}`;
    }
  };

  const sortedNotifications = useMemo(() => {
    let sorted = [...notifications];
    
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "oldest":
        sorted.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "unread":
        sorted.sort((a, b) => a.isRead - b.isRead);
        break;
      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }
    
    return sorted;
  }, [notifications, sortBy]);

  const filteredNotifications = useMemo(() => {
    return sortedNotifications.filter((notification) => {
      // Archive filter
      if (selectedCategory === "archived") {
        return archivedNotifications.includes(notification.id);
      } else if (selectedCategory === "pinned") {
        return pinnedNotifications.includes(notification.id);
      } else if (selectedCategory === "bookmarked") {
        return bookmarkedNotifications.includes(notification.id);
      } else if (archivedNotifications.includes(notification.id)) {
        return false;
      }

      const matchesSearch =
        notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.source.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "all" || notification.category === selectedCategory;
      
      const matchesReadStatus = !showUnreadOnly || !notification.isRead;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const notifDate = new Date(notification.timestamp);
        switch (dateFilter) {
          case "today":
            matchesDate = notifDate.toDateString() === now.toDateString();
            break;
          case "week":
            matchesDate = (now - notifDate) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case "month":
            matchesDate = (now - notifDate) <= 30 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      // Priority filter
      const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
      
      return matchesSearch && matchesCategory && matchesReadStatus && matchesDate && matchesPriority;
    });
  }, [sortedNotifications, searchText, selectedCategory, showUnreadOnly, archivedNotifications, pinnedNotifications, bookmarkedNotifications, dateFilter, priorityFilter]);

  const unreadCount = notifications.filter((n) => !n.isRead && !archivedNotifications.includes(n.id)).length;
  const pinnedCount = pinnedNotifications.length;
  const bookmarkedCount = bookmarkedNotifications.length;

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length
        ? []
        : filteredNotifications.map((n) => n.id)
    );
  };

  const markAsRead = (ids) => {
    setNotifications(prev =>
      prev.map(n => ids.includes(n.id) ? { ...n, isRead: true } : n)
    );
    setSelectedNotifications([]);
  };

  const markAsUnread = (ids) => {
    setNotifications(prev =>
      prev.map(n => ids.includes(n.id) ? { ...n, isRead: false } : n)
    );
    setSelectedNotifications([]);
  };

  const deleteNotifications = (ids) => {
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    setSelectedNotifications([]);
    setPinnedNotifications(prev => prev.filter(id => !ids.includes(id)));
    setBookmarkedNotifications(prev => prev.filter(id => !ids.includes(id)));
    setArchivedNotifications(prev => prev.filter(id => !ids.includes(id)));
  };

  const togglePin = (id) => {
    setPinnedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id) => {
    setBookmarkedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const toggleArchive = (id) => {
    setArchivedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const exportNotifications = () => {
    const dataToExport = filteredNotifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      category: n.category,
      priority: n.priority,
      timestamp: n.timestamp.toISOString(),
      isRead: n.isRead,
      source: n.source
    }));

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (exportFormat === "csv") {
      const headers = "ID,Title,Message,Category,Priority,Timestamp,Read,Source\n";
      const csv = dataToExport.map(n => 
        `${n.id},"${n.title}","${n.message}",${n.category},${n.priority},${n.timestamp},${n.isRead},"${n.source}"`
      ).join('\n');
      const blob = new Blob([headers + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const bulkActions = [
    { label: "Mark as Read", action: () => markAsRead(selectedNotifications), icon: CheckCheck },
    { label: "Mark as Unread", action: () => markAsUnread(selectedNotifications), icon: Eye },
    { label: "Archive", action: () => selectedNotifications.forEach(toggleArchive), icon: Archive },
    { label: "Bookmark", action: () => selectedNotifications.forEach(toggleBookmark), icon: Bookmark },
    { label: "Delete", action: () => deleteNotifications(selectedNotifications), icon: Trash2, danger: true },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      current: true,
    },
  ];

  return (
    <div
      className="min-h-screen p-6 transition-all duration-300"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="p-3 rounded-xl relative"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Bell className="w-8 h-8" style={{ color: colors.primary }} />
                {unreadCount > 0 && (
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
                  Notifications
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <p>Stay updated with your teaching activities</p>
                  <span className="text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
        

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  soundEnabled ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-300 text-gray-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Auto Refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  autoRefresh 
                    ? `text-white` 
                    : 'border-2 hover:scale-105'
                }`}
                style={{
                  backgroundColor: autoRefresh ? colors.primary : 'transparent',
                  borderColor: colors.primary,
                  color: autoRefresh ? 'white' : colors.primary,
                }}
              >
                <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showUnreadOnly
                    ? "text-white shadow-lg"
                    : "border-2 hover:scale-105"
                }`}
                style={{
                  backgroundColor: showUnreadOnly ? colors.primary : "transparent",
                  borderColor: showUnreadOnly ? colors.primary : colors.primary,
                  color: showUnreadOnly ? "white" : colors.primary,
                }}
              >
                {showUnreadOnly ? "Show All" : "Unread Only"}
              </button>

              <button
                className="p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105"
                style={{ borderColor: colors.secondary, color: colors.secondary }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6" style={{ backgroundColor: colors.cardBg }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                  style={{ backgroundColor: colors.cardBg, color: colors.text }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority</option>
                  <option value="unread">Unread First</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                  style={{ backgroundColor: colors.cardBg, color: colors.text }}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                  style={{ backgroundColor: colors.cardBg, color: colors.text }}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Export Format</label>
                <div className="flex space-x-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                    style={{ backgroundColor: colors.cardBg, color: colors.text }}
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </select>
                  <button
                    onClick={exportNotifications}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1 sticky top-0">
            <div className="rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6" style={{ backgroundColor: colors.cardBg }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Categories</h3>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 text-left ${
                      selectedCategory === category.value
                        ? "shadow-md transform scale-[1.02]"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === category.value
                          ? `${colors.primary}15`
                          : "transparent",
                      color:
                        selectedCategory === category.value
                          ? colors.primary
                          : colors.text,
                    }}
                  >
                    <span className="font-medium">{category.label}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        selectedCategory === category.value
                          ? "text-white"
                          : "text-gray-500 bg-gray-100"
                      }`}
                      style={{
                        backgroundColor:
                          selectedCategory === category.value
                            ? colors.primary
                            : undefined,
                      }}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Enhanced Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Total</span>
                    <span className="font-bold text-blue-800">{notifications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Unread</span>
                    <span className="font-bold text-blue-800">{unreadCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">High Priority</span>
                    <span className="font-bold text-blue-800">
                      {notifications.filter((n) => n.priority === "high").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Pinned</span>
                    <span className="font-bold text-blue-800">{pinnedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Bookmarked</span>
                    <span className="font-bold text-blue-800">{bookmarkedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Archived</span>
                    <span className="font-bold text-blue-800">{archivedNotifications.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Actions */}
            <div className="rounded-2xl p-6 shadow-lg border border-gray-100 mb-6" style={{ backgroundColor: colors.cardBg }}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications, source, or content..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none transition-all duration-300"
                    style={{ 
                      backgroundColor: colors.cardBg, 
                      color: colors.text,
                      focusBorderColor: colors.primary 
                    }}
                    onFocus={(e) => (e.target.style.borderColor = colors.primary)}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Bulk Actions */}
                {selectedNotifications.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm" style={{ color: colors.text }}>
                      {selectedNotifications.length} selected
                    </span>
                    {bulkActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          action.danger 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'text-white'
                        }`}
                        style={{
                          backgroundColor: action.danger ? undefined : colors.primary
                        }}
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {/* Select All */}
              {filteredNotifications.length > 0 && (
                <div className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ backgroundColor: colors.cardBg }}>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ accentColor: colors.primary }}
                    />
                    <span className="text-sm font-medium" style={{ color: colors.text }}>
                      Select all notifications ({filteredNotifications.length})
                    </span>
                  </label>
                </div>
              )}

              {/* Pinned Notifications First */}
              {selectedCategory === "all" && pinnedNotifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colors.text }}>
                    <Pin className="w-5 h-5 mr-2" />
                    Pinned Notifications
                  </h3>
                  <div className="space-y-3">
                    {filteredNotifications
                      .filter(n => pinnedNotifications.includes(n.id))
                      .map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          colors={colors}
                          selectedNotifications={selectedNotifications}
                          handleSelectNotification={handleSelectNotification}
                          getNotificationIcon={getNotificationIcon}
                          getNotificationColor={getNotificationColor}
                          getPriorityColor={getPriorityColor}
                          markAsRead={markAsRead}
                          deleteNotifications={deleteNotifications}
                          togglePin={togglePin}
                          toggleBookmark={toggleBookmark}
                          toggleArchive={toggleArchive}
                          pinnedNotifications={pinnedNotifications}
                          bookmarkedNotifications={bookmarkedNotifications}
                          archivedNotifications={archivedNotifications}
                          isPinned={true}
                        />
                      ))}
                  </div>
                  <div className="border-b border-gray-200 my-6"></div>
                </div>
              )}

              {/* Regular Notifications */}
              {filteredNotifications
                .filter(n => selectedCategory === "all" ? !pinnedNotifications.includes(n.id) : true)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    colors={colors}
                    selectedNotifications={selectedNotifications}
                    handleSelectNotification={handleSelectNotification}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationColor={getNotificationColor}
                    getPriorityColor={getPriorityColor}
                    markAsRead={markAsRead}
                    deleteNotifications={deleteNotifications}
                    togglePin={togglePin}
                    toggleBookmark={toggleBookmark}
                    toggleArchive={toggleArchive}
                    pinnedNotifications={pinnedNotifications}
                    bookmarkedNotifications={bookmarkedNotifications}
                    archivedNotifications={archivedNotifications}
                  />
                ))}

              {/* Empty State */}
              {filteredNotifications.length === 0 && (
                <div className="rounded-2xl p-12 shadow-lg border border-gray-100 text-center" style={{ backgroundColor: colors.cardBg }}>
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                    No notifications found
                  </h3>
                  <p className="text-gray-500">
                    {searchText || selectedCategory !== "all" || showUnreadOnly
                      ? "Try adjusting your search or filter criteria"
                      : "You're all caught up! No new notifications."}
                  </p>
                  {(searchText || selectedCategory !== "all" || showUnreadOnly) && (
                    <button
                      onClick={() => {
                        setSearchText("");
                        setSelectedCategory("all");
                        setShowUnreadOnly(false);
                        setDateFilter("all");
                        setPriorityFilter("all");
                      }}
                      className="mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colors.primary,
                        color: "white"
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredNotifications.length > 0 && filteredNotifications.length >= 10 && (
              <div className="mt-8 text-center">
                <button
                  className="px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  Load More Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate NotificationCard component for better organization
const NotificationCard = ({
  notification,
  colors,
  selectedNotifications,
  handleSelectNotification,
  getNotificationIcon,
  getNotificationColor,
  getPriorityColor,
  markAsRead,
  deleteNotifications,
  togglePin,
  toggleBookmark,
  toggleArchive,
  pinnedNotifications,
  bookmarkedNotifications,
  archivedNotifications,
  isPinned = false
}) => {
  const [showActions, setShowActions] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
        notification.isRead ? "border-gray-100" : "border-l-4 shadow-md"
      } ${isPinned ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''}`}
      style={{
        backgroundColor: isPinned ? `${colors.secondary}08` : colors.cardBg,
        borderLeftColor: !notification.isRead ? getNotificationColor(notification.type) : undefined,
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selectedNotifications.includes(notification.id)}
          onChange={() => handleSelectNotification(notification.id)}
          className="mt-1 w-4 h-4 rounded focus:ring-2"
          style={{ accentColor: colors.primary }}
        />

        {/* Icon/Avatar */}
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                backgroundColor: getNotificationColor(notification.type),
              }}
            >
              {notification.avatar}
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${getNotificationColor(notification.type)}20`,
                color: getNotificationColor(notification.type),
              }}
            >
              {getNotificationIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3
                  className={`text-lg font-semibold ${
                    notification.isRead ? "text-gray-700" : ""
                  }`}
                  style={{
                    color: notification.isRead ? undefined : colors.text,
                  }}
                >
                  {notification.title}
                </h3>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    notification.priority
                  )}`}
                >
                  {notification.priority}
                </span>

                {!notification.isRead && (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}

                {pinnedNotifications.includes(notification.id) && (
                  <Pin className="w-4 h-4 text-yellow-500" />
                )}

                {bookmarkedNotifications.includes(notification.id) && (
                  <BookmarkCheck className="w-4 h-4 text-blue-500" />
                )}

                {archivedNotifications.includes(notification.id) && (
                  <Archive className="w-4 h-4 text-gray-500" />
                )}
              </div>

              <p className={`mb-3 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`} style={{ color: colors.text }}>
                {notification.message}
                {notification.message.length > 100 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-2 text-blue-500 hover:underline text-sm"
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>

              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{notification.time}</span>
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${getNotificationColor(notification.type)}15`,
                    color: getNotificationColor(notification.type),
                  }}
                >
                  {notification.category}
                </span>
                <span className="text-xs text-gray-400">
                  from {notification.source}
                </span>
                {notification.dueDate && (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs">Due: {notification.dueDate}</span>
                  </div>
                )}
                {notification.actionable && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    Action Required
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center space-x-2 ml-4 transition-opacity duration-300 ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead([notification.id])}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                  }}
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => togglePin(notification.id)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  pinnedNotifications.includes(notification.id)
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-50 text-gray-500'
                }`}
                title={pinnedNotifications.includes(notification.id) ? "Unpin" : "Pin"}
              >
                {pinnedNotifications.includes(notification.id) ? 
                  <PinOff className="w-4 h-4" /> : 
                  <Pin className="w-4 h-4" />
                }
              </button>

              <button
                onClick={() => toggleBookmark(notification.id)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  bookmarkedNotifications.includes(notification.id)
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-50 text-gray-500'
                }`}
                title={bookmarkedNotifications.includes(notification.id) ? "Remove bookmark" : "Bookmark"}
              >
                {bookmarkedNotifications.includes(notification.id) ? 
                  <BookmarkCheck className="w-4 h-4" /> : 
                  <Bookmark className="w-4 h-4" />
                }
              </button>

              <button
                onClick={() => toggleArchive(notification.id)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 bg-gray-50 text-gray-500 hover:bg-gray-100"
                title={archivedNotifications.includes(notification.id) ? "Unarchive" : "Archive"}
              >
                <Archive className="w-4 h-4" />
              </button>

              {notification.actionable && (
                <button
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: `${colors.secondary}15`,
                    color: colors.secondary,
                  }}
                  title="Take action"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
                title="Reply"
              >
                <Reply className="w-4 h-4" />
              </button>

              <button
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: `${colors.secondary}15`,
                  color: colors.secondary,
                }}
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteNotifications([notification.id])}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-110"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPageClient;