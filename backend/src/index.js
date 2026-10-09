import app from "./app.js";

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🌱 GrowMate API running on http://localhost:${PORT}`);
  console.log(`🌿 Touch Grass Mode enabled. Health check at http://localhost:${PORT}/api/health`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing HTTP server gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
