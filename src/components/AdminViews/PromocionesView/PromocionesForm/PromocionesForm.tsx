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
  const [estado, setEstado] = useState<'Alta' | 'Baja'>(promocion?.fechaBaja ? 'Baja' : 'Alta');
  const [descuento, setDescuento] = useState(0);
  const [detallePromocion, setDetallePromocion] = useState<PromocionDetalle[]>([]);
  const [Promocion, setPromocion] = useState<Promocion>();
  const [selectedArticuloId, setSelectedArticuloId] = useState<number>(0);
  const [imagen, setImagen] = useState<File | null>(null);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [fechaAlta, setFechaAlta] = useState<string>();
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');

  const [mostrarInputImagen, setMostrarInputImagen] = useState(false);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [precioFinal, setPrecioFinal] = useState<number>(0);

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
  
  //Calcular precio
  useEffect(() => {
  const nuevoTotal = detallePromocion.reduce((total, detalle) => {
    const precio = detalle.articulo?.precioVenta || 0;
    return total + (precio * detalle.cantidad);
  }, 0);
  
  setPrecioTotal(nuevoTotal);
  setPrecioFinal(nuevoTotal * (1 - descuento / 100));
}, [detallePromocion, descuento]);
  useEffect(() => {
    const fetchData = async () => {
      if (promocion) {
        setNombre(promocion.denominacion);
        setDescripcion(promocion.descripcion);
        setEstado(promocion.fechaBaja ? 'Baja' : 'Alta');
        setDescuento(promocion.descuento ?? 0); 
        setDetallePromocion(promocion.promocionesDetalle ?? null); 
        setFechaDesde(promocion.fechaDesde ? new Date(promocion.fechaDesde).toISOString().slice(0, 10) : ''); 
        setFechaHasta(promocion.fechaHasta ? new Date(promocion.fechaHasta).toISOString().slice(0, 10) : ''); 
        setFechaAlta(promocion.fechaAlta ?? undefined);
        setPromocion(promocion);
        setNombreImagenActual(promocion.imagenes?.length ? promocion.imagenes[0].nombre : null);
        setImagenPreview(null);
      }
    };

    fetchData();
  }, [promocion]);

  useEffect(() => {
    const nombreArchivo = promocion?.imagenes?.[0]?.nombre;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!nombre.trim()) {
      alert("El nombre de la promoción no puede estar vacío.");
      return;
    }
    
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
    
    if (detallePromocion.length === 0) {
      alert("Debe seleccionar al menos un artículo para la promoción.");
      return;
    }
    if (descuento <= 0 || descuento > 100) {
      alert("El porcentaje de descuento debe estar entre 1% y 100%.");
      return;
    }

    if (!imagen && modo === 'crear') {
      alert("Debe seleccionar una imagen para la promoción.");
      return;
    }

    const payload: Promocion = {
        denominacion: nombre,
        descripcion: descripcion,
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

    if (modo === "editar") {
      try {
        if (estado === 'Baja') {
          payload.fechaBaja = new Date().toISOString();
        } else {
          payload.fechaBaja = null;
        }

        if (payload.promocionesDetalle) {
          payload.promocionesDetalle = payload.promocionesDetalle.map(detalle => {
            if (detalle.articulo && 'stockPorSucursal' in detalle.articulo) {
              const articuloInsumo = detalle.articulo as any;
              if (articuloInsumo.stockPorSucursal) {
                articuloInsumo.stockPorSucursal = articuloInsumo.stockPorSucursal.map((stock: any) => {
                  const { sucursalId, ...stockSinSucursalId } = stock;
                  return stockSinSucursalId;
                });
              }
            }
            return detalle;
          });
        }
        
        // Aseguramos que la sucursal esté establecida (usar el valor predeterminado 1 si no hay sucursal)
        payload.sucursal = {
          id: 1,
          nombre: "Central", 
          fechaAlta: new Date().toISOString(),
          fechaBaja: null,
          fechaModificacion: null
        };
        
        // Limpieza de datos para eliminar sucursalId en stockPorSucursal
        if (payload.promocionesDetalle) {
          payload.promocionesDetalle = payload.promocionesDetalle.map(detalle => {
            // Si es un artículo insumo con stockPorSucursal
            if (detalle.articulo && 'stockPorSucursal' in detalle.articulo) {
              const articuloInsumo = detalle.articulo as any;
              if (articuloInsumo.stockPorSucursal) {
                // Eliminar sucursalId de cada elemento en stockPorSucursal
                articuloInsumo.stockPorSucursal = articuloInsumo.stockPorSucursal.map((stock: any) => {
                  const { sucursalId, ...stockSinSucursalId } = stock;
                  return stockSinSucursalId;
                });
              }
            }
            return detalle;
          });
        }
        const result = await updatePromocion(payload, imagen!, promocion?.id);

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
        if (payload.promocionesDetalle) {
          payload.promocionesDetalle = payload.promocionesDetalle.map(detalle => {
            if (detalle.articulo && 'stockPorSucursal' in detalle.articulo) {
              const articuloInsumo = detalle.articulo as any;
              if (articuloInsumo.stockPorSucursal) {
                articuloInsumo.stockPorSucursal = articuloInsumo.stockPorSucursal.map((stock: any) => {
                  const { sucursalId, ...stockSinSucursalId } = stock;
                  return stockSinSucursalId;
                });
              }
            }
            return detalle;
          });
        }
        
        // Aseguramos que la sucursal esté establecida (usar el valor predeterminado 1 si no hay sucursal)
        payload.sucursal = {
          id: 1,
          nombre: "Central", 
          fechaAlta: new Date().toISOString(),
          fechaBaja: null,
          fechaModificacion: null
        };
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
            <label>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={styles.textareaInput}
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

          <div className={styles.recipeHeader}>
            <label>Artículos</label>
            <div className={styles.selectContainer}>
          <select
            value={selectedArticuloId}
            onChange={e => {
              const id = Number(e.target.value);
              setSelectedArticuloId(id);
              
              // Si se selecciona un artículo válido, agregarlo automáticamente
              if (id !== 0) {
                const articulo = articulos.find(a => a.id === id);
                if (articulo) {
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
                  // Resetear la selección
                  setSelectedArticuloId(0);
                }
              }
            }}
          >
            <option value={0}>-- Seleccionar artículo --</option>
            {articulos.map(art => (
              <option
                key={art.id}
                value={art.id}
                disabled={detallePromocion.some(det => det.articulo?.id === art.id)}
              >
                {art.denominacion}
              </option>
            ))}
          </select>
        </div>
      </div>

        <div>
          <table className={styles.ingredientesTable}>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detallePromocion.map((detalle, idx) => (
                <tr key={detalle.articulo?.id}>
                  <td>{detalle.articulo?.denominacion}</td>
                  <td>
                    <div className={styles.inputWithUnit}>
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
                        className={styles.quantityField}
                      />
                    </div>
                  </td>
                  <td className={styles.moneyCell}>
                    ${((detalle.articulo?.precioVenta || 0) * detalle.cantidad).toFixed(2)}
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className={styles.deleteBtn}
                      onClick={() => handleEliminarArticulo(detalle.articulo?.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.fieldGroupFull}>
        <h4 style={{margin :'5px 0'}}>Calcular Precio con Descuento:</h4>
        <div className={styles.costSummary}>
          <div className={styles.costEquation}>
            <span className={styles.costLabel}>Precio actual:</span>
            <span className={styles.costValue}>${precioTotal.toFixed(2)}</span>
            <div className={styles.equationOperator}>-</div>
            <span className={styles.costLabel}>Descuento:</span>
            <div className={styles.gainSection}>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                className={styles.marginInput}
              />
              <span className={styles.percentSymbol}>%</span>
            </div>
            <div className={styles.equationOperator}>=</div>
            <span className={styles.costLabel}>Precio final:</span>
            <span className={styles.finalCostValue}>${precioFinal.toFixed(2)}</span>
          </div>
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
