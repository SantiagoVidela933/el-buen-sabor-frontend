import { BaseEntity } from "./BaseEntity";
import { Factura } from "./Factura";

export class DatoMercadoPago extends BaseEntity {
  date_created: string; // LocalDate → string ("YYYY-MM-DD")
  date_approved: string;
  date_last_updated: string;
  payment_type_id: string;
  payment_method_id: string;
  status: string;
  status_detail: string;

  factura?: Factura; // opcional

  constructor(
    date_created: string,
    date_approved: string,
    date_last_updated: string,
    payment_type_id: string,
    payment_method_id: string,
    status: string,
    status_detail: string,
    factura?: Factura
  ) {
    super();
    this.date_created = date_created;
    this.date_approved = date_approved;
    this.date_last_updated = date_last_updated;
    this.payment_type_id = payment_type_id;
    this.payment_method_id = payment_method_id;
    this.status = status;
    this.status_detail = status_detail;
    if (factura) this.factura = factura;
  }
}
