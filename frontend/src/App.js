import React from 'react';
// Importa los componentes de React Router para navegación
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Importa los componentes de cada página
import Clientes from './Clientes';
import Compras from './Compras';
import Bicicletas from './Bicicletas';

function App() {
  return (
    // Router envuelve toda la app para habilitar la navegación por rutas
    <Router>
      {/* Barra de navegación con enlaces a cada página */}
      <nav style={{ margin: 10 }}>
        {/* Link crea un enlace a la ruta de clientes */}
        <Link to="/" style={{ marginRight: 10 }}>Clientes</Link>
        {/* Link crea un enlace a la ruta de compras */}
        <Link to="/compras" style={{ marginRight: 10 }}>Compras</Link>
        {/* Link crea un enlace a la ruta de bicicletas */}
        <Link to="/bicicletas">Bicicletas</Link>
      </nav>
      {/* Routes define las rutas y qué componente mostrar en cada una */}
      <Routes>
        {/* Ruta raíz: muestra el componente Clientes */}
        <Route path="/" element={<Clientes />} />
        {/* Ruta /compras: muestra el componente Compras */}
        <Route path="/compras" element={<Compras />} />
        {/* Ruta /bicicletas: muestra el componente Bicicletas */}
        <Route path="/bicicletas" element={<Bicicletas />} />
      </Routes>
    </Router>
  );
}

export default App;
