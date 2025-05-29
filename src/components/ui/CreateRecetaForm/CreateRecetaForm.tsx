import { useEffect, useState } from 'react';
import { getInsumosBySucursalId } from '../../../api/articuloInsumo';
import { ArticuloInsumo } from '../../../models/ArticuloInsumo';

interface IngredienteReceta {
  insumo: ArticuloInsumo;
  cantidad: number;
}

const CreateRecetaForm = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [ingredientes, setIngredientes] = useState<IngredienteReceta[]>([]);

  useEffect(() => {
    const fetchInsumos = async () => {
      const data = await getInsumosBySucursalId(1);
      setInsumos(data);
    };
    fetchInsumos();
  }, []);

  const handleAgregarIngrediente = () => {
    if (selectedInsumoId === 0) return alert('Seleccioná un ingrediente');
    if (cantidad <= 0) return alert('Ingresá una cantidad válida');

    const insumo = insumos.find(i => i.id === selectedInsumoId);
    if (!insumo) return alert('Ingrediente no encontrado');

    // Evitar duplicados: si ya está, actualizar cantidad
    setIngredientes((prev) => {
      const existe = prev.find(i => i.insumo.id === selectedInsumoId);
      if (existe) {
        return prev.map(i =>
          i.insumo.id === selectedInsumoId
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { insumo, cantidad }];
    });

    // Reset inputs
    setSelectedInsumoId(0);
    setCantidad(0);
  };

  return (
    <div>
      <h2>Crear / Modificar Receta</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={selectedInsumoId}
          onChange={(e) => setSelectedInsumoId(Number(e.target.value))}
        >
          <option value={0}>-- Seleccionar ingrediente --</option>
          {insumos.map((insumo) => (
            <option key={insumo.id} value={insumo.id}>
              {insumo.denominacion}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          min={0}
          step={0.1}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />

        <button onClick={handleAgregarIngrediente}>Agregar</button>
      </div>

      <h3>Ingredientes Agregados:</h3>
      <ul>
        {ingredientes.map(({ insumo, cantidad }) => (
          <li key={insumo.id}>
            {insumo.denominacion} — {cantidad} {insumo.unidadMedida.denominacion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateRecetaForm;
