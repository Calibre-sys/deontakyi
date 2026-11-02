import type { ToolKey } from "@/components/tools";

// All site content. Edit here to update the page.

export const PROFILE = {
  name: "Deon Takyi-Amponsem",
  role: "Machine Learning Engineer",
  focus: "Physics-informed ML for subsurface systems",
  location: "Accra, Ghana",
  email: "deontakyiamponsem@gmail.com",
  phone: "+233 592 763 423",
  phoneHref: "tel:+233592763423",
  github: "https://github.com/Calibre-sys",
  linkedin: "https://www.linkedin.com/",
  cv: "/Deon-Takyi-Amponsem-CV.pdf",
  portrait: "/portrait-card.jpg",
};


export const INTERESTS = [
  "Physics-informed machine learning",
  "Flow in porous media",
  "Unsupervised representation learning",
  "Causal inference on time series",
  "Subsurface characterization",
];

/* ── Publications ── */

export type Paper = {
  id: string;
  year: string;
  title: string;
  venue: string;
  detail: string;
  doi: string;
  authors: string[];
  summary: string;
  methods: string[];
  tools: ToolKey[];
  cover?: string;
  screenshot: string;
};

export const ME_AS_AUTHOR = "Deon Yeboah Takyi-Amponsem";

export const PAPERS: Paper[] = [
  {
    id: "hfu",
    year: "2025",
    title:
      "Automated hydraulic flow unit determination using FZI-Z-score probability, K-means clustering with autoencoders, and machine learning classification: a case study of the Subei Basin, China",
    venue: "Journal of Applied Geophysics",
    detail: "Elsevier · Vol. 240 · Art. 105778",
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
      "An automated pipeline for classifying porous rock into hydraulic flow units from core measurements. Autoencoder embeddings feed K-means clustering, a statistically grounded FZI-Z-score probability plot validates the units, and an MLP classifier predicts them for unseen wells. Applied to RCAL data from five wells.",
    methods: ["Autoencoders", "K-means", "MLP classification", "Flow zone indicator"],
    tools: ["python", "sklearn", "pandas", "numpy"],
    cover: "/media/jag-cover.jpg",
    screenshot: "/media/paper-flowunit.png",
  },
  {
    id: "injectors",
    year: "2026",
    title: "Analyzing the Effects of Water Injectors on Oil Production Using Causality Models",
    venue: "SPE Africa Technology Conference",
    detail: "Abidjan · Paper SPE-233427-MS",
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
      "A three-stage framework for inferring well-to-well connectivity from production data: Pearson correlation, interference testing, then multivariate time-series causality with VAR and VECM models. Identifies which injectors drive each producer without tracer tests.",
    methods: ["VAR", "VECM", "Granger causality", "Time series"],
    tools: ["python", "pandas", "numpy", "jupyter"],
    screenshot: "/media/paper-waterinjectors.png",
  },
];

/* ── Certifications ── */

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
  tools: ToolKey[];
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
    tools: ["pytorch", "python"],
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
    tools: ["pytorch", "python"],
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
    tools: [],
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
    tools: ["python", "pandas"],
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
    tools: ["langchain", "python"],
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
    tools: ["sklearn", "python"],
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
    tools: [],
  },
];

/* ── Projects ── */

export type Project = {
  id: string;
  name: string;
  kind: string;
  blurb: string;
  result?: string;
  stack: string[];
  tools: ToolKey[];
  video?: string;
  poster?: string;
  link?: string;
  private?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "reschar",
    name: "RescharAI",
    kind: "ML software · Subsurface",
    blurb:
      "Desktop software for reservoir characterization. Unsupervised models identify hydraulic flow units; supervised regressors with residual correction delineate net pay.",
    result: "Replaces a manual petrophysics workflow",
    stack: ["Python", "scikit-learn", "PyTorch"],
    tools: ["python", "sklearn", "pytorch"],
    video: "/media/reschar-demo.mp4",
    poster: "/media/reschar-poster.jpg",
  },
  {
    id: "soh",
    name: "SOH Order Management",
    kind: "Workflow automation",
    blurb: "Order management for a bulk distribution company: document generation, email dispatch and order tracking.",
    result: "Processing time per order cut by more than 90%",
    stack: ["Apps Script", "Google APIs"],
    tools: ["appsscript", "sheets"],
    video: "/media/soh-demo.mp4",
    poster: "/media/soh-poster.jpg",
    private: true,
  },
  {
    id: "fortell",
    name: "Fortell",
    kind: "ML and research writing platform",
    blurb:
      "Upload a spreadsheet and Fortell cleans it, trains and compares six models, then an agent pipeline turns the results into a cited paper you can export as PDF, Word or LaTeX.",
    stack: ["Python", "LLM agents", "React", "Node.js"],
    tools: ["python", "react", "node"],
    video: "/media/fortell-demo.mp4",
    poster: "/media/fortell-poster.jpg",
    link: "https://www.fortell.site",
  },
];

