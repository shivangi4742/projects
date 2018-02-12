import { Product } from './product.model';

export class Payment {
  constructor(
    public hasCashback: boolean,
    public amount: number,
    public status: number|null,
    public cbAmount: number|null,
    public id: string,
    public tr: string | null,
    public till: string | null,
    public mode: string|null,
    public vPA: string | null,
    public merchantVPA: string|null,
    public dateAndTime: string,
    public cbTid: string|null,
    public cbMode: string|null,
    public hasProducts: boolean,
    public products: Array<Product>|null,
    public email: string | null,
    public phone: string | null,
    public address: string | null) { }
}