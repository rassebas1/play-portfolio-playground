import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, useNavigation, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/ui/layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy load all page components for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Games = React.lazy(() => import("./pages/Games"));
const Experience = React.lazy(() => import("./pages/Experience"));
const Education = React.lazy(() => import("./pages/Education"));
const GamePage = React.lazy(() => import("./pages/GamePage"));
const LabAI = React.lazy(() => import("./pages/LabAI"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

/**
 * Initializes a new QueryClient instance for React Query.
 * This client manages caching, background updates, and invalidation of data.
 */
const queryClient = new QueryClient();

/**
 * The Root component serves as the main layout wrapper for all routes.
 * It provides a consistent layout, handles navigation state, and enables page transition animations.
 * @returns {JSX.Element} The root layout with animated page transitions.
 */
const Root = () => {
  // Hook to get information about the current navigation state (e.g., 'idle', 'loading', 'submitting').
  const navigation = useNavigation();
  // Hook to get the current location object, useful for keying AnimatePresence.
  const location = useLocation();

  return (
    // Layout component provides a consistent structure (e.g., Navbar, Footer).
    <Layout navigationState={navigation.state}>
      {/* AnimatePresence enables exit animations for components that are removed from the React tree. */}
      <AnimatePresence mode="wait" initial={false}>
        {/* Outlet renders the current route's component.
            The key prop is crucial for AnimatePresence to detect route changes and trigger animations. */}
        <Outlet />
      </AnimatePresence>
    </Layout>
  );
};

/**
 * Configures the application's routing using React Router DOM.
 * Defines the paths and corresponding components, including nested routes and error handling.
 * Each route's element is wrapped with Framer Motion for page transition animations.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // The Root component acts as the layout for all child routes.
    children: [
      // Index route for the homepage.
      { index: true, element: <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Home /></motion.div> },
      // Route for the games listing page.
      { path: "games", element: <motion.div key="games" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Games /></motion.div> },
      // Route for the experience page.
      { path: "experience", element: <motion.div key="experience" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Experience /></motion.div> },
      // Route for the education page.
      { path: "education", element: <motion.div key="education" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Education /></motion.div> },
// Dynamic route for individual game pages, using a gameId parameter.
      { path: "game/:gameId", element: <motion.div key="game-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><GamePage /></motion.div> },
      // Route for the Lab AI page.
      { path: "lab-ai", element: <motion.div key="lab-ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><LabAI /></motion.div> },
      // Catch-all route for any undefined paths, leading to a 404 Not Found page.
      { path: "*", element: <motion.div key="not-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><NotFound /></motion.div> },
    ],
  },
],{basename: "/play-portfolio-playground/"}); // Base URL for deployment in a sub-directory.

/**
 * The main application component.
 * Sets up global providers for data fetching (React Query), theming (next-themes),
 * tooltips, and toast notifications. It then renders the application's routes.
 * @returns {JSX.Element} The root of the React application.
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;