export class Order {
  id: number;
  date: string;
  total: number;
  orderStatus: "Entregado" | "En preparación" | "En camino" | "Cancelado";
  paid: boolean;

  constructor(
    id: number,
    date: string,
    total: number,
    orderStatus: "Entregado" | "En preparación" | "En camino" | "Cancelado",
    paid: boolean
  ) {
    this.id = id;
    this.date = date;
    this.total = total;
    this.orderStatus = orderStatus;
    this.paid = paid;
  }
}