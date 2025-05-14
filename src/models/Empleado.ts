export default class Empleado {
  constructor(
    public id: number, // útil para identificar al empleado
    public nombre: string,
    public apellido: string,
    public email: string,
    public telefono: string,
    public direccion: string,
    public departamento: string,
    public estado: 'Alta' | 'Baja',
    public fechaNacimiento: string,
    public rol: 'Cajero' | 'Cocinero' | 'Delivery'
  ) {}
}
