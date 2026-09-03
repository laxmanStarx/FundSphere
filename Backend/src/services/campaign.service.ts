import { CampaignRepository } from "../repositories/campaign.repository";
import { generateSlug } from "../utils/slug";

import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";
import { Prisma } from "@prisma/client";

export class CampaignService {
  constructor(
    private campaignRepository = new CampaignRepository()
  ) {}

  // =========================================================
  // CREATE CAMPAIGN
  // =========================================================

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
    // Check category
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

    // Validate title
    if (!data.title.trim()) {
      throw new AppError(
        "Campaign title is required",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate description
    if (!data.description.trim()) {
      throw new AppError(
        "Campaign description is required",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate goal amount
    if (data.goalAmount <= 0) {
      throw new AppError(
        "Goal amount must be greater than zero",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate deadline
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
      await this.campaignRepository.findCampaignBySlug(
        slug
      );

    let counter = 1;

    while (existingCampaign) {
      slug = `${baseSlug}-${counter}`;

      existingCampaign =
        await this.campaignRepository.findCampaignBySlug(
          slug
        );

      counter++;
    }

    // Create campaign
    const campaign =
      await this.campaignRepository.createCampaign({
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

  async getAllCampaigns(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    isFeatured?: boolean;
  }) {
    const page =
      params.page && params.page > 0
        ? params.page
        : 1;

    const limit =
      params.limit && params.limit > 0
        ? Math.min(params.limit, 50)
        : 10;

    const skip = (page - 1) * limit;

    const [campaigns, total] =
      await Promise.all([
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

  // =========================================================
  // APPROVE CAMPAIGN - ADMIN ONLY
  // =========================================================

  async approveCampaign(
    campaignId: string,
    adminId: string
  ) {
    const campaign =
      await this.campaignRepository.findCampaignById(
        campaignId
      );

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

  // =========================================================
  // REJECT CAMPAIGN - ADMIN ONLY
  // =========================================================

  async rejectCampaign(
    campaignId: string,
    adminId: string,
    rejectionReason: string
  ) {
    const campaign =
      await this.campaignRepository.findCampaignById(
        campaignId
      );

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
        rejectionReason.trim()
      );

    return rejectedCampaign;
  }

  // =========================================================
  // UPDATE CAMPAIGN - OWNER ONLY
  // =========================================================

  async updateCampaign(
    campaignId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      goalAmount?: number;
      categoryId?: string;
      deadline?: Date;
    }
  ) {
    // -------------------------------------------------------
    // 1. Find campaign
    // -------------------------------------------------------

    const campaign =
      await this.campaignRepository.findCampaignById(
        campaignId
      );

    if (!campaign) {
      throw new AppError(
        "Campaign not found",
        HttpStatus.NOT_FOUND
      );
    }

    // -------------------------------------------------------
    // 2. Check ownership
    // -------------------------------------------------------

    if (campaign.ownerId !== userId) {
      throw new AppError(
        "You are not allowed to update this campaign",
        HttpStatus.FORBIDDEN
      );
    }

    // -------------------------------------------------------
    // 3. Check campaign status
    // -------------------------------------------------------

    if (
      campaign.status !== "PENDING" &&
      campaign.status !== "REJECTED"
    ) {
      throw new AppError(
        "Only pending or rejected campaigns can be updated",
        HttpStatus.BAD_REQUEST
      );
    }

    // -------------------------------------------------------
    // 4. Validate title
    // -------------------------------------------------------

    if (
      data.title !== undefined &&
      !data.title.trim()
    ) {
      throw new AppError(
        "Campaign title cannot be empty",
        HttpStatus.BAD_REQUEST
      );
    }

    // -------------------------------------------------------
    // 5. Validate description
    // -------------------------------------------------------

    if (
      data.description !== undefined &&
      !data.description.trim()
    ) {
      throw new AppError(
        "Campaign description cannot be empty",
        HttpStatus.BAD_REQUEST
      );
    }

    // -------------------------------------------------------
    // 6. Validate goal amount
    // -------------------------------------------------------

    if (
      data.goalAmount !== undefined &&
      data.goalAmount <= 0
    ) {
      throw new AppError(
        "Goal amount must be greater than zero",
        HttpStatus.BAD_REQUEST
      );
    }

    // -------------------------------------------------------
    // 7. Validate deadline
    // -------------------------------------------------------

    if (
      data.deadline !== undefined &&
      data.deadline <= new Date()
    ) {
      throw new AppError(
        "Deadline must be in the future",
        HttpStatus.BAD_REQUEST
      );
    }

    // -------------------------------------------------------
    // 8. Validate category
    // -------------------------------------------------------

    if (data.categoryId !== undefined) {
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
    }

    // -------------------------------------------------------
    // 9. Generate unique slug if title changed
    // -------------------------------------------------------

    let slug: string | undefined;

    if (data.title !== undefined) {
      const baseSlug = generateSlug(
        data.title
      );

      slug = baseSlug;

      let counter = 1;

      let existingCampaign =
        await this.campaignRepository.findCampaignBySlug(
          slug
        );

      while (
        existingCampaign &&
        existingCampaign.id !== campaignId
      ) {
        slug = `${baseSlug}-${counter}`;

        existingCampaign =
          await this.campaignRepository.findCampaignBySlug(
            slug
          );

        counter++;
      }
    }

    // -------------------------------------------------------
    // 10. Prepare update data
    // -------------------------------------------------------

    const updateData: Prisma.CampaignUpdateInput = {
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

    const updatedCampaign =
      await this.campaignRepository.updateCampaign(
        campaignId,
        updateData
      );







      

    return updatedCampaign;



    



  }



  async deleteCampaign(
  campaignId: string,
  userId: string
) {
  const campaign =
    await this.campaignRepository.findCampaignById(
      campaignId
    );

  if (!campaign) {
    throw new AppError(
      "Campaign not found",
      HttpStatus.NOT_FOUND
    );
  }

  if (campaign.deletedAt) {
    throw new AppError(
      "Campaign is already deleted",
      HttpStatus.BAD_REQUEST
    );
  }

  // Only campaign owner can delete
  if (campaign.ownerId !== userId) {
    throw new AppError(
      "You are not allowed to delete this campaign",
      HttpStatus.FORBIDDEN
    );
  }

  const deletedCampaign =
    await this.campaignRepository.deleteCampaign(
      campaignId
    );

  return deletedCampaign;
}
}