/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  base: '/play-portfolio-playground/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    exclude: [
      'e2e/**',
      'playwright.config.ts',
      'node_modules/**',
      '.opencode/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/games/**/*.ts',
        'src/components/**/*.tsx',
        'src/pages/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/lib/**/*.ts',
        'src/contexts/**/*.tsx',
        'src/utils/**/*.ts',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/tests/**',
        'src/vite-env.d.ts',
        'e2e/**',
        'src/components/ui/layout/sidebar.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 77,
        branches: 70,
        statements: 80,
      },
    },
  },
}));
