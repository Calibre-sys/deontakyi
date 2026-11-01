// Everything the page says lives here. Edit this file to update the site.

export const PROFILE = {
  name: "Deon Takyi-Amponsem",
  fullName: "Deon Yeboah Takyi-Amponsem",
  role: "Software & ML Engineer",
  location: "Accra, Ghana",
  email: "deontakyiamponsem@gmail.com",
  phone: "+233 592 763 423",
  phoneHref: "tel:+233592763423",
  github: "https://github.com/Calibre-sys",
  linkedin: "https://www.linkedin.com/",
  cv: "/Deon-Takyi-Amponsem-CV.pdf",
  portrait: "/portrait-card.jpg",
};

export const STATS = [
  { value: "2", label: "published papers" },
  { value: "7", label: "certifications" },
  { value: "90%", label: "faster order processing at SOH" },
  { value: "1st", label: "class, BSc Petroleum Eng." },
];

/* ── Research ─────────────────────────────────────────── */

export type Paper = {
  id: string;
  /** Short name used as the big index entry. */
  name: string;
  title: string;
  venue: string;
  venueShort: string;
  publisher: string;
  date: string;
  detail: string;
  doi: string;
  authors: string[];
  summary: string;
  highlights: string[];
  tags: string[];
  cover?: string;
  screenshot: string;
};

export const ME_AS_AUTHOR = "Deon Yeboah Takyi-Amponsem";

export const PAPERS: Paper[] = [
  {
    id: "hfu",
    name: "Flow units, found automatically",
    title:
      "Automated hydraulic flow unit determination using FZI-Z-score probability, K-means clustering with autoencoders, and machine learning classification: a case study of the Subei Basin, China",
    venue: "Journal of Applied Geophysics",
    venueShort: "J. Appl. Geophys.",
    publisher: "Elsevier",
    date: "September 2025",
    detail: "Vol. 240 · Article 105778",
    doi: "10.1016/j.jappgeo.2025.105778",
    authors: [
      "Stephen Adjei",
      "Deon Yeboah Takyi-Amponsem",
      "Jonathan Atuquaye Quaye",
      "Yen Adams Sokama-Neuyam",
      "John Ojuu Oleka",
      "George Kobla Asigbi",
      "Turkson Kwesi Duodu",
    ],
    summary:
      "The standard way to find hydraulic flow units ranks samples by probability, and it breaks down on large datasets. We replaced it with a pipeline that holds up: an FZI-Z-score probability plot, K-means clustering on autoencoder features, and an ML classifier that predicts flow units for new wells. We tested it on RCAL data from five wells in the Subei Basin.",
    highlights: [
      "The FZI-Z-score probability plot gives a statistically sound way to identify flow units",
      "K-means clustering on autoencoder features automates HFU identification",
      "An MLP classifier predicts flow units with high accuracy",
    ],
    tags: ["Autoencoders", "K-means", "MLP", "Reservoir characterization"],
    cover: "/media/jag-cover.jpg",
    screenshot: "/media/paper-flowunit.png",
  },
  {
    id: "injectors",
    name: "What the water injectors do",
    title: "Analyzing the Effects of Water Injectors on Oil Production Using Causality Models",
    venue: "SPE Africa Technology Conference",
    venueShort: "SPE ATC 2026",
    publisher: "Society of Petroleum Engineers · OnePetro",
    date: "June 2026 · Abidjan, Côte d'Ivoire",
    detail: "Paper SPE-233427-MS",
    doi: "10.2118/233427-MS",
    authors: [
      "Stephen Adjei",
      "Daniel Tettey Yohuno",
      "Kingsley Osei Bonsu",
      "Chris Owusu Asante",
      "Deon Yeboah Takyi-Amponsem",
      "Yen Adams Sokama-Neuyam",
      "Kwesi Mensah Duodu-Turkson",
      "Kwadwo Fosu Adom",
    ],
    summary:
      "Tracer tests are expensive. Simulation relies on simplifying assumptions. Interference tests get ambiguous when several injectors are active. We built a three-stage framework instead: Pearson correlation, then interference testing, then multivariate time-series causality (VAR and VECM). It shows which water injectors actually drive production at each producer.",
    highlights: [
      "Three stages: correlation, then interference testing, then causality",
      "VAR and VECM models show which way influence runs between wells",
      "A cheaper alternative to tracer tests in mature waterfloods",
    ],
    tags: ["Causal inference", "VAR / VECM", "Time series", "Waterflooding"],
    screenshot: "/media/paper-waterinjectors.png",
  },
];

