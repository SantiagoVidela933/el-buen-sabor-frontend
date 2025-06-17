import { useEffect, useState } from 'react';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { createCategoria, updateCategoria } from '../../../../../api/articuloCategoria';
import styles from './RubroIngredienteForm.module.css';

interface RubroIngredienteFormProps {
  rubro?: CategoriaArticulo;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (rubroActualizado: CategoriaArticulo) => void;
}

const RubroIngredienteForm = ({ rubro, onClose, modo, onSubmit }: RubroIngredienteFormProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'Alta' | 'Baja'>(rubro?.fechaBaja ? 'Baja' : 'Alta');
  
  useEffect(() => {
    if (rubro) {
      setDescripcion(rubro.denominacion);
      setEstado(rubro.fechaBaja ? 'Baja' : 'Alta');
    }
  }, [rubro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert("La denominación no puede estar vacía.");
      return;
    }

    const payload = {
      denominacion: descripcion,
      categoriaPadreId: null,
      sucursalId: 1, 
      fechaBaja: estado === 'Baja' ? new Date().toISOString() : null,
    };

    if (modo === "editar" && rubro?.id) {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        } else {
          payload.fechaBaja = null;
        }
        console.log("Payload enviado:", payload);
        const result = await updateCategoria(rubro.id, payload);
        onSubmit(result);
      } catch (error) {
        console.error("Error al actualizar la categoría:", error);
      }
    } else {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        }
        const result = await createCategoria(payload);
        onSubmit(result);
      } catch (error) {
        console.error("Error al crear la categoría:", error);
      }
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Rubro Ingrediente' : 'Modificar Rubro Ingrediente'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        {modo === 'crear' && (
          <div className={styles.fieldGroup}>
            <label>Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'Alta' | 'Baja')}
              >
                <option value="Alta">Alta</option>
                <option value="Baja">Baja</option>
              </select>
          </div>
        )}
      </div>

      <div className={styles.buttonActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className={styles.saveBtn}>Guardar</button>
      </div>
    </form>
  );
};

export default RubroIngredienteForm;
