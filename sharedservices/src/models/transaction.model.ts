import { Payment } from './payment.model';

export class Transaction {
    constructor(
        public numPayments: number,
        public totalAmount: number,
        public numPages: number,
        public payments: Payment[] | null) { }
}