/* ── Certifications ───────────────────────────────────── */

export type Cert = {
  id: string;
  short: string;
  title: string;
  issuer: "DataCamp" | "365 Data Science";
  date: string;
  credential: string;
  length?: string;
  pdf: string;
  preview: string;
  skills: string[];
};

export const CERTS: Cert[] = [
  {
    id: "dl-intermediate",
    short: "Intermediate Deep Learning",
    title: "Intermediate Deep Learning with PyTorch",
    issuer: "DataCamp",
    date: "Nov 2025",
    credential: "#43,446,826",
    length: "4 hrs",
    pdf: "/evidence/cert-deep-learning-intermediate.pdf",
    preview: "/evidence/previews/cert-deep-learning-intermediate.jpg",
    skills: ["PyTorch", "CNNs", "RNNs", "Training loops"],
  },
  {
    id: "dl-intro",
    short: "Intro to Deep Learning",
    title: "Introduction to Deep Learning with PyTorch",
    issuer: "DataCamp",
    date: "Sep 2025",
    credential: "#41,449,299",
    length: "4 hrs",
    pdf: "/evidence/cert-deep-learning-intro.pdf",
    preview: "/evidence/previews/cert-deep-learning-intro.jpg",
    skills: ["PyTorch", "Neural networks", "Backprop"],
  },
  {
    id: "genai",
    short: "Generative AI for Business",
    title: "Generative AI for Business",
    issuer: "DataCamp",
    date: "Dec 2025",
    credential: "#45,165,130",
    length: "1 hr",
    pdf: "/evidence/cert-genai-business.pdf",
    preview: "/evidence/previews/cert-genai-business.jpg",
    skills: ["LLMs", "AI strategy"],
  },
  {
    id: "arima",
    short: "ARIMA Forecasting",
    title: "ARIMA Models in Python",
    issuer: "DataCamp",
    date: "Jul 2025",
    credential: "#41,887,445",
    length: "4 hrs",
    pdf: "/evidence/cert-arima.pdf",
    preview: "/evidence/previews/cert-arima.jpg",
    skills: ["Time series", "ARIMA / SARIMA", "statsmodels"],
  },
  {
    id: "langchain",
    short: "Chat Apps with LangChain",
    title: "Build Chat Applications with OpenAI and LangChain",
    issuer: "365 Data Science",
    date: "Nov 2024",
    credential: "CC-EEE76A0036",
    pdf: "/evidence/cert-langchain-openai.pdf",
    preview: "/evidence/previews/cert-langchain-openai.jpg",
    skills: ["LangChain", "OpenAI API", "RAG"],
  },
  {
    id: "ml-az",
    short: "ML Algorithms A–Z",
    title: "The Machine Learning Algorithms A–Z",
    issuer: "365 Data Science",
    date: "Nov 2024",
    credential: "CC-A58BD17499",
    pdf: "/evidence/cert-ml-algorithms.pdf",
    preview: "/evidence/previews/cert-ml-algorithms.jpg",
    skills: ["Supervised", "Unsupervised", "scikit-learn"],
  },
  {
    id: "intro-ai",
    short: "Intro to AI",
    title: "Intro to AI",
    issuer: "365 Data Science",
    date: "Nov 2024",
    credential: "CC-84BCF12CBE",
    pdf: "/evidence/cert-intro-ai.pdf",
    preview: "/evidence/previews/cert-intro-ai.jpg",
    skills: ["AI foundations"],
  },
];

