import express from "express";

import authRoutes from "./routes/auth.routes";

import { errorMiddleware } from "./middlewares/error.middleware";


import campaignRoutes from "./routes/campaign.routes";



const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FundSphere Backend Running");
});



app.use("/api/v1/auth", authRoutes)

app.use("/api/v1/campaigns", campaignRoutes);




app.use(errorMiddleware);

export default app;