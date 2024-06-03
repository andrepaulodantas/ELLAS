// src/App.tsx
import React from "react";
import ProjectRoutes from "./routes/Routes";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header className="header" />
      <ProjectRoutes />
    </div>
  );
};

export default App;
