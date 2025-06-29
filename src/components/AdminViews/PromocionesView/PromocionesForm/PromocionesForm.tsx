import { useEffect, useRef, useState } from 'react';
import styles from './PromocionesForm.module.css';
import { Promocion } from '../../../../models/Promocion';
import { createPromocion, updatePromocion } from '../../../../api/promociones';
import { PromocionDetalle } from '../../../../models/PromocionDetalle';
import { Articulo } from '../../../../models/Articulo';
import { getAllArticulosManufacturadosActivos } from '../../../../api/articuloManufacturado';
import { getAllArticuloInsumoActivos } from '../../../../api/articuloInsumo';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

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
  const [Promocion, setPromocion] = useState<Promocion>();
  const [selectedArticuloId, setSelectedArticuloId] = useState<number>(0);
  const [imagen, setImagen] = useState<File | null>(null);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [fechaAlta, setFechaAlta] = useState<string>();

  const [mostrarInputImagen, setMostrarInputImagen] = useState(false);
  const [articulos, setArticulos] = useState<Articulo[]>([]);

 // Muestro imagen (img, nombre) a editar en form
  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const didSetPreview = useRef(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
      setImagen(file);
      setNombreImagenActual(file.name);
      setImagenPreview(URL.createObjectURL(file));
      didSetPreview.current = true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (promocion) {
        setDescripcion(promocion.denominacion);
        setEstado(promocion.fechaBaja ? 'Baja' : 'Alta');
        setDescuento(promocion.descuento ?? 0); 
        setDetallePromocion(promocion.promocionesDetalle ?? null); 

        setFechaDesde(promocion.fechaDesde ? new Date(promocion.fechaDesde).toISOString().slice(0, 10) : ''); 
        setFechaHasta(promocion.fechaHasta ? new Date(promocion.fechaHasta).toISOString().slice(0, 10) : ''); 
        setFechaAlta(promocion.fechaAlta ?? undefined);
        setPromocion(promocion);
        setNombreImagenActual(promocion.imagenes?.length ? promocion.imagenes[0].nombre : null);
        setImagenPreview(null); // Limpia el preview si cambia el producto
      }
    };

    fetchData();
  }, [promocion]);

  useEffect(() => {
    const nombreArchivo = promocion?.imagenes?.[0]?.nombre;

    console.log("Nombre de archivo:", nombreArchivo);
    if (nombreArchivo) {
      setNombreImagenActual(nombreArchivo);
      setImagenPreview(`http://localhost:8080/imagenes/${nombreArchivo}`);
      didSetPreview.current = true;
    } else {
      setNombreImagenActual(null);
      setImagenPreview(null);
      didSetPreview.current = false;
    }
  }, [promocion?.imagenes]);


  useEffect(() => {
    const fetchData = async () => {
      const manufacturados = await getAllArticulosManufacturadosActivos();
      manufacturados.map((articulo) => {
        articulo.detalles = [];
        articulo.tipoArticulo = 'manufacturado';
        if ('estado' in articulo) {
          delete (articulo as any).estado;
        }
      });
      
      const insumosVenta = await getAllArticuloInsumoActivos();
      insumosVenta.map((articulo) => {
        articulo.tipoArticulo = 'insumo';
        if ('estado' in articulo) {
          delete (articulo as any).estado;
        }
      });
      setArticulos([...manufacturados, ...insumosVenta]);
    };
    fetchData();
  }, []);
  
  const handleEliminarArticulo = (idArticulo?: number) => {
    setDetallePromocion(prev => prev.filter(detalle => detalle.articulo?.id !== idArticulo));
    console.log("Detalle de promoción:", detallePromocion);
  };

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
        id: promocion?.id ?? undefined, 
    };

    if ('pedidosVentaDetalle' in payload) {
      delete (payload as any).pedidosVentaDetalle;
    }

    console.log("Payload de promoción:", payload);

    if (modo === "editar") {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        } else {
          payload.fechaBaja = null;
        }

        if (payload.sucursal) {
          payload.sucursal.id = payload.sucursal.id === 0 ? 1 : payload.sucursal.id;
        }

        const result = await updatePromocion(payload, imagen!, promocion?.id);
        console.log("Promocion actualizada:", result);

        result.sucursal = promocion?.sucursal;

        Swal.fire({
          icon: "success",
          title: "Promoción actualizada exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });

        onSubmit(result);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error}`
        });
      }
    } else {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        }

        const result = await createPromocion(payload, imagen!);
        Swal.fire({
          icon: "success",
          title: "Promoción creada exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
        onSubmit(result);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error}`
        });
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

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex' }}>
            <select
              style={{ width: '20rem' }}
              value={selectedArticuloId}
              onChange={e => setSelectedArticuloId(Number(e.target.value))}
              >
              <option value={0}>Seleccionar artículo</option>
              {articulos.map(art => (
                <option
                key={art.id}
                value={art.id}
                disabled={detallePromocion.some(det => det.articulo?.id === art.id)}>
                  {art.denominacion}
                </option>
              ))}
            </select>
          </div>

          <button
          style={{ width: '20rem' }}
            type="button"
            onClick={() => {
              if (selectedArticuloId === 0) return alert('Selecciona un artículo');
              const articulo = articulos.find(a => a.id === selectedArticuloId);
              if (!articulo) return;
              setDetallePromocion(prev => [
                ...prev,
                {
                  articulo,
                  cantidad: 1,
                  fechaAlta: new Date().toISOString(),
                  fechaModificacion: null,
                  fechaBaja: null
                }
              ]);
              setSelectedArticuloId(0);
            }}
            >
            Agregar al detalle
          </button>
        </div>

        <div>
          <h4>Articulos Agregados:</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {detallePromocion.map((detalle, idx) => (
                <li key={detalle.articulo?.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  {detalle.articulo?.denominacion}
                  <input
                    type="number"
                    min={1}
                    value={detalle.cantidad}
                    onChange={e => {
                      const nuevaCantidad = Number(e.target.value);
                      setDetallePromocion(prev =>
                        prev.map((d, i) =>
                          i === idx ? { ...d, cantidad: nuevaCantidad } : d
                    )
                  );
                }}
                style={{ marginLeft: 8 }}
                />
                <button type="button" onClick={() => handleEliminarArticulo(detalle.articulo?.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
        </div>
      </div>

        <div className={styles.fieldGroupFull}>
          <label htmlFor="imagen">Imágen</label>
          {nombreImagenActual && !mostrarInputImagen ? (
            <>
              <p>Imagen seleccionada: {nombreImagenActual}</p>
              <button
                type="button"
                onClick={() => setMostrarInputImagen(true)}
                className={styles.saveBtn}
                style={{ marginBottom: '1em' }}
              >
                Cambiar imagen
              </button>
            </>
          ) : (
            <>
              <input
                type="file"
                id="imagen"
                className={styles.imageInput}
                onChange={handleImageChange}
              />
              {nombreImagenActual && <p>Imagen seleccionada: {nombreImagenActual}</p>}
            </>
          )}
          {imagenPreview ? (
            <div style={{ margin: '1em auto' }}>
              <img
                src={imagenPreview}
                alt="Preview"
                style={{ maxWidth: 200, border: '1px solid black' }}
                onError={(e) => {
                  console.error('Error cargando imagen:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <p>No hay imagen para mostrar</p>
          )}
        </div>
      </div>


        <div className={styles.buttonActions}>
        <button type="submit" className={styles.saveBtn}> 
          {modo === "crear" ? "Crear" : "Actualizar"}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelBtn}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default PromocionesForm;
