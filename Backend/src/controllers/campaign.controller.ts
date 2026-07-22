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
}