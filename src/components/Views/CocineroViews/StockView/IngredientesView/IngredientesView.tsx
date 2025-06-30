import { useState } from "react";
import styles from "./IngredientesView.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../../../ui/Modal/Modal";
import RegistrarCompra from "../../StockView/IngredientesView/RegistrarCompra/RegistrarCompra";
import CrearModificarIngrediente from "../../../CocineroViews/StockView/IngredientesView/CrearModificarIngrediente/CrearModificarIngrediente"; // Importa el nuevo componente

type Ingrediente = {
  id: number;
  nombre: string;
  rubro: string;
  precioCosto: number;
  stockMinimo: number;
  stockActual: number;
  unidad: string;
  estado: "Alta" | "Baja";
};

const calcularNivelStock = (ingrediente: Ingrediente) => {
  if (ingrediente.stockActual === 0) return "Faltante";
  if (ingrediente.stockActual <= ingrediente.stockMinimo) return "Pedir";
  if (ingrediente.stockActual <= ingrediente.stockMinimo + 2) return "Óptimo";
  return "Alto";
};

// Exporta INGREDIENTES_DATA para que RegistrarCompra.tsx pueda usarlo
export const INGREDIENTES_DATA_INITIAL: Ingrediente[] = [ // Renombrado a INGREDIENTES_DATA_INITIAL
  // 🔽 Aquí podés duplicar para testear más páginas
  {
    id: 1,
    nombre: "Tomate",
    rubro: "Verdura",
    precioCosto: 100,
    stockMinimo: 3,
    stockActual: 0,
    unidad: "kg",
    estado: "Baja",
  },
  {
    id: 2,
    nombre: "Harina",
    rubro: "Secos",
    precioCosto: 80,
    stockMinimo: 5,
    stockActual: 7,
    unidad: "kg",
    estado: "Alta",
  },
  {
    id: 3,
    nombre: "Queso",
    rubro: "Lácteos",
    precioCosto: 300,
    stockMinimo: 2,
    stockActual: 2,
    unidad: "kg",
    estado: "Baja",
  },
  {
    id: 4,
    nombre: "Lechuga",
    rubro: "Verdura",
    precioCosto: 70,
    stockMinimo: 4,
    stockActual: 6,
    unidad: "unidad",
    estado: "Alta",
  },
  {
    id: 5,
    nombre: "Aceite",
    rubro: "Aceites",
    precioCosto: 400,
    stockMinimo: 3,
    stockActual: 1,
    unidad: "lt",
    estado: "Baja",
  },
  {
    id: 6,
    nombre: "Pan",
    rubro: "Panadería",
    precioCosto: 50,
    stockMinimo: 4,
    stockActual: 5,
    unidad: "unidad",
    estado: "Alta",
  },
  {
    id: 7,
    nombre: "Sal",
    rubro: "Condimentos",
    precioCosto: 30,
    stockMinimo: 2,
    stockActual: 0,
    unidad: "kg",
    estado: "Baja",
  },
  {
    id: 8,
    nombre: "Pollo",
    rubro: "Carnes",
    precioCosto: 900,
    stockMinimo: 3,
    stockActual: 3,
    unidad: "kg",
    estado: "Alta",
  },
  {
    id: 9,
    nombre: "Papas",
    rubro: "Verdura",
    precioCosto: 60,
    stockMinimo: 5,
    stockActual: 4,
    unidad: "kg",
    estado: "Alta",
  },
  {
    id: 10,
    nombre: "Huevos",
    rubro: "Lácteos",
    precioCosto: 200,
    stockMinimo: 10,
    stockActual: 8,
    unidad: "unidad",
    estado: "Baja",
  },
  {
    id: 11,
    nombre: "Cebolla",
    rubro: "Verdura",
    precioCosto: 90,
    stockMinimo: 2,
    stockActual: 2,
    unidad: "kg",
    estado: "Alta",
  },
  {
    id: 12,
    nombre: "Pimienta",
    rubro: "Condimentos",
    precioCosto: 250,
    stockMinimo: 1,
    stockActual: 1,
    unidad: "kg",
    estado: "Baja",
  },
];

