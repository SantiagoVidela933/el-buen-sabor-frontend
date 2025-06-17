import { CategoriaArticulo } from "../models/CategoriaArticulo";

// GET - Listado ABM: categorías menú con bajas incluidas (para grilla ABM)
export async function getCategoriasMenuBySucursalId(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/menu/abm/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de menú");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasMenuBySucursalId:", error);
    return [];
  }
}

// GET - Listado ABM: categorías insumo con bajas incluidas (para grilla ABM)
export async function getCategoriasInsumosBySucursalId(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/insumos/abm/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de insumos");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasInsumosBySucursalId:", error);
    return [];
  }
}

// GET - Listado selects: solo categorías menú activas (para dropdowns)
export async function getCategoriasMenuABM(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/menu/activas/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de menú");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasMenuBySucursalId:", error);
    return [];
  }
}

// GET - Listado selects: solo categorías insumo activas (para dropdowns)
export async function getCategoriasInsumosABM(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/insumos/activas/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de insumos");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasInsumosBySucursalId:", error);
    return [];
  }
}

// POST - Crear nueva categoría
export async function createCategoria(categoria: Partial<CategoriaArticulo>): Promise<CategoriaArticulo> {
  const response = await fetch(`http://localhost:8080/api/categoria`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(categoria)
  });

  if (!response.ok) {
    throw new Error("Error al crear la categoría");
  }

  const data = await response.json();
  return CategoriaArticulo.fromJson(data);
}

// PUT - Actualizar categoría existente
export async function updateCategoria(
  id: number,
  data: {
    denominacion: string;
    categoriaPadreId?: number | null;
    sucursalId: number;
  }
): Promise<CategoriaArticulo> {
  const response = await fetch(`http://localhost:8080/api/categoria/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la categoría");
  }

  const json = await response.json();
  return CategoriaArticulo.fromJson(json);
}

// DELETE - Eliminar categoría por ID
export async function deleteCategoria(id: number): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/categoria/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la categoría");
  }
}