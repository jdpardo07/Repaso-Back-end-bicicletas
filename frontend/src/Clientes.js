import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Spinner, Card, Row, Col, Modal } from 'react-bootstrap';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // ID del cliente en edición
  const [form, setForm] = useState({ nombre: '', email: '', ciudad: '' });
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', ciudad: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);


  // --- FETCH (READ) ---
  const fetchClientes = () => {
    setLoading(true);
    fetch('http://localhost:8000/usuarios')
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // --- DELETE ---
  const handleShowDeleteModal = (id) => {
    setClienteAEliminar(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClienteAEliminar(null);
  };

  const confirmarEliminar = () => {
    fetch(`http://localhost:8000/usuarios/${clienteAEliminar}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.detail || 'No se pudo eliminar');
        } else {
          setClientes(clientes.filter(c => c.id_usuario !== clienteAEliminar));
        }
        handleCloseDeleteModal();
      });
  };

  // --- EDIT ---
  const abrirEditar = (cliente) => {
    setEditando(cliente.id_usuario);
    setForm({ nombre: cliente.nombre, email: cliente.email, ciudad: cliente.ciudad });
  };

  const cancelarEditar = () => {
    setEditando(null);
    setForm({ nombre: '', email: '', ciudad: '' });
  };

  // --- UPDATE ---
  const guardarEdicion = (id) => {
    fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.detail || 'No se pudo editar');
          return;
        }
        setClientes(clientes.map(c => c.id_usuario === id ? { ...c, ...form } : c));
        cancelarEditar();
      });
  };

  // --- CREATE ---
  const agregarCliente = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.detail || 'No se pudo crear');
          return;
        }
        fetchClientes(); // Recargar lista
        setNuevo({ nombre: '', email: '', ciudad: '' });
      });
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Cargando...</p></div>;
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card className="mb-4">
            <Card.Header as="h5">Agregar Nuevo Cliente</Card.Header>
            <Card.Body>
              <Form onSubmit={agregarCliente}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Control required placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Control required type="email" placeholder="Email" value={nuevo.email} onChange={e => setNuevo({ ...nuevo, email: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Control required placeholder="Ciudad" value={nuevo.ciudad} onChange={e => setNuevo({ ...nuevo, ciudad: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="d-grid">
                    <Button variant="primary" type="submit">Agregar</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5">Lista de Clientes</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Ciudad</th>
                    <th style={{width: '180px'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id_usuario}>
                      <td>{cliente.id_usuario}</td>
                      <td>
                        {editando === cliente.id_usuario ? (
                          <Form.Control value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                        ) : cliente.nombre}
                      </td>
                      <td>
                        {editando === cliente.id_usuario ? (
                          <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        ) : cliente.email}
                      </td>
                      <td>
                        {editando === cliente.id_usuario ? (
                          <Form.Control value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                        ) : cliente.ciudad}
                      </td>
                      <td>
                        {editando === cliente.id_usuario ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => guardarEdicion(cliente.id_usuario)}>Guardar</Button>
                            <Button variant="secondary" size="sm" className="ms-2" onClick={cancelarEditar}>Cancelar</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="warning" size="sm" onClick={() => abrirEditar(cliente)}>Editar</Button>
                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleShowDeleteModal(cliente.id_usuario)}>Eliminar</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Clientes;
