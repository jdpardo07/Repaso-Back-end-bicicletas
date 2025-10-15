import React, { useEffect, useState } from 'react';
import { Table, Spinner, Card } from 'react-bootstrap';

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/ventas')
      .then(res => res.json())
      .then(data => {
        setCompras(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Cargando...</p></div>;
  }

  return (
    <Card>
      <Card.Header as="h5">Compras de Clientes</Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(compra => (
              <tr key={compra.id_venta}>
                <td>{compra.id_venta}</td>
                <td>{compra.cliente}</td>
                <td>{compra.fecha}</td>
                <td>{compra.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default Compras;
