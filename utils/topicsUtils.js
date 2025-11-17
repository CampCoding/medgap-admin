import { subjects } from "../data/subjects";

/**
 * Get all topics from a specific subject and unit
 * @param {string} subjectId - The subject code (e.g., "MTH101")
 * @param {string} unitId - The unit name (optional)
 * @returns {Array} Array of topics with additional metadata
 */
export const getTopicsBySubjectAndUnit = (subjectId, unitId = null) => {
  const subject = subjects.find(s => s.code === subjectId);
  if (!subject) return [];
  
  if (unitId) {
    const unit = subject.units.find(u => u.name === unitId);
    return unit ? unit.topics.map(topic => ({
      ...topic,
      unitName: unit.name,
      subjectName: subject.name,
      subjectCode: subject.code
    })) : [];
  }
  
  // If no unit specified, get all topics from all units
  return subject.units.flatMap(unit => 
    unit.topics.map(topic => ({
      ...topic,
      unitName: unit.name,
      subjectName: subject.name,
      subjectCode: subject.code
    }))
  );
};

/**
 * Get all topics from all subjects
 * @returns {Array} Array of all topics with metadata
 */
export const getAllTopics = () => {
  return subjects.flatMap(subject => 
    subject.units.flatMap(unit => 
      unit.topics.map(topic => ({
        ...topic,
        unitName: unit.name,
        subjectName: subject.name,
        subjectCode: subject.code
      }))
    )
  );
};

/**
 * Search topics by name, unit, or subject
 * @param {Array} topics - Array of topics to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered topics
 */
export const searchTopics = (topics, searchTerm) => {
  if (!searchTerm.trim()) return topics;

  const term = searchTerm.toLowerCase();
  return topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(term) ||
      (topic.unitName && topic.unitName.toLowerCase().includes(term)) ||
      (topic.subjectName && topic.subjectName.toLowerCase().includes(term)) ||
      (topic.subjectCode && topic.subjectCode.toLowerCase().includes(term))
  );
};

/**
 * Filter topics by various criteria
 * @param {Array} topics - Array of topics to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered topics
 */
export const filterTopics = (topics, filters) => {
  return topics.filter((topic) => {
    // Date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const topicDate = new Date(topic.lastUpdated);
      const now = new Date();
      const daysDiff = Math.floor(
        (now - topicDate) / (1000 * 60 * 60 * 24)
      );

      switch (filters.dateRange) {
        case "today":
          if (daysDiff !== 0) return false;
          break;
        case "week":
          if (daysDiff > 7) return false;
          break;
        case "month":
          if (daysDiff > 30) return false;
          break;
        case "year":
          if (daysDiff > 365) return false;
          break;
      }
    }

    // Question range filter
    if (filters.questionRange && filters.questionRange !== "all") {
      const questions = topic.questions;
      switch (filters.questionRange) {
        case "0-10":
          if (questions > 10) return false;
          break;
        case "11-20":
          if (questions < 11 || questions > 20) return false;
          break;
        case "21-30":
          if (questions < 21 || questions > 30) return false;
          break;
        case "30+":
          if (questions < 31) return false;
          break;
      }
    }

    // Digital library range filter
    if (filters.digitalLibraryRange && filters.digitalLibraryRange !== "all") {
      const digitalLibrary = topic.digital_library;
      switch (filters.digitalLibraryRange) {
        case "0-10":
          if (digitalLibrary > 10) return false;
          break;
        case "11-20":
          if (digitalLibrary < 11 || digitalLibrary > 20) return false;
          break;
        case "21-30":
          if (digitalLibrary < 21 || digitalLibrary > 30) return false;
          break;
        case "30+":
          if (digitalLibrary < 31) return false;
          break;
      }
    }

    // Flashcard range filter
    if (filters.flashcardRange && filters.flashcardRange !== "all") {
      const flashcards = topic.flashcards || 0;
      switch (filters.flashcardRange) {
        case "0-10":
          if (flashcards > 10) return false;
          break;
        case "11-20":
          if (flashcards < 11 || flashcards > 20) return false;
          break;
        case "21-30":
          if (flashcards < 21 || flashcards > 30) return false;
          break;
        case "30+":
          if (flashcards < 31) return false;
          break;
      }
    }

    return true;
  });
};

/**
 * Sort topics by various criteria
 * @param {Array} topics - Array of topics to sort
 * @param {string} sortBy - Sort criteria
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Sorted topics
 */
export const sortTopics = (topics, sortBy, sortOrder) => {
  return [...topics].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "questions":
        aValue = a.questions;
        bValue = b.questions;
        break;
      case "digital_library":
        aValue = a.digital_library;
        bValue = b.digital_library;
        break;
      case "flashcards":
        aValue = a.flashcards || 0;
        bValue = b.flashcards || 0;
        break;
      case "lastUpdated":
        aValue = new Date(a.lastUpdated);
        bValue = new Date(b.lastUpdated);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Get filtered and sorted topics
 * @param {Array} topics - Array of topics
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered and sorted topics
 */
export const getFilteredTopics = (topics, searchTerm, filters) => {
  let filtered = searchTopics(topics, searchTerm);
  filtered = filterTopics(filtered, filters);
  filtered = sortTopics(filtered, filters.sortBy, filters.sortOrder);
  return filtered;
};

/**
 * Check if there are any active filters
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Filter criteria
 * @returns {boolean} True if there are active filters
 */
export const hasActiveFilters = (searchTerm, filters) => {
  return (
    searchTerm ||
    (filters.dateRange && filters.dateRange !== "all") ||
    (filters.questionRange && filters.questionRange !== "all") ||
    (filters.digitalLibraryRange && filters.digitalLibraryRange !== "all") ||
    (filters.flashcardRange && filters.flashcardRange !== "all")
  );
};

/**
 * Get default filter state
 * @returns {Object} Default filter state
 */
export const getDefaultFilters = () => ({
  dateRange: "all",
  questionRange: "all",
  digitalLibraryRange: "all",
  flashcardRange: "all",
  sortBy: "name",
  sortOrder: "asc",
});

/**
 * Determine if a topic is active based on content availability and recent updates
 * @param {Object} topic - Topic object
 * @returns {boolean} True if topic is active
 */
export const isTopicActive = (topic) => {
  if (!topic) return false;

  const questionsCount = topic?.questions ?? (Array.isArray(topic?.questions) ? topic.questions.length : 0);
  const flashcardsCount = topic?.flashcards ?? (Array.isArray(topic?.flashcards) ? topic.flashcards.length : 0);
  const digitalLibraryCount = topic?.digital_library ?? (Array.isArray(topic?.digital_library) ? topic.digital_library.length : 0);
  
  const hasContent = questionsCount > 0 || flashcardsCount > 0 || digitalLibraryCount > 0;
  
  if (!hasContent) return false;
  
  // Check if last updated is within 30 days
  if (topic?.lastUpdated) {
    const lastUpdated = new Date(topic.lastUpdated);
    const now = new Date();
    const daysDiff = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30;
  }
  
  // If no lastUpdated date, consider active if it has content
  return hasContent;
};