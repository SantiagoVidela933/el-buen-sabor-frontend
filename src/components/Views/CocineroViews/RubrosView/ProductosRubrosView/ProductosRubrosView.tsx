import { useState, useMemo } from "react";
import styles from "./ProductosRubrosView.module.css";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Modal from "../../../../ui/Modal/Modal"; // Asume que Modal.tsx está en el mismo directorio o lo ajustas
import CrearModificarProductoRubro from "../ProductosRubrosView/CrearModificarProductoRubro/CrearModificarProductoRubro"; // Importamos el nuevo componente
import modalSpecificStyles from "./ProductosRubrosView.module.css";

interface RubroProducto {
    id: number;
    nombre: string;
    rubroPadre: string;
    estado: "Alta" | "Baja";
}

// Simulación de un generador de IDs para nuevos rubros
let nextId = 6; // Empieza después de los hardcodeados

const rubrosHardcoded: RubroProducto[] = [
    { id: 1, nombre: "Pizzas", rubroPadre: "Comidas", estado: "Alta" },
    {
        id: 2,
        nombre: "Bebidas sin alcohol",
        rubroPadre: "Bebidas",
        estado: "Alta",
    },
    { id: 3, nombre: "Cafetería", rubroPadre: "Bebidas", estado: "Baja" },
    { id: 4, nombre: "Guarniciones", rubroPadre: "Comidas", estado: "Alta" },
    { id: 5, nombre: "Postres", rubroPadre: "Comidas", estado: "Alta" },
];

const ProductosRubrosView = () => {
    const [search, setSearch] = useState("");
    const [rubros, setRubros] = useState<RubroProducto[]>(rubrosHardcoded);

    // Nuevo estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para guardar el rubro que se está editando (o null si es nuevo)
    const [rubroToEdit, setRubroToEdit] = useState<RubroProducto | undefined>(undefined);

    // Nuevo estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Cantidad de filas por página

    // Filtrado según búsqueda
    const filteredRubros = useMemo(() => {
        return rubros.filter((rubro) =>
            rubro.nombre.toLowerCase().includes(search.toLowerCase())
        );
    }, [rubros, search]);

    // Calcular cantidad total de páginas
    const totalPages = Math.ceil(filteredRubros.length / itemsPerPage);

    // Calcular qué rubros mostrar en la página actual
    const currentRubros = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRubros.slice(startIndex, endIndex);
    }, [filteredRubros, currentPage]);

    // Resetear página cuando cambia la búsqueda para evitar páginas vacías
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // --- Funciones para manejar el modal ---

    const handleNewRubro = () => {
        setRubroToEdit(undefined); // Para asegurar que el formulario esté vacío
        setIsModalOpen(true);
    };

    const handleEditRubro = (rubro: RubroProducto) => {
        setRubroToEdit(rubro); // Carga los datos del rubro a editar
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRubroToEdit(undefined); // Limpia el rubro en edición al cerrar
    };

    const handleSaveRubro = (newRubroData: Omit<RubroProducto, 'id'>, id?: number) => {
        if (id) {
            // Es una edición
            setRubros(prevRubros =>
                prevRubros.map(rubro =>
                    rubro.id === id ? { ...rubro, ...newRubroData, id } : rubro
                )
            );
        } else {
            // Es un nuevo rubro
            setRubros(prevRubros => [
                ...prevRubros,
                { ...newRubroData, id: nextId++ } // Asigna un nuevo ID
            ]);
        }
        handleCloseModal(); // Cierra el modal después de guardar
    };

    const handleDeleteRubro = (id: number) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este rubro?")) {
            setRubros(prevRubros => prevRubros.filter(rubro => rubro.id !== id));
        }
    };


    return (
        <div className={styles.rubrosWrapper}>
            <div className={styles.header}>
                <button className={styles.nuevoButton} onClick={handleNewRubro}>
                    Nuevo
                </button>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Buscar rubro"
                        value={search}
                        onChange={onSearchChange}
                    />
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Rubro</th>
                        <th>Rubro Padre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRubros.length > 0 ? (
                        currentRubros.map((rubro) => (
                            <tr
                                key={rubro.id}
                                className={rubro.estado === "Baja" ? styles.bajaRow : ""}
                            >
                                <td>{rubro.nombre}</td>
                                <td>{rubro.rubroPadre}</td>
                                <td>{rubro.estado}</td>
                                <td className={styles.acciones}>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => handleEditRubro(rubro)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => handleDeleteRubro(rubro.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className={styles.noData}>
                                No hay rubros que coincidan con tu búsqueda.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`${styles.paginationButton} ${
                                currentPage === i + 1 ? styles.activePage : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal para Crear/Modificar Rubro */}
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    className={modalSpecificStyles.wideModalContent} // <--- PASA LA NUEVA CLASE AQUÍ
                >
                    <CrearModificarProductoRubro
                        rubroInicial={rubroToEdit}
                        onSave={handleSaveRubro}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ProductosRubrosView;