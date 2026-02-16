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

## Key Dependencies

- **UI**: Radix UI primitives, Tailwind CSS, class-variance-authority
- **State**: React hooks, React Context
- **Data**: TanStack React Query
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **i18n**: i18next
- **Animations**: Framer Motion
