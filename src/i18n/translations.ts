/**
 * src/i18n/translations.ts
 * 
 * @deprecated
 * 
 * This file is deprecated. Translations are now managed via external JSON files
 * in public/locales/[lang]/[namespace].json
 * 
 * This file is kept for reference but is no longer used by the application.
 * 
 * To update translations:
 *   1. Edit public/locales/en/[namespace].json for English
 *   2. Edit public/locales/es/[namespace].json for Spanish
 *   3. Edit public/locales/fr/[namespace].json for French
 *   4. Edit public/locales/it/[namespace].json for Italian (placeholder)
 * 
 * To add a new language:
 *   1. Create public/locales/[new-lang]/ folder
 *   2. Copy JSON files from public/locales/en/
 *   3. Translate all values (keep keys unchanged)
 *   4. Add [new-lang] to LANGUAGES array in scripts/validate-i18n.js
 * 
 * OLD DESCRIPTION:
 * Type-safe translations for the entire application.
 * All translations are bundled with the app (no runtime loading from JSON).
 */

import { i18nKeys } from '@/types/i18n';

type TranslationValue = string;
type Translations = Record<string, TranslationValue>;

export const translations = {
  en: flattenTranslations({
    common: {
      Home: 'Home',
      Experience: 'Experience',
      Education: 'Education',
      Games: 'Games',
      mainHeading: 'Sebastián Espitia Londoño',
      introParagraph: 'Software Engineer with a passion for building modern web applications and games.',
      experienceHeading: 'Experience & Skills',
      educationHeading: 'Education & Achievements',
      Skills: 'Skills',
      developerTitle: 'Software Engineer',
      developerDescription: 'Software Engineer with a background in Electronics Engineering and current Big Data specialization. Expertise spans modern web architectures, secure integration platforms, and cloud-native solutions, with proven success in leading digital transformation for major financial and telecommunications clients.',
      keyCourses: 'Key Courses',
      signatureProject: 'Signature Project',
      portfolio: 'Portfolio',
      language: {
        english: 'English',
        spanish: 'Spanish',
        french: 'French',
      },
      changeLanguageAriaLabel: 'Change language',
      toggleMenuAriaLabel: 'Toggle Menu',
      mobileNavigationAriaLabel: 'Mobile Navigation',
      gameZoneHeading: 'Game Zone',
      gameZoneIntro: 'Explore a collection of classic and modern games.',
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      category: {
        strategy: 'Strategy',
        puzzle: 'Puzzle',
        arcade: 'Arcade',
      },
      status: {
        readyToPlay: 'Ready to Play',
        comingSoon: 'Coming Soon',
      },
      button: {
        playGame: 'Play Game',
      },
      footer: {
        copyright: 'All rights reserved.',
        githubAriaLabel: 'GitHub profile',
        linkedinAriaLabel: 'LinkedIn profile',
      },
      notFound: {
        message: 'Oops! Page not found',
        returnHome: 'Return to Home',
      },
    },
    education: {
      master: {
        degree: 'Master of Science in Big Data',
        hook: 'Specialized in Cloud Architectures, Data Engineering, and Machine Learning',
        courses: ['Machine Learning', 'Datacenter technologies', 'Data analytics', 'Storage and processing techniques'],
        project: { title: 'Lightweight Machine Learning for Yellowhammer Recognition' },
        description: ["Thesis: 'Lightweight Machine Learning for Yellowhammer Recognition'.", 'Graduated with Honors.'],
      },
      engineer: {
        degree: 'Electronics Engineer Graduate',
        hook: 'Focused on embedded systems and digital signal processing',
        courses: ['Digital Image Processing', 'Embedded Systems Design', 'Control Systems', 'Bio-Nano-Technology'],
        project: { title: 'ECG Signal Acquisition and Processing' },
        description: [
          'Digital Image Processing Projects: Created an algorithm for mamal cancer detection using MATLAB. Created an algorithm for real-time object tracking using OpenCV and MATLAB.',
          'Embedded Systems Projects: Developed a propeller clock using ATMEGA16 microcontroller. Designed a line-following robot and participated with a 4th position result at RuniBot international Competition using STM32. Designed a prototype for ECG signal acquisition and processing using PSoC microcontroller with visualization on Android Devices and data storage using Firebase.',
        ],
      },
      bachelor: {
        degree: 'Bachelor of Science',
        hook: 'Trilingual program with emphasis on sciences',
        courses: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Biology'],
        project: { title: 'Bioluminescent Bacteria Culture' },
        description: [
          'Trilingual program: Spanish (Native), French (Baccalaureat), English.',
          'High shool diploma with emphasis on Mathematics, Physics, and Chemistry.',
          'Final Year Project: Investigation and culture of Bioluminiscent Bacteria.',
          'Member of Mathematics specialization club.',
          'Member of the Football team.',
        ],
      },
    },
    experience: {
      nttDataTelefonica: {
        title: 'Software Engineer',
        activities: [
          'Served as lead front-end engineer, bridging business and technical teams by translating client requirements into actionable technical specifications, while driving sprint planning, risk assessment, effort estimation, and feature implementation.',
          'Architected and executed modernization of legacy sales application using Angular, reducing development cycle time and enhancing team velocity through strategic component-based design.',
          'Deployed Azure cloud infrastructure incorporating version control, automated CI/CD pipelines, and Kubernetes orchestration (AKS) to optimize containerized application delivery, improving deployment frequency from weekly to daily.',
        ],
      },
      nttDataBancoPopular: {
        title: 'Software Engineer',
        activities: [
          'Directed strategic planning and risk mitigation across multiple quarters, safeguarding project timelines and bolstering stakeholder confidence by proactively addressing operational risks.',
          'Architected and led a hybrid cloud integration solution to automate client processes, orchestrating on-premises services with AWS. Enforced robust security via DataPower Gateway using signed and mutual authentication certificates.',
          'Authored comprehensive service contracts (WSDL, YAML and SWAGGER) to streamline cross-team collaboration, ensuring seamless system integration and securing Architecture Committee approval.',
          'Owned the end-to-end service development lifecycle: designed system architecture, managed deployments on WebLogic, and validated performance through rigorous testing (unit, load, stress using JMeter), with detailed documentation of design and deployment processes.',
          'Maintained and supported legacy microservices and ETL pipelines in production environments, resolving critical issues while progressively modernizing authentication and security protocols using Java 8.',
        ],
      },
      nttDataIbm: {
        title: 'Software Engineer',
        activities: [
          'Leveraged enterprise integration technologies by receiving training in IBM Toolkit and MuleSoft, and implementing API Gateway solutions with comprehensive service contract development in WSDL, YAML and SWAGGER formats.',
        ],
      },
      nttDataBbva: {
        title: 'Software Engineer',
        activities: [
          'Expanded front-end development skills through comprehensive training in modern web component technologies, including Web Components, Styled Components, and Lit Element, with a solid foundation in core web technologies HTML and CSS.',
        ],
      },
      coders: {
        title: 'Junior Software Engineer',
        activities: [
          'Developed reusable, modular front-end components using React and VueJS with TypeScript, implementing custom npm library-based components while collaborating closely with UX/UI design teams to translate Figma templates into functional Micro-Frontend architectures.',
          'Developed internationalized (i18n) and accessible (a11y) user interfaces, ensuring seamless user experience across multiple languages, regions, and devices.',
          'Back-end practitioner using NodeJS for microservices and REST responses with SQL queries.',
        ],
      },
    },
    skills: {
      category: {
        languages: 'Languages',
        frontend: 'Frontend',
        backendApis: 'Backend & APIs',
        cloudDevops: 'Cloud & DevOps',
        toolsPlatforms: 'Tools & Platforms',
        methodologies: 'Methodologies',
      },
      language: {
        typescript: 'TypeScript',
        javascript: 'JavaScript',
        python: 'Python',
        java: 'Java',
        sql: 'SQL',
        htmlCss: 'HTML/CSS',
        cCpp: 'C/C++',
      },
      frontend: {
        react: 'React',
        vue: 'Vue',
        angular: 'Angular',
        litElements: 'Lit-Elements',
        webComponents: 'Web Components',
        jsx: 'JSX',
      },
      backendApis: {
        nodejs: 'Node.js',
        rest: 'REST',
        soap: 'SOAP',
        protobuf: 'Protobuf',
        wsdl: 'WSDL',
        swaggerOpenapiYaml: 'Swagger/OpenAPI (YAML)',
      },
      cloudDevops: {
        azure: 'Azure (AKS, CI/CD)',
        aws: 'AWS',
        kubernetes: 'Kubernetes',
        docker: 'Docker',
        git: 'Git',
        svn: 'SVN',
      },
      toolsPlatforms: {
        ibmDatapower: 'IBM DataPower/Integration Toolkit',
        weblogic: 'WebLogic',
        jmeter: 'JMeter',
        vite: 'Vite',
        webpack: 'Webpack',
        rollup: 'Rollup',
        figma: 'Figma',
      },
      methodologies: {
        agileScrum: 'Agile/Scrum',
        ciCd: 'CI/CD',
        microFrontends: 'Micro-Frontends',
        systemArchitecture: 'System Architecture',
      },
    },
    games: {
      ticTacToe: { name: 'Tic Tac Toe', description: 'Classic strategy game for two players. First to get three in a row wins!' },
      game2048: { name: '2048', description: 'Slide numbered tiles to combine them and reach the 2048 tile.' },
      flappyBird: { name: 'Flappy Bird', description: 'Navigate through pipes by tapping to keep the bird flying.' },
      snake: { name: 'Snake', description: 'Control a growing snake to eat food while avoiding walls and yourself.' },
      memoryGame: { name: 'Memory Game', description: 'Test your memory by matching pairs of hidden cards.' },
      brickBreaker: { name: 'Brick Breaker', description: 'Destroy bricks with a ball and paddle. Break all bricks to clear the level!' },
    },
  }),
  es: flattenTranslations({
    common: {
      Home: 'Inicio',
      Experience: 'Experiencia',
      Education: 'Educación',
      Games: 'Juegos',
      mainHeading: 'Sebastián Espitia Londoño',
      introParagraph: 'Ingeniero de Software con pasión por construir aplicaciones web y juegos modernos.',
      experienceHeading: 'Experiencia y Habilidades',
      educationHeading: 'Educación y Logros',
      Skills: 'Habilidades',
      developerTitle: 'Ingeniero de Software',
      developerDescription: 'Ingeniero de Software con experiencia en Ingeniería Electrónica y especialización actual en Big Data. Experiencia en arquitecturas web modernas, plataformas de integración seguras y soluciones nativas de la nube, con éxito comprobado en liderar la transformación digital para importantes clientes financieros y de telecomunicaciones.',
      keyCourses: 'Cursos Clave',
      signatureProject: 'Proyecto Destacado',
      portfolio: 'Portafolio',
      language: { english: 'Inglés', spanish: 'Español', french: 'Francés' },
      changeLanguageAriaLabel: 'Cambiar idioma',
      toggleMenuAriaLabel: 'Abrir menú',
      mobileNavigationAriaLabel: 'Navegación móvil',
      gameZoneHeading: 'Zona de Juegos',
      gameZoneIntro: 'Explora una colección de juegos clásicos y modernos.',
      difficulty: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' },
      category: { strategy: 'Estrategia', puzzle: 'Rompecabezas', arcade: 'Arcade' },
      status: { readyToPlay: 'Listo para Jugar', comingSoon: 'Próximamente' },
      button: { playGame: 'Jugar' },
      footer: { copyright: 'Todos los derechos reservados.', githubAriaLabel: 'Perfil de GitHub', linkedinAriaLabel: 'Perfil de LinkedIn' },
      notFound: { message: '¡Oops! Página no encontrada', returnHome: 'Volver al inicio' },
    },
    education: {
      master: {
        degree: 'Máster en Big Data',
        hook: 'Especializado en Arquitecturas en la Nube, Ingeniería de Datos y Machine Learning',
        courses: ['Machine Learning', 'Tecnologías de Datacenter', 'Análisis de datos', 'Técnicas de almacenamiento y procesamiento'],
        project: { title: 'Machine Learning Ligero para el Reconocimiento del Escribano Cerillo' },
        description: ["Tesis: 'Machine Learning Ligero para el Reconocimiento del Escribano Cerillo'.", 'Graduado con Honores.'],
      },
      engineer: {
        degree: 'Ingeniero Electrónico',
        hook: 'Enfocado en sistemas embebidos y procesamiento de señales digitales',
        courses: ['Procesamiento Digital de Imágenes', 'Diseño de Sistemas Embebidos', 'Sistemas de Control', 'Bio-Nano-Tecnología'],
        project: { title: 'Adquisición y Procesamiento de Señales ECG' },
        description: [
          'Proyectos de Procesamiento Digital de Imágenes: Creación de un algoritmo para la detección de cáncer de mama usando MATLAB. Creación de un algoritmo para el seguimiento de objetos en tiempo real usando OpenCV y MATLAB.',
          'Proyectos de Sistemas Embebidos: Desarrollo de un reloj de hélice usando el microcontrolador ATMEGA16. Diseño de un robot seguidor de línea y participación con un 4º puesto en la Competición internacional RuniBot usando STM32. Diseño de un prototipo para la adquisición y procesamiento de señales ECG usando el microcontrolador PSoC con visualización en Dispositivos Android y almacenamiento de datos usando Firebase.',
        ],
      },
      bachelor: {
        degree: 'Bachillerato Científico',
        hook: 'Programa trilingüe con énfasis en ciencias',
        courses: ['Matemáticas Avanzadas', 'Física', 'Química', 'Biología'],
        project: { title: 'Cultivo de Bacterias Bioluminiscentes' },
        description: [
          'Programa trilingüe: Español (Nativo), Francés (Baccalaureat), Inglés.',
          'Diploma de bachillerato con énfasis en Matemáticas, Física y Química.',
          'Proyecto de Fin de Año: Investigación y cultivo de Bacterias Bioluminiscentes.',
          'Miembro del club de especialización en Matemáticas.',
          'Miembro del equipo de Fútbol.',
        ],
      },
    },
    experience: {
      nttDataTelefonica: {
        title: 'Ingeniero de Software',
        activities: [
          'Se desempeñó como ingeniero front-end líder, uniendo a los equipos comerciales y técnicos al traducir los requisitos del cliente en especificaciones técnicas procesables, al tiempo que impulsaba la planificación de sprints, la evaluación de riesgos, la estimación de esfuerzos y la implementación de características.',
          'Diseñó y ejecutó la modernización de la aplicación de ventas heredada utilizando Angular, reduciendo el tiempo del ciclo de desarrollo y mejorando la velocidad del equipo a través del diseño estratégico basado en componentes.',
          'Desplegó la infraestructura en la nube de Azure incorporando control de versiones, canalizaciones de CI/CD automatizadas y orquestación de Kubernetes (AKS) para optimizar la entrega de aplicaciones en contenedores, mejorando la frecuencia de implementación de semanal a diaria.',
        ],
      },
      nttDataBancoPopular: {
        title: 'Ingeniero de Software',
        activities: [
          'Dirigió la planificación estratégica y la mitigación de riesgos a lo largo de varios trimestres, salvaguardando los cronogramas de los proyectos y reforzando la confianza de las partes interesadas al abordar de manera proactiva los riesgos operativos.',
          'Diseñó y dirigió una solución de integración de nube híbrida para automatizar los procesos de los clientes, orquestando los servicios locales con AWS. Se aplicó una seguridad sólida a través de DataPower Gateway utilizando certificados de autenticación mutua y firmados.',
          'Redactó contratos de servicio integrales (WSDL, YAML y SWAGGER) para agilizar la colaboración entre equipos, garantizando una integración perfecta del sistema y obteniendo la aprobación del Comité de Arquitectura.',
          'Se adueñó del ciclo de vida completo del desarrollo de servicios: diseñó la arquitectura del sistema, gestionó las implementaciones en WebLogic y validó el rendimiento mediante pruebas rigurosas (unitarias, de carga y de estrés con JMeter), con documentación detallada de los procesos de diseño e implementación.',
          'Mantuvo y soportó microservicios heredados y canalizaciones de ETL en entornos de producción, resolviendo problemas críticos mientras modernizaba progresivamente los protocolos de autenticación y seguridad utilizando Java 8.',
        ],
      },
      nttDataIbm: { title: 'Ingeniero de Software', activities: ['Aprovechó las tecnologías de integración empresarial al recibir capacitación en IBM Toolkit y MuleSoft, e implementó soluciones de API Gateway con un desarrollo integral de contratos de servicio en formatos WSDL, YAML y SWAGGER.'] },
      nttDataBbva: { title: 'Ingeniero de Software', activities: ['Amplió las habilidades de desarrollo front-end a través de una capacitación integral en tecnologías modernas de componentes web, incluidos Web Components, Styled Components y Lit Element, con una base sólida en las tecnologías web centrales HTML y CSS.'] },
      coders: {
        title: 'Ingeniero de Software Junior',
        activities: [
          'Desarrolló componentes front-end modulares y reutilizables utilizando React y VueJS con TypeScript, implementando componentes personalizados basados en bibliotecas de npm mientras colaboraba estrechamente con los equipos de diseño de UX/UI para traducir las plantillas de Figma en arquitecturas de micro-frontend funcionales.',
          'Desarrolló interfaces de usuario internacionalizadas (i18n) y accesibles (a11y), garantizando una experiencia de usuario perfecta en varios idiomas, regiones y dispositivos.',
          'Practicante de back-end que utiliza NodeJS para microservicios y respuestas REST con consultas SQL.',
        ],
      },
    },
    skills: {
      category: { languages: 'Idiomas', frontend: 'Frontend', backendApis: 'Backend y APIs', cloudDevops: 'Nube y DevOps', toolsPlatforms: 'Herramientas y Plataformas', methodologies: 'Metodologías' },
      language: { typescript: 'TypeScript', javascript: 'JavaScript', python: 'Python', java: 'Java', sql: 'SQL', htmlCss: 'HTML/CSS', cCpp: 'C/C++' },
      frontend: { react: 'React', vue: 'Vue', angular: 'Angular', litElements: 'Lit-Elements', webComponents: 'Web Components', jsx: 'JSX' },
      backendApis: { nodejs: 'Node.js', rest: 'REST', soap: 'SOAP', protobuf: 'Protobuf', wsdl: 'WSDL', swaggerOpenapiYaml: 'Swagger/OpenAPI (YAML)' },
      cloudDevops: { azure: 'Azure (AKS, CI/CD)', aws: 'AWS', kubernetes: 'Kubernetes', docker: 'Docker', git: 'Git', svn: 'SVN' },
      toolsPlatforms: { ibmDatapower: 'IBM DataPower/Integration Toolkit', weblogic: 'WebLogic', jmeter: 'JMeter', vite: 'Vite', webpack: 'Webpack', rollup: 'Rollup', figma: 'Figma' },
      methodologies: { agileScrum: 'Agile/Scrum', ciCd: 'CI/CD', microFrontends: 'Micro-Frontends', systemArchitecture: 'Arquitectura de Sistemas' },
    },
    games: {
      ticTacToe: { name: 'Tres en Raya', description: 'Clásico juego de estrategia para dos jugadores. ¡El primero en conseguir tres en raya gana!' },
      game2048: { name: '2048', description: 'Desliza las fichas numeradas para combinarlas y alcanzar la ficha 2048.' },
      flappyBird: { name: 'Flappy Bird', description: 'Navega entre tuberías tocando para mantener el pájaro volando.' },
      snake: { name: 'Serpiente', description: 'Controla una serpiente creciente para comer mientras evitas las paredes y a ti mismo.' },
      memoryGame: { name: 'Juego de Memoria', description: 'Pon a prueba tu memoria emparejando pares de cartas ocultas.' },
      brickBreaker: { name: 'Rompe Ladrillos', description: '¡Destruye ladrillos con una pelota y una paleta. Rompe todos los ladrillos para pasar de nivel!' },
    },
  }),
  fr: flattenTranslations({
    common: {
      Home: 'Accueil',
      Experience: 'Expérience',
      Education: 'Éducation',
      Games: 'Jeux',
      mainHeading: 'Sebastián Espitia Londoño',
      introParagraph: 'Ingénieur logiciel passionné par la création d\'applications web et de jeux modernes.',
      experienceHeading: 'Expérience et Compétences',
      educationHeading: 'Éducation et Réalisations',
      Skills: 'Compétences',
      developerTitle: 'Ingénieur Logiciel',
      developerDescription: 'Ingénieur logiciel avec une formation en génie électronique et une spécialisation actuelle en Big Data. Son expertise couvre les architectures Web modernes, les plates-formes d\'intégration sécurisées et les solutions natives du cloud, avec un succès avéré dans la conduite de la transformation numérique pour d\'importants clients des secteurs financier et des télécommunications.',
      keyCourses: 'Cours Clés',
      signatureProject: 'Projet Phare',
      portfolio: 'Portfolio',
      language: { english: 'Anglais', spanish: 'Espagnol', french: 'Français' },
      changeLanguageAriaLabel: 'Changer de langue',
      toggleMenuAriaLabel: 'Ouvrir le menu',
      mobileNavigationAriaLabel: 'Navigation mobile',
      gameZoneHeading: 'Zone de jeux',
      gameZoneIntro: 'Explorez une collection de jeux classiques et modernes.',
      difficulty: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' },
      category: { strategy: 'Stratégie', puzzle: 'Casse-tête', arcade: 'Arcade' },
      status: { readyToPlay: 'Prêt à jouer', comingSoon: 'Bientôt disponible' },
      button: { playGame: 'Jouer' },
      footer: { copyright: 'Tous droits réservés.', githubAriaLabel: 'Profil GitHub', linkedinAriaLabel: 'Profil LinkedIn' },
      notFound: { message: 'Oups! Page non trouvée', returnHome: 'Retour à l\'accueil' },
    },
    education: {
      master: {
        degree: 'Master of Science en Big Data',
        hook: 'Spécialisé dans les architectures cloud, l\'ingénierie des données et l\'apprentissage automatique',
        courses: ['Apprentissage automatique', 'Technologies de centre de données', 'Analyse de données', 'Techniques de stockage et de traitement'],
        project: { title: 'Apprentissage automatique léger pour la reconnaissance du bruant jaune' },
        description: ["Thèse: 'Apprentissage automatique léger pour la reconnaissance du bruant jaune'.", 'Diplômé avec mention.'],
      },
      engineer: {
        degree: 'Ingénieur en électronique diplômé',
        hook: 'Axé sur les systèmes embarqués et le traitement numérique du signal',
        courses: ['Traitement d\'images numériques', 'Conception de systèmes embarqués', 'Systèmes de contrôle', 'Bio-Nano-Technologie'],
        project: { title: 'Acquisition et traitement du signal ECG' },
        description: [
          'Projets de traitement d\'images numériques : Création d\'un algorithme de détection du cancer du sein à l\'aide de MATLAB. Création d\'un algorithme de suivi d\'objets en temps réel à l\'aide d\'OpenCV et de MATLAB.',
          'Projets de systèmes embarqués : Développement d\'une horloge à hélice à l\'aide du microcontrôleur ATMEGA16. Conception d\'un robot suiveur de ligne et participation avec un résultat de 4e position au concours international RuniBot à l\'aide de STM32. Conception d\'un prototype pour l\'acquisition et le traitement du signal ECG à l\'aide du microcontrôleur PSoC avec visualisation sur les appareils Android et stockage de données à l\'aide de Firebase.',
        ],
      },
      bachelor: {
        degree: 'Baccalauréat scientifique',
        hook: 'Programme trilingue avec un accent sur les sciences',
        courses: ['Mathématiques avancées', 'Physique', 'Chimie', 'Biologie'],
        project: { title: 'Culture de bactéries bioluminescentes' },
        description: [
          'Programme trilingue : espagnol (natif), français (baccalauréat), anglais.',
          'Diplôme d\'études secondaires avec une spécialisation en mathématiques, physique et chimie.',
          'Projet de fin d\'études : Enquête et culture de bactéries bioluminescentes.',
          'Membre du club de spécialisation en mathématiques.',
          'Membre de l\'équipe de football.',
        ],
      },
    },
    experience: {
      nttDataTelefonica: {
        title: 'Ingénieur Logiciel',
        activities: [
          'A servi d\'ingénieur front-end principal, faisant le pont entre les équipes commerciales et techniques en traduisant les exigences des clients en spécifications techniques exploitables, tout en dirigeant la planification des sprints, l\'évaluation des risques, l\'estimation des efforts et la mise en œuvre des fonctionnalités.',
          'A architecturé et exécuté la modernisation de l\'application de vente héritée à l\'aide d\'Angular, réduisant le temps de cycle de développement et améliorant la vélocité de l\'équipe grâce à une conception stratégique basée sur les composants.',
          'A déployé l\'infrastructure cloud Azure en intégrant le contrôle de version, les pipelines CI/CD automatisés et l\'orchestration Kubernetes (AKS) pour optimiser la livraison d\'applications conteneurisées, améliorant la fréquence de déploiement de hebdomadaire à quotidienne.',
        ],
      },
      nttDataBancoPopular: {
        title: 'Ingénieur Logiciel',
        activities: [
          'A dirigé la planification stratégique et l\'atténuation des risques sur plusieurs trimestres, protégeant les délais des projets et renforçant la confiance des parties prenantes en traitant de manière proactive les risques opérationnels.',
          'A architecturé et dirigé une solution d\'intégration de cloud hybride pour automatiser les processus des clients, en orchestrant les services sur site avec AWS. A appliqué une sécurité robuste via DataPower Gateway à l\'aide de certificats d\'authentification mutuelle et signés.',
          'A rédigé des contrats de service complets (WSDL, YAML et SWAGHER) pour rationaliser la collaboration entre les équipes, garantissant une intégration transparente du système et obtenant l\'approbation du comité d\'architecture.',
          'A possédé le cycle de vie complet du développement de services : a conçu l\'architecture du système, géré les déploiements sur WebLogic et validé les performances par des tests rigoureux (unitaires, de charge, de stress avec JMeter), avec une documentation détaillée des processus de conception et de déploiement.',
          'A maintenu et pris en charge les microservices hérités et les pipelines ETL dans les environnements de production, résolvant les problèmes critiques tout en modernisant progressivement les protocoles d\'authentification et de sécurité à l\'aide de Java 8.',
        ],
      },
      nttDataIbm: { title: 'Ingénieur Logiciel', activities: ['A tiré parti des technologies d\'intégration d\'entreprise en recevant une formation sur IBM Toolkit et MuleSoft, et en mettant en œuvre des solutions de passerelle d\'API avec un développement complet de contrats de service aux formats WSDL, YAML et SWAGGER.'] },
      nttDataBbva: { title: 'Ingénieur Logiciel', activities: ['A élargi ses compétences en développement front-end grâce à une formation complète sur les technologies de composants Web modernes, notamment les composants Web, les composants stylisés et Lit Element, avec une base solide dans les technologies Web de base HTML et CSS.'] },
      coders: {
        title: 'Ingénieur Logiciel Junior',
        activities: [
          'A développé des composants front-end modulaires et réutilisables à l\'aide de React et VueJS avec TypeScript, en mettant en œuvre des composants personnalisés basés sur la bibliothèque npm tout en collaborant étroitement avec les équipes de conception UX/UI pour traduire les modèles Figma en architectures de micro-frontend fonctionnelles.',
          'A développé des interfaces utilisateur internationalisées (i18n) et accessibles (a11y), garantissant une expérience utilisateur transparente dans plusieurs langues, régions et appareils.',
          'Praticien back-end utilisant NodeJS pour les microservices et les réponses REST avec des requêtes SQL.',
        ],
      },
    },
    skills: {
      category: { languages: 'Langues', frontend: 'Frontend', backendApis: 'Backend et API', cloudDevops: 'Cloud et DevOps', toolsPlatforms: 'Outils et Plateformes', methodologies: 'Méthodologies' },
      language: { typescript: 'TypeScript', javascript: 'JavaScript', python: 'Python', java: 'Java', sql: 'SQL', htmlCss: 'HTML/CSS', cCpp: 'C/C++' },
      frontend: { react: 'React', vue: 'Vue', angular: 'Angular', litElements: 'Lit-Elements', webComponents: 'Web Components', jsx: 'JSX' },
      backendApis: { nodejs: 'Node.js', rest: 'REST', soap: 'SOAP', protobuf: 'Protobuf', wsdl: 'WSDL', swaggerOpenapiYaml: 'Swagger/OpenAPI (YAML)' },
      cloudDevops: { azure: 'Azure (AKS, CI/CD)', aws: 'AWS', kubernetes: 'Kubernetes', docker: 'Docker', git: 'Git', svn: 'SVN' },
      toolsPlatforms: { ibmDatapower: 'IBM DataPower/Integration Toolkit', weblogic: 'WebLogic', jmeter: 'JMeter', vite: 'Vite', webpack: 'Webpack', rollup: 'Rollup', figma: 'Figma' },
      methodologies: { agileScrum: 'Agile/Scrum', ciCd: 'CI/CD', microFrontends: 'Micro-Frontends', systemArchitecture: 'Architecture de système' },
    },
    games: {
      ticTacToe: { name: 'Tic Tac Toe', description: 'Jeu de stratégie classique pour deux joueurs. Le premier à aligner trois symboles gagne !' },
      game2048: { name: '2048', description: 'Faites glisser les tuiles numérotées pour les combiner et atteindre la tuile 2048.' },
      flappyBird: { name: 'Flappy Bird', description: 'Naviguez entre les tuyaux en tapant pour maintenir l\'oiseau en vol.' },
      snake: { name: 'Serpent', description: 'Contrôlez un serpent qui grandit en mangeant de la nourriture tout en évitant les murs et lui-même.' },
      memoryGame: { name: 'Jeu de Mémoire', description: 'Testez votre mémoire en associant des paires de cartes cachées.' },
      brickBreaker: { name: 'Casse-briques', description: 'Détruisez les briques avec une balle et une raquette. Cassez toutes les briques pour passer le niveau !' },
    },
  }),
} as const satisfies Record<string, Translations>;

/**
 * Helper function to flatten nested translation objects into flat key-value pairs
 */
function flattenTranslations(obj: Record<string, unknown>, prefix = ''): Translations {
  const result: Translations = {};
  
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        result[`${newKey}.${index}`] = item;
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTranslations(value as Record<string, unknown>, newKey));
    }
  }
  
  return result;
}
