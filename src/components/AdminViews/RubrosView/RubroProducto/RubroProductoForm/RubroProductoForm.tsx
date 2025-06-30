import { useEffect, useState } from 'react';
import styles from './RubroProductoForm.module.css';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { createCategoria, updateCategoria } from '../../../../../api/articuloCategoria';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

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
    if (!descripcion.trim()) {
      alert("La denominación no puede estar vacía.");
      return;
    }

    const payload = {
      denominacion: descripcion,
      categoriaPadreId: rubro?.categoriaPadre?.id ?? 3,
      sucursalId: 1, 
      fechaBaja: estado === 'Baja' ? new Date().toISOString() : null,
      categoriaInsumo: false,
    };

    if (modo === "editar" && rubro?.id) {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        } else {
          payload.fechaBaja = null;
        }
        const result = await updateCategoria(rubro.id, payload);
        Swal.fire({
          icon: "success",
          title: "Categoria actualizada exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });

        onSubmit(result);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error al actualizar la categoría`
        });
      }
    } else {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        }
        const result = await createCategoria(payload);
        Swal.fire({
          icon: "success",
          title: "Categoria creada exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
        onSubmit(result);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error al crear la categoría`
        });
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

export default RubroProductoForm;
