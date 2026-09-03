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
    // =========================================================
    // CREATE CAMPAIGN
    // =========================================================
    async createCampaign(userId, data) {
        // Check category
        const category = await this.campaignRepository.findCategoryById(data.categoryId);
        if (!category) {
            throw new AppError_1.AppError("Category not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        // Validate title
        if (!data.title.trim()) {
            throw new AppError_1.AppError("Campaign title is required", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Validate description
        if (!data.description.trim()) {
            throw new AppError_1.AppError("Campaign description is required", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Validate goal amount
        if (data.goalAmount <= 0) {
            throw new AppError_1.AppError("Goal amount must be greater than zero", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Validate deadline
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
        // Create campaign
        const campaign = await this.campaignRepository.createCampaign({
            title: data.title.trim(),
            description: data.description.trim(),
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
    // =========================================================
    // GET ALL ACTIVE CAMPAIGNS
    // =========================================================
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
    // =========================================================
    // GET CAMPAIGN BY SLUG
    // =========================================================
    async getCampaignBySlug(slug) {
        const campaign = await this.campaignRepository.findCampaignDetailsBySlug(slug);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        return campaign;
    }
    // =========================================================
    // APPROVE CAMPAIGN - ADMIN ONLY
    // =========================================================
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
    // =========================================================
    // REJECT CAMPAIGN - ADMIN ONLY
    // =========================================================
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
        const rejectedCampaign = await this.campaignRepository.rejectCampaign(campaignId, adminId, rejectionReason.trim());
        return rejectedCampaign;
    }
    // =========================================================
    // UPDATE CAMPAIGN - OWNER ONLY
    // =========================================================
    async updateCampaign(campaignId, userId, data) {
        // -------------------------------------------------------
        // 1. Find campaign
        // -------------------------------------------------------
        const campaign = await this.campaignRepository.findCampaignById(campaignId);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        // -------------------------------------------------------
        // 2. Check ownership
        // -------------------------------------------------------
        if (campaign.ownerId !== userId) {
            throw new AppError_1.AppError("You are not allowed to update this campaign", httpStatus_1.HttpStatus.FORBIDDEN);
        }
        // -------------------------------------------------------
        // 3. Check campaign status
        // -------------------------------------------------------
        if (campaign.status !== "PENDING" &&
            campaign.status !== "REJECTED") {
            throw new AppError_1.AppError("Only pending or rejected campaigns can be updated", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // -------------------------------------------------------
        // 4. Validate title
        // -------------------------------------------------------
        if (data.title !== undefined &&
            !data.title.trim()) {
            throw new AppError_1.AppError("Campaign title cannot be empty", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // -------------------------------------------------------
        // 5. Validate description
        // -------------------------------------------------------
        if (data.description !== undefined &&
            !data.description.trim()) {
            throw new AppError_1.AppError("Campaign description cannot be empty", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // -------------------------------------------------------
        // 6. Validate goal amount
        // -------------------------------------------------------
        if (data.goalAmount !== undefined &&
            data.goalAmount <= 0) {
            throw new AppError_1.AppError("Goal amount must be greater than zero", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // -------------------------------------------------------
        // 7. Validate deadline
        // -------------------------------------------------------
        if (data.deadline !== undefined &&
            data.deadline <= new Date()) {
            throw new AppError_1.AppError("Deadline must be in the future", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // -------------------------------------------------------
        // 8. Validate category
        // -------------------------------------------------------
        if (data.categoryId !== undefined) {
            const category = await this.campaignRepository.findCategoryById(data.categoryId);
            if (!category) {
                throw new AppError_1.AppError("Category not found", httpStatus_1.HttpStatus.NOT_FOUND);
            }
        }
        // -------------------------------------------------------
        // 9. Generate unique slug if title changed
        // -------------------------------------------------------
        let slug;
        if (data.title !== undefined) {
            const baseSlug = (0, slug_1.generateSlug)(data.title);
            slug = baseSlug;
            let counter = 1;
            let existingCampaign = await this.campaignRepository.findCampaignBySlug(slug);
            while (existingCampaign &&
                existingCampaign.id !== campaignId) {
                slug = `${baseSlug}-${counter}`;
                existingCampaign =
                    await this.campaignRepository.findCampaignBySlug(slug);
                counter++;
            }
        }
        // -------------------------------------------------------
        // 10. Prepare update data
        // -------------------------------------------------------
        const updateData = {
            ...(data.title !== undefined && {
                title: data.title.trim(),
            }),
            ...(data.description !== undefined && {
                description: data.description.trim(),
            }),
            ...(data.goalAmount !== undefined && {
                goalAmount: data.goalAmount,
            }),
            ...(data.deadline !== undefined && {
                deadline: data.deadline,
            }),
            ...(data.categoryId !== undefined && {
                category: {
                    connect: {
                        id: data.categoryId,
                    },
                },
            }),
            ...(slug !== undefined && {
                slug,
            }),
        };
        // -------------------------------------------------------
        // 11. Rejected campaign is resubmitted
        // -------------------------------------------------------
        if (campaign.status === "REJECTED") {
            updateData.status = "PENDING";
            updateData.rejectionReason = null;
            updateData.approvedAt = null;
            updateData.approvedBy = {
                disconnect: true,
            };
        }
        // -------------------------------------------------------
        // 12. Update campaign
        // -------------------------------------------------------
        const updatedCampaign = await this.campaignRepository.updateCampaign(campaignId, updateData);
        return updatedCampaign;
    }
    async deleteCampaign(campaignId, userId) {
        const campaign = await this.campaignRepository.findCampaignById(campaignId);
        if (!campaign) {
            throw new AppError_1.AppError("Campaign not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (campaign.deletedAt) {
            throw new AppError_1.AppError("Campaign is already deleted", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Only campaign owner can delete
        if (campaign.ownerId !== userId) {
            throw new AppError_1.AppError("You are not allowed to delete this campaign", httpStatus_1.HttpStatus.FORBIDDEN);
        }
        const deletedCampaign = await this.campaignRepository.deleteCampaign(campaignId);
        return deletedCampaign;
    }
}
exports.CampaignService = CampaignService;
