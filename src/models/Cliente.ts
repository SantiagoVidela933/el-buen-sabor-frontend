export default class Cliente {
  constructor(
    public id: number, 
    public nombre: string,
    public apellido: string,
    public email: string,
    public telefono: string,
    public direccion: string,
    public departamento: string,
    public estado: 'Alta' | 'Baja',
    public fechaNacimiento: string,
  ) {}
}
