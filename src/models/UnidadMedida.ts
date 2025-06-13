export class UnidadMedida {
  id?: number; 
  denominacion: string;

  constructor(denominacion: string, id?: number) {
    this.denominacion = denominacion;
    this.id = id;
  }

  static fromJson(json: any): UnidadMedida {
    return new UnidadMedida(json.denominacion, json.id);
  }
}
