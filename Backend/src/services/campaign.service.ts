import { CampaignRepository } from "../repositories/campaign.repository";
import { generateSlug } from "../utils/slug";

import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

export class CampaignService {
  constructor(
    private campaignRepository = new CampaignRepository()
  ) {}

 
  async createCampaign(
    userId: string,
    data: {
      title: string;
      description: string;
      goalAmount: number;
      categoryId: string;
      deadline: Date;
    }
  ) {
    const category =
      await this.campaignRepository.findCategoryById(
        data.categoryId
      );

    if (!category) {
      throw new AppError(
        "Category not found",
        HttpStatus.NOT_FOUND
      );
    }

    if (data.deadline <= new Date()) {
      throw new AppError(
        "Deadline must be in the future",
        HttpStatus.BAD_REQUEST
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;

    let existingCampaign =
      await this.campaignRepository.findCampaignBySlug(slug);

    let counter = 1;

    while (existingCampaign) {
      slug = `${baseSlug}-${counter}`;

      existingCampaign =
        await this.campaignRepository.findCampaignBySlug(slug);

      counter++;
    }

    const campaign =
      await this.campaignRepository.createCampaign({
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


async getAllCampaigns(params: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}) {
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

  async getCampaignBySlug(slug: string) {
    const campaign =
      await this.campaignRepository.findCampaignDetailsBySlug(
        slug
      );

    if (!campaign) {
      throw new AppError(
        "Campaign not found",
        HttpStatus.NOT_FOUND
      );
    }

    return campaign;
  }

  async approveCampaign(
  campaignId: string,
  adminId: string
) {
  const campaign =
    await this.campaignRepository.findCampaignById(campaignId);

  if (!campaign) {
    throw new AppError(
      "Campaign not found",
      HttpStatus.NOT_FOUND
    );
  }

  if (campaign.status !== "PENDING") {
    throw new AppError(
      "Only pending campaigns can be approved",
      HttpStatus.BAD_REQUEST
    );
  }

  if (campaign.deadline <= new Date()) {
    throw new AppError(
      "Campaign deadline has already passed",
      HttpStatus.BAD_REQUEST
    );
  }

  const approvedCampaign =
    await this.campaignRepository.approveCampaign(
      campaignId,
      adminId
    );

  return approvedCampaign;
}

async rejectCampaign(
  campaignId: string,
  adminId: string,
  rejectionReason: string
) {
  const campaign =
    await this.campaignRepository.findCampaignById(campaignId);

  if (!campaign) {
    throw new AppError(
      "Campaign not found",
      HttpStatus.NOT_FOUND
    );
  }

  if (campaign.status !== "PENDING") {
    throw new AppError(
      "Only pending campaigns can be rejected",
      HttpStatus.BAD_REQUEST
    );
  }

  if (!rejectionReason.trim()) {
    throw new AppError(
      "Rejection reason is required",
      HttpStatus.BAD_REQUEST
    );
  }

  const rejectedCampaign =
    await this.campaignRepository.rejectCampaign(
      campaignId,
      adminId,
      rejectionReason
    );

  return rejectedCampaign;
}
}