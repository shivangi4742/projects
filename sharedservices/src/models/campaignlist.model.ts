import { Campaign } from "./campaign.model";

export class CampaignList {
    constructor(
        public allCampaigns: Campaign[],
        public numPages: number,
        public totalCamps: number
    ) { }
}