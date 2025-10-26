
import React from 'react';
import { Button, Row, Col, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Home() {
  return (
    <>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Bienvenido a mi página web</h1>
          <p className="fs-4">Acá vas a ver todos los clientes, marcas y compras de bicicletas.</p>
          <LinkContainer to="/clientes">
            <Button variant="primary" size="lg" className="me-2">Ver Clientes</Button>
          </LinkContainer>
          <LinkContainer to="/compras">
            <Button variant="info" size="lg" className="me-2">Ver Compras</Button>
          </LinkContainer>
          <LinkContainer to="/bicicletas">
            <Button variant="success" size="lg">Ver Bicicletas</Button>
          </LinkContainer>
        </div>
      </div>
    </>
  );
}

export default Home;
