// src/routes/ProjectRoutes.tsx
import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Sobre from "../pages/Sobre/Sobre";
import NotFound from "../pages/NotFound";
import FazerLoginOne from "../pages/FazerLoginOne";
import HomeOne from "../pages/HomeOne/HomeOne";
import FazerLoginTwo from "../pages/FazerLoginTwo";
import FazerLoginThreeOne from "../pages/FazerLoginThreeOne";
import FazerLoginThree from "../pages/FazerLoginThree";
import BuscaOne from "../pages/BuscaOne";
import BuscaTwo from "../pages/BuscaTwo";
import BuscaTwoOne from "../pages/BuscaTwoOne";
import DadosAbertos from "../pages/DadosAbertos";
import Estilos from "../pages/Estilos";
import Componentes from "../pages/Componentes";
import ApoieEllas from "../pages/ApoieEllas/ApoieEllas";
import Contato from "../pages/Contato/Contato";
import Faq from "../pages/FAQ";
import GraphView from "../components/GraphView";
import PrivateRoute from "../components/PrivateRoute"; // Import the PrivateRoute component
import AdvancedSearchPage from "../pages/AdvancedSearch";
import SparqlWorkshopPage from "../pages/SparqlWorkshop";
import { PropertyTestComponent } from "../components";
import DiagnosticTest from "../components/DiagnosticTest";

const ProjectRoutes = () => {
  const defaultSearchHandler = () => {
    console.log("Default search handler");
  };

  let element = useRoutes([
    { path: "/", element: <HomeOne /> },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
    { path: "/sobre", element: <Sobre /> },
    { path: "/homeone", element: <HomeOne /> },
    { path: "/fazerloginone", element: <FazerLoginOne /> },
    { path: "/fazerlogintwo", element: <FazerLoginTwo /> },
    { path: "/fazerloginthreeone", element: <FazerLoginThreeOne /> },
    { path: "/fazerloginthree", element: <FazerLoginThree /> },
    {
      path: "/open-data/1",
      element: <BuscaOne onSearch={defaultSearchHandler} />,
    },
    { path: "/open-data/2", element: <BuscaTwo /> },
    { path: "/open-data/3", element: <BuscaTwoOne /> },
    { path: "/estilos", element: <Estilos /> },
    { path: "/componentes", element: <Componentes /> },
    { path: "/apoie-ellas", element: <ApoieEllas /> },
    { path: "/contato", element: <Contato /> },
    { path: "/faq", element: <Faq /> },
    { path: "/graph-view", element: <GraphView queryType="initiatives" /> },
    {
      path: "/policies-by-country",
      element: <GraphView queryType="policiesByCountry" />,
    },
    { path: "/policy-types", element: <GraphView queryType="policyTypes" /> },
    {
      path: "/policy-results",
      element: <GraphView queryType="policyResults" />,
    },
    {
      path: "/policies-by-country-and-date",
      element: <GraphView queryType="policiesByCountryAndDate" />,
    },
    { path: "/advanced-search", element: <AdvancedSearchPage /> },
    { path: "/sparql-workshop", element: <SparqlWorkshopPage /> },
    { path: "/property-test", element: <PropertyTestComponent /> },
    { path: "/diagnostic-test", element: <DiagnosticTest /> },
  ]);

  return element;
};

export default ProjectRoutes;
