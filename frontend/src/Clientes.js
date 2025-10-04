import React, { useEffect, useState } from 'react';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // usuario en edición
  const [form, setForm] = useState({ nombre: '', email: '', ciudad: '' });
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', ciudad: '' });

  // Obtener todos los clientes (READ)
  useEffect(() => {
    fetch('http://localhost:8000/usuarios')
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      });
  }, []);

  // Eliminar cliente (DELETE)
  const eliminarCliente = (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este cliente?')){
      fetch(`http://localhost:8000/usuarios/${id}`, { method: 'DELETE' })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json();
            alert(data.detail || 'No se pudo eliminar');
            return;
          }
          setClientes(clientes.filter(c => c.id_usuario !== id));
        });
    }
  };


  // Abrir formulario de edición (EDIT)
  // Esta función se llama cuando haces clic en el botón "Editar" de un cliente.
  // 1. Guarda el id del cliente que quieres editar en el estado 'editando'.
  //    Así React sabe cuál fila está en modo edición.
  // 2. Copia los datos actuales del cliente al estado 'form',
  //    para que los inputs del formulario muestren los valores actuales y puedas modificarlos.
  const abrirEditar = (cliente) => {
    setEditando(cliente.id_usuario); // Marca este cliente como el que se está editando
    setForm({ nombre: cliente.nombre, email: cliente.email, ciudad: cliente.ciudad }); // Llena el formulario con los datos actuales
  };


// Cancelar edición
// Esta función se llama cuando haces clic en el botón "Cancelar" durante la edición.
// 1. Limpia el estado 'editando' (lo pone en null), así React sabe que ya no estás editando ningún cliente.
// 2. Limpia el formulario, dejando los campos vacíos.
const cancelarEditar = () => {
  setEditando(null); // Sale del modo edición
  setForm({ nombre: '', email: '', ciudad: '' }); // Limpia los campos del formulario
};

  // Guardar cambios de edición (UPDATE)
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

  // Agregar nuevo cliente (CREATE)
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
        // Recargar lista
        fetch('http://localhost:8000/usuarios')
          .then(res => res.json())
          .then(data => setClientes(data));
        setNuevo({ nombre: '', email: '', ciudad: '' });
      });
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Clientes</h2>
      {/* Formulario para agregar nuevo cliente */}
      <form onSubmit={agregarCliente} style={{ marginBottom: 20 }}>
        <input required placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input required placeholder="Email" value={nuevo.email} onChange={e => setNuevo({ ...nuevo, email: e.target.value })} />
        <input required placeholder="Ciudad" value={nuevo.ciudad} onChange={e => setNuevo({ ...nuevo, ciudad: e.target.value })} />
        <button type="submit">Agregar</button>
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id_usuario}>
              <td>{cliente.id_usuario}</td>
              <td>
                {editando === cliente.id_usuario ? (
                  <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                ) : cliente.nombre}
              </td>
              <td>
                {editando === cliente.id_usuario ? (
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                ) : cliente.email}
              </td>
              <td>
                {editando === cliente.id_usuario ? (
                  <input value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                ) : cliente.ciudad}
              </td>
              <td>
                {editando === cliente.id_usuario ? (
                  <>
                    {/* Botón para guardar edición */}
                    <button onClick={() => guardarEdicion(cliente.id_usuario)}>Guardar</button>
                    {/* Botón para cancelar edición */}
                    <button onClick={cancelarEditar}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {/* Botón para editar */}
                    <button onClick={() => abrirEditar(cliente)}>Editar</button>
                    {/* Botón para eliminar */}
                    <button onClick={() => eliminarCliente(cliente.id_usuario)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;

/**
 * 
 * 
 * e: Es el evento que se dispara cuando ocurre un cambio en el input (por ejemplo, cuando escribes algo).
e.target: Es el elemento HTML que disparó el evento, en este caso el <input>.
e.target.value: Es el valor actual que tiene ese input (lo que el usuario está escribiendo).
<input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />

Cuando escribes en el input, se dispara el evento onChange.
e es el evento, e.target es el input, y e.target.value es el texto que escribiste.
setForm({ ...form, nombre: e.target.value }) actualiza el estado form con el nuevo valor de nombre.
Así React puede mostrar siempre el valor actualizado en el input y en el estado.
 */