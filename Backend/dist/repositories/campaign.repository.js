"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class CampaignRepository {
    async createCampaign(data) {
        return prisma_1.default.campaign.create({
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        bio: true,
                    },
                },
                category: true,
                images: true,
            },
        });
    }
    async findCampaignBySlug(slug) {
        return prisma_1.default.campaign.findUnique({
            where: {
                slug,
            },
        });
    }
    async findCategoryById(categoryId) {
        return prisma_1.default.category.findUnique({
            where: {
                id: categoryId,
            },
        });
    }
    // Get all active campaigns
    async findAllCampaigns(options) {
        const { skip, take, categoryId, search, isFeatured } = options;
        return prisma_1.default.campaign.findMany({
            where: {
                status: "ACTIVE",
                deletedAt: null,
                ...(categoryId && {
                    categoryId,
                }),
                ...(isFeatured !== undefined && {
                    isFeatured,
                }),
                ...(search && {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        bio: true,
                    },
                },
                category: true,
                images: true,
            },
        });
    }
    // Get one campaign using slug
    async findCampaignDetailsBySlug(slug) {
        return prisma_1.default.campaign.findFirst({
            where: {
                slug,
                deletedAt: null,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true,
                    },
                },
                category: true,
                images: true,
                donations: {
                    select: {
                        id: true,
                        amount: true,
                        anonymous: true,
                        message: true,
                        createdAt: true,
                        donor: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    }
    async countCampaigns(options) {
        const { categoryId, search, isFeatured } = options;
        return prisma_1.default.campaign.count({
            where: {
                status: "ACTIVE",
                deletedAt: null,
                ...(categoryId && {
                    categoryId,
                }),
                ...(isFeatured !== undefined && {
                    isFeatured,
                }),
                ...(search && {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
        });
    }
    async findCampaignById(id) {
        return prisma_1.default.campaign.findUnique({
            where: {
                id,
            },
            include: {
                owner: true,
                category: true,
                images: true,
            },
        });
    }
    async approveCampaign(id, adminId) {
        return prisma_1.default.campaign.update({
            where: {
                id,
            },
            data: {
                status: "ACTIVE",
                approvedAt: new Date(),
                approvedBy: {
                    connect: {
                        id: adminId,
                    },
                },
                rejectionReason: null,
            },
            include: {
                owner: true,
                category: true,
                images: true,
            },
        });
    }
    async rejectCampaign(id, adminId, rejectionReason) {
        return prisma_1.default.campaign.update({
            where: {
                id,
            },
            data: {
                status: "REJECTED",
                rejectionReason,
                approvedAt: null,
                approvedBy: {
                    connect: {
                        id: adminId,
                    },
                },
            },
            include: {
                owner: true,
                category: true,
                images: true,
            },
        });
    }
}
exports.CampaignRepository = CampaignRepository;
