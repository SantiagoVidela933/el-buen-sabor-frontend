import React, { useEffect, useState } from "react";
import styles from "./StockIngredienteAdmin.module.css";
import { ArticuloInsumo } from "../../../../../models/ArticuloInsumo";
import { getAllArticuloInsumo, updateStockSucursalInsumo } from "../../../../../api/articuloInsumo";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

interface Props {
  modo: "editar";
  onClose: () => void;
  onSubmit: (nuevo: any) => void;
}

const StockIngredienteAdmin: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | null>(null);
  const [operacion, setOperacion] = useState<'ingreso' | 'egreso'>('ingreso');
  const [cantidad, setCantidad] = useState<number>(0);
  const [stockFinal, setStockFinal] = useState<number>(0);

  useEffect(() => {
    fetchInsumos();
  }, []);

  useEffect(() => {
    if (selectedInsumo) {
      calcularStockFinal();
    }
  }, [selectedInsumo]);

  useEffect(() => {
    calcularStockFinal();
  }, [operacion, cantidad, selectedInsumo]);

  const fetchInsumos = async () => {
    try {
      const data = await getAllArticuloInsumo();
      // Filtrar solo los insumos activos
      const insumosActivos = data.filter(insumo => !insumo.fechaBaja);
      setInsumos(insumosActivos);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los insumos"
      });
    }
  };

  const handleInsumoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const insumoId = Number(e.target.value);
    const selected = insumos.find(i => i.id === insumoId) || null;
    setSelectedInsumo(selected);
    
    if (selected) {
      setCantidad(0); // Resetear cantidad al cambiar de insumo
    }
  };

  const calcularStockFinal = () => {
    if (!selectedInsumo) {
      setStockFinal(0);
      return;
    }
    
    const stockActual = selectedInsumo.stockPorSucursal[0]?.stockActual || 0;
    if (operacion === 'ingreso') {
      setStockFinal(stockActual + cantidad);
    } else {
      const nuevoStock = stockActual - cantidad;
      setStockFinal(nuevoStock < 0 ? 0 : nuevoStock); // Evitar stock negativo
    }
  };

  const procesarActualizacion = async () => {
    try {
      if (!selectedInsumo || selectedInsumo.id === undefined) {
        throw new Error("No hay insumo seleccionado");
      }
      // Solo enviar el stockFinal a la API
      await updateStockSucursalInsumo(selectedInsumo.id, 1, { stockActual: stockFinal }); // 1 es el idSucursal, cámbialo si es necesario

      Swal.fire({
        icon: "success",
        title: "Stock actualizado",
        text: `El stock del insumo ${selectedInsumo.denominacion} ha sido actualizado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });

      onSubmit({ ...selectedInsumo, stockPorSucursal: [{ ...selectedInsumo.stockPorSucursal[0], stockActual: stockFinal }] });
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el stock del insumo"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInsumo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe seleccionar un insumo"
      });
      return;
    }

    if (cantidad <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La cantidad debe ser mayor a 0"
      });
      return;
    }
    // Validar que la cantidad de egreso no supere el stock actual
    if (operacion === 'egreso') {
      const stockActual = selectedInsumo.stockPorSucursal[0]?.stockActual || 0;
      if (cantidad > stockActual) {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: `Está intentando descontar mas stock del que dispone. Stock actual: ${stockActual} ${selectedInsumo.unidadMedida.denominacion}`
        });
        return;
      }
    }

    
    // Validar que el stock final no supere el stock máximo
    const stockMaximo = selectedInsumo.stockPorSucursal[0]?.stockMaximo || 0;
    if (operacion === 'ingreso' && stockMaximo > 0 && stockFinal > stockMaximo) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia de stock",
        text: `Esta operación superará el stock máximo definido (${stockMaximo} ${selectedInsumo.unidadMedida.denominacion})`,
        showCancelButton: true,
        confirmButtonText: "Continuar de todas formas",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceder con la actualización
          procesarActualizacion();
        }
      });
      return;
    }
    await procesarActualizacion();

  }

  return (
    <div className={styles.formContainer}>
      <h2>Administrar Stock</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.fieldsGrid}>
          {/* Select para elegir insumo */}
          
          <div className={styles.fieldGroup}>
            <select 
              className={styles.select}
              value={selectedInsumo?.id || ""}
              onChange={handleInsumoChange}
              required
            >
              <option value="">-- Seleccione un insumo --</option>
              {insumos.map(insumo => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.denominacion}
                </option>
              ))}
            </select>
          </div>
            <div className={styles.rowContainer}>
            {/* Campo para ingresar cantidad */}
            <div className={styles.fieldGroup}>
              <div className={styles.inputWithUnit}>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  required
                />
                <span className={styles.unitText}>
                  {selectedInsumo?.unidadMedida?.denominacion || "unidades"}
                </span>
              </div>
            </div>
          {/* Tipo de operación */}
          <div className={styles.operationButtonContainer}>
            <button
              type="button"
              className={`${styles.operationButton} ${operacion === 'ingreso' ? styles.selected : ''}`}
              onClick={() => setOperacion('ingreso')}
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
            <button
              type="button"
              className={`${styles.operationButton} ${operacion === 'egreso' ? styles.selected : ''}`}
              onClick={() => setOperacion('egreso')}
            >
              <span className="material-symbols-outlined">arrow_downward</span>
            </button>
          </div>
        </div>      


          {selectedInsumo && (
            <>
              {/* Información del insumo */}
              <div className={styles.infoContainer}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Stock Actual:</span>
                  <span className={styles.infoValue}>
                    {selectedInsumo.stockPorSucursal[0]?.stockActual || 0} {selectedInsumo.unidadMedida.denominacion}
                  </span>
                </div>
              </div>
              
              {/* Resumen del stock final */}
              <div className={styles.resultContainer}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Stock Final:</span>
                  <span className={styles.resultValue}>
                    {stockFinal} {selectedInsumo.unidadMedida.denominacion}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.buttonActions}>
          <button type="submit" className={styles.saveBtn} disabled={!selectedInsumo || cantidad <= 0}>
            Aceptar
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockIngredienteAdmin;