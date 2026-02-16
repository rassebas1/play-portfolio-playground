/**
 * src/utils/education_consts.ts
 *
 * Defines a constant array of educational experiences.
 * Each object in the array represents a single educational entry,
 * including details like degree, university, years, logo, a brief hook,
 * associated skills, key courses, a signature project, and a detailed description.
 * Content is provided in multiple languages (English, Spanish, French) for internationalization.
 */

/**
 * Array representing the user's educational background.
 * Each entry is an object containing details about a specific educational period.
 * @constant {Array<Object>} education
 * @property {Object} degree - The degree obtained, with multilingual support.
 * @property {string} degree.en - Degree in English.
 * @property {string} degree.es - Degree in Spanish.
 * @property {string} degree.fr - Degree in French.
 * @property {string} university - The name and location of the university/institution.
 * @property {string} years - The period of study (e.g., "2025-2026").
 * @property {string} logo - Path to the institution's logo image.
 * @property {Object} hook - A brief, catchy description of the focus, with multilingual support.
 * @property {string} hook.en - Hook in English.
 * @property {string} hook.es - Hook in Spanish.
 * @property {string} hook.fr - Hook in French.
 * @property {string[]} skills - An array of relevant skills acquired during this period.
 * @property {Object} courses - Key courses taken, with multilingual support.
 * @property {string[]} courses.en - Courses in English.
 * @property {string[]} courses.es - Courses in Spanish.
 * @property {string[]} courses.fr - Courses in French.
 * @property {Object} project - Details about a signature project.
 * @property {Object} project.title - Project title with multilingual support.
 * @property {string} project.title.en - Project title in English.
 * @property {string} project.title.es - Project title in Spanish.
 * @property {string} project.title.fr - Project title in French.
 * @property {string} project.thumbnail - Path to the project's thumbnail image.
 * @property {Object} description - Detailed description of achievements, with multilingual support.
 * @property {string[]} description.en - Description points in English.
 * @property {string[]} description.es - Description points in Spanish.
 * @property {string[]} description.fr - Description points in French.
 */
export const education = [
  {
    degree: "education.master.degree",
    university: "Ramon Llull - La Salle University, Barcelona, Spain",
    years: "2025-2026",
    logo: "/LS_logo.jpg",
    hook: "education.master.hook",
    skills: ["Python", "Spark", "Hadoop", "Azure", "AWS", "GCP"],
    courses: [
        "education.master.courses.0",
        "education.master.courses.1",
        "education.master.courses.2",
        "education.master.courses.3"
    ],
    project: {
      title: "education.master.project.title",
      thumbnail: "/biodcase_logo.png",
    },
    description: [
        "education.master.description.0",
        "education.master.description.1"
    ]
  },
  {
    degree: "education.engineer.degree",
    university: "Central University, Bogotá, Colombia",
    years: "2017-2022",
    logo: "/Logo_Ucentral.jpg",
    hook: "education.engineer.hook",
    skills: ["C/C++", "MATLAB", "VHDL", "STM32", "PSoC"],
    courses: [
        "education.engineer.courses.0",
        "education.engineer.courses.1",
        "education.engineer.courses.2",
        "education.engineer.courses.3"
    ],
    project: {
      title: "education.engineer.project.title",
      thumbnail: "public/RateHeart.png",
    },
    description: {
      en: [
        "Digital Image Processing Projects: Created an algorithm for mamal cancer detection using MATLAB. Created an algorithm for real-time object tracking using OpenCV and MATLAB.",
        "Embedded Systems Projects: Developed a propeller clock using ATMEGA16 microcontroller. Designed a line-following robot and participated with a 4th position result at RuniBot international Competition using STM32. Designed a prototype for ECG signal acquisition and processing using PSoC microcontroller with visualization on Android Devices and data storage using Firebase.",
      ],
      es: [
        "Proyectos de Procesamiento Digital de Imágenes: Creación de un algoritmo para la detección de cáncer de mama usando MATLAB. Creación de un algoritmo para el seguimiento de objetos en tiempo real usando OpenCV y MATLAB.",
        "Proyectos de Sistemas Embebidos: Desarrollo de un reloj de hélice usando el microcontrolador ATMEGA16. Diseño de un robot seguidor de línea y participación con un 4º puesto en la Competición internacional RuniBot usando STM32. Diseño de un prototipo para la adquisición y procesamiento de señales ECG usando el microcontrolador PSoC con visualización en Dispositivos Android y almacenamiento de datos usando Firebase.",
      ],
      fr: [
        "Projets de traitement d'images numériques : Création d'un algorithme de détection du cancer du sein à l'aide de MATLAB. Création d'un algorithme de suivi d'objets en temps réel à l'aide d'OpenCV et de MATLAB.",
        "Projets de systèmes embarqués : Développement d'une horloge à hélice à l'aide du microcontrôleur ATMEGA16. Conception d'un robot suiveur de ligne et participation avec un résultat de 4e position au concours international RuniBot à l'aide de STM32. Conception d'un prototype pour l'acquisition et le traitement du signal ECG à l'aide du microcontrôleur PSoC avec visualisation sur les appareils Android et stockage de données à l'aide de Firebase.",
      ]
    }
  },
  {
    degree: {
      en: "Bachelor of Science",
      es: "Bachillerato Científico",
      fr: "Baccalauréat scientifique"
    },
    university: "Lycée Français Louis Pasteur, Bogotá, Colombia",
    years: "1996-2012",
    logo: "/LF_logo.jpg",
    hook: {
      en: "Trilingual program with emphasis on sciences",
      es: "Programa trilingüe con énfasis en ciencias",
      fr: "Programme trilingue avec un accent sur les sciences"
    },
    skills: ["French", "Physics", "Chemistry", "Mathematics"],
    courses: {
      en: [
        "Advanced Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
      ],
      es: [
        "Matemáticas Avanzadas",
        "Física",
        "Química",
        "Biología",
      ],
      fr: [
        "Mathématiques avancées",
        "Physique",
        "Chimie",
        "Biologie",
      ]
    },
    project: {
      title: {
        en: "Bioluminescent Bacteria Culture",
        es: "Cultivo de Bacterias Bioluminiscentes",
        fr: "Culture de bactéries bioluminescentes"
      },
      thumbnail: "/placeholder.svg",
    },
    description: {
      en: [
        "Trilingual program: Spanish (Native), French (Baccalaureat), English.",
        "High shool diploma with emphasis on Mathematics, Physics, and Chemistry.",
        "Final Year Project: Investigation and culture of Bioluminiscent Bacteria.",
        "Member of Mathematics specialization club.",
        "Member of the Football team.",
      ],
      es: [
        "Programa trilingüe: Español (Nativo), Francés (Baccalaureat), Inglés.",
        "Diploma de bachillerato con énfasis en Matemáticas, Física y Química.",
        "Proyecto de Fin de Año: Investigación y cultivo de Bacterias Bioluminiscentes.",
        "Miembro del club de especialización en Matemáticas.",
        "Miembro del equipo de Fútbol.",
      ],
      fr: [
        "Programme trilingue : espagnol (natif), français (baccalauréat), anglais.",
        "Diplôme d'études secondaires avec une spécialisation en mathématiques, physique et chimie.",
        "Projet de fin d'études : Enquête et culture de bactéries bioluminescentes.",
        "Membre du club de spécialisation en mathématiques.",
        "Membre de l'équipe de football.",
      ]
    }
  },
];
