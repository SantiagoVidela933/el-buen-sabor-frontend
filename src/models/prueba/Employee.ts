import Base from "../Base";
import { Domicilio } from "../Domicilio";

export default class Employee extends Base {
  constructor(
    id: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public telefono: string,
    public domicilio: Domicilio,
    public departamento: string,
    public estado: 'Alta' | 'Baja',
    public fechaNacimiento: string,
    public rol: 'Cajero' | 'Cocinero' | 'Delivery',
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}