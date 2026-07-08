import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "100kb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", os: "TUVY OS" });
  });

  // Mock DB in memory for now, will connect to Postgres/Supabase next
  let orders: any[] = [];
  let tables = [
    { id: "T1", status: "available", capacity: 4 },
    { id: "T2", status: "occupied", capacity: 2 },
    { id: "T3", status: "preparing", capacity: 6 },
    { id: "T4", status: "needs_help", capacity: 4 },
    { id: "T5", status: "available", capacity: 2 },
  ];

  app.get("/api/tables", (req, res) => {
    res.json(tables);
  });

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
