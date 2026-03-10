# Contributing to Jejak Masjid

First off, thank you for considering contributing to Jejak Masjid! 🕌

## How Can I Contribute?

### 🐛 Reporting Bugs

- Use GitHub Issues to report bugs
- Include steps to reproduce, expected behavior, and screenshots
- Specify your browser, OS, and device

### 💡 Suggesting Features

- Open an issue with the `feature` label
- Describe the problem you're solving and your proposed solution
- Include mockups or examples if possible

### 🔧 Pull Requests

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your change: `git checkout -b feature/your-feature`
4. **Make your changes** with clear, descriptive commits
5. **Test** your changes locally with `npm run dev` and `npm run build`
6. **Push** to your fork and **open a Pull Request**

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add mosque search feature
fix: resolve map marker alignment
docs: update README with new screenshots
style: improve mobile navbar spacing
refactor: extract map utils to separate module
```

## Development Setup

```bash
# Clone and install
git clone https://github.com/imfunthanks/jejak-masjid.git
cd jejak-masjid
npm install

# Set up environment
cp .env.example .env.local
# Configure DATABASE_URL and NEXTAUTH_SECRET

# Run development server
npm run dev
```

## Code Style

- **TypeScript** for all new files
- **Functional components** with React hooks
- Follow existing project patterns and naming conventions
- Run `npm run lint` before submitting PRs

## Need Help?

Feel free to open an issue or reach out. We're friendly and happy to help! 🌟
