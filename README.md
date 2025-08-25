# Stock Price Dashboard

A professional stock market dashboard built with **React + TypeScript + Tailwind CSS** using Vite. The app fetches real‑time/near‑real‑time stock data from free APIs (Alpha Vantage or Finnhub) and displays it in a responsive table with optional search, sorting, charts, and error handling.

---

##  Features

**Core Requirements**

* Fetches and displays stock data in a table: **symbol, price, change, change%**.
* Styled with **Tailwind CSS**.
* Responsive layout for mobile/desktop.
* Ready to deploy on **Vercel / Netlify / GitHub Pages**.

**Optional Enhancements**

* Loading state with spinner or skeleton.
* Error handling with retry button.
* Search & sort functionality.
* Bonus charts (ApexCharts or Chart.js).

---

##  Tech Stack

* **React 18** + **TypeScript** (scaffolded with Vite)
* **Tailwind CSS** for styling
* **Alpha Vantage** / **Finnhub** for market data
* **Chart.js** or **ApexCharts** (optional)

---

##  Folder Structure

```
stock-dashboard/
├─ public/
│  ├─ favicon.ico
│  ├─ placeholder.svg
│  └─ robots.txt
├─ src/
│  ├─ components/        # UI components (StockTable, Loader, etc.)
│  ├─ hooks/             # Custom React hooks
│  ├─ lib/               # API helper functions
│  ├─ pages/             # Page-level components
│  ├─ services/          # Service layer for API calls
│  ├─ types/             # TypeScript type definitions
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .gitignore
├─ bun.lockb / package-lock.json
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

---

##  Getting Started

### 1. Prerequisites

* Node.js 18+
* npm / pnpm / yarn
* API key from **Alpha Vantage** or **Finnhub**

### 2. Clone & Install

```bash
git clone <your-repo-url> stock-dashboard
cd stock-dashboard
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```bash
# For Alpha Vantage
VITE_ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_KEY

# Or for Finnhub
VITE_FINNHUB_KEY=YOUR_FINNHUB_KEY
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

