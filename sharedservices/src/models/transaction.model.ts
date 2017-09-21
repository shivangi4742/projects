import { Product } from './product.model';

export class Transaction {
  constructor(
    public hasCashback: boolean,
    public amount: number,
    public status: number,
    public cbAmount: number,
    public id: string,
    public tr: string,
    public mode: string,
    public vPA: string,
    public merchantVPA: string,
    public dateAndTime: string,
    public cbTid: string,
    public cbMode: string,
    public products: Array<Product>) { }
}