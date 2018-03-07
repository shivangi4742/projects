import { Variant } from './variant.model';

export class NewProduct {
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
        public description: string|null,
        public uom: string|null,
        public discount: number|null,
        public imageURLs: Array<string> | null,
        public isAvailable: boolean,
        public productType: string,
        public hasVariants: boolean,
        public variants: Array<Variant> | null,
        public venue: string | null,
        public startDate: any,
        public endDate: any,
        public fileUrl: string | null
    ) { }
}