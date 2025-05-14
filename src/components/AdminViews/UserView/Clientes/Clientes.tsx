import { useState } from 'react';
import styles from './Clientes.module.css';
import Modal from '../../../ui/Modal/Modal';
import ClienteForm from '../../../ui/ClienteForm/ClienteForm';
import Cliente from '../../../../models/Users/Cliente';

const empleadosIniciales: Cliente[] = [
  new Cliente(1,'JuanCliente', 'Pérez', 'juan.perez@example.com', '123456789', 'Calle Falsa 123', 'Godoy Cruz', 'Alta', '1990-01-01'),
  new Cliente(2,'AnaCliente', 'Gómez', 'ana.gomez@example.com', '987654321', 'Av. Siempreviva 742', 'Maipú', 'Baja', '1985-06-15')
];

const Clientes = () => {
  const [empleados, setClientes] = useState<Cliente[]>(empleadosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [empleadoSeleccionado, setClienteSeleccionado] = useState<Cliente | undefined>(undefined);

  const abrirCrearCliente = () => {
    setModoFormulario('crear');
    setClienteSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarCliente = (empleado: Cliente) => {
    setModoFormulario('editar');
    setClienteSeleccionado(empleado);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (empleadoActualizado: Cliente) => {
    if (modoFormulario === 'crear') {
      setClientes(prev => [...prev, empleadoActualizado]);
    } else {
      setClientes(prev =>
        prev.map(emp =>
          emp.email === empleadoSeleccionado?.email ? empleadoActualizado : emp
        )
      );
    }
    cerrarModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Clientes</h2>

      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder="Buscar por nombre..." />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Departamento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp, index) => (
            <tr key={index}>
              <td>{`${emp.nombre} ${emp.apellido}`}</td>
              <td>{emp.email}</td>
              <td>{emp.telefono}</td>
              <td>{emp.direccion}</td>
              <td>{emp.departamento}</td>
              <td>{emp.estado}</td>
              <td>
                <button className={styles.addBtn} onClick={abrirCrearCliente}>
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className={styles.editBtn} onClick={() => abrirEditarCliente(emp)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className={styles.deleteBtn}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <Modal onClose={cerrarModal}>
          <ClienteForm  
            modo={modoFormulario}
            empleado={empleadoSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default Clientes;
