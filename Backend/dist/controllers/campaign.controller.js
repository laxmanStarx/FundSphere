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
        this.getAllCampaigns = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const categoryId = typeof req.query.categoryId === "string"
                ? req.query.categoryId
                : undefined;
            const search = typeof req.query.search === "string"
                ? req.query.search
                : undefined;
            const isFeatured = req.query.isFeatured === "true"
                ? true
                : req.query.isFeatured === "false"
                    ? false
                    : undefined;
            const result = await this.campaignService.getAllCampaigns({
                page,
                limit,
                categoryId,
                search,
                isFeatured,
            });
            return res.status(httpStatus_1.HttpStatus.OK).json(new apiResponse_1.ApiResponse(httpStatus_1.HttpStatus.OK, result, "Campaigns fetched successfully"));
        });
        this.getCampaignBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const slug = Array.isArray(req.params.slug)
                ? req.params.slug[0]
                : req.params.slug;
            const campaign = await this.campaignService.getCampaignBySlug(slug);
            return res.status(httpStatus_1.HttpStatus.OK).json(new apiResponse_1.ApiResponse(httpStatus_1.HttpStatus.OK, campaign, "Campaign fetched successfully"));
        });
        this.approveCampaign = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const campaignId = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const campaign = await this.campaignService.approveCampaign(campaignId, req.user.id);
            return res.status(httpStatus_1.HttpStatus.OK).json(new apiResponse_1.ApiResponse(httpStatus_1.HttpStatus.OK, campaign, "Campaign approved successfully"));
        });
        this.rejectCampaign = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const campaignId = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const campaign = await this.campaignService.rejectCampaign(campaignId, req.user.id, req.body.rejectionReason);
            return res.status(httpStatus_1.HttpStatus.OK).json(new apiResponse_1.ApiResponse(httpStatus_1.HttpStatus.OK, campaign, "Campaign rejected successfully"));
        });
    }
}
exports.CampaignController = CampaignController;
