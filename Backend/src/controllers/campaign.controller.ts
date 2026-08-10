import { Request, Response } from "express";
import { CampaignService } from "../services/campaign.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { HttpStatus } from "../constants/httpStatus";

export class CampaignController {
  constructor(
    private campaignService = new CampaignService()
  ) {}

  createCampaign = asyncHandler(async (req: Request, res: Response) => {
    const campaign = await this.campaignService.createCampaign(
      req.user!.id,
      {
        title: req.body.title,
        description: req.body.description,
        goalAmount: Number(req.body.goalAmount),
        categoryId: req.body.categoryId,
        deadline: new Date(req.body.deadline),
      }
    );

    return res.status(HttpStatus.CREATED).json(
      new ApiResponse(

        HttpStatus.CREATED,
         campaign,  
        "Campaign created successfully",
        
      )
      
    );
  });


getAllCampaigns = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const isFeatured =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined;

    const result =
      await this.campaignService.getAllCampaigns({
        page,
        limit,
        categoryId,
        search,
        isFeatured,
      });

    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        result,
        "Campaigns fetched successfully",
        
      )
    );
  }
);

getCampaignBySlug = asyncHandler(
  async (req: Request, res: Response) => {

    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const campaign =
      await this.campaignService.getCampaignBySlug(slug);

    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        campaign,
        "Campaign fetched successfully"
      )
    );
  }
);

approveCampaign = asyncHandler(
  async (req: Request, res: Response) => {

    const campaignId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const campaign =
      await this.campaignService.approveCampaign(
        campaignId,
        req.user!.id
      );

    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        campaign,
        "Campaign approved successfully"
      )
    );
  }
);

rejectCampaign = asyncHandler(
  async (req: Request, res: Response) => {

    const campaignId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const campaign =
      await this.campaignService.rejectCampaign(
        campaignId,
        req.user!.id,
        req.body.rejectionReason
      );

    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        campaign,
        "Campaign rejected successfully"
      )
    );
  }
);


}