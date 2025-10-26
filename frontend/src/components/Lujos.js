
import React from 'react';
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const lujos = [
  { id: 1, nombre: 'Luces LED recargables (juego)', precio: 75, marca: 'Cateye' },
  { id: 2, nombre: 'Ciclocomputador GPS', precio: 250, marca: 'Garmin' },
  { id: 3, nombre: 'Bolso de sillín de cuero', precio: 60, marca: 'Brooks' },
  { id: 4, nombre: 'Portabidón de carbono', precio: 55, marca: 'Elite' },
  { id: 5, nombre: 'Maillot de ciclismo profesional', precio: 120, marca: 'Rapha' },
  { id: 6, nombre: 'Culotte con badana de gel', precio: 150, marca: 'Assos' },
  { id: 7, nombre: 'Gafas de sol fotocromáticas', precio: 180, marca: 'Oakley' },
  { id: 8, nombre: 'Casco aerodinámico', precio: 220, marca: 'Giro' },
  { id: 9, nombre: 'Zapatillas de ciclismo de carbono', precio: 300, marca: 'Sidi' },
  { id: 10, nombre: 'Rodillo de entrenamiento inteligente', precio: 800, marca: 'Wahoo' },
  { id: 11, nombre: 'Guardabarros de diseño', precio: 40, marca: 'SKS' },
  { id: 12, nombre: 'Timbre de diseño', precio: 30, marca: 'Knog' },
];

const Lujos = () => {
  const navigate = useNavigate();

  const handleAcquire = (lujo) => {
    navigate('/compras', { state: { bicicleta: lujo } });
  };

  return (
    <>
      <h2 className="mb-4">Lujos para Bicicletas</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {lujos.map((lujo) => (
          <Col key={lujo.id}>
            <Card className="h-100">
              <Card.Header as="h5">{lujo.nombre}</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Marca: {lujo.marca}</ListGroup.Item>
                <ListGroup.Item>Precio: ${lujo.precio}</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button variant="success" onClick={() => handleAcquire(lujo)}>
                  Comprar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Lujos;
