import Base from "../Base";

export class Order extends Base {
  constructor(
    id: number,
    public date: string,
    public total: number,
    public orderStatus: "Entregado" | "En preparación" | "En camino" | "Cancelado",
    public paid: boolean,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
