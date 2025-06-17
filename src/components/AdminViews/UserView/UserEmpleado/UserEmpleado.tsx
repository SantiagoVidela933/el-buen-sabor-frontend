import { useState, useEffect } from 'react';
import styles from './UserEmpleado.module.css';
import { Empleado } from '../../../../models/Empleado';
import Modal from '../../../ui/Modal/Modal';
import UserEmpleadoForm from './UserEmpleadoForm/UserEmpleadoForm';

const UserEmpleado = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | undefined>(undefined);
  const [filtro, setFiltro] = useState<string>(''); // 🆕 filtro para la búsqueda

  const cargarEmpleados = () => {
    fetch('http://localhost:8080/api/empleados')
      .then(res => res.json())
      .then((data: any[]) => {
        const listado = data
          .map(item => Empleado.fromJson(item))
          .filter((e): e is Empleado => e !== null && e.id != null);
        setEmpleados(listado);
      })
      .catch(err => console.error('Error al cargar empleados:', err));
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

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

  const cerrarModal = () => setModalAbierto(false);

  const manejarSubmit = (empleadoActualizado: Empleado) => {
    if (modoFormulario === 'crear') {
      setEmpleados(prev => [...prev, empleadoActualizado]);
    } else {
      setEmpleados(prev =>
        prev.map(emp =>
          emp.id === empleadoActualizado.id ? empleadoActualizado : emp
        )
      );
    }
    cerrarModal();
  };

  const eliminarEmpleado = async (id: number) => {
    try {
      const empleado = empleados.find(e => e.id === id);
      if (empleado?.fechaBaja) {
        alert('No se puede eliminar un empleado dado de baja. Por favor, reactivelo primero.');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/empleados/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        cargarEmpleados(); // ✅ actualiza la lista
      } else {
        console.error(`Error al eliminar empleado con ID ${id}`);
      }
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  const darDeBajaEmpleado = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/empleados/${id}/baja`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fechaBaja: new Date().toISOString() })
      });

      if (response.ok) {
        cargarEmpleados();
      } else {
        console.error(`Error al dar de baja empleado con ID ${id}`);
      }
    } catch (error) {
      console.error('Error al dar de baja empleado:', error);
    }
  };

  const reactivarEmpleado = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/empleados/${id}/reactivar`, {
        method: 'PUT'
      });

      if (response.ok) {
        cargarEmpleados();
      } else {
        console.error(`Error al reactivar empleado con ID ${id}`);
      }
    } catch (error) {
      console.error('Error al reactivar empleado:', error);
    }
  };

  // 🆕 Empleados filtrados por nombre o apellido
  const empleadosFiltrados = empleados.filter(emp => {
    const nombreCompleto = `${emp.nombre} ${emp.apellido}`.toLowerCase();
    return nombreCompleto.includes(filtro.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Empleados</h2>
        <button className={styles.addBtn} onClick={abrirCrearEmpleado}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Localidad</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map((emp, index) => (
            <tr
              key={emp.id ?? `emp-${index}`}
              className={emp.fechaBaja ? styles.baja : ''}
            >
              <td>{`${emp.nombre} ${emp.apellido}`}</td>
              <td>{emp.email}</td>
              <td>{emp.telefono}</td>
              <td>{emp.domicilio?.calle || '-'}</td>
              <td>{emp.domicilio?.localidad?.nombre || '-'}</td>
              <td>{emp.rol}</td>
              <td>
                <button className={styles.editBtn} onClick={() => abrirEditarEmpleado(emp)} disabled={!!emp.fechaBaja}>
                  <span className="material-symbols-outlined">edit</span>
                </button>

                {emp.fechaBaja ? (
                  <button
                    className={styles.reactivarBtn}
                    onClick={() => reactivarEmpleado(emp.id!)}
                    title="Reactivar empleado"
                  >
                    <span className="material-symbols-outlined">autorenew</span>
                  </button>
                ) : (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => eliminarEmpleado(emp.id!)}
                    title="Eliminar empleado"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
          {empleadosFiltrados.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>No hay empleados que coincidan con la búsqueda.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalAbierto && (
        <Modal onClose={cerrarModal}>
          <UserEmpleadoForm
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

export default UserEmpleado;
