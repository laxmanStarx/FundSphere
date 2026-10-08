import { Request, Response, NextFunction } from "express";
import { DonationService } from "../services/donation.service";
import { ApiResponse } from "../utils/apiResponse";
import { HttpStatus } from "../constants/httpStatus";

export class DonationController {
  constructor(private donationService = new DonationService()) {}

  // POST /api/v1/donations
  createDonation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const donorId = req.user!.id;
      const { campaignId, amount, anonymous, message } = req.body;

      const result = await this.donationService.createDonation(donorId, {
        campaignId,
        amount: Number(amount),
        anonymous,
        message,
      });

      return res.status(HttpStatus.CREATED).json(
        new ApiResponse(
          HttpStatus.CREATED,
          result,
          "Donation processed successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/donations/my-donations
  getMyDonations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const donorId = req.user!.id;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this.donationService.getMyDonations(donorId, {
        page,
        limit,
      });

      return res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          result,
          "User donations fetched successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/donations/campaign/:campaignId
  getCampaignDonations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const campaignId = req.params.campaignId as string;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this.donationService.getCampaignDonations(
        campaignId,
        {
          page,
          limit,
        }
      );

      return res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          result,
          "Campaign donations fetched successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/donations/:id
  getDonationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string;

      const result = await this.donationService.getDonationById(id);

      return res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          result,
          "Donation details fetched successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };
}
