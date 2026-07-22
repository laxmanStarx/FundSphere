"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaign_service_1 = require("../services/campaign.service");
class CampaignController {
    constructor(campaignService = new campaign_service_1.CampaignService()) {
        this.campaignService = campaignService;
    }
}
exports.CampaignController = CampaignController;
