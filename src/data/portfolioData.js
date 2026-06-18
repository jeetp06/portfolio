export const RESUME_URL = "resume-JeetPancholi.pdf";

export const LINKS = {
  email: "mailto:jeetspancholi@gmail.com",
  linkedin: "https://www.linkedin.com/in/jeet-pancholi",
  github: "https://github.com/jeetp06",
};

export const STATS = [
  { value: "3.59", label: "GPA / 4.0" },
  { value: "Dec 2027", label: "expected B.S." },
  { value: "Math + CS", label: "UIUC" },
  { value: "US Citizen", label: "work authorized" },
];

export const EXPERIENCE = [
  {
    org: "Kripa Montessori School",
    role: "Full Stack Developer Intern",
    place: "Schaumburg, IL",
    when: "May 2025 - Aug 2025",
    points: [
      "Tech lead on a React + Tailwind proof-of-concept that modernized the school's digital experience for staff and families.",
      "Ran the full Git workflow - clean version control, project structure, and docs that cut handoff friction by an estimated 20-25%.",
      "Digitized legacy paper records and built a metadata tagging system, making the archive searchable for the first time and cutting lookup time 50-60%.",
    ],
    stack: {
      languages: ["JavaScript", "HTML", "CSS"],
      frameworks: ["React", "Tailwind CSS"],
      tools: ["Git", "GitHub", "VS Code"],
    },
    details: [
      "Led the frontend proof-of-concept for a more modern school website that could better support staff, families, and future updates.",
      "Built reusable React sections so the site could be expanded without rewriting the same layout patterns.",
      "Used Tailwind CSS to move quickly while keeping spacing, colors, and responsive behavior consistent.",
      "Set up a clearer Git workflow and project structure so handoff and future edits were easier.",
      "Converted paper-heavy records into searchable digital files with consistent tags and metadata.",
    ],
  },
  {
    org: "University of Illinois Chicago",
    role: "MCS 160 Teaching Aide I",
    place: "Chicago, IL",
    when: "Feb 2025 - May 2025",
    points: [
      "Streamlined grading for 30+ students with a standardized feedback rubric for Python assignments.",
      "Reviewed student code for correctness, efficiency, and style, reinforcing core course concepts.",
    ],
    stack: {
      languages: ["Python"],
      frameworks: [],
      tools: ["Autograding rubrics", "Code review", "Course LMS"],
    },
    details: [
      "Reviewed Python assignments for correctness, readability, and whether students were applying course concepts properly.",
      "Helped students reason through bugs instead of only giving final answers.",
      "Used a standardized rubric to make grading more consistent across submissions.",
      "Gave feedback on style, edge cases, and problem-solving approach so students knew what to improve next.",
    ],
  },
  {
    org: "Driving Forward Program",
    role: "AI Consulting Intern",
    place: "Chicago, IL",
    when: "Jan 2025 - Mar 2025",
    points: [
      "Assessed operational inefficiencies in primary-care workflows that ate into direct patient time.",
      "Designed and deployed an unbiased survey of randomly selected physicians on documentation burden and automation opportunities.",
      "Proposed an AI scribe projected to cut administrative overhead 15-20% and return that time to patient care.",
    ],
    stack: {
      languages: [],
      frameworks: [],
      tools: ["AI workflow analysis", "Survey design", "Process mapping", "Research synthesis"],
    },
    details: [
      "Mapped where documentation and administrative work slowed down primary-care workflows.",
      "Designed a physician survey to gather feedback without only sampling the loudest or most available voices.",
      "Analyzed documentation burden and looked for workflow points where automation would actually save time.",
      "Proposed an AI scribe solution focused on giving physicians more time with patients while reducing admin overhead.",
    ],
  },
];

