// src/App.tsx
import React from "react";
import ProjectRoutes from "./routes/ProjectRoutes";
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="App">
        <ProjectRoutes />
      </div>
    </LanguageProvider>
  );
};

export default App;
