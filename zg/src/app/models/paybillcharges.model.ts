export class PaybillChargesModel {
    constructor(
        public amount: number,
        public type: string,
        public subledger_code: string
    ) { }
}