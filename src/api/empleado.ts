export interface EmpleadoRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: string;
  sucursalId: number;
  password?: string; 
  domicilio: {
    calle: string;
    numero: number;
    codigoPostal: number;
    idLocalidad: number;
  };
}

export interface Localidad {
  id: number;
  nombre: string;
}

// GET Localidades
export const getLocalidades = async (): Promise<Localidad[]> => {
  const response = await fetch('http://localhost:8080/api/localidades');
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
  return response.json();
};

// POST Empleado
export const crearEmpleado = async (empleado: EmpleadoRequest): Promise<any> => {
  const response = await fetch('http://localhost:8080/api/empleados/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });

  const text = await response.text();
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }

  try {
    return JSON.parse(text);
  } catch {
    return empleado;
  }
};

// PUT Empleado
export const actualizarEmpleado = async (id: number, empleado: EmpleadoRequest): Promise<any> => {
  const response = await fetch(`http://localhost:8080/api/empleados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });

  const text = await response.text();
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }

  try {
    return JSON.parse(text);
  } catch {
    return empleado;
  }
};

// GET Empleados
export const getEmpleados = async (): Promise<any[]> => {
  const response = await fetch("http://localhost:8080/api/empleados");
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
  return response.json();
};

// DELETE Empleado
export const eliminarEmpleadoAPI = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/empleados/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
};

// PUT Dar de baja Empleado
export const darDeBajaEmpleadoAPI = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/empleados/${id}/baja`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaBaja: new Date().toISOString() }),
  });

  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
};

// PUT Reactivar Empleado
export const reactivarEmpleadoAPI = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/empleados/${id}/reactivar`, {
    method: "PUT",
  });
  
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
};
