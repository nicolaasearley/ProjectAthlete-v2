# Contributing to ProjectAthlete

Thank you for your interest in contributing to ProjectAthlete!

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nicolaasearley/ProjectAthlete-v2.git
   cd ProjectAthlete-v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📜 Code Standards

- **TypeScript**: Use strict typing. Avoid `any` unless absolutely necessary (e.g., worked around Supabase inference issues).
- **Tailwind CSS**: Use utility classes. Follow the established design system (glassmorphism, dark mode).
- **Components**: Keep components small and focused. Use client components (`'use client'`) only when necessary for interactivity.
- **Git**: Use descriptive commit messages.

## 🚀 Deployment

We use Docker for deployment. Ensure your changes don't break the standalone build:
```bash
npm run build
```

## 🐛 Bug Reports

Please open an issue on the repository with a detailed description of the bug and steps to reproduce it.

