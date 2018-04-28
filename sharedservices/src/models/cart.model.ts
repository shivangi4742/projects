import { CartItem } from "./cartitem.model";

export class Cart {
    constructor(
        public name: string,
        public phone: string,
        public email: string,
        public address: string,
        public items: Array<CartItem>,
        public merchantCode: string,
        public paymentMode: string,
        public pin: string,
        public city: string,
        public state: string
    ){ }
}