/* ── Projects ─────────────────────────────────────────── */

export type Project = {
  id: string;
  name: string;
  blurb: string;
  impact?: string;
  stack: string[];
  video?: string;
  poster?: string;
  link?: string;
  private?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "soh",
    name: "SOH Order Management",
    blurb:
      "Generates the documents, sends the emails and tracks every order for a BDC's daily operations. Runs on Google Sheets and Apps Script.",
    impact: "Processing time cut by more than 90%",
    stack: ["Apps Script", "Google APIs", "Automation"],
    video: "/media/soh-demo.mp4",
    poster: "/media/soh-poster.jpg",
    private: true,
  },
  {
    id: "reschar",
    name: "RescharAI",
    blurb:
      "Reservoir-characterization software. Unsupervised ML finds the hydraulic flow units, and supervised models with residual correctors mark the net pay.",
    impact: "Replaces manual petrophysics workflows",
    stack: ["Python", "Unsupervised ML", "Regression"],
    video: "/media/reschar-demo.mp4",
    poster: "/media/reschar-poster.jpg",
  },
  {
    id: "fortel",
    name: "Fortel",
    blurb:
      "A no-code ML web app: upload private data securely and train models without writing a line of code. I designed and built the whole front end.",
    stack: ["JavaScript", "HTML/CSS", "React", "Node.js"],
    video: "/media/fortel-demo.mp4",
    poster: "/media/fortel-poster.jpg",
    link: "https://fortel.onrender.com",
  },
  {
    id: "recruit",
    name: "Recruitment AI Agent",
    blurb:
      "Screens and ranks CVs, writes the shortlist and drafts every candidate email. Manual shortlisting is gone.",
    stack: ["AI agents", "LLMs", "Automation"],
    private: true,
  },
  {
    id: "manpower",
    name: "Manpower Outreach Automation",
    blurb:
      "Replaced a 900-person phone campaign with personalised emails, one-click replies, automatic logging and 3-day follow-ups. A two-day build that then ran itself.",
    impact: "455 of 880 contacts converted (52%), with no calls",
    stack: ["Apps Script", "Google APIs"],
    private: true,
  },
];

export const SKILLS = [
  "Python",
  "FastAPI",
  "PyTorch",
  "scikit-learn",
  "JavaScript",
  "React",
  "Node.js",
  "Apps Script",
  "LangChain",
  "RAG",
  "MCP",
  "Time series",
  "Deep learning",
  "VBA / Excel",
  "Eclipse 100/300",
  "Prosper",
  "GAP",
  "AutoCAD",
];

/* ── Bookshelf ────────────────────────────────────────── */

export type Book = {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  isbn: string;
  /** Optional local cover, e.g. "/books/chatter.jpg". Used before the online lookup. */
  cover?: string;
  note: string;
  /** Fallback cover colours when no image loads. */
  tint: [string, string];
};

export const SHELVES: { id: string; title: string; caption: string; books: Book[] }[] = [
  {
    id: "ml",
    title: "Machine learning & deep learning",
    caption: "The books I used to teach myself to build models.",
    books: [
      {
        id: "fastai",
        title: "Deep Learning for Coders with fastai & PyTorch",
        subtitle: "AI Applications Without a PhD",
        author: "Jeremy Howard & Sylvain Gugger",
        isbn: "9781492045526",
        note: "Taught me to build and train first and pick up the theory along the way.",
        tint: ["#1f3b57", "#f6f2f0"],
      },
      {
        id: "tensorflow",
        title: "Deep Learning with TensorFlow",
        author: "Giancarlo Zaccone & Md. Rezaul Karim",
        isbn: "9781786469786",
        note: "Computation graphs, CNNs and RNNs from the TensorFlow side.",
        tint: ["#20262e", "#f3c623"],
      },
    ],
  },
  {
    id: "beyond",
    title: "Beyond the code",
    caption: "Books that changed how I think.",
    books: [
      {
        id: "chatter",
        title: "Chatter",
        subtitle: "The Voice in Our Head, Why It Matters, and How to Harness It",
        author: "Ethan Kross",
        isbn: "9780525575238",
        note: "How to step back from your inner critic and work through hard problems calmly.",
        tint: ["#f3c623", "#1b1b1b"],
      },
    ],
  },
];

