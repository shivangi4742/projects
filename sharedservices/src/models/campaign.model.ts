export class Campaign {
    constructor(
        public txnrefnumber: string,
        public campaignName: string,
        public progress: number,
        public expiryDate: number,
        public totalbudget: number,
        public fundraised: number,
        public description: string,
        public creationDate: number
    ) { }
}