import { CampaignRepository } from "../repositories/campaign.repository";

export class CampaignService {

    constructor(
        private campaignRepository = new CampaignRepository()
    ) {}

}