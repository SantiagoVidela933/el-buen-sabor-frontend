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
export async function guardarCliente(cliente: Cliente) {
  try {
    const response = await fetch(`http://localhost:8080/api/clientes/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar cliente: ${response.status}`);
    }

    const data = await response.json();
    console.log("Cliente actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}


export async function getClientesMailJSONFetch(email:string) {
  try {
    const urlServer = `http://localhost:8080/api/clientes/email/${email}`;
    console.log(`Realizando petición GET a: ${urlServer}`);
    
    const response = await fetch(urlServer, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cliente: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos del cliente recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en getClientesMailJSONFetch:", error);
    throw error;
  }
}