import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Spinner, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TiposBicicleta = () => {
  const navigate = useNavigate();
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping to restore the "type" information
  const bikeTypeMap = {
    'Marlin 5': 'Montaña', 'X-Caliber 8': 'Montaña', 'Domane AL 3': 'Ruta', 'Madone SL 6': 'Ruta',
    'Rockhopper Comp': 'Montaña', 'Stumpjumper Alloy': 'Montaña', 'Allez E5': 'Ruta', 'Tarmac SL6': 'Ruta',
    'Talon 2': 'Montaña', 'Trance X 29': 'Montaña', 'Contend AR 3': 'Ruta', 'Defy Advanced 2': 'Ruta',
    'Aspect 940': 'Montaña', 'Spark 970': 'Montaña', 'Speedster 50': 'Ruta', 'Addict 30': 'Ruta',
    'Neuron 5': 'Montaña', 'Spectral 29 CF 7': 'Montaña', 'Endurace AL 7.0': 'Ruta', 'Aeroad CF SL 8': 'Ruta',
    'Alma H50': 'Montaña', 'Oiz H30': 'Montaña', 'Avant H60': 'Ruta', 'Orca M30': 'Ruta'
  };

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/bicicletas')
      .then(res => res.json())
      .then(data => {
        setBicicletas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bicicletas:', error);
        setLoading(false);
      });
  }, []);

  const handleAcquire = (bicicleta) => {
    const bikeDataForPurchase = {
        ...bicicleta,
        nombre: bicicleta.modelo
    };
    navigate('/compras', { state: { bicicleta: bikeDataForPurchase } });
  };

  const groupedByMarca = bicicletas.reduce((acc, curr) => {
    (acc[curr.marca] = acc[curr.marca] || []).push(curr);
    return acc;
  }, {});

  const sortedMarcas = Object.entries(groupedByMarca).sort(([, aModels], [, bModels]) => {
    return bModels.length - aModels.length;
  });

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Cargando...</p></div>;
  }

  return (
    <>
      <h2 className="mb-4">Tienda de Bicicletas</h2>
      <Row xs={1} md={2} lg={4} className="g-2">
        {sortedMarcas.map(([marca, modelos]) => (
          <Col key={marca} className="d-flex">
            <Card className="h-100 w-100">
              <Card.Header as="h5">{marca}</Card.Header>
              <ListGroup variant="flush">
                {modelos.map((modelo) => (
                  <ListGroup.Item key={modelo.id_bicicleta} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{modelo.modelo}</div>
                      <small className="text-muted">{bikeTypeMap[modelo.modelo] || 'General'}</small>
                    </div>
                    <div className="text-end">
                        <div>${modelo.precio}</div>
                        <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAcquire(modelo)}>
                            Adquirir
                        </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default TiposBicicleta;
