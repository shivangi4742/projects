export class Fundraiser {
    constructor(
        public id: number,
        public target: number,
        public collection: number,
        public fundraiserId: number,
        public campaignId: string,
        public fundraiserName: string
    ) { }
}