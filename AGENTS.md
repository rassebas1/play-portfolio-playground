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

This project uses **i18next** with **external JSON files** for translations. This approach provides:
- Runtime language switching without rebuilding
- Lazy loading of translations
- Support for pluralization and interpolation
- Type-safe translation keys

### Architecture Overview

The i18n system consists of:
1. **Translation files** - JSON files in `public/locales/[lang]/[namespace].json`
2. **Configuration** - `src/i18n.ts` - Sets up i18next with HTTP backend
3. **Type definitions** - `src/i18n.d.ts` - TypeScript types for IDE autocomplete
4. **Validation** - `scripts/validate-i18n.ts` - Ensures all languages have same keys

### Translation File Structure

```
public/locales/
├── en/
│   ├── common.json           # Navigation, footer, common UI strings
│   ├── experience.json       # Job titles, activities
│   ├── education.json        # Degrees, courses, descriptions
│   ├── skills.json          # Skill categories, skills
│   ├── games.json           # Game listings
│   └── games/
│       ├── common.json      # Shared game UI (board, controls, etc.)
│       └── tic-tac-toe.json # Game-specific translations
├── es/                      # Spanish translations
├── fr/                      # French translations
└── it/                      # Italian translations
```

**Key Points:**
- **Nested namespaces**: Use subfolders for related translations (e.g., `games/common.json` is accessed as `games:common`)
- **Array support**: Use numeric indices for arrays (e.g., `activities.0`, `activities.1`)
- **Interpolation**: Use `{{variable}}` syntax for dynamic values
- **Pluralization**: Use `_other` suffix for plural forms

### Configuration

**`src/i18n.ts`** - Main configuration:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)              // Load translations from JSON files
  .use(LanguageDetector)     // Auto-detect user language
  .use(initReactI18next)     // React integration
  .init({
    debug: false,
    fallbackLng: 'en',       // Default language
    ns: ['common', 'games'], // Default namespaces to load
    defaultNS: 'common',     // Fallback namespace
    backend: {
      loadPath: '/play-portfolio-playground/locales/{{lng}}/{{ns}}.json'
    }
  });
```

**`src/i18n.d.ts`** - TypeScript definitions:
```typescript
import common from '../public/locales/en/common.json';
import education from '../public/locales/en/education.json';
// ... other imports

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      education: typeof education;
      // ... other namespaces
    };
  }
}
```

### Translation Key Patterns

Keys use dot notation for nested objects:

| Pattern | Example | Result |
|---------|---------|--------|
| Simple key | `common.Home` | "Home" |
| Nested object | `experience.nttDataTelefonica.title` | "Software Engineer" |
| Array index | `nttDataTelefonica.activities.0` | First activity |
| Interpolation | `move_count` → `{{count}}` moves | "5 moves" |

**JSON Example (`experience.json`):**
```json
{
  "nttDataTelefonica": {
    "title": "Software Engineer",
    "activities": {
      "0": "First activity description...",
      "1": "Second activity description..."
    }
  }
}
```

### Using Translations in Code

#### 1. Basic Component Usage

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('experience'); // Load 'experience' namespace
  return <h1>{t('nttDataTelefonica.title')}</h1>;
};
```

#### 2. Multiple Namespaces

```typescript
const MyComponent = () => {
  const { t } = useTranslation(['experience', 'common']);
  return (
    <div>
      <h1>{t('experience_heading')}</h1>  {/* From 'experience' namespace */}
      <p>{t('Skills')}</p>               {/* From 'common' namespace */}
    </div>
  );
};
```

#### 3. Interpolation (Dynamic Values)

```typescript
// In JSON: "move_count": "{{count}} move", "move_count_other": "{{count}} moves"
const { t } = useTranslation('common');
t('move_count', { count: 5 }); // "5 moves"
t('score', { count: 100 });    // "Score: 100"
```

#### 4. Nested Namespaces (Games)

```typescript
// Load 'games/tic-tac-toe' namespace (maps to games/tic-tac-toe.json)
const { t } = useTranslation('games/tic-tac-toe');
const { t: tCommon } = useTranslation('common'); // Alias for multiple namespaces

return (
  <div>
    <h1>{t('title')}</h1>           {/* From games/tic-tac-toe.json */}
    <button>{tCommon('new_game')}</button> {/* From common.json */}
  </div>
);
```

