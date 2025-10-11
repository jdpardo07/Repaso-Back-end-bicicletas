import React from 'react';
import './Navbar.css';
// Importa los componentes de React Router para navegación
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Importa los componentes de cada página
import Clientes from './Clientes';
import Compras from './Compras';
import Bicicletas from './Bicicletas';


function App() {

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-link">Clientes</Link>
        <Link to="/compras" className="navbar-link">Compras</Link>
        <Link to="/bicicletas" className="navbar-link">Bicicletas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/bicicletas" element={<Bicicletas />} />
      </Routes>
    </Router>
  );
}

export default App;
