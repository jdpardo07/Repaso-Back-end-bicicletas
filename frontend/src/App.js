import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Clientes from './Clientes';
import Compras from './Compras';
import Bicicletas from './Bicicletas';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Repaso App</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Clientes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/compras">
                <Nav.Link>Compras</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/bicicletas">
                <Nav.Link>Bicicletas</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Clientes />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/bicicletas" element={<Bicicletas />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;