const IngredientesView = () => {
  const [stockFilter, setStockFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegistrarCompraModal, setShowRegistrarCompraModal] = useState(false);
  const [showCrearModificarIngredienteModal, setShowCrearModificarIngredienteModal] = useState(false); // Nuevo estado
  const [ingredienteToEdit, setIngredienteToEdit] = useState<Ingrediente | undefined>(undefined); // Nuevo estado para el ingrediente a editar
  const [ingredientesData, setIngredientesData] = useState<Ingrediente[]>(INGREDIENTES_DATA_INITIAL); // Usar estado para los datos de ingredientes
  const itemsPerPage = 5;

  const filtrados = ingredientesData.filter((ing) => { // Usar ingredientesData del estado
    const nivel = calcularNivelStock(ing);
    const coincideFiltro =
      stockFilter === "todos" || nivel.toLowerCase() === stockFilter;
    const coincideBusqueda = ing.nombre
      .toLowerCase()
      .includes(search.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  // Paginación
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtrados.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Funciones para el modal de RegistrarCompra
  const handleOpenRegistrarCompra = () => {
    setShowRegistrarCompraModal(true);
  };

  const handleCloseRegistrarCompra = () => {
    setShowRegistrarCompraModal(false);
  };

  const handleSaveCompra = (data: { ingrediente: string; cantidad: number; precioCosto: number }) => {
    setIngredientesData(prevData =>
      prevData.map(ing =>
        ing.nombre === data.ingrediente
          ? { ...ing, stockActual: ing.stockActual + data.cantidad }
          : ing
      )
    );
    alert(`Compra de ${data.cantidad} de ${data.ingrediente} a $${data.precioCosto.toFixed(2)} registrada.`);
  };

  // Funciones para el modal de Crear/Modificar Ingrediente
  const handleOpenCrearIngrediente = () => {
    setIngredienteToEdit(undefined); // Asegura que el formulario esté en blanco
    setShowCrearModificarIngredienteModal(true);
  };

  const handleOpenEditarIngrediente = (ingrediente: Ingrediente) => {
    setIngredienteToEdit(ingrediente); // Carga el ingrediente a editar
    setShowCrearModificarIngredienteModal(true);
  };

  const handleCloseCrearModificarIngrediente = () => {
    setShowCrearModificarIngredienteModal(false);
    setIngredienteToEdit(undefined); // Limpiar el ingrediente a editar al cerrar
  };

  const handleSaveIngrediente = (ingredienteGuardado: Omit<Ingrediente, 'id'> & { id?: number }) => {
    if (ingredienteGuardado.id) {
      // Es una edición
      setIngredientesData(prevData =>
        prevData.map(ing =>
          ing.id === ingredienteGuardado.id
            ? { ...ing, ...ingredienteGuardado as Ingrediente } // Actualiza con los nuevos datos
            : ing
        )
      );
      alert(`Ingrediente "${ingredienteGuardado.nombre}" actualizado correctamente.`);
    } else {
      // Es un nuevo ingrediente
      const newId = Math.max(...ingredientesData.map(ing => ing.id)) + 1; // Genera un ID simple
      const nuevoIngredienteConId: Ingrediente = {
        ...ingredienteGuardado as Ingrediente,
        id: newId,
      };
      setIngredientesData(prevData => [...prevData, nuevoIngredienteConId]);
      alert(`Ingrediente "${nuevoIngredienteConId.nombre}" creado correctamente.`);
    }
  };

  return (
    <div className={styles.productosWrapper}>
      <div className={styles.header}>
        <div>
          <button
            className={styles.registrarButton}
            onClick={handleOpenRegistrarCompra}
          >
            Registrar compra
          </button>
          <button
            className={styles.nuevoButton}
            onClick={handleOpenCrearIngrediente} // Abre el modal de Crear/Modificar para un nuevo ingrediente
          >
            Nuevo
          </button>
        </div>

        <div className={styles.filtroWrapper}>
          <label htmlFor="stockFilter">Nivel de stock:</label>
          <select
            id="stockFilter"
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1); // reset page
            }}
          >
            <option value="todos">Todos</option>
            <option value="óptimo">Óptimo</option>
            <option value="pedir">Pedir</option>
            <option value="faltante">Faltante</option>
          </select>
        </div>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Rubro</th>
              <th>Precio de costo</th>
              <th>Stock mínimo</th>
              <th>Stock actual</th>
              <th>Unidad medida</th>
              <th>Nivel de stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ing) => {
              const nivel = calcularNivelStock(ing);
              const isBaja = ing.estado === "Baja";

              return (
                <tr key={ing.id} className={isBaja ? styles.bajaRow : ""}>
                  <td>{ing.nombre}</td>
                  <td>{ing.rubro}</td> {/* Corregido el orden */}
                  <td>${ing.precioCosto}</td>
                  <td>{ing.stockMinimo}</td>
                  <td>{ing.stockActual}</td>
                  <td>{ing.unidad}</td>
                  <td>{nivel}</td>
                  <td>{ing.estado}</td>
                  <td className={styles.acciones}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleOpenEditarIngrediente(ing)} // Abre el modal de edición
                    >
                      <FaEdit />
                    </button>
                    <button className={styles.iconButton}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtrados.length > itemsPerPage && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`${styles.paginationButton} ${
                  currentPage === num ? styles.activePage : ""
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal para RegistrarCompra */}
      {showRegistrarCompraModal && (
        <Modal onClose={handleCloseRegistrarCompra}>
          <RegistrarCompra
            onClose={handleCloseRegistrarCompra}
            onSave={handleSaveCompra}
          />
        </Modal>
      )}

      {/* Modal para Crear/Modificar Ingrediente */}
      {showCrearModificarIngredienteModal && (
        <Modal onClose={handleCloseCrearModificarIngrediente}>
          <CrearModificarIngrediente
            onClose={handleCloseCrearModificarIngrediente}
            onSave={handleSaveIngrediente}
            ingredienteToEdit={ingredienteToEdit} // Pasa el ingrediente a editar
          />
        </Modal>
      )}
    </div>
  );
};

export default IngredientesView;