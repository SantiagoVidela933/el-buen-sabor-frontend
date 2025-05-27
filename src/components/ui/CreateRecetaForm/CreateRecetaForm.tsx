import React, { useState } from 'react';

// Reemplazar esto luego con tus modelos reales
const ingredientesDisponibles = [
  { id: 1, nombre: 'Pan', unidad: 'unidad' },
  { id: 2, nombre: 'Carne', unidad: 'gramos' },
  { id: 3, nombre: 'Queso', unidad: 'gramos' },
  { id: 4, nombre: 'Lechuga', unidad: 'hojas' },
];

interface IngredienteSeleccionado {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
}

const CreateRecetaForm = () => {
  const [ingredienteId, setIngredienteId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [ingredientesReceta, setIngredientesReceta] = useState<IngredienteSeleccionado[]>([]);

  const handleAgregar = () => {
    const ingrediente = ingredientesDisponibles.find(i => i.id === ingredienteId);
    if (ingrediente && cantidad > 0) {
      setIngredientesReceta([
        ...ingredientesReceta,
        { id: ingrediente.id, nombre: ingrediente.nombre, cantidad, unidad: ingrediente.unidad }
      ]);
      setCantidad(1);
      setIngredienteId(0);
    }
  };

  const handleEliminar = (id: number) => {
    setIngredientesReceta(ingredientesReceta.filter(i => i.id !== id));
  };

  return (
    <div>
      <h2>Crear / Modificar Receta</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={ingredienteId}
          onChange={(e) => setIngredienteId(Number(e.target.value))}
        >
          <option value={0}>-- Seleccionar ingrediente --</option>
          {ingredientesDisponibles.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          placeholder="Cantidad"
        />

        <button type="button" onClick={handleAgregar}>
          Agregar
        </button>
      </div>

      {ingredientesReceta.length > 0 && (
        <ul>
          {ingredientesReceta.map((ing) => (
            <li key={ing.id}>
              {ing.nombre} - {ing.cantidad} {ing.unidad}
              <button
                onClick={() => handleEliminar(ing.id)}
                style={{ marginLeft: '0.5rem' }}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateRecetaForm;
