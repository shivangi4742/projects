export class CartItem {
    constructor(
        public quantity: number,
        public productId: string,
        public name: string,
        public origPrice: number,
        public offerPrice: number,
        public imageURL: string,
        public variantId: string,
        public sizeId: string,
        public color: string,
        public size: string,
        public description: string,
        public shippingcharge: string | null
    ){ }
}