import Cliente from "../models/Users/Cliente";
export async function crearCliente(cliente: Cliente) {
  try {
    const response = await fetch("http://localhost:8080/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    });

    if (!response.ok) {
      throw new Error(`Error al crear cliente: ${response.status}`);
    }

    const data = await response.json();
    console.log("Cliente creado:", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}