export const WORK = [
  {
    tag: "React / Firebase",
    title: "MatchPoint",
    when: "2026",
    metric: "sports matching",
    body:
      "Built a sports matchmaking project that helps players find better games, teammates, and opponents based on shared preferences.",
    stack: {
      languages: ["JavaScript", "HTML", "CSS"],
      frameworks: ["React"],
      tools: ["Firebase", "Git", "VS Code"],
    },
    details: [
      "Designed MatchPoint around the problem of finding people to play sports with at the right time, location, and skill level.",
      "Built player discovery around useful matching signals like sport preference, availability, and competition level.",
      "Organized the data model so users, sports, and match requests could be filtered without making the interface feel crowded.",
      "Focused the experience on getting from interest to action quickly: find a match, view the fit, and move toward setting up a game.",
      "Kept the interface simple so the app feels useful for casual pickup games and more organized competitive play.",
    ],
  },
  {
    tag: "C++ / BFS / DFS",
    title: "Asynchronous Image Flood-Fill Engine",
    when: "Fall 2025",
    metric: "-25-35% peak memory",
    body:
      "Built a C++ flood-fill engine for high-res PNG traversal using custom BFS/DFS iterators. Localized stacks and queues reduced peak memory while generating 100+ frame traversal GIFs.",
    stack: {
      languages: ["C++"],
      frameworks: [],
      tools: ["BFS", "DFS", "PNG processing", "Custom iterators"],
    },
    details: [
      "Implemented both BFS and DFS traversal modes so the same image region could be filled with different exploration behavior.",
      "Built custom iterators to keep traversal logic clean and reusable across fill strategies.",
      "Generated 100+ frame traversal GIFs to visualize how the algorithm moved through the image over time.",
      "Reduced peak memory usage by keeping stack and queue state localized to the traversal instead of duplicating unnecessary image data.",
      "Used the project to practice algorithm design, memory tradeoffs, and clean C++ abstraction boundaries.",
    ],
  },
  {
    tag: "Python / scikit-learn",
    title: "Apple Options Volatility Prediction",
    when: "Illinois Data Science Club / 2025",
    metric: "R2 = 0.97",
    body:
      "Modeled 2,000+ Apple option contracts across IV, DTE, strike, volume, and sentiment features. A Random Forest captured the non-linear pricing structure and reached R2 0.97.",
    stack: {
      languages: ["Python"],
      frameworks: ["scikit-learn"],
      tools: ["Pandas", "NumPy", "Matplotlib", "Jupyter"],
    },
    details: [
      "Cleaned and prepared a dataset of 2,000+ Apple options contracts with features such as implied volatility, days to expiration, strike, volume, and sentiment.",
      "Used Pandas and NumPy to structure the data and prepare model-ready feature sets.",
      "Trained a Random Forest model in scikit-learn because the pricing behavior was non-linear and feature interactions mattered.",
      "Evaluated the model with R2 and used visualizations to understand prediction behavior across the option surface.",
      "Reached R2 = 0.97, showing strong fit for the selected feature set and modeling approach.",
    ],
  },
  {
    tag: "React Native / Firebase",
    title: "CookingPal - Pantry & Recipes",
    when: "Summer 2025",
    metric: "Vision-based entry",
    body:
      "Built a React Native pantry app with manual and OCR-based grocery entry. Firebase handled storage while recipe APIs turned inventory data into personalized meal recommendations.",
    stack: {
      languages: ["JavaScript"],
      frameworks: ["React Native"],
      tools: ["Firebase", "Expo Go", "OCR", "Recipe APIs"],
    },
    details: [
      "Built mobile pantry management flows with both manual item entry and OCR-assisted grocery capture.",
      "Used Firebase to persist pantry inventory so users could keep their data across app sessions.",
      "Connected stored ingredients to recipe APIs to turn pantry data into personalized meal ideas.",
      "Designed the flow around reducing friction: scan or enter groceries, update inventory, then receive practical recipe suggestions.",
      "Used React Native and Expo Go to move quickly while testing the mobile experience.",
    ],
  },
];

export const SKILLS = [
  {
    label: "Languages & Frameworks",
    items: ["Python", "JavaScript", "C", "C++", "React", "React Native", "Flask", "JavaFX", "HTML", "CSS", "Tailwind"],
  },
  {
    label: "Libraries & Technologies",
    items: ["NumPy", "Pandas", "Matplotlib", "REST APIs", "Firebase", "SQLite"],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "GitHub", "VS Code", "Docker", "Linux / Unix", "Jupyter", "Expo Go"],
  },
];
