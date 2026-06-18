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
  },
];

export const WORK = [
  {
    tag: "C++ / BFS / DFS",
    title: "Asynchronous Image Flood-Fill Engine",
    when: "Fall 2025",
    metric: "-25-35% peak memory",
    body:
      "Built a C++ flood-fill engine for high-res PNG traversal using custom BFS/DFS iterators. Localized stacks and queues reduced peak memory while generating 100+ frame traversal GIFs.",
  },
  {
    tag: "Python / scikit-learn",
    title: "Apple Options Volatility Prediction",
    when: "Illinois Data Science Club / 2025",
    metric: "R2 = 0.97",
    body:
      "Modeled 2,000+ Apple option contracts across IV, DTE, strike, volume, and sentiment features. A Random Forest captured the non-linear pricing structure and reached R2 0.97.",
  },
  {
    tag: "React Native / Firebase",
    title: "CookingPal - Pantry & Recipes",
    when: "Summer 2025",
    metric: "Vision-based entry",
    body:
      "Built a React Native pantry app with manual and OCR-based grocery entry. Firebase handled storage while recipe APIs turned inventory data into personalized meal recommendations.",
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
