export class Campaign {
    constructor(
        public campaignName: string,
        public progress: number,
        public expiryDate: string,
        public totalbudget: number,
        public fundraised: number
    ) { }
}