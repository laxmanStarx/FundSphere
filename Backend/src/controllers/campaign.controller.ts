import { Request, Response } from "express";

import { CampaignService } from "../services/campaign.service";

export class CampaignController {

    constructor(
        private campaignService = new CampaignService()
    ) {}

}