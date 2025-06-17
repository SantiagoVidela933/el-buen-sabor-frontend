
export interface EmpleadoRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: string;
  sucursalId: number;
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

export const getLocalidades = async (): Promise<Localidad[]> => {
  const res = await fetch('http://localhost:8080/api/localidades');
  if (!res.ok) throw new Error('No se pudieron cargar las localidades');
  return res.json();
};

export const crearEmpleado = async (empleado: EmpleadoRequest): Promise<any> => {
  const res = await fetch('http://localhost:8080/api/empleados/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Error al crear empleado: ${text}`);

  try {
    return JSON.parse(text);
  } catch {
    return empleado;
  }
};

export const actualizarEmpleado = async (id: number, empleado: EmpleadoRequest): Promise<any> => {
  const res = await fetch(`http://localhost:8080/api/empleados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Error al editar empleado: ${text}`);

  try {
    return JSON.parse(text);
  } catch {
    return empleado;
  }
};

// Obtener empleados
export const getEmpleados = async (): Promise<any[]> => {
  const res = await fetch("http://localhost:8080/api/empleados");
  if (!res.ok) throw new Error("Error al obtener empleados");
  return res.json();
};

// Eliminar empleado
export const eliminarEmpleadoAPI = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/api/empleados/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el empleado");
};

// Dar de baja empleado
export const darDeBajaEmpleadoAPI = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/api/empleados/${id}/baja`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaBaja: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Error al dar de baja el empleado");
};

// Reactivar empleado
export const reactivarEmpleadoAPI = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/api/empleados/${id}/reactivar`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al reactivar el empleado");
};
