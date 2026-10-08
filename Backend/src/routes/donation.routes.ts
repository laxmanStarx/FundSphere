import { Router } from "express";
import { DonationController } from "../controllers/donation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { createDonationValidator } from "../validators/donation.validator";

const router = Router();
const donationController = new DonationController();

// Create a new donation
router.post(
  "/",
  authenticate,
  createDonationValidator,
  validateRequest,
  donationController.createDonation
);

// Get current user's donation history
router.get(
  "/my-donations",
  authenticate,
  donationController.getMyDonations
);

// Get donations for a specific campaign (Public endpoint)
router.get(
  "/campaign/:campaignId",
  donationController.getCampaignDonations
);

// Get single donation details by ID
router.get(
  "/:id",
  donationController.getDonationById
);

export default router;
