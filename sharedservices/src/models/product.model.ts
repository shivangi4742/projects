export class Product {
  constructor(
    public isNew: boolean,
    public isSelected: boolean,
    public price: number,
    public originalPrice: number,
    public id: string,
    public name: string,
    public description: string,
    public uom: string,
    public imageURL: string) { }
}