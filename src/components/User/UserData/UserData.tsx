import styles from './UserData.module.css';
import Localidad from '../../../models/prueba/Localidad';
import { useState, useEffect } from "react";
import { getLocalidadesJSONFetch } from '../../../api/localidades';
import { guardarCliente } from '../../../api/cliente';
import { actualizarEmpleado } from '../../../api/empleado';
import { Cliente } from '../../../models/Cliente';
import { Empleado } from '../../../models/Empleado';
import { EmpleadoRequest } from '../../../api/empleado';
import { useAuth0 } from "@auth0/auth0-react"; // 👈 Importamos el hook

interface UserDataProps {
  cliente: Cliente | null;
  empleado: Empleado | null;
}

const UserData: React.FC<UserDataProps> = ({ cliente, empleado }) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [esEmpleado, setEsEmpleado] = useState<boolean>(false);
  const [editableEmpleado, setEditableEmpleado] = useState<Empleado | null>(null);
  const [editableCliente, setEditableCliente] = useState<Cliente | null>(null);

  const { loginWithRedirect } = useAuth0(); // 👈 Lo usamos para refrescar el perfil

  useEffect(() => {
    getLocalidadesJSONFetch().then(setLocalidades);
  }, []);

  useEffect(() => {
    if (empleado) {
      setEsEmpleado(true);
      setEditableEmpleado({
        ...empleado,
        domicilio: {
          ...empleado.domicilio,
          idLocalidad: empleado.domicilio.idLocalidad || empleado.domicilio.localidad?.id || 0,
        }
      });
    } else if (cliente) {
      setEsEmpleado(false);
      setEditableCliente({
        ...cliente,
        domicilio: {
          ...cliente.domicilio,
          idLocalidad: cliente.domicilio.idLocalidad || cliente.domicilio.localidad?.id || 0,
        }
      });
    }
  }, [cliente, empleado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (esEmpleado && editableEmpleado) {
      if (name === "domicilio.idLocalidad") {
        const id = Number(value);
        const localidadSeleccionada = localidades.find((loc) => loc.id === id);
        setEditableEmpleado({
          ...editableEmpleado,
          domicilio: {
            ...editableEmpleado.domicilio,
            idLocalidad: id,
            localidad: localidadSeleccionada ?? editableEmpleado.domicilio.localidad,
          }
        });
      } else if (name.startsWith("domicilio.")) {
        const key = name.split(".")[1];
        setEditableEmpleado({
          ...editableEmpleado,
          domicilio: {
            ...editableEmpleado.domicilio,
            [key]: key === "numero" || key === "codigoPostal" ? Number(value) : value,
          }
        });
      } else {
        setEditableEmpleado({
          ...editableEmpleado,
          [name]: value,
        });
      }

    } else if (!esEmpleado && editableCliente) {
      if (name === "domicilio.idLocalidad") {
        const id = Number(value);
        const localidadSeleccionada = localidades.find((loc) => loc.id === id);
        setEditableCliente({
          ...editableCliente,
          domicilio: {
            ...editableCliente.domicilio,
            idLocalidad: id,
            localidad: localidadSeleccionada ?? editableCliente.domicilio.localidad,
          }
        });
      } else if (name.startsWith("domicilio.")) {
        const key = name.split(".")[1];
        setEditableCliente({
          ...editableCliente,
          domicilio: {
            ...editableCliente.domicilio,
            [key]: key === "numero" || key === "codigoPostal" ? Number(value) : value,
          }
        });
      } else {
        setEditableCliente({
          ...editableCliente,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (esEmpleado && editableEmpleado) {
        const req: EmpleadoRequest = {
          nombre: editableEmpleado.nombre,
          apellido: editableEmpleado.apellido,
          telefono: editableEmpleado.telefono,
          email: editableEmpleado.email,
          rol: editableEmpleado.rol,
          sucursalId: 1,
          password: editableEmpleado.password || "unchanged",
          domicilio: {
            calle: editableEmpleado.domicilio.calle,
            numero: editableEmpleado.domicilio.numero,
            codigoPostal: editableEmpleado.domicilio.codigoPostal,
            idLocalidad: editableEmpleado.domicilio.idLocalidad
          }
        };

        await actualizarEmpleado(editableEmpleado.id, req);
        alert("Empleado actualizado correctamente.");
      } else if (!esEmpleado && editableCliente) {
        await guardarCliente(editableCliente);
        alert("Datos actualizados correctamente.");
      }

      // 👇 Refrescar perfil Auth0 para actualizar email y que Navbar no redirija
      await loginWithRedirect({
        prompt: "none",
        appState: { returnTo: "/" }
      });

    } catch (error) {
      alert("Ocurrió un error al guardar los datos.");
    }
  };

  const entity = esEmpleado ? editableEmpleado : editableCliente;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Mis datos personales</h3>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <label className={styles.label}>
            Nombre
            <input type="text" className={styles.input} name="nombre" value={entity?.nombre || ''} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Apellido
            <input type="text" className={styles.input} name="apellido" value={entity?.apellido || ''} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Teléfono
            <input type="text" className={styles.input} name="telefono" value={entity?.telefono || ''} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Email
            <input type="email" className={styles.input} name="email" value={entity?.email || ''} onChange={handleInputChange} />
          </label>

          {!esEmpleado && (
            <label className={styles.label}>
              Fecha de nacimiento
              <input type="date" className={styles.input} name="fechaDeNacimiento" value={(entity as Cliente)?.fechaDeNacimiento || ''} onChange={handleInputChange} />
            </label>
          )}

          <label className={styles.label}>
            Calle
            <input type="text" className={styles.input} name="domicilio.calle" value={entity?.domicilio.calle || ''} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Número
            <input type="number" className={styles.input} name="domicilio.numero" value={entity?.domicilio.numero || 0} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Código Postal
            <input type="number" className={styles.input} name="domicilio.codigoPostal" value={entity?.domicilio.codigoPostal || 0} onChange={handleInputChange} />
          </label>
          <label className={styles.label}>
            Departamento
            <select
              className={styles.select}
              name="domicilio.idLocalidad"
              value={entity?.domicilio.idLocalidad || ''}
              onChange={handleInputChange}
            >
              <option value="">-- Selecciona una localidad --</option>
              {localidades.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.button}>
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserData;
