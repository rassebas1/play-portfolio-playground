import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Create a minimal i18n instance for testing
// This uses simple translations without fetching from files
const testI18n = i18n.createInstance();

testI18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Common translations needed for tests
          'common.Home': 'Home',
          'common.Experience': 'Experience',
          'common.Skills': 'Skills',
          'common.Education': 'Education',
          'common.Games': 'Games',
          'common.Projects': 'Projects',
          'common.Contact': 'Contact',
          'common.NewGame': 'New Game',
          'common.Resume': 'Resume',
          'common.Play': 'Play',
          'common.Quit': 'Quit',
          'common.Pause': 'Pause',
          'common.Score': 'Score',
          'common.HighScore': 'High Score',
          'common.GameOver': 'Game Over',
          'common.YouWin': 'You Win!',
          'common.Start': 'Start',
          'common.Back': 'Back',
        },
      },
      es: {
        translation: {
          'common.Home': 'Inicio',
          'common.Experience': 'Experiencia',
          'common.Skills': 'Habilidades',
          'common.Education': 'Educación',
          'common.Games': 'Juegos',
          'common.Projects': 'Proyectos',
          'common.Contact': 'Contacto',
          'common.NewGame': 'Nuevo Juego',
          'common.Resume': 'Continuar',
          'common.Play': 'Jugar',
          'common.Quit': 'Salir',
          'common.Pause': 'Pausar',
          'common.Score': 'Puntuación',
          'common.HighScore': 'Mejor Puntuación',
          'common.GameOver': 'Fin del Juego',
          'common.YouWin': '¡Ganaste!',
          'common.Start': 'Iniciar',
          'common.Back': 'Volver',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default testI18n;