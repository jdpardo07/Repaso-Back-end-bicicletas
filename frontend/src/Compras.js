import React, { useEffect, useState } from 'react';
import { Table, Spinner, Card, Button, Form, Row, Col, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [newCliente, setNewCliente] = useState({ nombre: '', email: '', ciudad: '' });
  const [activeTab, setActiveTab] = useState('existing');

  const location = useLocation();
  const navigate = useNavigate();
  const { bicicleta } = location.state || {};

  useEffect(() => {
    // Fetch sales only if we are not in the process of a new purchase
    if (!bicicleta) {
      fetch('http://localhost:8000/ventas')
        .then(res => res.json())
        .then(data => {
          setCompras(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching compras:', error);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }

    // Fetch clients for the dropdown
    fetch('http://localhost:8000/usuarios')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Error fetching clientes:', error));
  }, [bicicleta]);

  const handlePurchase = (clienteId) => {
    const venta = {
      id_usuario: clienteId,
      id_bicicleta: bicicleta.id_bicicleta || null, // Handle bikes without id
      descripcion: `${bicicleta.nombre}`,
      total: bicicleta.precio,
    };

    fetch('http://localhost:8000/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    })
      .then(res => res.json())
      .then(newVenta => {
        alert('¡Compra completada!');
        navigate('/compras', { replace: true });
      })
      .catch(error => {
        console.error('Error completing purchase:', error);
        alert('No se pudo completar la compra.');
      });
  };

  const handleExistingClientPurchase = () => {
    if (!selectedCliente) {
      alert('Por favor, selecciona un cliente.');
      return;
    }
    handlePurchase(selectedCliente);
  };

  const handleNewClientPurchase = (e) => {
    e.preventDefault();
    // First, create the new client
    fetch('http://localhost:8000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCliente),
    })
      .then(res => {
        if (!res.ok) {
            throw new Error('Could not create client');
        }
        return res.json();
      })
      .then(createdUser => {
        // Then, make the purchase with the new client's ID
        handlePurchase(createdUser.id_usuario);
      })
      .catch(error => {
        console.error('Error creating new client:', error);
        alert('No se pudo registrar al nuevo cliente.');
      });
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Cargando...</p></div>;
  }

  if (bicicleta) {
    return (
      <Card>
        <Card.Header as="h5">Completar Compra</Card.Header>
        <Card.Body>
          <Card.Title>{bicicleta.nombre}</Card.Title>
          <Card.Text>Precio: ${bicicleta.precio}</Card.Text>

          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="existing">Cliente Existente</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="new">Cliente Nuevo</Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'existing' && (
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">Seleccionar Cliente</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            as="select"
                            value={selectedCliente}
                            onChange={e => setSelectedCliente(e.target.value)}
                        >
                            <option value="">Selecciona un cliente...</option>
                            {clientes.map(cliente => (
                            <option key={cliente.id_usuario} value={cliente.id_usuario}>
                                {cliente.nombre}
                            </option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Button variant="success" onClick={handleExistingClientPurchase}>
                    Completar Compra
                </Button>
            </Form>
          )}

          {activeTab === 'new' && (
            <Form onSubmit={handleNewClientPurchase}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">Nombre</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="text"
                            placeholder="Nombre completo"
                            required
                            value={newCliente.nombre}
                            onChange={e => setNewCliente({ ...newCliente, nombre: e.target.value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">Email</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            required
                            value={newCliente.email}
                            onChange={e => setNewCliente({ ...newCliente, email: e.target.value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">Ciudad</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="text"
                            placeholder="Ciudad"
                            required
                            value={newCliente.ciudad}
                            onChange={e => setNewCliente({ ...newCliente, ciudad: e.target.value })}
                        />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Registrar y Comprar
                </Button>
            </Form>
          )}
           <Button variant="secondary" className="mt-3 ms-2" onClick={() => navigate('/tipos-bicicleta')}>
              Cancelar
            </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header as="h5">Historial de Compras</Card.Header>
      <Card.Body>
        <Button variant="primary" className="mb-3" onClick={() => navigate('/tipos-bicicleta')}>
          Realizar una nueva compra
        </Button>
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
                <td>${compra.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default Compras;
