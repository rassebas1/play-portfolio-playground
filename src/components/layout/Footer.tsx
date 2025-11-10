import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto py-6 w-full">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Sebastián Espitia Londoño. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/rassebas1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/sespitial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
