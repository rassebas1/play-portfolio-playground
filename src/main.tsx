import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css' // Global application-specific CSS styles
import './index.css' // Tailwind CSS and other base styles
import './i18n'; // Internationalization configuration

/**
 * The entry point of the React application.
 * This file is responsible for rendering the main App component into the DOM.
 */

// Get the root DOM element where the React application will be mounted.
// The '!' asserts that the element will not be null.
const rootElement = document.getElementById("root");

// Ensure the root element exists before attempting to render.
if (rootElement) {
  // Create a React root and render the App component.
  // This is the modern way to render React applications starting from React 18.
  createRoot(rootElement).render(<App />);
} else {
  // Log an error if the root element is not found, which would prevent the app from starting.
  console.error("Root element with ID 'root' not found in the document.");
}
