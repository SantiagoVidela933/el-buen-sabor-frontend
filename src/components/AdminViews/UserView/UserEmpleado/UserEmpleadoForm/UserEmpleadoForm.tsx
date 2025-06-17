import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Empleado from '../../../../../models/prueba/Employee';
import styles from './UserEmpleadoForm.module.css';

interface Localidad {
  id: number;
  nombre: string;
}

interface UserEmpleadoFormProps {
  modo: 'crear' | 'editar';
  empleado?: Empleado;
  onClose: () => void;
  onSubmit: (empleadoActualizado: Empleado) => void;
}

const UserEmpleadoForm = ({ modo, empleado, onSubmit, onClose }: UserEmpleadoFormProps) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

 const [form, setForm] = useState({
  nombre: empleado?.nombre || '',
  apellido: empleado?.apellido || '',
  telefono: empleado?.telefono || '',
  email: empleado?.email || '',
  calle: empleado?.domicilio?.calle || '',
  numero: empleado?.domicilio?.numero?.toString() || '',
  codigoPostal: empleado?.domicilio?.codigoPostal?.toString() || '',
  idLocalidad: empleado?.domicilio?.localidad?.id?.toString() || '',
  clave: '',
  repetirClave: '',
  rol: empleado?.rol || '',
});


  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/localidades')
      .then((res) => res.json())
      .then((data) => setLocalidades(data))
      .catch(() => setError('Error al cargar localidades'));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const camposObligatorios = [
    'nombre', 'apellido', 'telefono', 'email',
    'calle', 'numero', 'codigoPostal', 'idLocalidad', 'rol'
  ];
  for (const campo of camposObligatorios) {
    if (!form[campo as keyof typeof form]) {
      setError('Todos los campos obligatorios deben estar completos.');
      return;
    }
  }

  if (form.clave !== form.repetirClave) {
    setError('Las claves no coinciden.');
    return;
  }

 try {
  const empleadoNuevo = {
    nombre: form.nombre,
    apellido: form.apellido,
    telefono: form.telefono,
    email: form.email,
    rol: form.rol,
    sucursalId: 1, // fijo por ahora
    domicilio: {
      calle: form.calle,
      numero: parseInt(form.numero),
      codigoPostal: parseInt(form.codigoPostal),
      idLocalidad: parseInt(form.idLocalidad)
    }
  };

  let url = '';
  let method: 'POST' | 'PUT' = 'POST';

  if (modo === 'crear') {
    url = 'http://localhost:8080/api/empleados/crear';
    method = 'POST';
  } else {
    if (!empleado?.id) {
      setError('ID de empleado no disponible para editar.');
      return;
    }
    url = `http://localhost:8080/api/empleados/${empleado.id}`;
    method = 'PUT';
  }

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleadoNuevo)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Error al ${modo === 'crear' ? 'crear' : 'editar'} el empleado: ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = empleadoNuevo;
  }

  onSubmit(data);
  alert(`Empleado ${modo === 'crear' ? 'creado' : 'actualizado'} exitosamente.`);
  onClose();

} catch (err: any) {
  setError(err.message || 'Ocurrió un error inesperado.');
}
};


  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Empleado' : 'Modificar Empleado'}</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Apellido</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Teléfono</label>
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Calle</label>
          <input type="text" name="calle" value={form.calle} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Número</label>
          <input type="number" name="numero" value={form.numero} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Código Postal</label>
          <input type="number" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Localidad</label>
          <select name="idLocalidad" value={form.idLocalidad} onChange={handleChange}>
            <option value="">-- Selecciona una localidad --</option>
            {localidades.map((loc) => (
              <option key={loc.id} value={loc.id.toString()}>
                {loc.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="">Seleccionar rol</option>
            <option value="CAJERO">Cajero</option>
            <option value="COCINERO">Cocinero</option>
            <option value="DELIVERY">Delivery</option>
          </select>
        </div>
      </div>

      <div className={styles.buttonGroup}>
       
        <div className={styles.rightButtons}>
          <button type="submit">Guardar</button>
        </div>
      </div>
    </form>
  );
};

export default UserEmpleadoForm;
