import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Empleado from '../../../../../models/prueba/Employee';
import styles from './UserEmpleadoForm.module.css';
import {
  getLocalidades,
  crearEmpleado,
  actualizarEmpleado,
  Localidad,
  EmpleadoRequest
} from '../../../../../api/empleado';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

interface UserEmpleadoFormProps {
  modo: 'crear' | 'editar';
  empleado?: Empleado;
  onClose: () => void;
  onSubmit: (empleadoActualizado: Empleado) => void;
}

const UserEmpleadoForm = ({ modo, empleado, onSubmit, onClose }: UserEmpleadoFormProps) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [mostrarInfoClave, setMostrarInfoClave] = useState(false);

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

  useEffect(() => {
    getLocalidades()
      .then((localidadesData) => {
        setLocalidades(localidadesData);
        if (modo === 'editar' && empleado?.domicilio?.localidad?.nombre) {
          const localidadEncontrada = localidadesData.find(
            (loc) =>
              loc.nombre.toLowerCase().trim() ===
              empleado.domicilio.localidad.nombre.toLowerCase().trim()
          );
          if (localidadEncontrada) {
            setForm((prev) => ({
              ...prev,
              idLocalidad: localidadEncontrada.id.toString(),
            }));
          }
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar localidades',
        });
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarContraseñaSegura = (clave: string): boolean => {
    const tieneMayuscula = /[A-Z]/.test(clave);
    const tieneNumero = /\d/.test(clave);
    const tieneSimbolo = /[!@#$%^&*(),.?":{}|<>_]/.test(clave);
    const tieneLongitud = clave.length >= 8;
    const condiciones = [/[a-z]/.test(clave), tieneMayuscula, tieneNumero, tieneSimbolo];
    const cumpleMinimo = condiciones.filter(Boolean).length >= 3;
    return tieneLongitud && cumpleMinimo;
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const camposObligatorios = [
    'nombre', 'apellido', 'telefono', 'email',
    'calle', 'numero', 'codigoPostal', 'idLocalidad', 'rol'
  ];

  for (const campo of camposObligatorios) {
    if (!form[campo as keyof typeof form]) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos obligatorios deben estar completos.',
      });
      return;
    }
  }

  if (modo === 'crear') {
    if (!form.clave || !form.repetirClave) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta contraseña',
        text: 'Debe ingresar y repetir la contraseña.',
      });
      return;
    }

    if (form.clave !== form.repetirClave) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de contraseña',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    if (!validarContraseñaSegura(form.clave)) {
      await Swal.fire({
        icon: 'error',
        title: 'Contraseña insegura',
        html: `
          La contraseña debe tener al menos <strong>8 caracteres</strong> y cumplir con <strong>3 de los siguientes:</strong>
          <ul style="text-align:left;">
            <li>Letras minúsculas (a-z)</li>
            <li>Letras mayúsculas (A-Z)</li>
            <li>Números (0-9)</li>
            <li>Caracteres especiales (por ejemplo: !@#$%^&*)</li>
          </ul>
        `
      });
      return;
    }
  }

  const empleadoData: EmpleadoRequest = {
    nombre: form.nombre,
    apellido: form.apellido,
    telefono: form.telefono,
    email: form.email,
    rol: form.rol,
    sucursalId: 1,
    domicilio: {
      calle: form.calle,
      numero: parseInt(form.numero),
      codigoPostal: parseInt(form.codigoPostal),
      idLocalidad: parseInt(form.idLocalidad)
    },
    ...(modo === 'crear' && { password: form.clave })
  };

  try {
    const data = modo === 'crear'
      ? await crearEmpleado(empleadoData)
      : await actualizarEmpleado(empleado!.id!, empleadoData);

    onSubmit(data);
    await Swal.fire({
      icon: "success",
      title: `Empleado ${modo === 'crear' ? 'creado' : 'actualizado'} exitosamente!`,
      showConfirmButton: false,
      timer: 1500
    });
    onClose();
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${err?.response?.data?.message || err.message || 'Ocurrió un error inesperado.'}`,
    });
  }
};

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Empleado' : 'Modificar Empleado'}</h2>

      <div className={styles.fieldsGrid}>
        {([
          { label: 'Nombre', name: 'nombre' },
          { label: 'Apellido', name: 'apellido' },
          {
            label: 'Teléfono',
            name: 'telefono',
            type: 'tel',
            inputMode: 'numeric' as 'numeric',
            onInput: (e: React.FormEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, '');
            }
          },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Calle', name: 'calle' },
          { label: 'Número',
            name: 'numero',
            type: 'text',
            inputMode: 'numeric' as 'numeric',
            onInput: (e: React.FormEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, '');
            }
          },
          {
            label: 'Código Postal',
            name: 'codigoPostal',
            type: 'text',
            inputMode: 'numeric' as 'numeric',
            onInput: (e: React.FormEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, '');
            }
          }
        ] as {
          label: string;
          name: string;
          type?: string;
          pattern?: string;
          inputMode?: 'email' | 'text' | 'tel' | 'search' | 'url' | 'numeric' | 'none' | 'decimal';
          onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
        }[]).map(({ label, name, type, inputMode, onInput }) => (
          <div className={styles.fieldGroup} key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              {...(inputMode && { inputMode })}
              {...(onInput && { onInput })}
            />
          </div>
        ))}

        <div className={styles.fieldGroup}>
          <label>Localidad</label>
          <select name="idLocalidad" value={form.idLocalidad} onChange={handleChange}>
            <option value="">-- Selecciona una localidad --</option>
            {localidades.map((loc) => (
              <option key={loc.id} value={loc.id.toString()}>{loc.nombre}</option>
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

        {modo === 'crear' && (
          <>
            <div className={styles.fieldGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                name="clave"
                value={form.clave}
                onChange={handleChange}
                onFocus={() => setMostrarInfoClave(true)}
                onBlur={() => setMostrarInfoClave(false)}
              />
            </div>

            {mostrarInfoClave && (
              <div className={styles.passwordInfo}>
                <p>
                  La contraseña debe tener al menos <strong>8 caracteres</strong> y cumplir con <strong>3 de los siguientes</strong>:
                </p>
                <ul>
                  <li>• Letras minúsculas (a-z)</li>
                  <li>• Letras mayúsculas (A-Z)</li>
                  <li>• Números (0-9)</li>
                  <li>• Caracteres especiales (por ejemplo: !@#$%^&*)</li>
                </ul>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label>Repetir Contraseña</label>
              <input
                type="password"
                name="repetirClave"
                value={form.repetirClave}
                onChange={handleChange}
              />
            </div>
          </>
        )}
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
