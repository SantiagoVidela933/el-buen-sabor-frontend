import { UnidadMedida } from '../models/UnidadMedida';

// GET Unidades de Medida
export async function getUnidadMedida(): Promise<UnidadMedida[]> {
  try {
    const response = await fetch('http://localhost:8080/api/unidadmedida');
    if (!response.ok) {
      throw new Error('Error al obtener las unidades de medida');
    }
    const data = await response.json();
    return data.map((item: any) => UnidadMedida.fromJson(item));
  } catch (error) {
    console.error('Error en getUnidadMedida:', error);
    return [];
  }
}
