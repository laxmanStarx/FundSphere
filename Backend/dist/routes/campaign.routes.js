"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const campaign_validator_1 = require("../validators/campaign.validator");
const autorize_middleware_1 = require("../middlewares/autorize.middleware");
const router = (0, express_1.Router)();
const campaignController = new campaign_controller_1.CampaignController();
// CREATE CAMPAIGN
router.post("/", auth_middleware_1.authenticate, campaign_validator_1.createCampaignValidator, validation_middleware_1.validateRequest, campaignController.createCampaign);
// GET ALL ACTIVE CAMPAIGNS
router.get("/", campaignController.getAllCampaigns);
// GET CAMPAIGN BY SLUG
router.get("/:slug", campaignController.getCampaignBySlug);
router.patch("/:id/approve", auth_middleware_1.authenticate, (0, autorize_middleware_1.authorize)("ADMIN"), campaignController.approveCampaign);
router.patch("/:id/reject", auth_middleware_1.authenticate, (0, autorize_middleware_1.authorize)("ADMIN"), campaignController.rejectCampaign);
router.patch("/:id", auth_middleware_1.authenticate, campaignController.updateCampaign);
exports.default = router;
