export class AddOn {
    constructor(
        public isAvailable: boolean,
        public price: number,
        public originalPrice: number,
        public code: string,
        public description: string) { }
}  