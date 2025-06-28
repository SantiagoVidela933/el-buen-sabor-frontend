export abstract class BaseEntity {
  id?: number;
  fechaAlta: string | null;
  fechaModificacion: string | null;
  fechaBaja: string | null;

  constructor(
    id: number = 0,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null
  ) {
    this.id = id;
    this.fechaAlta = fechaAlta;
    this.fechaModificacion = fechaModificacion;
    this.fechaBaja = fechaBaja;
  }
}
