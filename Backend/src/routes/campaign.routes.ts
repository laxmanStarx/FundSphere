import { Router } from "express";
import { CampaignController } from "../controllers/campaign.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { createCampaignValidator } from "../validators/campaign.validator";
import { validateRequest } from "../middlewares/validation.middleware";

const router = Router();

const campaignController = new CampaignController();

router.post( "/",authenticate,createCampaignValidator,validateRequest,campaignController.createCampaign);

export default router;