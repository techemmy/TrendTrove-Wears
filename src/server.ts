import type { Application } from "express";
import express from "express";

const app: Application = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`🔥[Server] listening on port ${PORT}`);
});
