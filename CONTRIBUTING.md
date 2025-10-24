# Contributing to SSRMS

Thank you for considering contributing to the Spaza Shop Registration & Management System! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or identity.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- Git for version control
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/The-Genesis.git
   cd The-Genesis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure build script** (if not already present)
   
   Add to `package.json` scripts:
   ```json
   "build:dev": "vite build --mode development"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Navigate to `http://localhost:8080`

## Development Workflow

### Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `style/styling-update` - UI/styling changes
- `test/test-description` - Test additions/updates

### Example Branch Names

```bash
git checkout -b feature/shop-search-filter
git checkout -b fix/login-validation-error
git checkout -b docs/api-documentation
```

## Coding Standards

### TypeScript Guidelines

1. **Always use TypeScript** for new code
2. **Define proper types** - Avoid using `any`
3. **Use interfaces** for object shapes
4. **Leverage type inference** when obvious

```typescript
// ✅ Good
interface Shop {
  id: string;
  name: string;
  compliance_score: number;
}

const getShop = async (id: string): Promise<Shop> => {
  // implementation
}

// ❌ Bad
const getShop = async (id: any): Promise<any> => {
  // implementation
}
```

### React Component Guidelines

1. **Use functional components** with hooks
2. **Extract reusable logic** into custom hooks
3. **Keep components focused** - Single Responsibility Principle
4. **Use proper prop types**

```typescript
// ✅ Good - Focused component with proper typing
interface ShopCardProps {
  shop: Shop;
  onSelect: (id: string) => void;
}

export const ShopCard = ({ shop, onSelect }: ShopCardProps) => {
  return (
    <div onClick={() => onSelect(shop.id)}>
      <h3>{shop.name}</h3>
    </div>
  );
};
```

### Styling Guidelines

1. **Use Tailwind CSS** utility classes
2. **Use semantic tokens** from `index.css` and `tailwind.config.ts`
3. **Avoid inline styles** and direct color values
4. **Use design system tokens** for consistency

```typescript
// ✅ Good - Uses semantic tokens
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</button>

// ❌ Bad - Direct colors
<button className="bg-blue-500 text-white hover:bg-blue-600">
  Submit
</button>
```

### File Organization

```
src/
├── components/           # Reusable UI components
├── pages/               # Page components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── integrations/        # External service integrations
└── types/               # TypeScript type definitions
```

## Commit Guidelines

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes

### Examples

```bash
feat(shop-management): add shop search functionality

Implement full-text search for shops with filters for province,
compliance status, and rating.

Closes #123

---

fix(auth): resolve login validation error

Fix email validation regex to properly handle special characters
in email addresses.

Fixes #456

---

docs(readme): update installation instructions

Add missing steps for Supabase configuration and environment
variable setup.
```

### Commit Best Practices

1. **Keep commits atomic** - One logical change per commit
2. **Write descriptive messages** - Explain what and why, not how
3. **Reference issues** - Use `Closes #123` or `Fixes #456`
4. **Keep subject line under 72 characters**
5. **Use imperative mood** - "Add feature" not "Added feature"

## Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the linter** - `npm run lint`
3. **Build the project** - `npm run build`
4. **Update documentation** if needed
5. **Write clear commit messages**

### PR Title Format

Use the same format as commit messages:

```
feat(scope): Brief description of changes
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **At least one approval** required from maintainers
3. **Address review comments** promptly
4. **Keep PR focused** - Avoid scope creep
5. **Update branch** if conflicts arise

## Testing Guidelines

### Manual Testing Checklist

When testing your changes, verify:

#### Authentication
- [ ] Sign up with all three roles (customer, shop owner, government)
- [ ] Login with valid credentials
- [ ] Logout functionality
- [ ] Password reset flow
- [ ] Form validation errors display correctly

#### Role-Specific Features
- [ ] Appropriate dashboard loads for each role
- [ ] Role-specific features are accessible
- [ ] Unauthorized features are hidden/blocked

#### Responsive Design
- [ ] Mobile view (320px - 767px)
- [ ] Tablet view (768px - 1023px)
- [ ] Desktop view (1024px+)

#### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)

### Testing Edge Cases

Always test:
- Empty states (no data)
- Loading states
- Error states (network failures, invalid data)
- Long text content (overflow handling)
- Special characters in inputs
- Form validation boundaries

## Database Changes

### Migration Guidelines

When making database changes:

1. **Never modify read-only files** - Don't edit `src/integrations/supabase/types.ts`
2. **Use migration tool** for all database changes
3. **Include RLS policies** for security
4. **Test migrations** thoroughly before submitting
5. **Document schema changes** in `DATABASE.md`

### Example Migration Pattern

```sql
-- Create new table
CREATE TABLE public.example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own records"
  ON public.example FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON public.example FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Security Best Practices

1. **Never commit secrets** or API keys
2. **Use environment variables** for sensitive data
3. **Implement proper RLS policies** for all tables
4. **Validate all user inputs** client and server-side
5. **Follow OWASP guidelines** for web security

## Getting Help

### Resources

- **Documentation**: Check existing docs in the repository
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Email**: support@ssrms.co.za for sensitive matters

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to SSRMS! Your efforts help build a better system for South African communities. 🇿🇦
