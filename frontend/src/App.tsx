// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ProjectRoutes from "./routes/ProjectRoutes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
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
