import prisma from "../config/prisma";
import { Prisma, TransactionStatus } from "@prisma/client";

export class DonationRepository {
  // Execute transactional operations
  async transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(fn);
  }

  // Create a new donation
  async createDonation(
    data: Prisma.DonationCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || prisma;
    return client.donation.create({
      data,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            goalAmount: true,
            raisedAmount: true,
            ownerId: true,
          },
        },
        transaction: true,
      },
    });
  }

  // Find donation by ID
  async findDonationById(id: string) {
    return prisma.donation.findUnique({
      where: {
        id,
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            goalAmount: true,
            raisedAmount: true,
            ownerId: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        transaction: true,
      },
    });
  }

  // Get user's donation history (donations made by donor)
  async findDonationsByDonorId(
    donorId: string,
    options: {
      skip: number;
      take: number;
    }
  ) {
    const { skip, take } = options;

    return prisma.donation.findMany({
      where: {
        donorId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            goalAmount: true,
            raisedAmount: true,
            images: {
              take: 1,
            },
          },
        },
        transaction: true,
      },
    });
  }

  // Count total donations made by a donor
  async countDonationsByDonorId(donorId: string) {
    return prisma.donation.count({
      where: {
        donorId,
      },
    });
  }

  // Get all donations received by a campaign
  async findDonationsByCampaignId(
    campaignId: string,
    options: {
      skip: number;
      take: number;
    }
  ) {
    const { skip, take } = options;

    return prisma.donation.findMany({
      where: {
        campaignId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        transaction: true,
      },
    });
  }

  // Count total donations received by a campaign
  async countDonationsByCampaignId(campaignId: string) {
    return prisma.donation.count({
      where: {
        campaignId,
      },
    });
  }

  // Create wallet transaction record
  async createWalletTransaction(
    data: Prisma.WalletTransactionCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || prisma;
    return client.walletTransaction.create({
      data,
    });
  }

  // Update wallet transaction status & gateway reference
  async updateWalletTransactionStatus(
    id: string,
    status: TransactionStatus,
    gatewayReference?: string,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || prisma;
    return client.walletTransaction.update({
      where: {
        id,
      },
      data: {
        status,
        ...(gatewayReference && { gatewayReference }),
      },
    });
  }

  // Update campaign raisedAmount
  async incrementCampaignRaisedAmount(
    campaignId: string,
    amount: Prisma.Decimal | number,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || prisma;
    return client.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        raisedAmount: {
          increment: amount,
        },
      },
    });
  }
}
