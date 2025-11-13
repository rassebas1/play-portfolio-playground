import React from 'react';
import { Github, Linkedin } from 'lucide-react';

/**
 * Footer component.
 * Provides a consistent footer across the application, displaying copyright information
 * and links to the developer's GitHub and LinkedIn profiles.
 *
 * @returns {JSX.Element} The rendered footer.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto py-6 w-full">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        {/* Copyright Information */}
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Sebastián Espitia Londoño. All rights reserved.
        </p>
        {/* Social Media Links */}
        <div className="flex gap-4">
          {/* GitHub Link */}
          <a
            href="https://github.com/rassebas1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub" // Accessibility label
          >
            <Github className="h-5 w-5" /> {/* GitHub icon */}
          </a>
          {/* LinkedIn Link */}
          <a
            href="https://linkedin.com/in/sespitial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn" // Accessibility label
          >
            <Linkedin className="h-5 w-5" /> {/* LinkedIn icon */}
          </a>
        </div>
      </div>
    </footer>
  );
};
