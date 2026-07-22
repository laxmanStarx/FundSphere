"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const campaign_repository_1 = require("../repositories/campaign.repository");
class CampaignService {
    constructor(campaignRepository = new campaign_repository_1.CampaignRepository()) {
        this.campaignRepository = campaignRepository;
    }
}
exports.CampaignService = CampaignService;
