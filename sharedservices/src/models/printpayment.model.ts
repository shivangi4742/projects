export class PrintPayment {
    constructor(
        public tr: string|null,
        public id: string|null,
        public orderId: string|null,
        public vPA: string|null,
        public merchantVPA: string|null,
        public amount: number|null,
        public mode: string|null,
        public till: string|null,
        public status: string|null,
        public dateAndTime: string|null,
        public hasCashback: string|null,
        public description: string|null,
        public name: string|null,
        public email: string|null,
        public phone: string|null,
        public address: string|null,
        public pan: string|null,
        public plink: string|null,
        public transactionid:string|null ){ }
}