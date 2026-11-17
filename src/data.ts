import type { ToolKey } from "@/components/tools";
import type { VisualKind } from "@/components/visuals";

// All site content. Edit here to update the page.

export const PROFILE = {
  name: "Deon Takyi-Amponsem",
  role: "Builder · applied ML for physical systems",
  focus: "Machine learning applied to subsurface systems: rocks, wells and reservoirs",
  location: "Accra, Ghana",
  email: "deontakyiamponsem@gmail.com",
  phone: "+233 592 763 423",
  phoneHref: "tel:+233592763423",
  github: "https://github.com/Calibre-sys",
  linkedin: "https://www.linkedin.com/",
  cv: "/Deon-Takyi-Amponsem-CV.pdf",
  portrait: "/portrait-card.jpg",
};


export const INTERESTS = ["subsurface systems", "physics-informed ML", "causal time series"];

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
      "an autoencoder + K-means pipeline that discovers rock types with no labels, then a neural net that predicts them in wells it has never seen. replaces a manual workflow; tested on five wells in China's Subei Basin.",
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
      "causal inference on multivariate time series (VAR, VECM) to find which wells drive which, from production history alone. no physical tests needed.",
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

/* ── Projects (case studies on the home page) ── */

/** What the work did, measured. Either a number or a before → after. */
export type Outcome =
  | { kind: "number"; value: string; label: string }
  | { kind: "shift"; before: string; after: string };

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  /** One line that says what it is. */
  tagline: string;
  problem: string;
  built: string;
  outcome: Outcome;
  /** Smaller supporting facts shown under the outcome. */
  facts: string[];
  tools: ToolKey[];
  /** Media: a screen recording, or one of the drawn visuals. */
  video?: string;
  poster?: string;
  visual?: "outreach" | "recruiter";
  /** Address shown in the window frame around the media. */
  address: string;
  links?: { label: string; href: string }[];
  private?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "reschar",
    name: "RescharAI",
    kind: "reservoir characterization software",
    year: "2025",
    tagline: "rock typing and net pay, without the manual petrophysics.",
    problem:
      "finding flow units and pay zones in a reservoir is a slow, manual petrophysical workflow, repeated well by well.",
    built:
      "a desktop app on FastAPI. unsupervised learning groups the rock into hydraulic flow units; supervised regressors with residual correctors pick out net pay. engineers use it without writing code.",
    outcome: { kind: "shift", before: "hours of manual workflow per well", after: "a few clicks, no code" },
    facts: ["used on real field data with GNPC", "built on the method published in J. Applied Geophysics"],
    tools: ["python", "fastapi", "sklearn", "pytorch"],
    video: "/media/reschar-demo.mp4",
    poster: "/media/reschar-poster.jpg",
    address: "rescharai · desktop",
    links: [{ label: "try the demo", href: "/rescharai-demo/" }],
  },
  {
    id: "outreach",
    name: "Manpower outreach automation",
    kind: "workflow automation",
    year: "2025",
    tagline: "a 900-contact phone campaign, replaced by emails that ran themselves.",
    problem:
      "SOH Energy needed to reach about 900 people in its manpower database. the plan was to phone every one of them, a job that would take months.",
    built:
      "a Google Apps Script workflow: custom emails with one-click replies, every answer logged to the sheet, follow-ups after three days, and a thank-you on confirmation.",
    outcome: { kind: "number", value: "455 / 880", label: "contacts converted, with zero phone calls" },
    facts: ["52% response rate", "months of calling → a two-day build"],
    tools: ["appsscript", "sheets", "javascript"],
    visual: "outreach",
    address: "apps script · outreach.gs",
    private: true,
  },
  {
    id: "soh",
    name: "SOH Order Management",
    kind: "operations software",
    year: "2025",
    tagline: "orders, documents and emails for a fuel distributor, end to end.",
    problem:
      "every order at a bulk fuel distributor meant hand-made documents, hand-sent emails and a spreadsheet to keep track of it all.",
    built:
      "an order system on Google's APIs that generates the documents, dispatches the emails and tracks every order from request to delivery.",
    outcome: { kind: "number", value: "90%+", label: "less time to process an order" },
    facts: ["in daily use at SOH Energy", "documents, emails and tracking in one place"],
    tools: ["appsscript", "sheets", "javascript"],
    video: "/media/soh-demo.mp4",
    poster: "/media/soh-poster.jpg",
    address: "soh · order tracker",
    private: true,
  },
  {
    id: "fortell",
    name: "Fortell",
    kind: "no-code ML web app",
    year: "2025",
    tagline: "spreadsheet in, research paper out.",
    problem: "training and writing up a model takes code, time and a lot of formatting most people don't have.",
    built:
      "a full-stack app that cleans the data, trains and compares six models, then a team of LLM agents writes the results up with real citations. exports to PDF, Word or LaTeX.",
    outcome: { kind: "number", value: "6 models", label: "trained and compared on every upload" },
    facts: ["agents write it up with real citations", "PDF · Word · LaTeX export"],
    tools: ["python", "react", "node"],
    video: "/media/fortell-demo.mp4",
    poster: "/media/fortell-poster.jpg",
    address: "fortell.site",
    links: [{ label: "fortell.site", href: "https://www.fortell.site" }],
  },
  {
    id: "recruiter",
    name: "AI recruitment agent",
    kind: "LLM agent",
    year: "2025",
    tagline: "CVs in, a ranked shortlist and the emails out.",
    problem: "shortlisting candidates meant reading every CV by hand, then writing to each one.",
    built:
      "an AI agent that reads each CV against the role, scores and ranks the candidates, and drafts the emails to send, end to end.",
    outcome: { kind: "shift", before: "manual shortlisting", after: "screened, ranked and emailed automatically" },
    facts: ["built for hiring at SOH Energy"],
    tools: ["python", "appsscript", "sheets"],
    visual: "recruiter",
    address: "agent · screening",
    private: true,
  },
];

