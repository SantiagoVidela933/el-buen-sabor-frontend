import { ArticuloInsumo } from "../../models/ArticuloInsumo";
import { Ingredient } from "../../models/Products/Ingredient/Ingredient";
import { IngredientCategory } from "../../models/Products/Ingredient/IngredientCategory";
import { MeasurementUnit } from "../../models/Products/Ingredient/MeasurementUnit";


export function mapArticuloInsumoToIngredient(articulo: ArticuloInsumo): Ingredient {
  const categoria = new IngredientCategory(
    articulo.categoria?.id ?? 0,
    articulo.categoria?.denominacion ?? ''
  );

  const unidad = articulo.unidadMedida?.denominacion?.toLowerCase() as keyof typeof MeasurementUnit;
  const medida: MeasurementUnit = MeasurementUnit[unidad] ?? MeasurementUnit.u;

  return new Ingredient(
    articulo.id,
    articulo.denominacion,
    categoria,
    articulo.stockPorSucursal?.[0]?.stockMinimo ?? 0,
    articulo.stockPorSucursal?.[0]?.stockActual ?? 0,
    medida,
    articulo.precioCompra,
    articulo.fechaBaja ? 'No disponible' : 'Disponible',
    !!articulo.fechaBaja
  );
}
