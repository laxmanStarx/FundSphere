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
                owner: true,
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
}
exports.CampaignRepository = CampaignRepository;