/* ── Experience ── */

export const EXPERIENCE = [
  {
    when: "Sep 2024 – Present",
    logo: "/logos/knust.png",
    tools: ["python", "pytorch", "sklearn", "jupyter"] as ToolKey[],
    org: "AI-DPRS Research Lab, KNUST",
    role: "Reservoir Characterization Lead · ML research",
    points: [
      "co-built an autoencoder + clustering system for hydraulic flow units, published in the Journal of Applied Geophysics",
      "built RescharAI: unsupervised flow units and supervised net pay in one desktop app",
      "applied unsupervised learning to real field data with GNPC",
      "built a causal analysis tool that shows production engineers how water injectors affect producers",
    ],
  },
  {
    when: "Nov 2025 – Present",
    logo: "/logos/soh-energy.png",
    tools: ["appsscript", "sheets", "javascript"] as ToolKey[],
    org: "SOH Energy",
    role: "Business Development / Technical Associate, National Service",
    points: [
      "built the order management system that cut processing time by 90%+",
      "replaced a 900-contact phone campaign with an email automation: 455 of 880 converted, zero calls",
      "built an AI agent that screens and ranks CVs and writes the candidate emails",
      "co-built the demand forecast and feasibility model for an urban fuel station",
    ],
  },
  {
    when: "Sep 2023 – Jan 2024",
    logo: undefined as string | undefined,
    tools: [] as ToolKey[],
    org: "Tema Tank Farm & Booster Station",
    role: "Operations Intern · Chase Logistics",
    points: [
      "tracked product to terminals, calibrated flow meters against prover tanks, and checked pumps, valves, pipelines and tanks",
      "first-hand look at the operational data problems i now automate",
    ],
  },
];

export const EDUCATION = [
  { when: "2021 – 2025", logo: "/logos/knust.png", org: "KNUST", role: "BSc Petroleum Engineering", note: "College of Engineering Excellence Award, 2021/22" },
  { when: "2018 – 2021", logo: undefined as string | undefined, org: "Mfantsipim School", role: "WASSCE, General Science", note: "" },
];

export const ACTIVITIES = [
  { logo: "/logos/spe.png", name: "SPE Africa Technology Conference 2026", detail: "Delegate, Abidjan" },
  { logo: "/logos/spe.png", name: "SPE DSEATS Africa Datathon 2025", detail: "Team DBTel, well classification with ML" },
  { logo: "/logos/spe.png", name: "SPE KNUST Chapter", detail: "Treasurer, 2024/25 · Member since 2021" },
  { logo: "/logos/spe.png", name: "SPE Energy4me", detail: "Volunteer, STEM outreach in schools" },
  { logo: undefined as string | undefined, name: "Building Bytes Pitch Program", detail: "Participant, Kumasi" },
];

