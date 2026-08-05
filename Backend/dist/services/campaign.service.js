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
        const baseSlug = (0, slug_1.generateSlug)(data.title);
        let slug = baseSlug;
        let existingCampaign = await this.campaignRepository.findCampaignBySlug(slug);
        let counter = 1;
        while (existingCampaign) {
            slug = `${baseSlug}-${counter}`;
            existingCampaign = await this.campaignRepository.findCampaignBySlug(slug);
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
}
exports.CampaignService = CampaignService;
