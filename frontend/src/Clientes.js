import React from 'react';
import CrudTable from './CrudTable';

function Clientes() {
  const columns = [
    { key: 'id_usuario', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
  ];

  const formFields = [
    { name: 'nombre', placeholder: 'Nombre', col: 4, type: 'text' },
    { name: 'email', placeholder: 'Email', col: 4, type: 'email' },
    { name: 'ciudad', placeholder: 'Ciudad', col: 3, type: 'text' },
  ];

  return (
    <CrudTable
      endpoint="usuarios"
      columns={columns}
      formFields={formFields}
      idKey="id_usuario"
    />
  );
}

export default Clientes;