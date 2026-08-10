import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export class CampaignRepository {

 async createCampaign(data: Prisma.CampaignCreateInput) {
  return prisma.campaign.create({
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
async findAllCampaigns(options: {
  skip: number;
  take: number;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}) {
  const { skip, take, categoryId, search, isFeatured } = options;

  return prisma.campaign.findMany({
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

  async countCampaigns(options: {
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}) {
  const { categoryId, search, isFeatured } = options;

  return prisma.campaign.count({
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

async findCampaignById(id: string) {
  return prisma.campaign.findUnique({
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

async approveCampaign(id: string, adminId: string) {
  return prisma.campaign.update({
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

async rejectCampaign(
  id: string,
  adminId: string,
  rejectionReason: string
) {
  return prisma.campaign.update({
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