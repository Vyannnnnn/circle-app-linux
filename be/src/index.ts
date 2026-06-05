import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import mainRoute from "./routes/index";
import { env } from "process";
import cors from "cors";

const app = express();
const PORT = env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", mainRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