#### 5. Data with Translation Keys (Recommended Pattern)

Define data inline in components using translation keys:

```typescript
const ExperiencePage = () => {
  const { t } = useTranslation('experience');
  
  // Define data with translation keys (not translated values)
  const experienceData = [
    {
      company: 'Telefónica – NTT DATA',
      title: 'nttDataTelefonica.title',  // Translation key
      activities: [
        'nttDataTelefonica.activities.0', // Translation key
        'nttDataTelefonica.activities.1',
      ]
    }
  ];
  
  return (
    <div>
      {experienceData.map(exp => (
        <ExperienceCard
          title={t(exp.title)}                    // Translate here
          activities={exp.activities.map(a => t(a))} // Translate array
        />
      ))}
    </div>
  );
};
```

### Adding New Translations

#### Adding Content to Existing Namespace

1. **Add to English file** (`public/locales/en/[namespace].json`):
   ```json
   {
     "new_section": {
       "title": "New Title",
       "description": "New description here"
     }
   }
   ```

2. **Add to other language files** (es, fr, it):
   ```json
   {
     "new_section": {
       "title": "Nuevo Título",     // Spanish
       "description": "Nueva descripción"
     }
   }
   ```

3. **Use in code**:
   ```typescript
   const { t } = useTranslation('common');
   t('new_section.title');
   ```

#### Adding a New Namespace

1. **Create JSON file** in all language folders:
   ```bash
   public/locales/en/newnamespace.json
   public/locales/es/newnamespace.json
   # etc.
   ```

2. **Add namespace to TypeScript types** in `src/i18n.d.ts`:
   ```typescript
   import newnamespace from '../public/locales/en/newnamespace.json';
   
   interface CustomTypeOptions {
     resources: {
       // ... existing namespaces
       newnamespace: typeof newnamespace;
     };
   }
   ```

3. **Use in code**:
   ```typescript
   const { t } = useTranslation('newnamespace');
   ```

#### Adding a New Language

1. **Create folder**: `public/locales/[lang]/`
2. **Copy all JSON files** from `public/locales/en/`
3. **Translate all values** (keep keys unchanged)
4. **Update validation script** `scripts/validate-i18n.ts`:
   ```typescript
   const LANGUAGES = ['en', 'es', 'fr', 'it', 'de']; // Add new language
   ```
5. **Run validation**:
   ```bash
   npm run validate:i18n
   ```

### Validation

The validation script ensures translation consistency:

**Automatic validation:**
- Runs on every `npm run build` (prebuild hook)
- Runs in CI/CD on every push

**Manual validation:**
```bash
npm run validate:i18n
```

**What it checks:**
- ✅ All JSON files exist for each language
- ✅ All keys in English exist in other languages
- ✅ No orphaned keys in other languages

**Example output:**
```
🔍 Validating i18n translations...

✅ English translation files found

Checking es...
  ✅ es translations complete

Checking fr...
  ✅ fr translations complete

✅ All translations validated successfully!
```

### Best Practices

1. **Use namespaces** to organize translations logically
2. **Define data inline** in components with translation keys, don't use consts files
3. **Use pluralization** for count-based strings (`_other` suffix)
4. **Keep keys descriptive** but concise (e.g., `nttDataTelefonica.title`)
5. **Run validation** before committing changes
6. **Update all languages** when adding new keys

### Deprecated Approaches

❌ **Bundled translations** (`src/i18n/translations.ts`) - Deprecated
- Previously used TypeScript object with all translations
- Not type-safe and required rebuild for changes

❌ **Consts files** (`src/utils/*_consts.ts`) - Deprecated
- Previously imported translation keys from consts
- Now define data inline in components for better readability

### Troubleshooting

**Translations not loading:**
- Check browser console for 404 errors
- Verify `loadPath` in `i18n.ts` matches your deployment path
- Ensure JSON files are valid (no trailing commas)

**TypeScript errors:**
- Run validation to ensure all languages have same keys
- Check `i18n.d.ts` imports match actual file structure

**Missing translations in production:**
- Verify `public/locales/` is included in deployment
- Check that `validate:i18n` passes before building

## Key Dependencies

- **UI**: Radix UI primitives, Tailwind CSS, class-variance-authority
- **State**: React hooks, React Context
- **Data**: TanStack React Query
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **i18n**: i18next
- **Animations**: Framer Motion
