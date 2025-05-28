import { BaseEntity } from "./BaseEntity";

export class Usuario extends BaseEntity {
  auth0id: string;
  nombreUsuario: string;

  constructor(auth0id: string, nombreUsuario: string) {
    super();
    this.auth0id = auth0id;
    this.nombreUsuario = nombreUsuario;
  }
}
