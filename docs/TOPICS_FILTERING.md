# Topics Filtering System

This document describes the comprehensive filtering system implemented for topics in the MedGap Admin application.

## Overview

The topics filtering system provides powerful search, filter, and sort capabilities for managing learning topics across subjects and units. It follows the same pattern as the existing subjects filtering system for consistency.

## Data Structure

Topics have the following filterable fields:

```javascript
{
  name: "Topic Name",           // String - searchable
  questions: 15,                // Number - filterable by range
  digital_library: 20,          // Number - filterable by range  
  flashcards: 20,               // Number - filterable by range
  lastUpdated: "2024-08-01",    // Date - filterable by time range
  unitName: "Unit Name",        // String - searchable (added by utils)
  subjectName: "Subject Name",  // String - searchable (added by utils)
  subjectCode: "MTH101"         // String - searchable (added by utils)
}
```

## Components

### 1. AdvancedTopicsFilters.jsx

A comprehensive filter component that provides:

- **Date Range Filter**: Today, This Week, This Month, This Year, All Time
- **Question Range Filter**: 0-10, 11-20, 21-30, 30+ questions
- **Digital Library Range Filter**: 0-10, 11-20, 21-30, 30+ items
- **Flashcard Range Filter**: 0-10, 11-20, 21-30, 30+ flashcards
- **Sort Options**: Name, Questions, Digital Library, Flashcards, Last Updated
- **Sort Order**: Ascending, Descending
- **Results Summary**: Shows filtered count vs total count
- **Clear All Filters**: Reset all filters to default state

### 2. TopicsManagementClient.jsx

The main component that orchestrates the filtering system:

- **Search Functionality**: Search by topic name, unit name, subject name, or subject code
- **View Modes**: Table view and Grid view
- **Filter Integration**: Connects search, filters, and sorting
- **Empty State**: Shows helpful message when no results found
- **Responsive Design**: Works on all screen sizes

### 3. topicsUtils.js

Utility functions for data manipulation:

- `getTopicsBySubjectAndUnit(subjectId, unitId)`: Get topics from specific subject/unit
- `getAllTopics()`: Get all topics from all subjects
- `searchTopics(topics, searchTerm)`: Search topics by various fields
- `filterTopics(topics, filters)`: Apply range and date filters
- `sortTopics(topics, sortBy, sortOrder)`: Sort topics by various criteria
- `getFilteredTopics(topics, searchTerm, filters)`: Combined search, filter, and sort
- `hasActiveFilters(searchTerm, filters)`: Check if any filters are active
- `getDefaultFilters()`: Get default filter state

## Usage Examples

### Basic Usage

```javascript
import TopicsManagementClient from '../components/Topics/TopicsManagementClient';

// Show all topics from all subjects
<TopicsManagementClient />

// Show topics from specific subject
<TopicsManagementClient subjectId="MTH101" />

// Show topics from specific subject and unit
<TopicsManagementClient subjectId="MTH101" unitId="Algebra" />
```

### Using Utility Functions

```javascript
import { 
  getTopicsBySubjectAndUnit, 
  searchTopics, 
  filterTopics, 
  sortTopics 
} from '../utils/topicsUtils';

// Get topics from specific subject and unit
const topics = getTopicsBySubjectAndUnit("MTH101", "Algebra");

// Search topics
const searchResults = searchTopics(topics, "equations");

// Filter topics
const filteredTopics = filterTopics(topics, {
  questionRange: "11-20",
  dateRange: "month"
});

// Sort topics
const sortedTopics = sortTopics(topics, "name", "asc");
```

### Custom Filter Implementation

```javascript
import { useState } from 'react';
import { getFilteredTopics, getDefaultFilters } from '../utils/topicsUtils';

function MyTopicsComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(getDefaultFilters());
  
  const topics = getTopicsBySubjectAndUnit("MTH101");
  const filteredTopics = getFilteredTopics(topics, searchTerm, filters);
  
  return (
    <div>
      {/* Your custom UI */}
      {filteredTopics.map(topic => (
        <div key={topic.name}>{topic.name}</div>
      ))}
    </div>
  );
}
```

## Filter Options

### Date Range Filters
- **Today**: Topics updated today
- **This Week**: Topics updated within the last 7 days
- **This Month**: Topics updated within the last 30 days
- **This Year**: Topics updated within the last 365 days
- **All Time**: No date restriction

### Question Range Filters
- **0-10**: Topics with 0-10 questions
- **11-20**: Topics with 11-20 questions
- **21-30**: Topics with 21-30 questions
- **30+**: Topics with 30+ questions

### Digital Library Range Filters
- **0-10**: Topics with 0-10 digital library items
- **11-20**: Topics with 11-20 digital library items
- **21-30**: Topics with 21-30 digital library items
- **30+**: Topics with 30+ digital library items

### Flashcard Range Filters
- **0-10**: Topics with 0-10 flashcards
- **11-20**: Topics with 11-20 flashcards
- **21-30**: Topics with 21-30 flashcards
- **30+**: Topics with 30+ flashcards

### Sort Options
- **Name**: Alphabetical by topic name
- **Questions**: By number of questions
- **Digital Library**: By number of digital library items
- **Flashcards**: By number of flashcards
- **Last Updated**: By last updated date

## Integration with Existing System

The topics filtering system integrates seamlessly with the existing subjects management system:

1. **Consistent UI**: Uses the same design patterns as subjects filters
2. **Shared Components**: Reuses SearchAndFilters component
3. **Similar API**: Follows the same prop patterns
4. **Responsive Design**: Works with the existing responsive system

## Performance Considerations

- **Efficient Filtering**: All filtering is done client-side for fast response
- **Debounced Search**: Search input can be debounced for better performance
- **Pagination**: Table view includes pagination for large datasets
- **Memoization**: Components can be memoized to prevent unnecessary re-renders

## Future Enhancements

Potential improvements for the filtering system:

1. **Server-side Filtering**: Move filtering to server for very large datasets
2. **Advanced Search**: Add full-text search capabilities
3. **Saved Filters**: Allow users to save and load filter presets
4. **Export Filtered Data**: Export filtered results to CSV/Excel
5. **Bulk Operations**: Perform actions on filtered topics
6. **Real-time Updates**: Update filters when data changes
7. **Analytics**: Track filter usage for insights

## Troubleshooting

### Common Issues

1. **No Results Found**: Check if filters are too restrictive
2. **Search Not Working**: Ensure search term is not empty and matches data
3. **Sort Not Working**: Verify sortBy and sortOrder parameters
4. **Performance Issues**: Consider pagination or server-side filtering

### Debug Tips

```javascript
// Log filtered results for debugging
console.log('Filtered topics:', getFilteredTopics(topics, searchTerm, filters));

// Check active filters
console.log('Active filters:', hasActiveFilters(searchTerm, filters));

// Verify data structure
console.log('Topics data:', topics);
```