export const MOMENTS = [
  { src: "/media/atc-2026.jpg", caption: "delegate at SPE ATC 2026", place: "Abidjan", w: 480, h: 640 },
  { src: "/media/buildingbytes-1.jpg", caption: "pitching at Building Bytes", place: "Kumasi", w: 1080, h: 720 },
  { src: "/media/energy4me-1.jpg", caption: "SPE Energy4me outreach", place: "Kumasi", w: 800, h: 312 },
  { src: "/portrait-card.jpg", caption: "between builds", place: "Accra", w: 900, h: 1200 },
  { src: "/media/buildingbytes-2.jpg", caption: "Building Bytes demo day", place: "Kumasi", w: 1080, h: 720 },
  { src: "/media/energy4me-2.jpg", caption: "teaching energy in schools", place: "Energy4me", w: 480, h: 319 },
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

/* ── Project collections (subpages) ──
 * Add a notebook project by adding an entry here. `repo` can point at a GitHub folder or notebook.
 */

export type CollectionId = "energy" | "other";

export const COLLECTIONS: { id: CollectionId; path: string; title: string; label: string; intro: string; note: string }[] = [
  {
    id: "energy",
    path: "/projects/energy",
    title: "ML for the subsurface",
    label: "energy",
    intro: "machine learning on physical systems: rock, well and production data, from flow units to causal links between wells.",
    note: "rocks, wells and fields",
  },
  {
    id: "other",
    path: "/projects/other",
    title: "other projects",
    label: "other",
    intro: "LLM agents, automation and whatever i'm learning right now.",
    note: "agents, automation and experiments",
  },
];

export type Entry = {
  id: string;
  collection: CollectionId;
  title: string;
  year: string;
  summary: string;
  methods: string[];
  tools: ToolKey[];
  /** Set `download` for files in /public/work (notebooks, slides) so they save instead of opening. */
  links?: { label: string; href: string; download?: boolean }[];
  /** One small interactive visual under the text. */
  visual?: VisualKind;
};

export const ENTRIES: Entry[] = [
  {
    id: "reschar",
    collection: "energy",
    title: "RescharAI",
    year: "2025",
    summary:
      "unsupervised models group the rock into flow units; supervised regressors with residual correction pick out the pay zones. shipped as a desktop app, so engineers get the models without the code.",
    methods: ["Autoencoders", "K-means", "Regression with residual correction"],
    tools: ["python", "sklearn", "pytorch"],
    links: [{ label: "Interactive demo", href: "/rescharai-demo/" }],
  },
  {
    id: "hfu",
    collection: "energy",
    title: "Automated hydraulic flow units",
    year: "2025",
    summary:
      "an autoencoder learns a compact representation of core data, K-means finds the clusters with no labels, and an MLP predicts them for new wells. published in the Journal of Applied Geophysics.",
    methods: ["Autoencoders", "K-means", "MLP classifier", "Flow zone indicator"],
    tools: ["python", "sklearn", "pandas", "numpy"],
    links: [{ label: "Paper", href: "https://doi.org/10.1016/j.jappgeo.2025.105778" }],
  },
  {
    id: "injectors",
    collection: "energy",
    title: "Causal inference on well data",
    year: "2026",
    summary:
      "Granger causality, VAR and VECM models on production time series to find which wells drive which. no physical tests needed. presented at SPE ATC 2026.",
    methods: ["Pearson correlation", "Granger causality", "VAR", "VECM"],
    tools: ["python", "pandas", "numpy", "jupyter"],
    links: [{ label: "Paper", href: "https://doi.org/10.2118/233427-MS" }],
  },
  {
    id: "dseats",
    collection: "energy",
    title: "SPE DSEATS Africa Datathon 2025",
    year: "2025",
    summary:
      "team DBTel. a transformer reads each well's five-year history, then XGBoost and a random forest label all 20 wells: reservoir, lift method, stability and four more.",
    methods: ["Transformer encoder", "XGBoost", "K-means", "Random forest"],
    tools: ["python", "tensorflow", "sklearn", "pandas"],
    links: [
      { label: "Notebook", href: "/work/dseats-datathon-2025.ipynb", download: true },
      { label: "Slides", href: "/work/dseats-datathon-2025-slides.pptx", download: true },
    ],
    visual: "wells",
  },
  {
    id: "arima",
    collection: "energy",
    title: "Oil production forecasting with ARIMA",
    year: "2025",
    summary: "six years of monthly field production, made stationary, fit with ARIMA and SARIMA, and forecast a year ahead.",
    methods: ["ARIMA", "SARIMA", "ADF test", "Auto-ARIMA"],
    tools: ["python", "pandas", "numpy", "jupyter"],
    links: [{ label: "Notebook", href: "/work/arima-oil-forecast.ipynb", download: true }],
    visual: "forecast",
  },
  {
    id: "feasibility",
    collection: "energy",
    title: "Demand forecasting",
    year: "2025",
    summary:
      "demand forecasting behind a go/no-go call on a new distribution venture at SOH Energy.",
    methods: ["Demand forecasting", "Scenario analysis", "Profitability analysis"],
    tools: ["sheets", "python"],
  },
  {
    id: "fastai",
    collection: "other",
    title: "Deep learning with fastai",
    year: "2026",
    summary:
      "working through the fastai course: image, text and tabular models, my own crocodile vs alligator vs agama classifier, then a digit classifier built from scratch with plain PyTorch.",
    methods: ["Transfer learning", "ResNet", "U-Net", "AWD-LSTM", "SGD from scratch"],
    tools: ["python", "pytorch", "jupyter"],
    links: [
      { label: "Kaggle", href: "https://www.kaggle.com/code/hunterxwolf/deep-learning" },
      { label: "Notebook", href: "/work/fastai-deep-learning.ipynb", download: true },
    ],
    visual: "digits",
  },
  {
    id: "fortell",
    collection: "other",
    title: "Fortell",
    year: "2025",
    summary:
      "spreadsheet in, paper out. cleans the data, trains and compares six models, then LLM agents write the results up with real citations. exports to PDF, Word or LaTeX.",
    methods: ["AutoML", "LLM agents", "Retrieval and citation"],
    tools: ["python", "react", "node"],
    links: [{ label: "fortell.site", href: "https://www.fortell.site" }],
  },
  {
    id: "soh",
    collection: "other",
    title: "SOH order management",
    year: "2025",
    summary:
      "end-to-end order automation for a fuel distributor: documents, emails and tracking. 90% less time per order.",
    methods: ["Workflow automation", "Document generation", "Google APIs"],
    tools: ["appsscript", "sheets", "javascript"],
  },
];