/* ── Experience ── */

export const EXPERIENCE = [
  {
    when: "2024 – Present",
    logo: "/logos/knust.png",
    tools: ["python", "pytorch", "sklearn", "jupyter"] as ToolKey[],
    org: "AI-DPRS Research Lab, KNUST",
    role: "Reservoir Characterization Lead, ML Research",
    points: [
      "Co-developed an automated hydraulic flow unit method; published in the Journal of Applied Geophysics",
      "Built RescharAI, combining unsupervised and supervised learning for subsurface characterization",
      "Applied unsupervised learning to field data in collaboration with GNPC",
      "Built a causal-analysis tool for injector–producer connectivity",
    ],
  },
  {
    when: "2025 – Present",
    logo: "/logos/soh-energy.png",
    tools: ["appsscript", "sheets", "javascript"] as ToolKey[],
    org: "SOH Energy",
    role: "Business Development / Technical Associate, National Service",
    points: [
      "Built an order management system that cut processing time by more than 90%",
      "Co-built a feasibility model with demand forecasting and profitability analysis",
    ],
  },
  {
    when: "2023 – 2024",
    logo: undefined as string | undefined,
    tools: [] as ToolKey[],
    org: "Tema Tank Farm & Booster Station",
    role: "Operations Intern",
    points: ["Flow-meter calibration with prover tanks, product tracking, and equipment inspection"],
  },
];

export const EDUCATION = [
  { when: "2021 – 2025", logo: "/logos/knust.png", org: "KNUST", role: "BSc Petroleum Engineering", note: "First-Class Honours · College of Engineering Excellence Award" },
  { when: "2018 – 2021", logo: undefined as string | undefined, org: "Mfantsipim School", role: "WASSCE, General Science", note: "" },
];

export const ACTIVITIES = [
  { logo: "/logos/spe.png", name: "SPE Africa Technology Conference 2026", detail: "Delegate, Abidjan" },
  { logo: "/logos/spe.png", name: "SPE KNUST Chapter", detail: "Treasurer, 2024/25 · Member since 2021" },
  { logo: "/logos/spe.png", name: "SPE Energy4me", detail: "Volunteer, STEM outreach in schools" },
  { logo: undefined as string | undefined, name: "Building Bytes Pitch Program", detail: "Participant, Kumasi" },
];

export const MOMENTS = [
  { src: "/media/atc-2026.jpg", caption: "SPE ATC 2026, Abidjan" },
  { src: "/media/buildingbytes-1.jpg", caption: "Building Bytes, Kumasi" },
  { src: "/media/energy4me-1.jpg", caption: "SPE Energy4me outreach" },
  { src: "/media/buildingbytes-2.jpg", caption: "Building Bytes demo day" },
];

/* ── Reading ── */

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  /** Optional local cover, e.g. "/books/chatter.jpg". Used before the online lookup. */
  cover?: string;
  tools: ToolKey[];
  tint: [string, string];
};

export const BOOKS: Book[] = [
  {
    id: "fastai",
    title: "Deep Learning for Coders with fastai & PyTorch",
    author: "Jeremy Howard, Sylvain Gugger",
    isbn: "9781492045526",
    tools: ["pytorch", "python"],
    tint: ["#1f3b57", "#f5f5f4"],
  },
  {
    id: "tensorflow",
    title: "Deep Learning with TensorFlow",
    author: "Giancarlo Zaccone, Md. Rezaul Karim",
    isbn: "9781786469786",
    tools: ["tensorflow", "keras"],
    tint: ["#20262e", "#f3c623"],
  },
  {
    id: "chatter",
    title: "Chatter",
    author: "Ethan Kross",
    isbn: "9780525575238",
    tools: [],
    tint: ["#f3c623", "#1b1b1b"],
  },
];

export const REFERENCES = [
  { name: "Dr. Stephen Adjei", role: "Principal Investigator, AI-DPRS · Lecturer, KNUST" },
  { name: "Mr. Felix Andoh", role: "Operator, Tema Tank Farm" },
];
