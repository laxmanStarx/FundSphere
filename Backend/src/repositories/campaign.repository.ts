import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export class CampaignRepository {
  async createCampaign(data: Prisma.CampaignCreateInput) {
    return prisma.campaign.create({
      data,
      include: {
        owner: true,
        category: true,
        images: true,
      },
    });
  }


  async findCampaignBySlug(slug: string) {
  return prisma.campaign.findUnique({
    where: {
      slug,
    },
  });
}


async findCategoryById(categoryId: string) {
  return prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
}













}