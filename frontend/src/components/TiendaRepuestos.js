import React, { useState, useMemo } from 'react';
import { Table, Button, Container, Modal } from 'react-bootstrap';

const initialRepuestos = [
  { id: 1, nombre: 'Llanta de Montaña', marca: 'Maxxis', precio: 55.99, definicion: 'Neumático diseñado para ofrecer agarre y durabilidad en terrenos de montaña y senderos.' },
  { id: 2, nombre: 'Frenos de Disco Hidráulicos', marca: 'Shimano', precio: 120.50, definicion: 'Sistema de frenado que utiliza fluido hidráulico para una potencia de frenado superior y modulación.' },
  { id: 3, nombre: 'Cadena de 11 velocidades', marca: 'SRAM', precio: 45.00, definicion: 'Cadena compatible con sistemas de transmisión de 11 velocidades, optimizada para cambios suaves.' },
  { id: 4, nombre: 'Sillín Ergonómico', marca: 'Selle Italia', precio: 85.75, definicion: 'Asiento diseñado para maximizar la comodidad y minimizar la presión en largos recorridos.' },
  { id: 5, nombre: 'Pedales Automáticos', marca: 'Look', precio: 99.99, definicion: 'Pedales que se enganchan a zapatillas especiales para una transferencia de potencia más eficiente.' },
  { id: 6, nombre: 'Cassette 11-42T', marca: 'Shimano', precio: 75.00, definicion: 'Conjunto de piñones traseros con un amplio rango de marchas, ideal para subidas empinadas.' },
  { id: 7, nombre: 'Manillar de Carbono', marca: 'RaceFace', precio: 150.00, definicion: 'Manillar ligero fabricado en fibra de carbono para reducir el peso y absorber vibraciones.' },
  { id: 8, nombre: 'Cubierta de Ruta', marca: 'Continental', precio: 65.25, definicion: 'Neumático liso y rápido, optimizado para bicicletas de carretera y pavimento.' },
  { id: 9, nombre: 'Juego de Ruedas de Carbono', marca: 'Zipp', precio: 1200.00, definicion: 'Ruedas de alto rendimiento, ligeras y aerodinámicas, para competición o uso avanzado.' },
  { id: 10, nombre: 'Desviador Trasero', marca: 'SRAM', precio: 250.50, definicion: 'Mecanismo que mueve la cadena entre los piñones del cassette para cambiar de marcha.' },
  { id: 11, nombre: 'Horquilla de Suspensión', marca: 'RockShox', precio: 450.00, definicion: 'Componente delantero que absorbe impactos y mejora el control en terrenos irregulares.' },
  { id: 12, nombre: 'Tija Telescópica', marca: 'Fox', precio: 300.00, definicion: 'Tubo de sillín que permite ajustar la altura del asiento sobre la marcha, ideal para MTB.' },
  { id: 13, nombre: 'Cinta de Manillar', marca: 'Lizard Skins', precio: 25.00, definicion: 'Cinta acolchada que se enrolla en el manillar para mejorar el agarre y la comodidad.' },
  { id: 14, nombre: 'Pastillas de Freno', marca: 'Shimano', precio: 15.99, definicion: 'Componente de fricción que presiona el disco de freno para detener la bicicleta.' },
];

function TiendaRepuestos() {
  const [repuestos, setRepuestos] = useState(initialRepuestos);
  const [sortConfig, setSortConfig] = useState({ key: 'precio', direction: 'ascending' });
  const [showModal, setShowModal] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);

  const handleShowModal = (repuesto) => {
    setSelectedRepuesto(repuesto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRepuesto(null);
  };

  const sortedRepuestos = useMemo(() => {
    let sortableItems = [...repuestos];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [repuestos, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Container>
      <h2 className="mt-4">Repuestos de Bicicleta</h2>
      <p>Encuentra una gran variedad de repuestos para tu bicicleta.</p>
      
      <div className="mb-3">
        <Button variant="secondary" onClick={() => requestSort('marca')} className="me-2">
          Ordenar por Marca {sortConfig.key === 'marca' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
        </Button>
        <Button variant="secondary" onClick={() => requestSort('precio')}>
          Ordenar por Precio {sortConfig.key === 'precio' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Definición</th>
          </tr>
        </thead>
        <tbody>
          {sortedRepuestos.map((repuesto) => (
            <tr key={repuesto.id}>
              <td>{repuesto.nombre}</td>
              <td>{repuesto.marca}</td>
              <td>${repuesto.precio.toFixed(2)}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(repuesto)}>
                  Ver Definición
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedRepuesto && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRepuesto.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Marca:</strong> {selectedRepuesto.marca}</p>
            <p><strong>Precio:</strong> ${selectedRepuesto.precio.toFixed(2)}</p>
            <hr />
            <p><strong>Definición:</strong></p>
            <p>{selectedRepuesto.definicion}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default TiendaRepuestos;