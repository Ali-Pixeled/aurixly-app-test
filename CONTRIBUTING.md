# Contributing to Aurixly Investment Platform

Thank you for your interest in contributing to the Aurixly Investment Platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher
- Git
- A Supabase account
- A Clerk account

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/aurixly-investment-platform.git
   cd aurixly-investment-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your environment variables
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Tailwind CSS for styling
- Follow React best practices and hooks patterns
- Use meaningful variable and function names

### Component Guidelines
- Keep components focused and single-purpose
- Use proper TypeScript interfaces for props
- Include proper error handling
- Make components responsive by default
- Use Lucide React for icons

### File Organization
- Components in `src/components/`
- Services in `src/services/`
- Types in `src/types/`
- Contexts in `src/contexts/`
- Utilities in `src/lib/`

### Database Changes
- All database changes must be done via migrations
- Create new migration files in `supabase/migrations/`
- Include proper RLS policies for security
- Test migrations thoroughly

## 🔧 Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits format:
```
type(scope): description

Examples:
feat(auth): add social login support
fix(dashboard): resolve balance calculation issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Manual Testing
- Test all user flows
- Verify responsive design
- Check error handling
- Test with different user roles

### Code Quality
- Run ESLint: `npm run lint`
- Type checking: `npm run type-check`
- Build verification: `npm run build`

## 🔒 Security Considerations

### Database Security
- Always use RLS policies
- Validate all inputs
- Use parameterized queries
- Follow principle of least privilege

### Authentication
- Never expose sensitive keys
- Use environment variables
- Implement proper session management
- Validate user permissions

### Data Handling
- Encrypt sensitive data
- Validate all user inputs
- Sanitize outputs
- Follow GDPR guidelines

## 📝 Documentation

### Code Documentation
- Document complex functions
- Use TypeScript interfaces
- Include JSDoc comments for public APIs
- Update README for new features

### Database Documentation
- Document schema changes
- Include migration descriptions
- Explain RLS policies
- Document API endpoints

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Verify it's reproducible
- Test in different browsers
- Check console for errors

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)

### Tools
- [Lucide Icons](https://lucide.dev)
- [Vite Documentation](https://vitejs.dev)
- [ESLint Rules](https://eslint.org/docs/rules)

## 🤝 Community

### Communication
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the code of conduct

### Code of Conduct
- Be welcoming and inclusive
- Respect differing viewpoints
- Accept constructive criticism
- Focus on what's best for the community

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Release notes for major features

Thank you for contributing to Aurixly Investment Platform!