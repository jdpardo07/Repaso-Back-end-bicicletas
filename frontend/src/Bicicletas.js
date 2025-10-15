import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Spinner, Card, Row, Col, Modal } from 'react-bootstrap';

function Bicicletas() {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // ID de la bicicleta en edición
  const [form, setForm] = useState({ marca: '', modelo: '', precio: '' });
  const [nuevo, setNuevo] = useState({ marca: '', modelo: '', precio: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bicicletaAEliminar, setBicicletaAEliminar] = useState(null);

  // --- FETCH (READ) ---
  const fetchBicicletas = () => {
    setLoading(true);
    fetch('http://localhost:8000/bicicletas')
      .then(res => res.json())
      .then(data => {
        setBicicletas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBicicletas();
  }, []);

  // --- DELETE ---
  const handleShowDeleteModal = (id) => {
    setBicicletaAEliminar(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBicicletaAEliminar(null);
  };

  const confirmarEliminar = () => {
    fetch(`http://localhost:8000/bicicletas/${bicicletaAEliminar}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.detail || 'No se pudo eliminar');
        } else {
          setBicicletas(bicicletas.filter(b => b.id_bicicleta !== bicicletaAEliminar));
        }
        handleCloseDeleteModal();
      });
  };

  // --- EDIT ---
  const abrirEditar = (bicicleta) => {
    setEditando(bicicleta.id_bicicleta);
    setForm({ marca: bicicleta.marca, modelo: bicicleta.modelo, precio: bicicleta.precio });
  };

  const cancelarEditar = () => {
    setEditando(null);
    setForm({ marca: '', modelo: '', precio: '' });
  };

  // --- UPDATE ---
  const guardarEdicion = (id) => {
    fetch(`http://localhost:8000/bicicletas/${id}`, {
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
        setBicicletas(bicicletas.map(b => b.id_bicicleta === id ? { ...b, ...form } : b));
        cancelarEditar();
      });
  };

  // --- CREATE ---
  const agregarBicicleta = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/bicicletas', {
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
        fetchBicicletas(); // Recargar lista
        setNuevo({ marca: '', modelo: '', precio: '' });
      });
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Cargando...</p></div>;
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header as="h5">Agregar Nueva Bicicleta</Card.Header>
        <Card.Body>
          <Form onSubmit={agregarBicicleta}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control required placeholder="Marca" value={nuevo.marca} onChange={e => setNuevo({ ...nuevo, marca: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control required placeholder="Modelo" value={nuevo.modelo} onChange={e => setNuevo({ ...nuevo, modelo: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Control required type="number" placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
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
        <Card.Header as="h5">Lista de Bicicletas</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Precio</th>
                <th style={{width: '180px'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bicicletas.map(bici => (
                <tr key={bici.id_bicicleta}>
                  <td>{bici.id_bicicleta}</td>
                  <td>
                    {editando === bici.id_bicicleta ? (
                      <Form.Control value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />
                    ) : bici.marca}
                  </td>
                  <td>
                    {editando === bici.id_bicicleta ? (
                      <Form.Control value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} />
                    ) : bici.modelo}
                  </td>
                  <td>
                    {editando === bici.id_bicicleta ? (
                      <Form.Control type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
                    ) : bici.precio}
                  </td>
                  <td>
                    {editando === bici.id_bicicleta ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => guardarEdicion(bici.id_bicicleta)}>Guardar</Button>
                        <Button variant="secondary" size="sm" className="ms-2" onClick={cancelarEditar}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="warning" size="sm" onClick={() => abrirEditar(bici)}>Editar</Button>
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => handleShowDeleteModal(bici.id_bicicleta)}>Eliminar</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta bicicleta?</Modal.Body>
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

export default Bicicletas;
