// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ProjectRoutes from "./routes/ProjectRoutes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "./i18n";

// Componente para remover hash da URL se existir
const HashRemover = () => {
  useEffect(() => {
    if (window.location.hash) {
      // Se houver um hash na URL, remova-o
      const cleanPath = window.location.pathname + window.location.search;
      window.history.replaceState({}, document.title, cleanPath);
    }
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <HashRemover />
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <ProjectRoutes />
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
