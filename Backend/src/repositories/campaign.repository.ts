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

  // Get all active campaigns
  async findAllCampaigns() {
    return prisma.campaign.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
      },

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        category: true,

        images: true,

        _count: {
          select: {
            donations: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get one campaign using slug
  async findCampaignDetailsBySlug(slug: string) {
    return prisma.campaign.findFirst({
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
}