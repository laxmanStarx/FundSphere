"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaign_service_1 = require("../services/campaign.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
class CampaignController {
    constructor(campaignService = new campaign_service_1.CampaignService()) {
        this.campaignService = campaignService;
        this.createCampaign = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const campaign = await this.campaignService.createCampaign(req.user.id, {
                title: req.body.title,
                description: req.body.description,
                goalAmount: Number(req.body.goalAmount),
                categoryId: req.body.categoryId,
                deadline: new Date(req.body.deadline),
            });
            return res.status(httpStatus_1.HttpStatus.CREATED).json(new apiResponse_1.ApiResponse(httpStatus_1.HttpStatus.CREATED, campaign, "Campaign created successfully"));
        });
    }
}
exports.CampaignController = CampaignController;
