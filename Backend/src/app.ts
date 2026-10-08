import express from "express";

import authRoutes from "./routes/auth.routes";
import campaignRoutes from "./routes/campaign.routes";
import walletRoutes from "./routes/wallet.routes";
import donationRoutes from "./routes/donation.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FundSphere Backend Running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/donations", donationRoutes);

app.use(errorMiddleware);

export default app;