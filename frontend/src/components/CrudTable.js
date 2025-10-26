
import React, { useEffect, useState } from 'react';
import API_URL from '../config';
import { Table, Button, Form, Spinner, Card, Row, Col, Modal } from 'react-bootstrap';

function CrudTable({ endpoint, columns, formFields, idKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [newItem, setNewItem] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = () => {
    setLoading(true);
  fetch(`${API_URL}/${endpoint}`)
      .then(res => res.json())
      .then(fetchedData => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${endpoint}:`, error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleShowDeleteModal = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
  fetch(`${API_URL}/${endpoint}/${itemToDelete}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
          const resData = await res.json();
          alert(resData.detail || 'Could not delete');
        } else {
          setData(data.filter(item => item[idKey] !== itemToDelete));
        }
        handleCloseDeleteModal();
      })
      .catch(error => {
        console.error(`Error deleting from ${endpoint}:`, error);
        alert('Could not delete. Check console for details.');
        handleCloseDeleteModal();
      });
  };

  const startEditing = (item) => {
    setEditing(item[idKey]);
    setForm(item);
  };

  const cancelEditing = () => {
    setEditing(null);
    setForm({});
  };

  const saveEdit = (id) => {
  fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) {
          const resData = await res.json();
          alert(resData.detail || 'Could not edit');
          return;
        }
        setData(data.map(item => (item[idKey] === id ? { ...item, ...form } : item)));
        cancelEditing();
      })
      .catch(error => {
        console.error(`Error saving edit to ${endpoint}:`, error);
        alert('Could not save edit. Check console for details.');
      });
  };

  const addItem = (e) => {
    e.preventDefault();
  fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
      .then(async res => {
        if (!res.ok) {
          const resData = await res.json();
          alert(resData.detail || 'Could not create');
          return;
        }
        fetchData();
        setNewItem({});
      })
      .catch(error => {
        console.error(`Error adding to ${endpoint}:`, error);
        alert('Could not add. Check console for details.');
      });
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /> <p>Loading...</p></div>;
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-3">
          {showAddForm ? 'Cancel' : 'Add New'}
        </Button>
        {showAddForm && (
          <Card>
            <Card.Header as="h5">Add New</Card.Header>
            <Card.Body>
              <Form onSubmit={addItem}>
                <Row>
                  {formFields.map(field => (
                    <Col md={field.col} key={field.name}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          required
                          type={field.type}
                          placeholder={field.placeholder}
                          value={newItem[field.name] || ''}
                          onChange={e => setNewItem({ ...newItem, [field.name]: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                  <Col md={1} className="d-grid">
                    <Button variant="primary" type="submit">Add</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        )}
      </div>

      <Card>
        <Card.Header as="h5">List</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item[idKey]}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {editing === item[idKey] ? (
                        <Form.Control
                          type={formFields.find(f => f.name === col.key)?.type || 'text'}
                          value={form[col.key]}
                          onChange={e => setForm({ ...form, [col.key]: e.target.value })}
                        />
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  <td>
                    {editing === item[idKey] ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => saveEdit(item[idKey])}>Save</Button>
                        <Button variant="secondary" size="sm" className="ms-2" onClick={cancelEditing}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="warning" size="sm" onClick={() => startEditing(item)}>Edit</Button>
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => handleShowDeleteModal(item[idKey])}>Delete</Button>
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
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CrudTable;
