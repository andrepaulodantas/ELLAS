import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import FazerLoginOne from "pages/FazerLoginOne";
import HomeOne from "pages/HomeOne";
import FazerLoginTwo from "pages/FazerLoginTwo";
import FazerLoginThreeOne from "pages/FazerLoginThreeOne";
import FazerLoginThree from "pages/FazerLoginThree";
import BuscaOne from "pages/BuscaOne";
import BuscaTwo from "pages/BuscaTwo";
import BuscaTwoOne from "pages/BuscaTwoOne";
import Estilos from "pages/Estilos";
import Componentes from "pages/Componentes";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "dashboard", element: <Home /> },
    { path: "*", element: <NotFound /> },
    {
      path: "/",
      element: <FazerLoginOne />,
    },
    {
      path: "homeone",
      element: <HomeOne />,
    },
    {
      path: "fazerlogintwo",
      element: <FazerLoginTwo />,
    },
    {
      path: "fazerloginthreeone",
      element: <FazerLoginThreeOne />,
    },
    {
      path: "fazerloginthree",
      element: <FazerLoginThree />,
    },
    {
      path: "buscaone",
      element: <BuscaOne />,
    },
    {
      path: "buscatwo",
      element: <BuscaTwo />,
    },
    {
      path: "buscatwoone",
      element: <BuscaTwoOne />,
    },
    {
      path: "estilos",
      element: <Estilos />,
    },
    {
      path: "componentes",
      element: <Componentes />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
