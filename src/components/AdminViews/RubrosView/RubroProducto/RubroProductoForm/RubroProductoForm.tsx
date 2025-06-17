import { useEffect, useState } from 'react';
import styles from './RubroProductoForm.module.css';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { createCategoria, updateCategoria } from '../../../../../api/articuloCategoria';

interface RubroProductFormProps {
  rubro?: CategoriaArticulo;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (rubroActualizado: CategoriaArticulo) => void;
}

const RubroProductoForm = ({ rubro, modo, onClose, onSubmit }: RubroProductFormProps) => {
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

    const payload = {
      denominacion: descripcion,
      categoriaPadreId: rubro?.categoriaPadre?.id ?? null,
      sucursalId: 1, 
      fechaBaja: estado === 'Baja' ? (rubro?.fechaBaja ?? new Date().toISOString()) : null,
    };

    if (modo === "editar" && rubro?.id) {
      try {
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
      <h2>{modo === 'crear' ? 'Crear Rubro Producto' : 'Modificar Rubro Producto'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

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

export default RubroProductoForm;
