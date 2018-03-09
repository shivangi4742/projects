import { NewVariant } from './newvariant.model';
import { NewSize } from './newsize.model';
import { ProductImage } from './productimage.model';

export class NewProduct {
    constructor(
        public isNew: boolean,
        public isEdit: boolean,
        public isSelected: boolean,
        public price: number,
        public discountedPrice: number,
        public id: string,
        public name: string,
        public description: string|null,
        public uom: string|null,
        public color: string|null,
        public prodSizes: Array<NewSize> | null,
        public prodImgUrls: Array<ProductImage> | null,
        public isAvailable: boolean,
        public productType: string,
        public hasVariants: boolean,
        public variants: Array<NewVariant> | null,
        public venue: string | null,
        public startDate: any,
        public endDate: any,
        public fileUrl: string | null
    ) { }
}