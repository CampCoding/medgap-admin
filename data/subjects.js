export const subjects = [
  {
    code: "MTH101",
    name: "Mathematics",
    description:
      "Fundamental mathematics concepts including algebra, geometry, and calculus",
    date: "2024-08-01",
    students: 245,
    questions: 156,
    lastUpdated: "2024-08-01",
    status: "active",
    units: [
      {
        name: "Algebra",
        students: 88,
        questions: 56,
        lastUpdated: "2024-08-01",

        topics: [
          {
            name: "Linear Equations",
            questions: 19,
            flashcards: 20,
            lastUpdated: "2024-08-01",
          },
          {
            name: "Quadratic Equations",
            questions: 19,
            flashcards: 20,

            lastUpdated: "2024-08-01",
          },
          {
            name: "Inequalities",
            questions: 18,
            flashcards: 20,
            lastUpdated: "2024-08-01",
          },
        ],
      },
      {
        name: "Geometry",
        students: 82,
        questions: 45,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Triangles", questions: 15, lastUpdated: "2024-08-01" },
          { name: "Circles", questions: 15, lastUpdated: "2024-08-01" },
          {
            name: "Area and Perimeter",
            questions: 15,
            lastUpdated: "2024-08-01",
          },
        ],
      },
      {
        name: "Calculus",
        students: 75,
        questions: 55,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Limits", questions: 18, lastUpdated: "2024-08-01" },
          { name: "Derivatives", questions: 18, lastUpdated: "2024-08-01" },
          { name: "Integrals", questions: 19, lastUpdated: "2024-08-01" },
        ],
      },
    ],
  },
  {
    code: "PHY201",
    name: "Physics",
    description:
      "Classical mechanics, thermodynamics, and electromagnetic theory",
    date: "2024-07-28",
    students: 189,
    questions: 98,
    lastUpdated: "2024-08-01",
    status: "active",

    units: [
      {
        name: "Mechanics",
        students: 65,
        questions: 32,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Kinematics", questions: 8, lastUpdated: "2024-08-01" },
          { name: "Forces", questions: 8, lastUpdated: "2024-08-01" },
          { name: "Energy", questions: 8, lastUpdated: "2024-08-01" },
          { name: "Momentum", questions: 8, lastUpdated: "2024-08-01" },
        ],
      },
      {
        name: "Thermodynamics",
        students: 60,
        questions: 36,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Heat Transfer", questions: 18, lastUpdated: "2024-08-01" },
          {
            name: "Laws of Thermodynamics",
            questions: 18,
            lastUpdated: "2024-08-01",
          },
        ],
      },
      {
        name: "Electromagnetism",
        students: 64,
        questions: 30,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Electric Fields", questions: 10, lastUpdated: "2024-08-01" },
          { name: "Magnetic Fields", questions: 10, lastUpdated: "2024-08-01" },
          { name: "Circuits", questions: 10, lastUpdated: "2024-08-01" },
        ],
      },
    ],
  },
  {
    code: "BIO111",
    name: "Biology",
    description: "Introduction to life sciences, cell biology, and genetics",
    date: "2024-07-30",
    students: 312,
    questions: 203,
    lastUpdated: "2024-08-01",
    status: "active",

    units: [
      {
        name: "Cell Biology",
        students: 100,
        questions: 60,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Cell Structure", questions: 20, lastUpdated: "2024-08-01" },
          { name: "Mitosis", questions: 20, lastUpdated: "2024-08-01" },
          { name: "Osmosis", questions: 20, lastUpdated: "2024-08-01" },
        ],
      },
      {
        name: "Genetics",
        students: 102,
        questions: 43,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "DNA", questions: 15, lastUpdated: "2024-08-01" },
          { name: "Genes", questions: 14, lastUpdated: "2024-08-01" },
          { name: "Inheritance", questions: 14, lastUpdated: "2024-08-01" },
        ],
      },
      {
        name: "Ecology",
        students: 110,
        questions: 100,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Ecosystems", questions: 33, lastUpdated: "2024-08-01" },
          { name: "Food Chains", questions: 33, lastUpdated: "2024-08-01" },
          { name: "Biodiversity", questions: 34, lastUpdated: "2024-08-01" },
        ],
      },
    ],
  },
  {
    code: "CHE151",
    name: "Chemistry",
    description: "Organic and inorganic chemistry fundamentals",
    date: "2024-07-26",
    status: "draft",

    students: 167,
    questions: 134,
    lastUpdated: "2024-08-01",
    units: [
      {
        name: "Organic Chemistry",
        students: 67,
        questions: 46,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Hydrocarbons", questions: 15, lastUpdated: "2024-08-01" },
          { name: "Alcohols", questions: 15, lastUpdated: "2024-08-01" },
          {
            name: "Carboxylic Acids",
            questions: 16,
            lastUpdated: "2024-08-01",
          },
        ],
      },
      {
        name: "Inorganic Chemistry",
        students: 100,
        questions: 45,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Periodic Table", questions: 15, lastUpdated: "2024-08-01" },
          {
            name: "Chemical Bonding",
            questions: 15,
            lastUpdated: "2024-08-01",
          },
          { name: "Acids & Bases", questions: 15, lastUpdated: "2024-08-01" },
        ],
      },
      {
        name: "Physical Chemistry",
        students: 100,
        questions: 43,
        lastUpdated: "2024-08-01",

        topics: [
          { name: "Thermochemistry", questions: 14, lastUpdated: "2024-08-01" },
          { name: "Kinetics", questions: 14, lastUpdated: "2024-08-01" },
          { name: "Equilibrium", questions: 15, lastUpdated: "2024-08-01" },
        ],
      },
    ],
  },
];
