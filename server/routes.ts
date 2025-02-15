import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertTokenAnalysisSchema } from "@shared/schema";
import {
  listAnalyses,
  getAnalysis,
  createAnalysis,
} from "./services/analysisService";

export function registerRoutes(app: Express): Server {
  app.get("/api/analyses", async (_req, res) => {
    try {
      const analyses = await listAnalyses();
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analyses/:address", async (req, res) => {
    try {
      const analysis = await getAnalysis(req.params.address);
      if (!analysis) {
        res.status(404).json({ message: "Analysis not found" });
        return;
      }
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/analyses", async (req, res) => {
    try {
      const bodyWithTimestamp = {
        ...req.body,
        createdAt: new Date().toISOString(),
      };

      const result = insertTokenAnalysisSchema.safeParse(bodyWithTimestamp);
      if (!result.success) {
        res.status(400).json({
          message: "Invalid request body",
          errors: result.error.errors,
        });
        return;
      }

      const savedAnalysis = await createAnalysis(result.data);
      res.json(savedAnalysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return createServer(app);
}
