import dotenv from "dotenv";
dotenv.config();

import { appConfig } from "./config";

import app from "./app";
import db from "./database"

(async () => {
  await db.sequelize.sync({ alter: true });
  console.log("📖[Database] connected succesfully!");
})();

app.listen(appConfig.PORT, () => {
  console.log(`🔥[Server] listening on port ${appConfig.PORT}`);
});
