import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTokenAnalysisSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/analyses", async (_req, res) => {
    const analyses = await storage.listAnalyses();
    res.json(analyses);
  });

  app.get("/api/analyses/:address", async (req, res) => {
    const analysis = await storage.getAnalysis(req.params.address);
    if (!analysis) {
      res.status(404).json({ message: "Analysis not found" });
      return;
    }
    res.json(analysis);
  });

  app.post("/api/analyses", async (req, res) => {
    const result = insertTokenAnalysisSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    const analysis = await storage.createAnalysis(result.data);
    res.json(analysis);
  });

  const httpServer = createServer(app);
  return httpServer;
}
