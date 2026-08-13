import { Router } from "express";

import { CampaignController } from "../controllers/campaign.controller";

import { authenticate } from "../middlewares/auth.middleware";
import {  validateRequest } from "../middlewares/validation.middleware";

import { createCampaignValidator } from "../validators/campaign.validator";
import { authorize } from "../middlewares/autorize.middleware";

const router = Router();

import { Role } from "@prisma/client";

const campaignController = new CampaignController();


// CREATE CAMPAIGN
router.post(
  "/",
  authenticate,
  createCampaignValidator,
  validateRequest,
  campaignController.createCampaign
);


// GET ALL ACTIVE CAMPAIGNS
router.get(
  "/",
  campaignController.getAllCampaigns
);


// GET CAMPAIGN BY SLUG
router.get(
  "/:slug",
  campaignController.getCampaignBySlug
);


router.patch(
  "/:id/approve",
  authenticate,
  authorize("ADMIN"),
  campaignController.approveCampaign
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize("ADMIN"),
  campaignController.rejectCampaign
);



router.put(
  "/:id",
  authenticate,
  campaignController.updateCampaign
);










router.patch("/:id",authenticate,campaignController.updateCampaign);

export default router;