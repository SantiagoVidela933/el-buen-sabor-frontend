export class UnidadMedida {
  id?: number; 
  denominacion: string;

  constructor(denominacion: string) {
    this.denominacion = denominacion;
  }

  static fromJson(json: any): UnidadMedida {
    return new UnidadMedida(json.denominacion);
  }
}
