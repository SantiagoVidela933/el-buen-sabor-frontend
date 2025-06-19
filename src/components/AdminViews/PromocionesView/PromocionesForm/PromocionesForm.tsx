import { useEffect, useState } from 'react';
import styles from './PromocionesForm.module.css';
import { Promocion } from '../../../../models/Promocion';
import { createPromocion, updatePromocion } from '../../../../api/promociones';
import { PromocionDetalle } from '../../../../models/PromocionDetalle';
import { Articulo } from '../../../../models/Articulo';
import { getAllArticulosManufacturados } from '../../../../api/articuloManufacturado';

interface PromocionesFormProps {
  promocion?: Promocion;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (promocionActualizado: Promocion) => void;
}

const PromocionesForm = ({ promocion, modo, onClose, onSubmit }: PromocionesFormProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'Alta' | 'Baja'>(promocion?.fechaBaja ? 'Baja' : 'Alta');
  const [descuento, setDescuento] = useState(0);
  const [detallePromocion, setDetallePromocion] = useState<PromocionDetalle[]>([]);
  const [selectedArticuloId, setSelectedArticuloId] = useState<number>(0);

  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  const [fechaAlta, setFechaAlta] = useState<string>();

  const [articulos, setArticulos] = useState<Articulo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (promocion) {
        setDescripcion(promocion.denominacion);
        setEstado(promocion.fechaBaja ? 'Baja' : 'Alta');
        setDescuento(promocion.descuento ?? 0); 
        setDetallePromocion(promocion.promocionesDetalle ?? null); 

        setFechaDesde(promocion.fechaDesde ? new Date(promocion.fechaDesde).toISOString().slice(0, 10) : ''); 
        setFechaHasta(promocion.fechaHasta ? new Date(promocion.fechaHasta).toISOString().slice(0, 10) : ''); 

        // setFechaAlta(promocion.fechaAlta ?? undefined); 

        // const articulos = await getAllArticulosManufacturados()
        setArticulos(articulos)
      }
    };

    fetchData();
  }, [promocion]);

  useEffect(() => {
    const fetchData = async () => {
      const articulos = await getAllArticulosManufacturados();
      console.log("Articulos:", articulos);
      setArticulos(articulos)
    };
    fetchData();
  }, []);

//   useEffect(() => {
//     console.log("CARGA DETALLE:");
//       if (modo === 'editar' && promocion?.promocionesDetalle?.length && detallePromocion.length > 0) {
//       const detallesIniciales: PromocionDetalle[] = promocion.promocionesDetalle.map((detalle) => {
//         // Buscar el artículo completo en detallePromocion, asegurando que sea de tipo Articulo
//         const articuloCompleto = detallePromocion.find((i) => i.articulo?.id === detalle.articulo?.id)?.articulo;
//         return {
//           ...detalle,
//           articulo: articuloCompleto ?? detalle.articulo,
//           cantidad: detalle.cantidad,
//         };
//       });
//       setDetallePromocion(detallesIniciales);
//       }
//     }, [modo, promocion, detallePromocion]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert("El nombre de la promoción no puede estar vacía.");
      return;
    }

    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      alert("La fecha en la que termina la promoción no puede ser menor a la fecha inicial.");
      return;
    }

    if (!fechaDesde || !fechaHasta) {
      alert("Debe seleccionar las fechas.");
      return;
    }

    const payload: Promocion = {
        denominacion: descripcion,
        fechaBaja: estado === 'Baja' ? new Date().toISOString() : null,
        imagenes: [],
        sucursal: promocion?.sucursal, // Mantener la sucursal de la promoción existente

        promocionesDetalle: detallePromocion,
        descuento: descuento,
        pedidosVentaDetalle: [],
        fechaAlta: promocion?.fechaAlta ?? new Date().toISOString(),
        
        fechaModificacion: promocion?.fechaModificacion ?? new Date().toISOString(),
        fechaDesde: fechaDesde ? new Date(fechaDesde) : new Date(),
        fechaHasta: fechaHasta ? new Date(fechaHasta) : new Date(),
        id: promocion?.id ?? 0, 
    };

    if (modo === "editar") {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        } else {
          payload.fechaBaja = null;
        }
        const result = await updatePromocion(payload, promocion?.id);
        onSubmit(result);
      } catch (error) {
        console.error("Error al actualizar la categoría:", error);
      }
    } else {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        }
        const result = await createPromocion(payload);
        // onSubmit(result);
      } catch (error) {
        console.error("Error al crear la categoría:", error);
      }
    }
  };


  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Promoción' : 'Modificar Promoción'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ height: '50px' }}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Descuento</label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label>Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroupFull}>
        <label>Detalle</label>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            value={selectedArticuloId}
            onChange={(e) => {
              const id = Number(e.target.value);
              const articuloYaAgregado = articulos.some(art => art?.id === id);
              if (id !== 0 && !articuloYaAgregado) {
                const detalle = detallePromocion.find(i => i.id === id);
                // if (detalle) {
                //   setDetallePromocion((prev) => [...prev, { articulo, cantidad: 0 }]);
                // }
              }
              setSelectedArticuloId(0); // Reset select
            }}
          >
            <option value={0}>-- Seleccionar articulo --</option>
            {articulos.map((articulo) => (
              <option
                key={articulo?.id}
                value={articulo?.id}
                // disabled={ingredientes.some((ing) => ing.insumo.id === insumo.id)}
              >
                {articulo?.denominacion}
              </option>
            ))}
          </select>
        </div>
        <h4>Articulos Agregados:</h4>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {detallePromocion.map(({ articulo, cantidad }, index) => (
            <li
              key={articulo?.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span style={{ flex: 1 }}>
                {articulo?.denominacion} ({articulo?.unidadMedida?.denominacion ?? ''})
              </span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={cantidad}
                onChange={(e) => {
                  const nuevaCantidad = Number(e.target.value);
                //   setIngredientes((prev) =>
                //     prev.map((ing, i) =>
                //       i === index ? { ...ing, cantidad: nuevaCantidad } : ing
                //     )
                //   );
                }}
              />
              {/* <button type="button" onClick={() => handleEliminarIngrediente(insumo.id)}>Eliminar</button> */}
            </li>
          ))}
        </ul>
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

export default PromocionesForm;
