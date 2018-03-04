export class CartItem {
    constructor(
        public quantity: number,
        public productId: string,
        public name: string,
        public origPrice: number,
        public offerPrice: number,
        public imageURL: string        
    ){ }
}