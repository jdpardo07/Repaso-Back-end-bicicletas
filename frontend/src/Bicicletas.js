import React, { useEffect, useState } from 'react';
import API_URL from './config';
import { Card, Button, Row, Col, Form, InputGroup, Spinner, Modal, ListGroup } from 'react-bootstrap';

const Bicicletas = () => {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBike, setNewBike] = useState({ marca: '', modelo: '', precio: '', tipo: '' });

  // Mapping to restore the "type" information
  const bikeTypeMap = {
    'Marlin 5': 'Montaña', 'X-Caliber 8': 'Montaña', 'Domane AL 3': 'Ruta', 'Madone SL 6': 'Ruta',
    'Rockhopper Comp': 'Montaña', 'Stumpjumper Alloy': 'Montaña', 'Allez E5': 'Ruta', 'Tarmac SL6': 'Ruta',
    'Talon 2': 'Montaña', 'Trance X 29': 'Montaña', 'Contend AR 3': 'Ruta', 'Defy Advanced 2': 'Ruta',
    'Aspect 940': 'Montaña', 'Spark 970': 'Montaña', 'Speedster 50': 'Ruta', 'Addict 30': 'Ruta',
    'Neuron 5': 'Montaña', 'Spectral 29 CF 7': 'Montaña', 'Endurace AL 7.0': 'Ruta', 'Aeroad CF SL 8': 'Ruta',
    'Alma H50': 'Montaña', 'Oiz H30': 'Montaña', 'Avant H60': 'Ruta', 'Orca M30': 'Ruta'
  };

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_URL}/bicicletas`)
      .then(res => res.json())
      .then(data => {
        setBicicletas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bicicletas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (bicicleta) => {
    setEditingId(bicicleta.id_bicicleta);
    setNewPrice(bicicleta.precio);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewPrice('');
  };

  const handleSave = (id_bicicleta) => {
    fetch(`${API_URL}/bicicletas/${id_bicicleta}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ precio: parseFloat(newPrice) }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(updatedBike => {
        setBicicletas(bicicletas.map(b => b.id_bicicleta === id_bicicleta ? updatedBike : b));
        handleCancel();
      })
      .catch(error => {
        console.error('Error updating price:', error);
        alert('No se pudo actualizar el precio.');
      });
  };

  const handleShowDeleteModal = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewBike({ marca: '', modelo: '', precio: '', tipo: '' }); // Reset form
  };

  const handleNewBikeChange = (e) => {
    setNewBike({ ...newBike, [e.target.name]: e.target.value });
  };

  const handleSaveNewBike = () => {
    fetch(`${API_URL}/bicicletas`,
     {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newBike, precio: parseFloat(newBike.precio) }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create');
        return res.json();
      })
      .then(addedBike => {
        fetchData(); // Refetch data to include the new bike
        handleCloseAddModal();
      })
      .catch(error => {
        console.error('Error adding bike:', error);
        alert('No se pudo agregar la bicicleta.');
      });
  };

  const confirmDelete = () => {
    fetch(`${API_URL}/bicicletas/${itemToDelete}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.detail || 'Could not delete');
        }
        setBicicletas(bicicletas.filter(item => item.id_bicicleta !== itemToDelete));
        handleCloseDeleteModal();
      })
      .catch(error => {
        console.error(`Error deleting from bicicletas:`, error);
        alert(error.message || 'Could not delete. Check console for details.');
        handleCloseDeleteModal();
      });
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administrar Bicicletas</h2>
        <Button variant="primary" onClick={handleShowAddModal}>Agregar Bicicleta</Button>
      </div>
      <Row xs={1} md={2} lg={4} className="g-2">
        {sortedMarcas.map(([marca, modelos]) => (
          <Col key={marca} className="d-flex">
            <Card className="h-100 w-100">
              <Card.Header as="h5">{marca}</Card.Header>
              <ListGroup variant="flush">
                {modelos.map((modelo) => (
                  <ListGroup.Item key={modelo.id_bicicleta}>
                    <div className="fw-bold">{modelo.modelo}</div>
                    <small className="text-muted">{bikeTypeMap[modelo.modelo] || 'General'}</small>
                    {editingId === modelo.id_bicicleta ? (
                      <InputGroup size="sm" className="mt-2">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="Nuevo precio"
                        />
                        <Button variant="success" onClick={() => handleSave(modelo.id_bicicleta)}>Guardar</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                      </InputGroup>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span>${modelo.precio}</span>
                        <div>
                            <Button variant="warning" size="sm" onClick={() => handleEdit(modelo)}>
                                Editar
                            </Button>
                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleShowDeleteModal(modelo.id_bicicleta)}>
                                Eliminar
                            </Button>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Bicicleta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control type="text" name="marca" value={newBike.marca} onChange={handleNewBikeChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control type="text" name="modelo" value={newBike.modelo} onChange={handleNewBikeChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={newBike.precio} onChange={handleNewBikeChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text" name="tipo" value={newBike.tipo} onChange={handleNewBikeChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveNewBike}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar esta bicicleta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Bicicletas;