import { useState, useMemo } from "react";
import styles from "./IngredientesRubrosView.module.css"; // Nuevo CSS para este componente
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Modal from "../../../../ui/Modal/Modal"; // Asegúrate de que la ruta a tu modal base sea correcta
import CrearModificarIngredienteRubro from "../IngredientesRubrosView/CrearModificarIngredienteRubro/CrearModificarIngredienteRubro"; // Nuevo componente del modal
import modalSpecificStyles from "./IngredientesRubrosView.module.css"; // Usaremos este mismo archivo para la clase del modal

// Interfaz para Rubro de Ingrediente (adaptada)
interface RubroIngrediente {
    id: number;
    nombre: string;
    rubroPadre: string; // Puede ser 'null' o 'undefined' si es un rubro de nivel superior
    estado: "Alta" | "Baja";
}

// Simulación de datos hardcodeados para rubros de ingredientes
let nextIngredienteRubroId = 6; // Empieza después de los hardcodeados

const rubrosIngredientesHardcoded: RubroIngrediente[] = [
    { id: 1, nombre: "Lácteos", rubroPadre: "Materia Prima", estado: "Alta" },
    { id: 2, nombre: "Vegetales", rubroPadre: "Materia Prima", estado: "Alta" },
    { id: 3, nombre: "Carnes", rubroPadre: "Materia Prima", estado: "Alta" },
    { id: 4, nombre: "Frutas", rubroPadre: "Materia Prima", estado: "Alta" },
    { id: 5, nombre: "Especias", rubroPadre: "Materia Prima", estado: "Baja" },
];

const IngredientesRubrosView = () => {
    const [search, setSearch] = useState("");
    const [rubros, setRubros] = useState<RubroIngrediente[]>(rubrosIngredientesHardcoded);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rubroToEdit, setRubroToEdit] = useState<RubroIngrediente | undefined>(undefined);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const filteredRubros = useMemo(() => {
        return rubros.filter((rubro) =>
            rubro.nombre.toLowerCase().includes(search.toLowerCase())
        );
    }, [rubros, search]);

    const totalPages = Math.ceil(filteredRubros.length / itemsPerPage);

    const currentRubros = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRubros.slice(startIndex, endIndex);
    }, [filteredRubros, currentPage]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // --- Funciones para manejar el modal ---

    const handleNewRubro = () => {
        setRubroToEdit(undefined);
        setIsModalOpen(true);
    };

    const handleEditRubro = (rubro: RubroIngrediente) => {
        setRubroToEdit(rubro);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRubroToEdit(undefined);
    };

    const handleSaveRubro = (newRubroData: Omit<RubroIngrediente, 'id'>, id?: number) => {
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
                { ...newRubroData, id: nextIngredienteRubroId++ }
            ]);
        }
        handleCloseModal();
    };

    const handleDeleteRubro = (id: number) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este rubro de ingrediente?")) {
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
                        placeholder="Buscar rubro de ingrediente"
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
                                <td>{rubro.rubroPadre || 'N/A'}</td> {/* Muestra 'N/A' si no tiene rubro padre */}
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
                                No hay rubros de ingredientes que coincidan con tu búsqueda.
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

            {/* Modal para Crear/Modificar Rubro de Ingrediente */}
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    className={modalSpecificStyles.wideModalContent}
                >
                    <CrearModificarIngredienteRubro
                        rubroInicial={rubroToEdit}
                        onSave={handleSaveRubro}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default IngredientesRubrosView;