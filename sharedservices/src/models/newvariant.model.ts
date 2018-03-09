import { NewSize } from './newsize.model';

export class NewVariant {
    constructor(
        public price: number,
        public discountedPrice: number,
        public id: string,
        public color: string,
        public isAvailable: boolean,
        public variantCode: string,
        public variantDesc: string,
        public listProductSizes: Array<NewSize>|null
    ) { }
}