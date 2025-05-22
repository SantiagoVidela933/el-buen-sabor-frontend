import { useState, useEffect } from 'react';
import styles from './CrearModificarProductoRubro.module.css';

// Reutilizamos la interfaz del rubro que ya tienes
interface RubroProducto {
    id: number;
    nombre: string;
    rubroPadre: string;
    estado: "Alta" | "Baja";
}

interface CrearModificarProductoRubroProps {
    // Si se pasa un rubro, significa que es una edición
    rubroInicial?: RubroProducto;
    onSave: (rubro: Omit<RubroProducto, 'id'>, id?: number) => void; // Recibe el rubro (sin id si es nuevo) y el id si es edición
    onCancel: () => void;
    // Podrías pasar una lista de rubros padres disponibles si los tienes dinámicamente
    // rubrosPadresDisponibles: string[]; 
}

const CrearModificarProductoRubro = ({ rubroInicial, onSave, onCancel }: CrearModificarProductoRubroProps) => {
    const [nombre, setNombre] = useState(rubroInicial?.nombre || '');
    const [rubroPadre, setRubroPadre] = useState(rubroInicial?.rubroPadre || '');
    const [estado, setEstado] = useState<"Alta" | "Baja">(rubroInicial?.estado || 'Alta');

    // Efecto para actualizar el formulario si rubroInicial cambia (útil si el modal se reutiliza y cambia el rubro)
    useEffect(() => {
        setNombre(rubroInicial?.nombre || '');
        setRubroPadre(rubroInicial?.rubroPadre || '');
        setEstado(rubroInicial?.estado || 'Alta');
    }, [rubroInicial]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validaciones básicas (puedes añadir más)
        if (!nombre.trim() || !rubroPadre.trim()) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const nuevoRubro: Omit<RubroProducto, 'id'> = {
            nombre,
            rubroPadre,
            estado
        };

        onSave(nuevoRubro, rubroInicial?.id); // Pasa el ID si es edición
    };

    return (
        <div className={styles.formContainer}>
            <h2>{rubroInicial ? 'Modificar Rubro' : 'Crear Rubro'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="rubroPadre">Rubro Padre</label>
                    <input
                        type="text"
                        id="rubroPadre"
                        value={rubroPadre}
                        onChange={(e) => setRubroPadre(e.target.value)}
                        required
                    />
                    {/* Si tuvieras una lista de rubros padres dinámicos, aquí podrías usar un <select> */}
                    {/* <select
                        id="rubroPadre"
                        value={rubroPadre}
                        onChange={(e) => setRubroPadre(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un rubro padre</option>
                        {rubrosPadresDisponibles.map(rp => (
                            <option key={rp} value={rp}>{rp}</option>
                        ))}
                    </select> */}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="estado">Estado Alto/Baja</label>
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as "Alta" | "Baja")}
                    >
                        <option value="Alta">Alta</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>

                <div className={styles.buttons}>
                    <button type="button" className={styles.cancelButton} onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.saveButton}>
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearModificarProductoRubro;