import { CampaignRepository } from "../repositories/campaign.repository";
import { generateSlug } from "../utils/slug";

import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

export class CampaignService {
  constructor(
    private campaignRepository = new CampaignRepository()
  ) {}

  // =========================
  // CREATE CAMPAIGN
  // =========================
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


  async getAllCampaigns() {
    return this.campaignRepository.findAllCampaigns();
  }

  // =========================
  // GET CAMPAIGN BY SLUG
  // =========================
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
}