export class SubLedgerModel {
    constructor(
        public amount: number,
        public subledger_code: string,
        public type: string,
        public oAmount: number // Original amount value
    ) { }
}