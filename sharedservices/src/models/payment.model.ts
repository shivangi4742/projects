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
        public dateAndTime: number,
        public cbTid: string|null,
        public cbMode: string|null,
        public hasProducts: boolean,
        public products: Array<Product>|null,
        public email: string | null,
        public phone: string | null,
        public address: string | null,
        public description: string | null,
        public pin: string | null,
        public city: string | null,
        public state: string | null) { }
}