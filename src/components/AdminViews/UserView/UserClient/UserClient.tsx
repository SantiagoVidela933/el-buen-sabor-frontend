import { useEffect, useState } from 'react';
import styles from './UserClient.module.css';
import Modal from '../../../ui/Modal/Modal';
import UserClienteForm from './UserClienteForm/UserClienteForm';
import { Cliente } from '../../../../models/Cliente';
import {
  getClientesJSONFetch,
  eliminarCliente,
  reactivarCliente
} from '../../../../api/cliente';

const UserClient = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | undefined>(undefined);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (!modalAbierto) {
      cargarClientes();
    }
  }, [modalAbierto]);

  const cargarClientes = async () => {
    try {
      const data = await getClientesJSONFetch();

      // Ordena clientes: activos primero
      const ordenados = [...data].sort((a, b) => {
        if (!a.fechaBaja && b.fechaBaja) return -1;
        if (a.fechaBaja && !b.fechaBaja) return 1;
        return 0;
      });

      setClientes(ordenados);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const abrirEditarCliente = (cliente: Cliente) => {
    setModoFormulario('editar');
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteSeleccionado(undefined);
  };

  const manejarSubmit = async (clienteActualizado: Cliente) => {
    try {
      console.log('Cliente actualizado:', clienteActualizado);
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar clientes:", error);
      alert("Hubo un error al actualizar la lista de clientes.");
    }
  };

  const manejarEliminar = async (clienteId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await eliminarCliente(clienteId);
        setClientes(prev =>
          prev.map(c =>
            c.id === clienteId ? { ...c, fechaBaja: new Date().toISOString() } : c
          )
        );
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Hubo un error al eliminar el cliente.");
      }
    }
  };

  const manejarReactivar = async (clienteId: number) => {
    try {
      await reactivarCliente(clienteId);
      setClientes(prev =>
        prev.map(c =>
          c.id === clienteId ? { ...c, fechaBaja: null } : c
        )
      );
    } catch (error) {
      console.error("Error al reactivar cliente:", error);
      alert("Hubo un error al reactivar el cliente.");
    }
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            const estaInactivo = cliente.fechaBaja !== null;

            return (
              <tr key={cliente.id} className={estaInactivo ? styles.inactivo : ''}>
                <td>{`${cliente.nombre} ${cliente.apellido}`}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.domicilio?.calle || 'Sin dirección'}</td>
                <td>{cliente.domicilio?.localidad?.nombre || 'Sin localidad'}</td>
                <td>
                  {!estaInactivo ? (
                    <>
                      <button className={styles.editBtn} onClick={() => abrirEditarCliente(cliente)}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => manejarEliminar(cliente.id)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </>
                  ) : (
                    <button className={styles.reactivateBtn} onClick={() => manejarReactivar(cliente.id)}>
                      <span className="material-symbols-outlined">restart_alt</span>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalAbierto && (
        <Modal onClose={cerrarModal}>
          <UserClienteForm
            modo={modoFormulario}
            cliente={clienteSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserClient;
