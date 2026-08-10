"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const campaign_repository_1 = require("../repositories/campaign.repository");
const slug_1 = require("../utils/slug");
const AppError_1 = require("../utils/AppError");
const httpStatus_1 = require("../constants/httpStatus");
class CampaignService {
    constructor(campaignRepository = new campaign_repository_1.CampaignRepository()) {
        this.campaignRepository = campaignRepository;
    }
    async createCampaign(userId, data) {
        const category = await this.campaignRepository.findCategoryById(data.categoryId);
        if (!category) {
            throw new AppError_1.AppError("Category not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (data.deadline <= new Date()) {
            throw new AppError_1.AppError("Deadline must be in the future", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Generate unique slug
        const baseSlug = (0, slug_1.generateSlug)(data.title);
        let slug = baseSlug;
        let existingCampaign = await this.campaignRepository.findCampaignBySlug(slug);
        let counter = 1;
        while (existingCampaign) {
            slug = `${baseSlug}-${counter}`;
            existingCampaign =
                await this.campaignRepository.findCampaignBySlug(slug);
            counter++;
        }
        const campaign = await this.campaignRepository.createCampaign({
            title: data.title,
            description: data.description,
            goalAmount: data.goalAmount,
            deadline: data.deadline,
            slug,
            owner: {
                connect: {
                    id: userId,
                },
            },
            category: {
                connect: {
                    id: data.categoryId,
                },
            },
        });
        return campaign;
    }
    async getAllCampaigns(params) {
        const page = params.page && params.page > 0
            ? params.page
            : 1;
        const limit = params.limit && params.limit > 0
            ? Math.min(params.limit, 50)
            : 10;
        const skip = (page - 1) * limit;
        const [campaigns, total] = await Promise.all([
            this.campaignRepository.findAllCampaigns({
                skip,
                take: limit,
                categoryId: params.categoryId,
                search: params.search,
                isFeatured: params.isFeatured,
            }),
            this.campaignRepository.countCampaigns({
                categoryId: params.categoryId,
                search: params.search,
                isFeatured: params.isFeatured,
            }),
        ]);
        return {
            campaigns,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getCampaignBySlug(slug) {
        const campaign = await this.campaignRepository.findCampaignDetailsBySlug(slug);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        return campaign;
    }
    async approveCampaign(campaignId, adminId) {
        const campaign = await this.campaignRepository.findCampaignById(campaignId);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (campaign.status !== "PENDING") {
            throw new AppError_1.AppError("Only pending campaigns can be approved", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        if (campaign.deadline <= new Date()) {
            throw new AppError_1.AppError("Campaign deadline has already passed", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const approvedCampaign = await this.campaignRepository.approveCampaign(campaignId, adminId);
        return approvedCampaign;
    }
    async rejectCampaign(campaignId, adminId, rejectionReason) {
        const campaign = await this.campaignRepository.findCampaignById(campaignId);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (campaign.status !== "PENDING") {
            throw new AppError_1.AppError("Only pending campaigns can be rejected", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        if (!rejectionReason.trim()) {
            throw new AppError_1.AppError("Rejection reason is required", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const rejectedCampaign = await this.campaignRepository.rejectCampaign(campaignId, adminId, rejectionReason);
        return rejectedCampaign;
    }
}
exports.CampaignService = CampaignService;
