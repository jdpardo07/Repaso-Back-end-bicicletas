import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';

const Tiendas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bicicleta } = location.state || {};

  // Fictitious store data
  const storeData = {
    'Trek': [
      { name: 'Cycle World', city: 'New York', country: 'USA' },
      { name: 'Bike Hub', city: 'London', country: 'UK' },
      { name: 'Velo Passion', city: 'Paris', country: 'France' }
    ],
    'Specialized': [
      { name: 'The Bike Shop', city: 'Los Angeles', country: 'USA' },
      { name: 'Radsport-Zentrum', city: 'Berlin', country: 'Germany' },
      { name: 'Tokyo Cycle', city: 'Tokyo', country: 'Japan' }
    ],
    'Giant': [
        { name: 'Giant Store Sydney', city: 'Sydney', country: 'Australia' },
        { name: 'Mega Bike', city: 'Amsterdam', country: 'Netherlands' },
    ],
    'Scott': [
        { name: 'Scott Reference Center', city: 'Zurich', country: 'Switzerland' },
        { name: 'Mountain High', city: 'Vancouver', country: 'Canada' },
    ],
    'Canyon': [
        { name: 'Canyon Showroom', city: 'Koblenz', country: 'Germany' },
        { name: 'Online Direct', city: 'Online', country: 'Worldwide' },
    ],
    'Orbea': [
        { name: 'Orbea Store Madrid', city: 'Madrid', country: 'Spain' },
        { name: 'Basque Cycles', city: 'Bilbao', country: 'Spain' },
    ]
  };

  if (!bicicleta) {
    return (
      <Card className="text-center">
        <Card.Body>
          <Card.Title>No se ha seleccionado ninguna bicicleta</Card.Title>
          <Card.Text>
            Por favor, vuelve a la tienda y selecciona una bicicleta para ver sus distribuidores.
          </Card.Text>
          <Button variant="primary" onClick={() => navigate('/tipos-bicicleta')}>Volver a la Tienda</Button>
        </Card.Body>
      </Card>
    );
  }

  const tiendasDisponibles = storeData[bicicleta.marca] || [];

  return (
    <Card>
      <Card.Header as="h5">
        Distribuidores para la {bicicleta.marca} {bicicleta.modelo}
      </Card.Header>
      <Card.Body>
        {tiendasDisponibles.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tienda</th>
                <th>Ciudad</th>
                <th>País</th>
              </tr>
            </thead>
            <tbody>
              {tiendasDisponibles.map((tienda, index) => (
                <tr key={index}>
                  <td>{tienda.name}</td>
                  <td>{tienda.city}</td>
                  <td>{tienda.country}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hay distribuidores físicos conocidos para esta marca. Puede ser de venta directa online.</p>
        )}
        <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>Volver</Button>
      </Card.Body>
    </Card>
  );
};

export default Tiendas;
