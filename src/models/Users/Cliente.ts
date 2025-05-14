import Base from "../Base";

export default class Cliente extends Base {
  constructor(
    id: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public telefono: string,
    public direccion: string,
    public departamento: string,
    public estado: 'Alta' | 'Baja',
    public fechaNacimiento: string,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
