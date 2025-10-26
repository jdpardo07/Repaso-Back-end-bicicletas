
import React, { useState } from 'react';
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const repuestosData = [
  { id: 1, nombre: 'Llantas (par)', precio: 50, marca: 'Michelin' },
  { id: 2, nombre: 'Cámaras de aire (par)', precio: 15, marca: 'Continental' },
  { id: 3, nombre: 'Cadena de 11 velocidades', precio: 40, marca: 'Shimano' },
  { id: 4, nombre: 'Pastillas de freno (par)', precio: 25, marca: 'SRAM' },
  { id: 5, nombre: 'Discos de freno (unidad)', precio: 35, marca: 'Magura' },
  { id: 6, nombre: 'Manillar de carbono', precio: 150, marca: 'Race Face' },
  { id: 7, nombre: 'Asiento ergonómico', precio: 80, marca: 'Selle Italia' },
  { id: 8, nombre: 'Pedales automáticos', precio: 90, marca: 'Crankbrothers' },
  { id: 9, nombre: 'Juego de cables y fundas', precio: 20, marca: 'Jagwire' },
  { id: 10, nombre: 'Cassette 11-42', precio: 120, marca: 'SunRace' },
  { id: 11, nombre: 'Bielas de aluminio', precio: 180, marca: 'FSA' },
  { id: 12, nombre: 'Eje de pedalier', precio: 45, marca: 'Race Face' },
];

const Repuestos = () => {
  const navigate = useNavigate();
  const [repuestos, setRepuestos] = useState(repuestosData);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleAcquire = (repuesto) => {
    navigate('/compras', { state: { item: repuesto, type: 'repuesto' } });
  };

  const sortByMarca = () => {
    const sortedRepuestos = [...repuestos].sort((a, b) => {
      const marcaA = a.marca.toUpperCase();
      const marcaB = b.marca.toUpperCase();
      if (marcaA < marcaB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (marcaA > marcaB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setRepuestos(sortedRepuestos);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const resetSort = () => {
    setRepuestos(repuestosData);
    setSortOrder('asc');
  };

  return (
    <>
      <h2 className="mb-4">Repuestos para Bicicletas</h2>
      <div className="mb-3">
        <Button variant="secondary" onClick={sortByMarca}>
          Ordenar por Marca ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </Button>
        <Button variant="secondary" className="ms-2" onClick={resetSort}>
          Resetear Orden
        </Button>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {repuestos.map((repuesto) => (
          <Col key={repuesto.id}>
            <Card className="h-100">
              <Card.Header as="h5">{repuesto.nombre}</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Marca: {repuesto.marca}</ListGroup.Item>
                <ListGroup.Item>Precio: ${repuesto.precio}</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button variant="primary" onClick={() => handleAcquire(repuesto)}>
                  Adquirir
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Repuestos;
