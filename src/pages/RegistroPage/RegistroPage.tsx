import styles from "./RegistroPage.module.css";
import Localidad from "../../models/prueba/Localidad";
import Cliente from "../../models/prueba/Client";
import Domicilio from "../../models/prueba/Domicilio";
import Usuario from "../../models/prueba/Usuario";
import { useState, useEffect } from "react";
import { getLocalidadesJSONFetch } from "../../api/localidades";
import { crearCliente } from "../../api/cliente";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

/*IMAGENES*/
import logo from "../../assets/logos/logo_buenSabor.png";
import pensamiento from "../../assets/images/imagen-pensamiento.png";
import personas from "../../assets/images/imagen-personas.png";
import celular from "../../assets/images/imagen-celular.png";

// ...importaciones iguales...

export default function RegistroPage() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();

  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState("");
  const [idLocalidad, setIdLocalidad] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) loginWithRedirect();
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  useEffect(() => {
    getLocalidadesJSONFetch().then(setLocalidades);
  }, []);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  if (isLoading || !isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numero;
    domicilio.codigoPostal = codigoPostal;
    domicilio.idLocalidad = idLocalidad;

    const usuario = new Usuario();
    usuario.auth0id = user?.sub || "";
    usuario.nombreUsuario = email;

    const cliente = new Cliente();
    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.email = email;
    cliente.telefono = telefono;
    cliente.fechaDeNacimiento = fechaNacimiento;
    cliente.domicilio = domicilio;
    cliente.usuario = usuario;

    try {
      await crearCliente(cliente);
      Swal.fire({
        icon: "success",
        title: "Datos guardados exitosamente!",
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al guardar los datos.`
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftSide}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo Buen Sabor" className={styles.logo} />
        </div>
        <div className={styles.bottomImages}>
          <img src={pensamiento} alt="Pensamiento" className={styles.pensamiento} />
          <img src={personas} alt="Personas" className={styles.personas} />
          <img src={celular} alt="Celular" className={styles.celular} />
        </div>
      </div>

      <div className={styles.rightSide}>
        <h1 className={styles.title}>
          Te damos la bienvenida a <br /> <strong>“Buen Sabor”</strong>
        </h1>
        <h2 className={styles.subtitle}>Terminá de completar tus datos:</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} readOnly />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="edad">Fecha de nacimiento</label>
            <input
              type="date"
              id="edad"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="street">Calle</label>
            <input
              type="text"
              id="street"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="number">Número</label>
            <input
              type="text"
              id="number"
              value={numero}
              onChange={(e) => setNumero(parseInt(e.target.value) || 0)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="postalCode">Código postal</label>
            <input
              type="text"
              id="postalCode"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="localidad">Localidad</label>
            <select
              id="localidad"
              value={idLocalidad}
              onChange={(e) => setIdLocalidad(parseInt(e.target.value))}
            >
              <option value={0}>Seleccione una localidad</option>
              {localidades.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.submitButton}>
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

