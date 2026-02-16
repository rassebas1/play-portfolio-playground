import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children }) => <div>{children}</div>,
    },
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations: Record<string, string> = {
        'Skills': 'Skills',
        'category.languages': 'Languages',
        'category.frontend': 'Frontend',
        'category.backend_apis': 'Backend & APIs',
        'category.cloud_devops': 'Cloud & DevOps',
        'category.tools_platforms': 'Tools & Platforms',
        'category.methodologies': 'Methodologies',
        'language.typescript': 'TypeScript',
        'language.javascript': 'JavaScript',
        'language.python': 'Python',
        'language.java': 'Java',
        'language.sql': 'SQL',
        'language.html_css': 'HTML/CSS',
        'language.c_cpp': 'C/C++',
        'frontend.react': 'React',
        'frontend.vue': 'Vue',
        'frontend.angular': 'Angular',
        'frontend.lit_elements': 'Lit-Elements',
        'frontend.web_components': 'Web Components',
        'frontend.jsx': 'JSX',
        'backend_apis.nodejs': 'Node.js',
        'backend_apis.rest': 'REST',
        'backend_apis.soap': 'SOAP',
        'backend_apis.protobuf': 'Protobuf',
        'backend_apis.wsdl': 'WSDL',
        'backend_apis.swagger_openapi_yaml': 'Swagger/OpenAPI (YAML)',
        'cloud_devops.azure': 'Azure (AKS, CI/CD)',
        'cloud_devops.aws': 'AWS',
        'cloud_devops.kubernetes': 'Kubernetes',
        'cloud_devops.docker': 'Docker',
        'cloud_devops.git': 'Git',
        'cloud_devops.svn': 'SVN',
        'tools_platforms.ibm_datapower': 'IBM DataPower/Integration Toolkit',
        'tools_platforms.weblogic': 'WebLogic',
        'tools_platforms.jmeter': 'JMeter',
        'tools_platforms.vite': 'Vite',
        'tools_platforms.webpack': 'Webpack',
        'tools_platforms.rollup': 'Rollup',
        'tools_platforms.figma': 'Figma',
        'methodologies.agile_scrum': 'Agile/Scrum',
        'methodologies.ci_cd': 'CI/CD',
        'methodologies.micro_frontends': 'Micro-Frontends',
        'methodologies.system_architecture': 'System Architecture',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

// Mock skills_consts
vi.mock('@/utils/skills_consts', () => ({
  skillCategories: {
    frontend: { en: 'Frontend', es: 'Frontend', fr: 'Frontend' },
    backend: { en: 'Backend', es: 'Backend', fr: 'Backend' },
  },
  skills: {
    frontend: ['React', 'TypeScript'],
    backend: ['Node.js', 'Express'],
  },
}));

describe('Skills', () => {
  it('renders the skills categories and skills', () => {
    render(<Skills />);
    
    // Check for categories
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
    expect(screen.getByText('Cloud & DevOps')).toBeInTheDocument();
    
    // Check for skills
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders the main title', () => {
    render(<Skills />);
    
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
