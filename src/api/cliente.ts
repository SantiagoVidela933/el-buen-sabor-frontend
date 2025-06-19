import {Cliente} from "../models/Cliente";
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



export interface PutClienteDTO {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaDeNacimiento: string;
  domicilio: {
    calle: string;
    numero: number;
    codigoPostal: number;
    idLocalidad: number;
  };
}

export async function guardarCliente(cliente: PutClienteDTO): Promise<Cliente> {
  if (!cliente.id) {
    throw new Error("El cliente debe tener id para actualizar");
  }

  const response = await fetch(`http://localhost:8080/api/clientes/${cliente.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    throw new Error("Error al guardar cliente");
  }

  const data = await response.json();
  return Cliente.fromJson(data)!;
}




export async function getClientesMailJSONFetch(email:string) {
  const urlServer = `http://localhost:8080/api/clientes/email/${email}`;
  const response = await fetch(urlServer, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    mode: 'cors'
  });

  console.log(response);
  return await response.json();
}
export async function getClientesJSONFetch() {
  const response = await fetch("http://localhost:8080/api/clientes", {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener clientes: ${response.status}`);
  }

  return await response.json();
}



export async function eliminarCliente(id: number) {
  const response = await fetch(`http://localhost:8080/api/clientes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar cliente: ${response.status}`);
  }

  return await response.text();
}

export async function reactivarCliente(id: number) {
  const response = await fetch(`http://localhost:8080/api/clientes/${id}/reactivar`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error al reactivar cliente: ${response.status}`);
  }

  return await response.text();
}

