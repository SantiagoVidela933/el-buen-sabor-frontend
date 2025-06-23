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
  const [filtroNombre, setFiltroNombre] = useState('');

  // --- Lógica de Paginación ---
  const clientesPorPagina = 8; // Define cuántos clientes mostrar por página
  const [paginaActual, setPaginaActual] = useState(1); // Estado para controlar la página actual


  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (!modalAbierto) {
      cargarClientes(); // Recarga clientes solo si el modal se cierra
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
      setPaginaActual(1); // Resetear a la primera página al cargar nuevos clientes
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
    cargarClientes(); // Aseguramos recarga al cerrar modal
  };

  const manejarSubmit = async (clienteActualizado: Cliente) => {
    try {
      console.log('Cliente actualizado:', clienteActualizado);
      cerrarModal();
      // La recarga se hará en `useEffect` cuando `modalAbierto` cambie a `false` o en `cerrarModal`
    } catch (error) {
      console.error("Error al actualizar clientes:", error);
      alert("Hubo un error al actualizar la lista de clientes.");
    }
  };

  const manejarEliminar = async (clienteId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await eliminarCliente(clienteId);
        // Actualizamos el estado local sin recargar completamente si solo se cambia `fechaBaja`
        setClientes(prev =>
          prev.map(c =>
            c.id === clienteId ? { ...c, fechaBaja: new Date().toISOString() } : c
          ).sort((a, b) => { // Re-ordenar después del cambio
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
          })
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
      // Actualizamos el estado local sin recargar completamente si solo se cambia `fechaBaja`
      setClientes(prev =>
        prev.map(c =>
          c.id === clienteId ? { ...c, fechaBaja: null } : c
        ).sort((a, b) => { // Re-ordenar después del cambio
          if (!a.fechaBaja && b.fechaBaja) return -1;
          if (a.fechaBaja && !b.fechaBaja) return 1;
          return 0;
        })
      );
    } catch (error) {
      console.error("Error al reactivar cliente:", error);
      alert("Hubo un error al reactivar el cliente.");
    }
  };

  // 🔎 Aplica filtro por nombre y apellido
  const clientesFiltrados = clientes.filter(cliente => {
    const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
    return nombreCompleto.includes(filtroNombre.toLowerCase());
  });

  // --- Cálculos para la paginación ---
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * clientesPorPagina,
    paginaActual * clientesPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* --- INICIO DEL CAMBIO --- */}
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>CLIENTES</h2>
          </div>
        </div>
        {/* --- FIN DEL CAMBIO --- */}

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => {
              setFiltroNombre(e.target.value);
              setPaginaActual(1); // Resetear a la primera página al cambiar el filtro
            }}
          />
        </div>
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
          {clientesPaginados.map((cliente) => { // Usamos clientesPaginados
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
          {clientesPaginados.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay clientes que coincidan con la búsqueda.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Sección de Paginación --- */}
      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={`${styles.paginationButton} ${
                paginaActual === i + 1 ? styles.activePage : ""
              }`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

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