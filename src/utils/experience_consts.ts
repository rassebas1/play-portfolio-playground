/**
 * src/utils/experience_consts.ts
 *
 * Defines a constant array of professional experience entries.
 * Each object in the array represents a single work experience,
 * including details like company, job title, dates, and key activities/achievements.
 * Content for titles and activities is provided in multiple languages (English, Spanish, French)
 * for internationalization.
 */

/**
 * Array representing the user's professional experience.
 * Each entry is an object containing details about a specific job role.
 * @constant {Array<Object>} experiences
 * @property {string} company - The name of the company.
 * @property {Object} title - The job title, with multilingual support.
 * @property {string} title.en - Job title in English.
 * @property {string} title.es - Job title in Spanish.
 * @property {string} title.fr - Job title in French.
 * @property {string} date - The duration of the employment (e.g., "Jan. 2023 – Sept. 2024").
 * @property {Object} activities - A list of key responsibilities and achievements, with multilingual support.
 * @property {string[]} activities.en - Activities in English.
 * @property {string[]} activities.es - Activities in Spanish.
 * @property {string[]} activities.fr - Activities in French.
 */
export const experiences = [
  {
    company: 'Telefónica – NTT DATA',
    title: {
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
      fr: 'Ingénieur Logiciel'
    },
    date: 'Oct. 2024 – Feb. 2025',
    activities: {
      en: [
        'Served as lead front-end engineer, bridging business and technical teams by translating client requirements into actionable technical specifications, while driving sprint planning, risk assessment, effort estimation, and feature implementation.',
        'Architected and executed modernization of legacy sales application using Angular, reducing development cycle time and enhancing team velocity through strategic component-based design.',
        'Deployed Azure cloud infrastructure incorporating version control, automated CI/CD pipelines, and Kubernetes orchestration (AKS) to optimize containerized application delivery, improving deployment frequency from weekly to daily.',
      ],
      es: [
        'Se desempeñó como ingeniero front-end líder, uniendo a los equipos comerciales y técnicos al traducir los requisitos del cliente en especificaciones técnicas procesables, al tiempo que impulsaba la planificación de sprints, la evaluación de riesgos, la estimación de esfuerzos y la implementación de características.',
        'Diseñó y ejecutó la modernización de la aplicación de ventas heredada utilizando Angular, reduciendo el tiempo del ciclo de desarrollo y mejorando la velocidad del equipo a través del diseño estratégico basado en componentes.',
        'Desplegó la infraestructura en la nube de Azure incorporando control de versiones, canalizaciones de CI/CD automatizadas y orquestación de Kubernetes (AKS) para optimizar la entrega de aplicaciones en contenedores, mejorando la frecuencia de implementación de semanal a diaria.',
      ],
      fr: [
        "A servi d'ingénieur front-end principal, faisant le pont entre les équipes commerciales et techniques en traduisant les exigences des clients en spécifications techniques exploitables, tout en dirigeant la planification des sprints, l'évaluation des risques, l'estimation des efforts et la mise en œuvre des fonctionnalités.",
        "A architecturé et exécuté la modernisation de l'application de vente héritée à l'aide d'Angular, réduisant le temps de cycle de développement et améliorant la vélocité de l'équipe grâce à une conception stratégique basée sur les composants.",
        "A déployé l'infrastructure cloud Azure en intégrant le contrôle de version, les pipelines CI/CD automatisés et l'orchestration Kubernetes (AKS) pour optimiser la livraison d'applications conteneurisées, améliorant la fréquence de déploiement de hebdomadaire à quotidienne.",
      ]
    }
  },
  {
    company: 'Banco Popular – NTT DATA',
    title: {
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
      fr: 'Ingénieur Logiciel'
    },
    date: 'Jan. 2023 – Sept. 2024',
    activities: {
      en: [
        'Directed strategic planning and risk mitigation across multiple quarters, safeguarding project timelines and bolstering stakeholder confidence by proactively addressing operational risks.',
        'Architected and led a hybrid cloud integration solution to automate client processes, orchestrating on-premises services with AWS. Enforced robust security via DataPower Gateway using signed and mutual authentication certificates.',
        'Authored comprehensive service contracts (WSDL, YAML and SWAGGER) to streamline cross-team collaboration, ensuring seamless system integration and securing Architecture Committee approval.',
        'Owned the end-to-end service development lifecycle: designed system architecture, managed deployments on WebLogic, and validated performance through rigorous testing (unit, load, stress using JMeter), with detailed documentation of design and deployment processes.',
        'Maintained and supported legacy microservices and ETL pipelines in production environments, resolving critical issues while progressively modernizing authentication and security protocols using Java 8.',
      ],
      es: [
        'Dirigió la planificación estratégica y la mitigación de riesgos a lo largo de varios trimestres, salvaguardando los cronogramas de los proyectos y reforzando la confianza de las partes interesadas al abordar de manera proactiva los riesgos operativos.',
        'Diseñó y dirigió una solución de integración de nube híbrida para automatizar los procesos de los clientes, orquestando los servicios locales con AWS. Se aplicó una seguridad sólida a través de DataPower Gateway utilizando certificados de autenticación mutua y firmados.',
        'Redactó contratos de servicio integrales (WSDL, YAML y SWAGGER) para agilizar la colaboración entre equipos, garantizando una integración perfecta del sistema y obteniendo la aprobación del Comité de Arquitectura.',
        'Se adueñó del ciclo de vida completo del desarrollo de servicios: diseñó la arquitectura del sistema, gestionó las implementaciones en WebLogic y validó el rendimiento mediante pruebas rigurosas (unitarias, de carga y de estrés con JMeter), con documentación detallada de los procesos de diseño e implementación.',
        'Mantuvo y soportó microservicios heredados y canalizaciones de ETL en entornos de producción, resolviendo problemas críticos mientras modernizaba progresivamente los protocolos de autenticación y seguridad utilizando Java 8.',
      ],
      fr: [
        "A dirigé la planification stratégique et l'atténuation des risques sur plusieurs trimestres, protégeant les délais des projets et renforçant la confiance des parties prenantes en traitant de manière proactive les risques opérationnels.",
        "A architecturé et dirigé une solution d'intégration de cloud hybride pour automatiser les processus des clients, en orchestrant les services sur site avec AWS. A appliqué une sécurité robuste via DataPower Gateway à l'aide de certificats d'authentification mutuelle et signés.",
        "A rédigé des contrats de service complets (WSDL, YAML et SWAGGER) pour rationaliser la collaboration entre les équipes, garantissant une intégration transparente du système et obtenant l'approbation du comité d'architecture.",
        "A possédé le cycle de vie complet du développement de services : a conçu l'architecture du système, géré les déploiements sur WebLogic et validé les performances par des tests rigoureux (unitaires, de charge, de stress avec JMeter), avec une documentation détaillée des processus de conception et de déploiement.",
        "A maintenu et pris en charge les microservices hérités et les pipelines ETL dans les environnements de production, résolvant les problèmes critiques tout en modernisant progressivement les protocoles d'authentification et de sécurité à l'aide de Java 8.",
      ]
    }
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, IBM training program',
    title: {
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
      fr: 'Ingénieur Logiciel'
    },
    date: 'Oct 2022 – Nov 2022',
    activities: {
      en: [
        'Leveraged enterprise integration technologies by receiving training in IBM Toolkit and MuleSoft, and implementing API Gateway solutions with comprehensive service contract development in WSDL, YAML and SWAGGER formats.'
      ],
      es: [
        'Aprovechó las tecnologías de integración empresarial al recibir capacitación en IBM Toolkit y MuleSoft, e implementó soluciones de API Gateway con un desarrollo integral de contratos de servicio en formatos WSDL, YAML y SWAGGER.'
      ],
      fr: [
        "A tiré parti des technologies d'intégration d'entreprise en recevant une formation sur IBM Toolkit et MuleSoft, et en mettant en œuvre des solutions de passerelle d'API avec un développement complet de contrats de service aux formats WSDL, YAML et SWAGGER."
      ]
    }
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, BBVA training program',
    title: {
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
      fr: 'Ingénieur Logiciel'
    },
    date: 'Aug. 2022 - Sept. 2022',
    activities: {
      en: [
        'Expanded front-end development skills through comprehensive training in modern web component technologies, including Web Components, Styled Components, and Lit Element, with a solid foundation in core web technologies HTML and CSS.'
      ],
      es: [
        'Amplió las habilidades de desarrollo front-end a través de una capacitación integral en tecnologías modernas de componentes web, incluidos Web Components, Styled Components y Lit Element, con una base sólida en las tecnologías web centrales HTML y CSS.'
      ],
      fr: [
        "A élargi ses compétences en développement front-end grâce à une formation complète sur les technologies de composants Web modernes, notamment les composants Web, les composants stylisés et Lit Element, avec une base solide dans les technologies Web de base HTML et CSS."
      ]
    }
  },
  {
    company: '4CODERS, Bogotá, Colombia',
    title: {
      en: 'Junior Software Engineer',
      es: 'Ingeniero de Software Junior',
      fr: 'Ingénieur Logiciel Junior'
    },
    date: 'Set. 2021- Mar. 2022',
    activities: {
      en: [
        'Developed reusable, modular front-end components using React and VueJS with TypeScript, implementing custom npm library-based components while collaborating closely with UX/UI design teams to translate Figma templates into functional Micro-Frontend architectures.',
        'Developed internationalized (i18n) and accessible (a11y) user interfaces, ensuring seamless user experience across multiple languages, regions, and devices.',
        'Back-end practitioner using NodeJS for microservices and REST responses with SQL queries.'
      ],
      es: [
        'Desarrolló componentes front-end modulares y reutilizables utilizando React y VueJS con TypeScript, implementando componentes personalizados basados en bibliotecas de npm mientras colaboraba estrechamente con los equipos de diseño de UX/UI para traducir las plantillas de Figma en arquitecturas de micro-frontend funcionales.',
        'Desarrolló interfaces de usuario internacionalizadas (i18n) y accesibles (a11y), garantizando una experiencia de usuario perfecta en varios idiomas, regiones y dispositivos.',
        'Practicante de back-end que utiliza NodeJS para microservicios y respuestas REST con consultas SQL.'
      ],
      fr: [
        "A développé des composants front-end modulaires et réutilisables à l'aide de React et VueJS avec TypeScript, en mettant en œuvre des composants personnalisés basés sur la bibliothèque npm tout en collaborant étroitement avec les équipes de conception UX/UI pour traduire les modèles Figma en architectures de micro-frontend fonctionnelles.",
        "A développé des interfaces utilisateur internationalisées (i18n) et accessibles (a11y), garantissant une expérience utilisateur transparente dans plusieurs langues, régions et appareils.",
        "Praticien back-end utilisant NodeJS pour les microservices et les réponses REST avec des requêtes SQL."
      ]
    }
  }
];
