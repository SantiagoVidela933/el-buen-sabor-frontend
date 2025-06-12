import Cliente from '../../../models/prueba/Client';
import styles from './UserData.module.css';
import Localidad from '../../../models/prueba/Localidad';
import { useState, useEffect } from "react";
import { getLocalidadesJSONFetch } from '../../../api/localidades';
import { guardarCliente } from '../../../api/cliente';

interface UserDataProps {
  cliente: Cliente | null;
}

const UserData: React.FC<UserDataProps> = ({ cliente }) => {
  
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [clienteEditable, setClienteEditable] = useState<Cliente | null>(cliente);

  useEffect(() => {
    getLocalidadesJSONFetch().then(setLocalidades);
  }, []);

  useEffect(() => {
    setClienteEditable(cliente);
  }, [cliente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (!clienteEditable) return;

    if (name.startsWith("domicilio.")) {
      const key = name.split(".")[1];
      setClienteEditable({
        ...clienteEditable,
        domicilio: {
          ...clienteEditable.domicilio,
          [key]: key === "numero" || key === "codigoPostal" || key === "idLocalidad" ? Number(value) : value
        }
      });
    } else {
      setClienteEditable({
        ...clienteEditable,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clienteEditable) {
      try {
        await guardarCliente(clienteEditable);
        alert("Cliente actualizado correctamente.");
      } catch (error) {
        alert("Ocurrió un error al guardar el cliente.");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Mis datos personales</h3>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Nombre
          <input type="text" className={styles.input} name="nombre" value={clienteEditable?.nombre || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Apellido
          <input type="text" className={styles.input} name="apellido" value={clienteEditable?.apellido || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Número de Teléfono
          <input type="text" className={styles.input} name="telefono" value={clienteEditable?.telefono || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Email
          <input type="email" className={styles.input} name="email" value={clienteEditable?.email || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Fecha de nacimiento
          <input type="date" className={styles.input} name="fechaDeNacimiento" value={clienteEditable?.fechaDeNacimiento || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Calle
          <input type="text" className={styles.input} name="domicilio.calle" value={clienteEditable?.domicilio.calle || ''} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Número calle
          <input type="number" className={styles.input} name="domicilio.numero" value={clienteEditable?.domicilio.numero || 0} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Código Postal
          <input type="number" className={styles.input} name="domicilio.codigoPostal" value={clienteEditable?.domicilio.codigoPostal || 0} onChange={handleInputChange} />
        </label>
        <label className={styles.label}>
          Departamento
          <select className={styles.select} name="domicilio.idLocalidad" value={clienteEditable?.domicilio.idLocalidad || ''} onChange={handleInputChange}>
            <option value="">-- Selecciona una localidad --</option>
            {localidades.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nombre}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.button} onClick={() => {window.location.href = "/"}}>
            Guardar cambios
  
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserData;
