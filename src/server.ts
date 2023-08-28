import dotenv from 'dotenv';
dotenv.config();

import { appConfig } from "./config";
import db from './database'
import app from "./app";

(async () => {
 await db.sequelize.sync({alter: true})
 console.log("📖[Database] connected succesfully!")
})()

app.listen(appConfig.PORT, () => {
  console.log(`🔥[Server] listening on port ${appConfig.PORT}`);
});
