Here is the updated, production-ready `README.md` reflecting your new **Hybrid AI Engine (Local Ollama + Google Gemini 3.6 Flash)** and **JWT Authentication System**:

```markdown
# Smart ATS Resume & AI Task Optimizer

An intelligent, hybrid-powered SaaS web application designed to analyze resumes against target job descriptions, discover ATS skill gaps, track interactive preparation tasks, and generate tailored CV templates—offering a seamless toggle between local LLMs via Ollama and cloud-based AI via Google Gemini.

---

## 🚀 Key Features

* 📄 **PDF & Plain Text Parsing:** Upload PDF resumes directly using native buffer parsing or paste raw text.
* ⚡ **Hybrid AI Engine:** Seamlessly toggle between **Local Ollama (`llama3.2` / `llama3.2:1b`)** for privacy-first inference and **Google Gemini 3.6 Flash** for lightning-fast cloud analysis.
* 🔐 **Multi-Tenant JWT Authentication:** Secure registration and login flow with password hashing (`bcryptjs`) ensuring isolated user sessions, data privacy, and personal history tracking.
* 🎯 **ATS Match Scoring:** Calculates real-time job match percentages, identifies critical skill gaps, and suggests concrete resume edits.
* 📝 **Interactive Task Checklist:** Automatically generates personalized preparation tasks and persists completion states in MongoDB.
* ✨ **AI Bullet Rewriter:** Highlights missing skills and rewrites weak resume bullet points using Google's **X-Y-Z formula** (*Accomplished X, measured by Y, by doing Z*).
* 📋 **CV Template Generator:** Transforms original resumes into tailored, ATS-ready Markdown/PDF printable templates pre-filled with target keywords.
* 📜 **Run History Tracking:** User-scoped sidebar drawer to review past analysis runs and track progress across job applications.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Lucide React Icons, Axios (with Interceptors)
* **Backend:** Node.js, Express.js, Multer, `pdf2json`, JSON Web Tokens (JWT), `bcryptjs`
* **Database:** MongoDB Atlas / Local MongoDB, Mongoose ORM
* **AI Orchestration:** 
  * **Local:** Ollama (`llama3.2`, `llama3.2:1b`)
  * **Cloud:** Google Gemini API (`@google/genai` - Gemini 3.6 Flash)

---

## 📁 Repository Structure

```text
smart-resume-taskmanager/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # ResumeForm, AnalysisDashboard, Modals, HistoryDrawer, AuthModal
│   │   ├── services/           # Axios API layer with JWT interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                     # Node.js Express Backend
    ├── config/                 # Ollama & Gemini API configurations
    ├── controllers/            # Auth, resume analysis, task persistence, & template engines
    ├── middleware/             # JWT Auth protection middleware
    ├── models/                 # Mongoose schemas (User, Analysis)
    ├── routes/                 # Express API routes (/api/auth, /api/resume)
    ├── utils/                  # Prompt engineering templates
    ├── server.js               # Express entry point
    └── .env                    # Environment variables

```

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [Ollama](https://ollama.com/) installed and running locally
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
* [Google Gemini API Key](https://aistudio.google.com/) (optional, for Cloud Engine switch)

---

### 1. Model Setup (Local Engine)

Pull and run your preferred local model:

```bash
ollama run llama3.2:1b

```

---

### 2. Backend Setup

```bash
cd server
npm install

```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
OLLAMA_HOST=[http://127.0.0.1:11434](http://127.0.0.1:11434)
MONGO_URI=mongodb://127.0.0.1:27017/smart_resume_db
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here

```

Start the Express server:

```bash
node server.js

```

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd client
npm install
npm run dev

```

Open `http://localhost:5173` in your browser.

---

## 📌 Usage Workflow

1. **Sign In / Register:** Create an account or log in to initialize your private dashboard session.
2. **Select Engine:** Choose **Ollama (Local)** for offline processing or **Gemini Flash (Cloud)** for instant cloud execution in the top bar.
3. **Input Data:** Upload your PDF resume or paste raw text alongside the target job description.
4. **Analyze & Match:** Run analysis to generate your ATS score, skill gaps, and interactive task checklist.
5. **Optimize Resume:** Click any **Identified Skill Gap** badge to open the AI Bullet Rewriter modal.
6. **Generate CV:** Click **Generate Tailored CV Template** to generate a reformatted, ATS-ready resume structure.
7. **Track Progress:** Access the **Past Runs** drawer to review previous analyses anytime.

```

```
