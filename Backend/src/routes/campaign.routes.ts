import { Router } from "express";

import { CampaignController } from "../controllers/campaign.controller";

const router = Router();

const campaignController = new CampaignController();

export default router;

