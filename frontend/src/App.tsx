// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import ProjectRoutes from "./routes/ProjectRoutes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarStateContext";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "./i18n";
import AdvancedSearchPage from './pages/AdvancedSearch';

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

// Componente para limpar parâmetros de URL quando estiver na página inicial
const QueryParamCleaner = () => {
  const location = useLocation();

  useEffect(() => {
    // Se estiver na página inicial e houver parâmetros de consulta
    if (location.pathname === "/" && location.search) {
      // Limpa os parâmetros de consulta da URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <HashRemover />
      <QueryParamCleaner />
      <LanguageProvider>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <ProjectRoutes />
              </div>
              <Footer />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
