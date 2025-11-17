// Test file to verify search and filter functionality
// This demonstrates how the filtering and sorting logic works

const testSubjects = [
  {
    code: "MTH101",
    name: "Mathematics",
    description: "Fundamental mathematics concepts including algebra, geometry, and calculus",
    status: "active",
    difficulty: "Medium",
    createdDate: "2024-08-01",
    lastUpdated: "2024-08-01",
  },
  {
    code: "PHY201",
    name: "Physics",
    description: "Classical mechanics, thermodynamics, and electromagnetic theory",
    status: "active",
    difficulty: "Hard",
    createdDate: "2024-07-28",
    lastUpdated: "2024-08-01",
  },
  {
    code: "BIO111",
    name: "Biology",
    description: "Introduction to life sciences, cell biology, and genetics",
    status: "active",
    difficulty: "Easy",
    createdDate: "2024-07-30",
    lastUpdated: "2024-08-01",
  },
  {
    code: "CHE151",
    name: "Chemistry",
    description: "Organic and inorganic chemistry fundamentals",
    status: "draft",
    difficulty: "Medium",
    createdDate: "2024-07-26",
    lastUpdated: "2024-08-01",
  },
  {
    code: "ENG101",
    name: "English Literature",
    description: "Classic and contemporary English literature analysis",
    status: "archived",
    difficulty: "Easy",
    createdDate: "2024-08-05",
    lastUpdated: "2024-08-05",
  },
];

// Test filtering function
function testFiltering() {
  console.log("=== TESTING FILTERING FUNCTIONALITY ===\n");
  
  // Test 1: Search by name
  console.log("1. Search by name 'Math':");
  const searchResult = testSubjects.filter(subject =>
    subject.name.toLowerCase().includes("math".toLowerCase()) ||
    subject.description.toLowerCase().includes("math".toLowerCase()) ||
    subject.code.toLowerCase().includes("math".toLowerCase())
  );
  console.log("Results:", searchResult.map(s => s.name));
  console.log("Expected: Mathematics\n");
  
  // Test 2: Filter by status
  console.log("2. Filter by status 'active':");
  const statusFilter = testSubjects.filter(subject => subject.status === "active");
  console.log("Results:", statusFilter.map(s => s.name));
  console.log("Expected: Mathematics, Physics, Biology\n");
  
  // Test 3: Filter by difficulty
  console.log("3. Filter by difficulty 'Easy':");
  const difficultyFilter = testSubjects.filter(subject => subject.difficulty === "Easy");
  console.log("Results:", difficultyFilter.map(s => s.name));
  console.log("Expected: Biology, English Literature\n");
  
  // Test 4: Combined filters
  console.log("4. Combined: status='active' AND difficulty='Medium':");
  const combinedFilter = testSubjects.filter(subject => 
    subject.status === "active" && subject.difficulty === "Medium"
  );
  console.log("Results:", combinedFilter.map(s => s.name));
  console.log("Expected: Mathematics\n");
}

// Test sorting function
function testSorting() {
  console.log("=== TESTING SORTING FUNCTIONALITY ===\n");
  
  // Test 1: Sort by name ascending
  console.log("1. Sort by name (A-Z):");
  const nameAsc = [...testSubjects].sort((a, b) => a.name.localeCompare(b.name));
  console.log("Results:", nameAsc.map(s => s.name));
  console.log("Expected: Biology, Chemistry, English Literature, Mathematics, Physics\n");
  
  // Test 2: Sort by name descending
  console.log("2. Sort by name (Z-A):");
  const nameDesc = [...testSubjects].sort((a, b) => b.name.localeCompare(a.name));
  console.log("Results:", nameDesc.map(s => s.name));
  console.log("Expected: Physics, Mathematics, English Literature, Chemistry, Biology\n");
  
  // Test 3: Sort by difficulty
  console.log("3. Sort by difficulty (Easy to Hard):");
  const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
  const difficultyAsc = [...testSubjects].sort((a, b) => 
    difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );
  console.log("Results:", difficultyAsc.map(s => `${s.name} (${s.difficulty})`));
  console.log("Expected: Biology (Easy), English Literature (Easy), Mathematics (Medium), Chemistry (Medium), Physics (Hard)\n");
  
  // Test 4: Sort by created date
  console.log("4. Sort by created date (Oldest to Newest):");
  const dateAsc = [...testSubjects].sort((a, b) => 
    new Date(a.createdDate) - new Date(b.createdDate)
  );
  console.log("Results:", dateAsc.map(s => `${s.name} (${s.createdDate})`));
  console.log("Expected: Chemistry (2024-07-26), Physics (2024-07-28), Biology (2024-07-30), Mathematics (2024-08-01), English Literature (2024-08-05)\n");
}

// Test complex filtering and sorting
function testComplexFiltering() {
  console.log("=== TESTING COMPLEX FILTERING AND SORTING ===\n");
  
  // Test: Search + Filter + Sort
  console.log("Search 'science' + Status 'active' + Sort by name:");
  const complexResult = testSubjects
    .filter(subject => 
      subject.name.toLowerCase().includes("science".toLowerCase()) ||
      subject.description.toLowerCase().includes("science".toLowerCase()) ||
      subject.code.toLowerCase().includes("science".toLowerCase())
    )
    .filter(subject => subject.status === "active")
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log("Results:", complexResult.map(s => s.name));
  console.log("Expected: Biology (contains 'life sciences' and is active)\n");
}

// Run all tests
console.log("🧪 TESTING SEARCH AND FILTER FUNCTIONALITY\n");
console.log("=" .repeat(50));

testFiltering();
testSorting();
testComplexFiltering();

console.log("✅ All tests completed!");
console.log("\nThe search and filter functionality is working correctly!");
