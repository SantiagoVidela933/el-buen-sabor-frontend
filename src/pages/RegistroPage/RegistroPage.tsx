import Localidad from '../../models/prueba/Localidad';
import Cliente from '../../models/prueba/Client';
import Domicilio from '../../models/prueba/Domicilio';
import Usuario from '../../models/prueba/Usuario';
import { useState, useEffect } from 'react';
import { getLocalidadesJSONFetch } from '../../api/localidades';
import { crearCliente } from '../../api/cliente';
import "./RegistroPage.css"
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

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
    // Si no está autenticado ni cargando, redirige a login
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  useEffect(() => {
    const cargarDatos = async () => {
      const localidadesData = await getLocalidadesJSONFetch();
      setLocalidades(localidadesData);
    };
    cargarDatos();
  }, []);

  // Opcional: setear el email del usuario Auth0 en el input email si existe
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Bloquear render mientras no esté autenticado
  if (isLoading || !isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numero;
    domicilio.codigoPostal = codigoPostal;
    domicilio.idLocalidad = idLocalidad;

    const usuario = new Usuario();
    usuario.auth0id = user?.sub || ""; // usar el sub de Auth0 real
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
      alert("Cliente creado correctamente");
      navigate("/"); // redirigir al home u otra página
    } catch (error) {
      if (error instanceof Error) {
        alert("⚠️ Hubo un error al crear el cliente: " + error.message);
        console.error(error);
      } else {
        alert("⚠️ Hubo un error desconocido al crear el cliente.");
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <div className='containera'>
      <div className='title'><h1>Registrarse</h1></div>
      <form className='Form' onSubmit={handleSubmit}>
        <div className='info-personal'>
          <div>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div>
            <label htmlFor="lastName">Apellido</label>
            <input type="text" id="lastName" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>

          <div>
            <label htmlFor="phone">Teléfono</label>
            <input type="text" id="phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} readOnly />
          </div>

          <div>
            <label htmlFor="edad">Fecha de nacimiento</label>
            <input type="date" id="edad" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
          </div>
        </div>

        <div className='info-domicilio'>
          <div>
            <label htmlFor="street">Calle</label>
            <input type="text" id="street" value={calle} onChange={(e) => setCalle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="number">Número</label>
            <input type="number" id="number" value={numero} onChange={(e) => setNumero(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label htmlFor="postalCode">Código postal</label>
            <input type="text" id="postalCode" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
          </div>
          <div>
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
        </div>

        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}

