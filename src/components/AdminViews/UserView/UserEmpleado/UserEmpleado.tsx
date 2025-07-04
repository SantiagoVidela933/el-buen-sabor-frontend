import { useState, useEffect } from "react";
import styles from "./UserEmpleado.module.css";
import { Empleado } from "../../../../models/Empleado";
import Modal from "../../../ui/Modal/Modal";
import UserEmpleadoForm from "./UserEmpleadoForm/UserEmpleadoForm";
import {
  getEmpleados,
  eliminarEmpleadoAPI,
  reactivarEmpleadoAPI,
} from "../../../../api/empleado";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const UserEmpleado = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<"crear" | "editar">(
    "crear"
  );
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<
    Empleado | undefined
  >(undefined);
  const [filtro, setFiltro] = useState<string>("");

  const empleadosPorPagina = 8; 
  const [paginaActual, setPaginaActual] = useState(1); 

  const cargarEmpleados = async () => {
    try {
      const data = await getEmpleados();
      const listado = data
        .map((item) => Empleado.fromJson(item))
        .filter((e): e is Empleado => e !== null && e.id != null);
      setEmpleados(listado);
      setPaginaActual(1); 
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const abrirCrearEmpleado = () => {
    setModoFormulario("crear");
    setEmpleadoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarEmpleado = (empleado: Empleado) => {
    setModoFormulario("editar");
    setEmpleadoSeleccionado(empleado);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const manejarSubmit = (empleadoActualizado: Empleado) => {
    if (modoFormulario === "crear") {
      setEmpleados((prev) => [...prev, empleadoActualizado]);
    } else {
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === empleadoActualizado.id ? empleadoActualizado : emp
        )
      );
    }
    cerrarModal();
    cargarEmpleados(); 
  };

  const eliminarEmpleado = async (id: number) => {
    try {
      const empleado = empleados.find((e) => e.id === id);
      if (empleado?.fechaBaja) {
        alert(
          "No se puede eliminar un empleado dado de baja. Por favor, reactivelo primero."
        );
        return;
      }

      Swal.fire({
        title: "¿Estas seguro que deseas dar de baja el registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, dar de baja",
        cancelButtonText: "Cancelar"
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          await eliminarEmpleadoAPI(id);
          cargarEmpleados(); // Recargar para actualizar la lista y la paginación
          Swal.fire({
            title: "Dado de baja!",
            text: "El registro ha sido exitosamente dado de baja.",
            icon: "success"
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `"Error al dar de baja empleado:", ${error}`
      });
    }
  };

  const reactivarEmpleado = async (id: number) => {
    try {
      await reactivarEmpleadoAPI(id);
      cargarEmpleados(); 
      Swal.fire({
        title: "Dado de alta!",
        text: "El registro ha sido exitosamente dado de alta.",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `"Error al dar de baja empleado:", ${error}`
      });
    }
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const nombreCompleto = `${emp.nombre} ${emp.apellido}`.toLowerCase();
    return nombreCompleto.includes(filtro.toLowerCase());
  });

  const totalPaginas = Math.ceil(
    empleadosFiltrados.length / empleadosPorPagina
  );
  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * empleadosPorPagina,
    paginaActual * empleadosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>EMPLEADOS</h2>
          </div>
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
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>
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
          {empleadosPaginados.map((emp, index) => (
            <tr
              key={emp.id ?? `emp-${index}`}
              className={emp.fechaBaja ? styles.baja : ""}
            >
              <td>{`${emp.nombre} ${emp.apellido}`}</td>
              <td>{emp.email}</td>
              <td>{emp.telefono}</td>
              <td>{emp.domicilio?.calle || "-"}</td>
              <td>{emp.domicilio?.localidad?.nombre || "-"}</td>
              <td>{emp.rol}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => abrirEditarEmpleado(emp)}
                  disabled={!!emp.fechaBaja}
                >
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
          {empleadosPaginados.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No hay empleados que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
