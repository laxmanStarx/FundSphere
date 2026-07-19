import express from "express";

import authRoutes from "./routes/auth.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FundSphere Backend Running");
});



app.use("/api/v1/auth", authRoutes)




app.use(errorMiddleware);

export default app;