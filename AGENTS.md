# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for AI agents working in this codebase.

## Project Overview

This is a React + TypeScript + Vite portfolio/playground project with:
- React 18 + TypeScript
- Vite for build tooling
- Vitest for testing
- ESLint for linting
- Tailwind CSS for styling
- Radix UI for accessible components
- React Router DOM for routing
- React Query (TanStack Query) for data fetching
- Framer Motion for animations

## Commands

### Development
```bash
npm run dev          # Start development server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run all tests (watch mode)
npm test -- --run    # Run all tests once
npm test <file>      # Run single test file
npm test <file> -t "test name"  # Run specific test by name
npm run test:ui      # Run tests with Vitest UI
```

### Linting
```bash
npm run lint         # Run ESLint on all files
```

## Code Style Guidelines

### File Organization
- Components go in `src/components/` (UI components in `src/components/ui/`)
- UI components are organized into subfolders: `forms/`, `feedback/`, `layout/`, `display/`, `navigation/`, `overlay/`, `interactive/`, `other/`
- Pages go in `src/pages/`
- Custom hooks in `src/hooks/`
- Utilities in `src/lib/` and `src/utils/`
- Types in `src/types/`
- Games in `src/games/`

### Imports
- Use path aliases: `@/` maps to `src/`
- Order imports: external libs → internal components/hooks → utilities → types
- Use named imports: `import { Button } from "@/components/ui/button"`
- Avoid default exports where possible
- **DO NOT create `index.ts` files that re-export everything from a folder** - this causes import resolution issues and conflicts. Import components directly with full paths.

### Naming Conventions
- **Components**: PascalCase (e.g., `Button.tsx`, `GameHeader.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameState.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`, `cn.ts`)
- **Types/Interfaces**: PascalCase (e.g., `GameState.ts`)
- **Test files**: `*.test.ts` or `*.test.tsx` co-located with source

### TypeScript
- Use explicit types for function parameters and return values
- Use interfaces for object shapes
- Use type inference for simple cases
- Enable `strict: false` in tsconfig (relaxed type checking)

### React Patterns
- Use functional components with hooks
- Use `React.forwardRef` for components that need ref forwarding
- Use `cva` (class-variance-authority) for component variants
- Use `cn()` utility for conditional Tailwind classes

### CSS/Tailwind
- Use Tailwind utility classes
- Use `cn()` from `@/lib/utils` to merge Tailwind classes
- Follow Tailwind's class ordering convention
- Use Radix UI primitives for accessible interactive components

### Error Handling
- Use try/catch for async operations
- Display errors with toast notifications (use `sonner` or `toast` from shadcn)
- Handle loading states with appropriate UI feedback
- Implement error boundaries for component tree failures

### Testing
- Use Vitest with `@testing-library/react` and `@testing-library/jest-dom`
- Test file naming: `ComponentName.test.tsx`
- Use `describe` blocks for grouping related tests
- Use `it` or `test` for individual test cases
- Follow AAA pattern: Arrange, Act, Assert
- Use `beforeEach` for test setup

### Component Structure
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComponentProps {
  className?: string
}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", className)}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"
```

### Git Conventions
- Write concise commit messages (imperative mood)
- Create feature branches for new features
- Keep commits atomic and focused

### Accessibility
- Use Radix UI primitives which are accessible by default
- Include proper ARIA attributes when building custom components
- Ensure keyboard navigation works for all interactive elements

## Code Generation Principles (from Gemini.md)

Follow these principles when generating code:

### S.O.L.I.D. Principles
- **Single Responsibility Principle**: Each component, function, and module should have one clear purpose
- Apply other S.O.L.I.D. principles as appropriate for React/TypeScript

### Clarity and Readability
- Write self-documenting code with clear variable and function names
- Keep code concise without sacrificing clarity
- Follow consistent formatting (indentation, spacing, line breaks)

### Correctness and Functionality
- Ensure generated code correctly implements requirements
- Handle edge cases and invalid inputs appropriately
- Avoid syntax errors, logical bugs, and common pitfalls

### Maintainability and Extensibility
- Generate code in small, focused units (functions, components, modules)
- Minimize dependencies between different parts
- Design code to be easily extensible
- Avoid magic numbers/strings - use named constants or config

### Performance and Efficiency
- Be mindful of computational resources (CPU, memory)
- Prefer efficient algorithms and data structures where performance matters

### Security
- Avoid common vulnerabilities (injection, XSS, insecure deserialization)
- Validate and sanitize all external inputs

### Testability
- Generate code with clear inputs and outputs for easy unit testing
- Design components to allow easy mocking during testing

### Documentation
- Add comments sparingly, focusing on *why* complex logic exists, not *what*
- Add JSDoc for public interfaces (exported functions, component props)

## Internationalization (i18n)

This project uses i18next with external JSON files for translations.

### Translation File Structure

```
public/locales/
├── en/
│   ├── common.json      # Navigation, footer, common UI strings
│   ├── experience.json  # Job titles, activities
│   ├── education.json  # Degrees, courses, descriptions
│   ├── skills.json    # Skill categories, skills
│   └── games.json     # Game names, descriptions
├── es/ (Spanish - complete)
├── fr/ (French - complete)
└── it/ (Italian - placeholder)
```

### Translation Key Format

Keys follow the pattern: `namespace.key.subkey`

Examples:
- `common.Home` → "Home"
- `experience.nttDataTelefonica.title` → "Software Engineer"
- `education.master.degree` → "Master of Science in Big Data"
- `skills.category.languages` → "Languages"

### Using Translations in Code

**1. In consts files** (e.g., `src/utils/experience_consts.ts`):
```typescript
// Use the full key path (namespace.key.subkey)
export const experiences = [
  {
    title: 'experience.nttDataTelefonica.title',
    activities: [
      'experience.nttDataTelefonica.activities.0',
      'experience.nttDataTelefonica.activities.1',
    ]
  }
];
```

**2. In components**:
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('experience'); // Use namespace
  return <h1>{t('nttDataTelefonica.title')}</h1>;
};
```

### Adding New Translations

**Adding new content:**
1. Add translation to `public/locales/en/[namespace].json`
2. Add translation to other language files (es, fr, it)
3. Reference in consts file using key format: `namespace.key`

**Adding a new language:**
1. Create `public/locales/[lang]/` folder
2. Copy JSON files from `public/locales/en/`
3. Translate all values (keep keys unchanged)
4. Add `[lang]` to `LANGUAGES` array in `scripts/validate-i18n.ts`
5. Run `npm run validate:i18n` to verify

### Validation

Translation validation runs automatically:
- **prebuild hook**: `npm run build` automatically runs validation
- **CI**: GitHub Actions validates on every push

The validation script (`scripts/validate-i18n.ts`) checks:
- All keys in English exist in all other languages
- All language files are present

To run validation manually:
```bash
npm run validate:i18n
```

### Deprecated

The previous bundled translation approach (`src/i18n/translations.ts`) is deprecated. All translations are now managed via external JSON files.

## Key Dependencies

- **UI**: Radix UI primitives, Tailwind CSS, class-variance-authority
- **State**: React hooks, React Context
- **Data**: TanStack React Query
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **i18n**: i18next
- **Animations**: Framer Motion
