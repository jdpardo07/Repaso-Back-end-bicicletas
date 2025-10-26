
import React from 'react';
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const catalogoData = [
  // Data from TiendaRepuestos.js (already has definitions)
  { id: 1, nombre: 'Llanta de Montaña', marca: 'Maxxis', precio: 55.99, definicion: 'Neumático diseñado para ofrecer agarre y durabilidad en terrenos de montaña y senderos.', tipo: 'repuesto' },
  { id: 2, nombre: 'Frenos de Disco Hidráulicos', marca: 'Shimano', precio: 120.50, definicion: 'Sistema de frenado que utiliza fluido hidráulico para una potencia de frenado superior y modulación.', tipo: 'repuesto' },
  { id: 3, nombre: 'Cadena de 11 velocidades', marca: 'SRAM', precio: 45.00, definicion: 'Cadena compatible con sistemas de transmisión de 11 velocidades, optimizada para cambios suaves.', tipo: 'repuesto' },
  { id: 4, nombre: 'Sillín Ergonómico', marca: 'Selle Italia', precio: 85.75, definicion: 'Asiento diseñado para maximizar la comodidad y minimizar la presión en largos recorridos.', tipo: 'repuesto' },
  { id: 5, nombre: 'Pedales Automáticos', marca: 'Look', precio: 99.99, definicion: 'Pedales que se enganchan a zapatillas especiales para una transferencia de potencia más eficiente.', tipo: 'repuesto' },
  { id: 6, nombre: 'Cassette 11-42T', marca: 'Shimano', precio: 75.00, definicion: 'Conjunto de piñones traseros con un amplio rango de marchas, ideal para subidas empinadas.', tipo: 'repuesto' },
  { id: 7, nombre: 'Manillar de Carbono', marca: 'RaceFace', precio: 150.00, definicion: 'Manillar ligero fabricado en fibra de carbono para reducir el peso y absorber vibraciones.', tipo: 'repuesto' },
  { id: 8, nombre: 'Cubierta de Ruta', marca: 'Continental', precio: 65.25, definicion: 'Neumático liso y rápido, optimizado para bicicletas de carretera y pavimento.', tipo: 'repuesto' },
  { id: 9, nombre: 'Juego de Ruedas de Carbono', marca: 'Zipp', precio: 1200.00, definicion: 'Ruedas de alto rendimiento, ligeras y aerodinámicas, para competición o uso avanzado.', tipo: 'repuesto' },
  { id: 10, nombre: 'Desviador Trasero', marca: 'SRAM', precio: 250.50, definicion: 'Mecanismo que mueve la cadena entre los piñones del cassette para cambiar de marcha.', tipo: 'repuesto' },
  { id: 11, nombre: 'Horquilla de Suspensión', marca: 'RockShox', precio: 450.00, definicion: 'Componente delantero que absorbe impactos y mejora el control en terrenos irregulares.', tipo: 'repuesto' },
  { id: 12, nombre: 'Tija Telescópica', marca: 'Fox', precio: 300.00, definicion: 'Tubo de sillín que permite ajustar la altura del asiento sobre la marcha, ideal para MTB.', tipo: 'repuesto' },
  { id: 13, nombre: 'Cinta de Manillar', marca: 'Lizard Skins', precio: 25.00, definicion: 'Cinta acolchada que se enrolla en el manillar para mejorar el agarre y la comodidad.', tipo: 'repuesto' },
  { id: 14, nombre: 'Pastillas de Freno', marca: 'Shimano', precio: 15.99, definicion: 'Componente de fricción que presiona el disco de freno para detener la bicicleta.', tipo: 'repuesto' },
  // Data from Repuestos.js (definitions added)
  { id: 15, nombre: 'Llantas (par)', precio: 50, marca: 'Michelin', definicion: 'Juego de dos neumáticos para uso general en diversas condiciones.', tipo: 'repuesto' },
  { id: 16, nombre: 'Cámaras de aire (par)', precio: 15, marca: 'Continental', definicion: 'Dos cámaras de aire de repuesto para neumáticos de bicicleta.', tipo: 'repuesto' },
  { id: 17, nombre: 'Juego de cables y fundas', precio: 20, marca: 'Jagwire', definicion: 'Kit completo de cables y fundas para frenos y cambios.', tipo: 'repuesto' },
  { id: 18, nombre: 'Bielas de aluminio', precio: 180, marca: 'FSA', definicion: 'Juego de bielas y platos de aluminio, componente clave de la transmisión.', tipo: 'repuesto' },
  { id: 19, nombre: 'Eje de pedalier', precio: 45, marca: 'Race Face', definicion: 'Rodamiento que permite que las bielas giren suavemente.', tipo: 'repuesto' },
  // Data from Lujos.js (definitions added)
  { id: 20, nombre: 'Luces LED recargables (juego)', precio: 75, marca: 'Cateye', definicion: 'Set de luces delantera y trasera para visibilidad y seguridad.', tipo: 'lujo' },
  { id: 21, nombre: 'Ciclocomputador GPS', precio: 250, marca: 'Garmin', definicion: 'Dispositivo GPS para registrar rutas, velocidad, distancia y más métricas.', tipo: 'lujo' },
  { id: 22, nombre: 'Bolso de sillín de cuero', precio: 60, marca: 'Brooks', definicion: 'Elegante bolso de herramientas que se acopla debajo del sillín.', tipo: 'lujo' },
  { id: 23, nombre: 'Portabidón de carbono', precio: 55, marca: 'Elite', definicion: 'Soporte ultraligero de fibra de carbono para llevar botellas de agua.', tipo: 'lujo' },
  { id: 24, nombre: 'Maillot de ciclismo profesional', precio: 120, marca: 'Rapha', definicion: 'Camiseta técnica de alto rendimiento para ciclistas.', tipo: 'lujo' },
  { id: 25, nombre: 'Culotte con badana de gel', precio: 150, marca: 'Assos', definicion: 'Pantalón corto de ciclismo con acolchado de gel para máxima comodidad.', tipo: 'lujo' },
  { id: 26, nombre: 'Gafas de sol fotocromáticas', precio: 180, marca: 'Oakley', definicion: 'Gafas que se adaptan automáticamente a las condiciones de luz.', tipo: 'lujo' },
  { id: 27, nombre: 'Casco aerodinámico', precio: 220, marca: 'Giro', definicion: 'Casco diseñado para minimizar la resistencia al viento y maximizar la velocidad.', tipo: 'lujo' },
  { id: 28, nombre: 'Zapatillas de ciclismo de carbono', precio: 300, marca: 'Sidi', definicion: 'Zapatillas con suela de carbono rígida para una transferencia de potencia óptima.', tipo: 'lujo' },
  { id: 29, nombre: 'Rodillo de entrenamiento inteligente', precio: 800, marca: 'Wahoo', definicion: 'Dispositivo para entrenar en interiores que simula rutas y resistencias.', tipo: 'lujo' },
  { id: 30, nombre: 'Guardabarros de diseño', precio: 40, marca: 'SKS', definicion: 'Guardabarros elegantes para protegerte de salpicaduras de agua y barro.', tipo: 'lujo' },
  { id: 31, nombre: 'Timbre de diseño', precio: 30, marca: 'Knog', definicion: 'Timbre compacto y con estilo para anunciar tu presencia.', tipo: 'lujo' },
];

const Catalogo = () => {
  const navigate = useNavigate();

  const handlePurchase = (item) => {
    // We use a generic 'item' object to pass to the Compras page
    navigate('/compras', { state: { item: item } });
  };

  return (
    <>
      <h2 className="mb-4">Catálogo de Productos</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {catalogoData.map((item) => (
          <Col key={item.id}>
            <Card className="h-100 d-flex flex-column">
              <Card.Header as="h5">{item.nombre}</Card.Header>
              <Card.Body className="d-flex flex-column flex-grow-1">
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Marca:</strong> {item.marca}</ListGroup.Item>
                  <ListGroup.Item><strong>Precio:</strong> ${item.precio.toFixed(2)}</ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Definición:</strong> {item.definicion}
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-auto">
                  <Button variant="primary" className="w-100" onClick={() => handlePurchase(item)}>
                    Comprar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Catalogo;
