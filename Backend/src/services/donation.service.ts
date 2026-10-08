import { HttpStatus } from "../constants/httpStatus";
import { CampaignRepository } from "../repositories/campaign.repository";
import { DonationRepository } from "../repositories/donation.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { AppError } from "../utils/AppError";
import { Prisma, TransactionStatus, TransactionType, PaymentGateway } from "@prisma/client";

export class DonationService {
  constructor(
    private donationRepository = new DonationRepository(),
    private campaignRepository = new CampaignRepository(),
    private walletRepository = new WalletRepository()
  ) {}

  // Create a new donation
  async createDonation(
    donorId: string,
    data: {
      campaignId: string;
      amount: number;
      anonymous?: boolean;
      message?: string;
    }
  ) {
    const { campaignId, amount, anonymous = false, message } = data;

    // 1. Verify campaign exists and is active
    const campaign = await this.campaignRepository.findCampaignById(campaignId);

    if (!campaign || campaign.deletedAt) {
      throw new AppError("Campaign not found", HttpStatus.NOT_FOUND);
    }

    if (campaign.status !== "ACTIVE") {
      throw new AppError(
        "Donations can only be made to active campaigns",
        HttpStatus.BAD_REQUEST
      );
    }

    if (new Date(campaign.deadline) < new Date()) {
      throw new AppError(
        "Campaign deadline has passed",
        HttpStatus.BAD_REQUEST
      );
    }

    // 2. Verify donor has a wallet
    const wallet = await this.walletRepository.findWalletByUserId(donorId);

    if (!wallet) {
      throw new AppError("Donor wallet not found", HttpStatus.NOT_FOUND);
    }

    // 3. Perform donation inside atomic transaction
    const result = await this.donationRepository.transaction(async (tx) => {
      // Create Donation record
      const donation = await this.donationRepository.createDonation(
        {
          donor: { connect: { id: donorId } },
          campaign: { connect: { id: campaignId } },
          amount: new Prisma.Decimal(amount),
          anonymous,
          message,
        },
        tx
      );

      // Create WalletTransaction record
      const transaction = await this.donationRepository.createWalletTransaction(
        {
          wallet: { connect: { id: wallet.id } },
          donation: { connect: { id: donation.id } },
          type: TransactionType.DEBIT,
          amount: new Prisma.Decimal(amount),
          status: TransactionStatus.SUCCESS,
          gateway: PaymentGateway.STRIPE,
          description: `Donation to campaign: ${campaign.title}`,
        },
        tx
      );

      // Increment Campaign raisedAmount
      const updatedCampaign = await this.donationRepository.incrementCampaignRaisedAmount(
        campaignId,
        new Prisma.Decimal(amount),
        tx
      );

      return {
        donation,
        transaction,
        raisedAmount: updatedCampaign.raisedAmount,
      };
    });

    return result;
  }

  // Get user's donation history
  async getMyDonations(
    donorId: string,
    options: { page?: number; limit?: number }
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      this.donationRepository.findDonationsByDonorId(donorId, { skip, take: limit }),
      this.donationRepository.countDonationsByDonorId(donorId),
    ]);

    return {
      donations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get campaign donations
  async getCampaignDonations(
    campaignId: string,
    options: { page?: number; limit?: number }
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    // Verify campaign exists
    const campaign = await this.campaignRepository.findCampaignById(campaignId);
    if (!campaign || campaign.deletedAt) {
      throw new AppError("Campaign not found", HttpStatus.NOT_FOUND);
    }

    const [rawDonations, total] = await Promise.all([
      this.donationRepository.findDonationsByCampaignId(campaignId, { skip, take: limit }),
      this.donationRepository.countDonationsByCampaignId(campaignId),
    ]);

    // Format anonymous donor info if requested
    const donations = rawDonations.map((donation) => {
      if (donation.anonymous) {
        return {
          ...donation,
          donor: {
            id: null,
            name: "Anonymous Donor",
            avatar: null,
          },
        };
      }
      return donation;
    });

    return {
      donations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single donation details
  async getDonationById(donationId: string) {
    const donation = await this.donationRepository.findDonationById(donationId);

    if (!donation) {
      throw new AppError("Donation not found", HttpStatus.NOT_FOUND);
    }

    if (donation.anonymous) {
      return {
        ...donation,
        donor: {
          id: null,
          name: "Anonymous Donor",
          avatar: null,
        },
      };
    }

    return donation;
  }
}
