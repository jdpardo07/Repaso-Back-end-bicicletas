import React, { useEffect, useState } from 'react';

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/ventas')
      .then(res => res.json())
      .then(data => {
        setCompras(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Compras de Clientes</h2>
      <table border="1" cellPadding="5">
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
      </table>
    </div>
  );
}

export default Compras;