/* ── Journey ──────────────────────────────────────────── */

export const EXPERIENCE = [
  {
    when: "Nov 2025 to now",
    org: "SOH Energy",
    role: "Business Development / Technical Associate",
    points: [
      "Built the SOH Order Management system, which cut order processing time by more than 90%",
      "Built an AI recruitment agent that screens, ranks and emails candidates",
      "Automated a 900-contact outreach campaign: 52% converted with no phone calls",
      "Co-built a fuel-station feasibility model covering demand forecasting, costs and profitability",
    ],
  },
  {
    when: "Sep 2024 to now",
    org: "AI-DPRS Research Lab, KNUST",
    role: "Reservoir Characterization Lead (ML Research)",
    points: [
      "Co-developed an automated HFU identification system, published in the Journal of Applied Geophysics",
      "Built RescharAI, combining unsupervised and supervised ML for reservoir work",
      "Worked with GNPC to apply unsupervised ML to real field data",
      "Built a causal-analysis tool showing how water injectors affect producing wells",
    ],
  },
  {
    when: "Sep 2023–Jan 2024",
    org: "Tema Tank Farm & Booster Station",
    role: "Operations Intern",
    points: [
      "Tracked product to terminals and calibrated flow meters with prover tanks",
      "Ran checks on pumps, valves, pipelines and storage tanks, and saw first-hand the data problems I now automate",
    ],
  },
];

export const EDUCATION = [
  {
    when: "2021–2025",
    org: "KNUST",
    role: "BSc Petroleum Engineering",
    points: [
      "First-Class Honours",
      "College of Engineering Excellence Award (2021/22)",
      "Treasurer, SPE KNUST Chapter (2024/25); SPE member since 2021",
    ],
  },
  {
    when: "2018–2021",
    org: "Mfantsipim School",
    role: "WASSCE, General Science",
    points: [],
  },
];

/* ── Events ───────────────────────────────────────────── */

export type Moment = { id: string; src: string; title: string; tag: string; w: number; h: number };

export const MOMENTS: Moment[] = [
  { id: "bb1", src: "/media/buildingbytes-1.jpg", title: "Building Bytes Pitch Program, Kumasi", tag: "Pitch", w: 1080, h: 720 },
  { id: "e4m2", src: "/media/energy4me-2.jpg", title: "SPE Energy4me school outreach", tag: "Volunteer", w: 480, h: 319 },
  { id: "bb2", src: "/media/buildingbytes-2.jpg", title: "Building Bytes, demo day", tag: "Pitch", w: 1080, h: 720 },
  { id: "e4m1", src: "/media/energy4me-1.jpg", title: "Energy4me, teaching energy basics", tag: "Volunteer", w: 800, h: 312 },
  { id: "atc", src: "/media/atc-2026.jpg", title: "Africa Technology Conference 2026, Abidjan", tag: "Delegate", w: 480, h: 640 },
];

export const REFERENCES = [
  { name: "Dr. Stephen Adjei, PhD", role: "Principal Investigator, AI-DPRS · Lecturer, Petroleum Eng., KNUST" },
  { name: "Mr. Felix Andoh", role: "Operator, Tema Tank Farm" },
];

export const EVENTS = [
  { name: "Africa Technology Conference 2026", detail: "Delegate, Abidjan, Côte d'Ivoire. Our water-injector paper was presented here." },
  { name: "Building Bytes Pitch Program", detail: "Pitched and demoed a product in Kumasi." },
  { name: "SPE Energy4me", detail: "Volunteer, teaching school students how energy is found and produced." },
  { name: "SPE KNUST Chapter", detail: "Treasurer on the executive, 2024/25. Member since 2021." },
];
