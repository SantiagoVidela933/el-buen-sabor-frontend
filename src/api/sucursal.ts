// GET Sucursales
export const getSucursal = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/sucursales/1");
    
    if (!response.ok) {
      throw new Error('Error al obtener la información de la sucursal');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos de la sucursal:", error);
    throw error;
  }
};