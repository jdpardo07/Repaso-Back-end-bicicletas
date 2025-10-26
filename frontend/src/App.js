import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';

import Home from './pages/Home';
import Clientes from './components/Clientes';
import Compras from './components/Compras';
import Bicicletas from './components/Bicicletas';
import TiposBicicleta from './components/TiposBicicleta';
import Tiendas from './components/Tiendas';
import Repuestos from './components/Repuestos';
import Lujos from './components/Lujos';
import TiendaRepuestos from './components/TiendaRepuestos';

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Bicicletas App</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/clientes">
                <Nav.Link>Clientes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/compras">
                <Nav.Link>Compras</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/bicicletas">
                <Nav.Link>Bicicletas</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/tipos-bicicleta">
                <Nav.Link>Tienda de Bicicletas</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/tienda-repuestos">
                <Nav.Link>Repuestos de Bicicleta</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/bicicletas" element={<Bicicletas />} />
          <Route path="/tipos-bicicleta" element={<TiposBicicleta />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/repuestos" element={<Repuestos />} />
          <Route path="/lujos" element={<Lujos />} />
          <Route path="/tienda-repuestos" element={<TiendaRepuestos />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;