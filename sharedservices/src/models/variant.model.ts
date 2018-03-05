export class Variant {
  constructor(
    public qty: number|null,
    public price: number,
    public originalPrice: number,
    public id: string,
    public color: string,
    public sizes: Array<string>|null
  ) { }
}