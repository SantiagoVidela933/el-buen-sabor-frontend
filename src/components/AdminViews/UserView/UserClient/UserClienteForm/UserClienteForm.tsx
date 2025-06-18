import { useEffect, useState } from 'react';
import { Cliente } from '../../../../../models/Cliente';
import styles from './UserClienteForm.module.css';
import { getLocalidadesJSONFetch } from '../../../../../api/localidades';
import { guardarCliente } from '../../../../../api/cliente';

interface Localidad {
  id: number;
  nombre: string;
}

interface PutClienteDTO {
  id?: number;  // importante incluir id aquí
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

interface UserClienteFormProps {
  modo: 'crear' | 'editar';
  cliente?: Cliente;
  onClose: () => void;
  onSubmit: (clienteActualizado: Cliente) => void;
}

const UserClienteForm = ({ modo, cliente, onClose, onSubmit }: UserClienteFormProps) => {
  const [nombre, setNombre] = useState(cliente?.nombre || '');
  const [apellido, setApellido] = useState(cliente?.apellido || '');
  const [telefono, setTelefono] = useState(cliente?.telefono || '');
  const [email, setEmail] = useState(cliente?.email || '');
  const [fechaDeNacimiento, setFechaDeNacimiento] = useState(cliente?.fechaDeNacimiento || '');
  const [calle, setCalle] = useState(cliente?.domicilio?.calle || '');
  const [numero, setNumero] = useState(cliente?.domicilio?.numero?.toString() || '');
  const [codigoPostal, setCodigoPostal] = useState(cliente?.domicilio?.codigoPostal?.toString() || '');
  const [localidadId, setLocalidadId] = useState(cliente?.domicilio?.localidad?.id || 0);

  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  useEffect(() => {
    getLocalidadesJSONFetch()
      .then(data => setLocalidades(data))
      .catch(error => {
        console.error('Error al obtener localidades:', error);
        setLocalidades([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliente?.id && modo === 'editar') {
      alert('Cliente sin ID, no se puede actualizar.');
      return;
    }

    const dto: PutClienteDTO = {
      id: cliente?.id,
      nombre,
      apellido,
      telefono,
      email,
      fechaDeNacimiento,
      domicilio: {
        calle,
        numero: Number(numero),
        codigoPostal: Number(codigoPostal),
        idLocalidad: Number(localidadId),
      }
    };

    try {
      const clienteActualizado = await guardarCliente(dto );
      console.log('Cliente actualizado desde API:', clienteActualizado);
      onSubmit(clienteActualizado);
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      alert('Error al guardar el cliente.');
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Cliente' : 'Modificar Cliente'}</h2>

      {/* Campos del formulario */}
      {/* ...igual que antes, sin cambios */}

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Apellido</label>
          <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Teléfono</label>
          <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Fecha de Nacimiento</label>
          <input type="date" value={fechaDeNacimiento} onChange={e => setFechaDeNacimiento(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Calle</label>
          <input type="text" value={calle} onChange={e => setCalle(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Número</label>
          <input type="text" value={numero} onChange={e => setNumero(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Código Postal</label>
          <input type="text" value={codigoPostal} onChange={e => setCodigoPostal(e.target.value)} />
        </div>
        <div className={styles.fieldGroup}>
          <label>Localidad</label>
          <select value={localidadId} onChange={e => setLocalidadId(Number(e.target.value))}>
            <option value={0}>-- Selecciona un departamento --</option>
            {localidades.map(localidad => (
              <option key={localidad.id} value={localidad.id}>
                {localidad.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default UserClienteForm;
