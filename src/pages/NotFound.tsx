import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

/**
 * NotFound component.
 * This component serves as the 404 error page for the application.
 * It displays a user-friendly message indicating that the requested page was not found
 * and provides a link to return to the home page. It also logs the non-existent route
 * to the console for debugging purposes.
 *
 * @returns {JSX.Element} The rendered 404 Not Found page.
 */
const NotFound = () => {
  const { t } = useTranslation();
  // `useLocation` hook from React Router DOM to get the current URL location.
  const location = useLocation();

  // Effect hook to log the non-existent route to the console.
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname // Logs the path that caused the 404.
    );
  }, [location.pathname]); // Dependency on location.pathname ensures this logs only when the path changes.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t('not_found.message')}</p>
        {/* Link to return to the home page */}
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t('not_found.return_home')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
