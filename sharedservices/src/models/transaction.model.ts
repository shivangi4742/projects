import { Product } from './product.model';

export class Transaction {
  constructor(
    public hasCashback: boolean,
    public amount: number,
    public status: number|null,
    public cbAmount: number|null,
    public id: string,
    public tr: string,
    public mode: string|null,
    public vPA: string,
    public till: string,
    public merchantVPA: string,
    public dateAndTime: string,
    public cbTid: string|null,
    public cbMode: string|null,
    public products: Array<Product>|null) { }
}