import Base from "../Base";

export class ProductCategory extends Base {
  constructor(
    id: number,
    public description: string,
    deleted?: boolean
    
  ) {
    super(id, deleted);
  }
}
