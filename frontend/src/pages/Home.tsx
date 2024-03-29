import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div style={{ height: "100vh", padding: "20px", backgroundColor: "#232323", color: "white" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Homepage</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        This project was generated By{" "}      
        . Quickly use below links to navigate through all pages.
      </p>
      <ul style={{ listStyle: "none", padding: "0" }}>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/" style={{ color: "#87CEFA", textDecoration: "none" }}>
            FazerLoginOne
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/homeone" style={{ color: "#87CEFA", textDecoration: "none" }}>
            HomeOne
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/fazerlogintwo" style={{ color: "#87CEFA", textDecoration: "none" }}>
            FazerLoginTwo
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/fazerloginthreeone" style={{ color: "#87CEFA", textDecoration: "none" }}>
            FazerLoginThreeOne
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/fazerloginthree" style={{ color: "#87CEFA", textDecoration: "none" }}>
            FazerLoginThree
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/buscaone" style={{ color: "#87CEFA", textDecoration: "none" }}>
            BuscaOne
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/buscatwo" style={{ color: "#87CEFA", textDecoration: "none" }}>
            BuscaTwo
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/buscatwoone" style={{ color: "#87CEFA", textDecoration: "none" }}>
            BuscaTwoOne
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/estilos" style={{ color: "#87CEFA", textDecoration: "none" }}>
            Estilos
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/componentes" style={{ color: "#87CEFA", textDecoration: "none" }}>
            Componentes
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Home;
