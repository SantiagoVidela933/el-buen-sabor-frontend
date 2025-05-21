import { useState, useMemo } from "react"; // Asegúrate de importar useMemo
import styles from "./ProductosView.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../../../ui/Modal/Modal";
import CrearModificarProducto from "./CrearModificarProducto/CrearModificarProducto";

interface Producto {
  id: number;
  nombre: string;
  rubro: string;
  precioVenta: number;
  tiempoEnCocina: string;
  estado: "Alta" | "Baja";
}

const productosHardcoded: Producto[] = [
  { id: 1, nombre: "lorem ipsum dolor sit amet 1", rubro: "Lorem Ipsum", precioVenta: 340, tiempoEnCocina: "45 min", estado: "Baja" },
  { id: 2, nombre: "lorem ipsum dolor sit amet 2", rubro: "Lorem Ipsum", precioVenta: 340, tiempoEnCocina: "45 min", estado: "Alta" },
  { id: 3, nombre: "pizza especial", rubro: "Pizzas", precioVenta: 850, tiempoEnCocina: "30 min", estado: "Alta" },
  { id: 4, nombre: "hamburguesa doble", rubro: "Hamburguesas", precioVenta: 950, tiempoEnCocina: "25 min", estado: "Alta" },
  { id: 5, nombre: "papas fritas", rubro: "Guarniciones", precioVenta: 300, tiempoEnCocina: "15 min", estado: "Alta" },
  { id: 6, nombre: "ensalada cesar", rubro: "Ensaladas", precioVenta: 700, tiempoEnCocina: "20 min", estado: "Alta" },
  { id: 7, nombre: "soda grande", rubro: "Bebidas", precioVenta: 200, tiempoEnCocina: "5 min", estado: "Alta" },
  { id: 8, nombre: "torta de chocolate", rubro: "Postres", precioVenta: 450, tiempoEnCocina: "10 min", estado: "Alta" },
  { id: 9, nombre: "cafe con leche", rubro: "Cafetería", precioVenta: 150, tiempoEnCocina: "5 min", estado: "Baja" },
  { id: 10, nombre: "sandwich de jamon y queso", rubro: "Sandwiches", precioVenta: 600, tiempoEnCocina: "10 min", estado: "Alta" },
  { id: 11, nombre: "jugo de naranja", rubro: "Bebidas", precioVenta: 250, tiempoEnCocina: "5 min", estado: "Alta" },
  { id: 12, nombre: "milanesa con fritas", rubro: "Comidas", precioVenta: 1100, tiempoEnCocina: "35 min", estado: "Alta" },
  { id: 13, nombre: "sorbete de limon", rubro: "Postres", precioVenta: 380, tiempoEnCocina: "5 min", estado: "Alta" },
  { id: 14, nombre: "agua mineral", rubro: "Bebidas", precioVenta: 180, tiempoEnCocina: "2 min", estado: "Baja" },
  { id: 15, nombre: "pasta con salsa", rubro: "Pastas", precioVenta: 900, tiempoEnCocina: "25 min", estado: "Alta" },
];


const ProductosView = () => {
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState<Producto[]>(productosHardcoded);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cantidad de productos por página, puedes ajustar esto

  // Filtra los productos basados en la búsqueda
  const filteredProductos = useMemo(() => {
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }, [productos, search]); // Re-calcula solo cuando productos o search cambian

  // Calcula los productos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  const abrirModalParaCrear = () => {
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalParaEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const guardarProducto = (producto: Producto) => {
    setProductos((prev) =>
      prev.some((p) => p.id === producto.id)
        ? prev.map((p) => (p.id === producto.id ? producto : p))
        : [...prev, producto]
    );
    setModalAbierto(false);
    // Después de guardar/crear, podrías querer volver a la primera página
    // o a la página donde se encontraría el nuevo/editado producto.
    // Por simplicidad, volvemos a la primera.
    setCurrentPage(1);
  };

  // Función para cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.productosWrapper}>
      <div className={styles.header}>
        <button className={styles.nuevoButton} onClick={abrirModalParaCrear}>
          Nuevo
        </button>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al buscar
            }}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Rubro</th>
            <th>Precio Venta</th>
            <th>Tiempo en cocina</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapea sobre los productos de la página actual */}
          {currentProductos.length > 0 ? (
            currentProductos.map((producto) => (
              <tr
                key={producto.id}
                className={producto.estado === "Baja" ? styles.bajaRow : ""}
              >
                <td>{producto.nombre}</td>
                <td>{producto.rubro}</td>
                <td>${producto.precioVenta.toFixed(2)}</td> {/* Añadido .toFixed(2) para formato de moneda */}
                <td>{producto.tiempoEnCocina}</td>
                <td>{producto.estado}</td>
                <td className={styles.acciones}>
                  <button
                    className={styles.iconButton}
                    onClick={() => abrirModalParaEditar(producto)}
                  >
                    <FaEdit />
                  </button>
                  <button className={styles.iconButton}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noData}>
                No hay productos que coincidan con tu búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`${styles.paginationButton} ${
                currentPage === i + 1 ? styles.activePage : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {modalAbierto && (
        <Modal onClose={() => setModalAbierto(false)}>
          <CrearModificarProducto
            producto={productoSeleccionado ?? undefined}
            onGuardar={guardarProducto}
            onCancelar={() => setModalAbierto(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductosView;