# SARAL AI Platform - Frontend

This is the React-based frontend for the SARAL AI recruitment platform. It features two core modules: an AI-powered Candidate Search and an Advanced Email Sequence Builder.

## 🚀 Live Demo
- **URL**: [https://headsin-saral-ai.vercel.app/](https://headsin-saral-ai.vercel.app/)

## ✨ Key Features

### Module 1: AI Candidate Search
- **Natural Language Search**: Semantic search interface for finding talent.
- **AI Processing Pipeline**: High-fidelity 4-stage processing loader (Fetching, Semantic Scan, Ranking, Insights).
- **Credit Balance Tracking**: Real-time credit management with confirmation modals.
- **Interactive Results Grid**: 4-column responsive grid with match scores and status indicators.
- **Deep Candidate Insights**: Detailed modals featuring career timelines, AI verdicts, and contact unlocking.

### Module 2: Email Sequence Builder
- **Multi-step Drip Campaigns**: Build complex sequences with emails and custom delays.
- **Rich Text Editing**: Integrated `react-quill` for professional email drafting.
- **Sequence Analytics**: Delivery metrics and 7-day activity trends using `recharts`.

## 🛠️ Tech Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (High-fidelity design system)
- **Icons**: Lucide React / Custom SVG
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📦 Installation & Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-repo/saral-ai.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root:
   ```env
   REACT_APP_API_URL=https://headsin-backend.onrender.com
   ```

4. **Run Development Server**:
   ```bash
   npm start
   ```

## 📐 Architecture
- **Component-Driven**: Modular components in `src/components/`.
- **Custom Hooks**: Reusable logic for API calls and state.
- **Responsive Design**: Optimized for Desktop (3/4 columns), Tablet (2 columns), and Mobile (1 column).
- **Error Boundaries**: Robust crash protection for all major modules.

## 📄 License
MIT
