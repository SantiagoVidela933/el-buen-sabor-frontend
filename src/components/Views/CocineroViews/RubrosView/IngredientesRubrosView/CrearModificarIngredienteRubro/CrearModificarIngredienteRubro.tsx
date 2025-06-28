import { useState, useEffect } from 'react';
import styles from './CrearModificarIngredienteRubro.module.css'; // Nuevo CSS para este formulario

// Reutilizamos la interfaz del rubro (adaptada para ingredientes)
interface RubroIngrediente {
    id: number;
    nombre: string;
    rubroPadre: string;
    estado: "Alta" | "Baja";
}

interface CrearModificarIngredienteRubroProps {
    rubroInicial?: RubroIngrediente;
    onSave: (rubro: Omit<RubroIngrediente, 'id'>, id?: number) => void;
    onCancel: () => void;
}

const CrearModificarIngredienteRubro = ({ rubroInicial, onSave, onCancel }: CrearModificarIngredienteRubroProps) => {
    const [nombre, setNombre] = useState(rubroInicial?.nombre || '');
    const [rubroPadre, setRubroPadre] = useState(rubroInicial?.rubroPadre || '');
    const [estado, setEstado] = useState<"Alta" | "Baja">(rubroInicial?.estado || 'Alta');

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

        const nuevoRubro: Omit<RubroIngrediente, 'id'> = {
            nombre,
            rubroPadre,
            estado
        };

        onSave(nuevoRubro, rubroInicial?.id);
    };

    return (
        <div className={styles.formContainer}>
            <h2>{rubroInicial ? 'Modificar Rubro de Ingrediente' : 'Crear Rubro de Ingrediente'}</h2>
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

export default CrearModificarIngredienteRubro;