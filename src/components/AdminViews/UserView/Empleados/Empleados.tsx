import { useState } from 'react';
import styles from './Empleados.module.css';
import Empleado from '../../../../models/Users/Empleado';
import Modal from '../../../ui/Modal/Modal';
import EmpleadoForm from '../../../ui/EmpleadoForm/EmpleadoForm';

const empleadosIniciales: Empleado[] = [
  new Empleado(1,'Juan', 'Pérez', 'juan.perez@example.com', '123456789', 'Calle Falsa 123', 'Godoy Cruz', 'Alta', '1990-01-01', 'Cocinero'),
  new Empleado(2,'Ana', 'Gómez', 'ana.gomez@example.com', '987654321', 'Av. Siempreviva 742', 'Maipú', 'Baja', '1985-06-15', 'Delivery')
];

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | undefined>(undefined);

  const abrirCrearEmpleado = () => {
    setModoFormulario('crear');
    setEmpleadoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarEmpleado = (empleado: Empleado) => {
    setModoFormulario('editar');
    setEmpleadoSeleccionado(empleado);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (empleadoActualizado: Empleado) => {
    if (modoFormulario === 'crear') {
      setEmpleados(prev => [...prev, empleadoActualizado]);
    } else {
      setEmpleados(prev =>
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
        <h2 className={styles.title}>Empleados</h2>

      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder="Buscar por nombre..." />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Empleado</th>
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
                <button className={styles.addBtn} onClick={abrirCrearEmpleado}>
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className={styles.editBtn} onClick={() => abrirEditarEmpleado(emp)}>
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
          <EmpleadoForm
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

export default Empleados;
