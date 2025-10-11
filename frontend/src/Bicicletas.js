import React, { useEffect, useState } from 'react';
import './Navbar.css';
function Bicicletas() {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/bicicletas')
      .then(res => res.json())
      .then(data => {
        setBicicletas(data);
        setLoading(false);
      });
  }, []);

  

  if (loading) return <p>Cargando...</p>;

  return (
    <div className='table-bicilcetas'>
      <h2>Bicicletas</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {bicicletas.map(bici => (
            <tr key={bici.id_bicicleta}>
              <td>{bici.id_bicicleta}</td>
              <td>{bici.marca}</td>
              <td>{bici.modelo}</td>
              <td>{bici.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bicicletas;
