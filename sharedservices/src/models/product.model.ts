import { Variant } from "./variant.model";

export class Product {
  constructor(
    public isNew: boolean,
    public isEdit: boolean,
    public isSelected: boolean,
    public qty: number|null,
    public price: number,
    public originalPrice: number,
    public id: string,
    public prodId: string|null,
    public name: string,
    public description: string,
    public uom: string,
    public imageURL: string,
    public color: string,
    public sizes: Array<string>|null,
    public variants: Array<Variant>|null,
    public imageURLs: Array<string>|null,
    public merchantCode: string) { }
}