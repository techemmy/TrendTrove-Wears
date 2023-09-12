import dotenv from 'dotenv';

import { appConfig } from './config';

import app from './app';
import db from './database';
dotenv.config();

(async () => {
    await db.sequelize.sync({ alter: true });
    console.log('📖[Database] connected succesfully!');
})().catch((err) => {
    console.log('[DB Connection Error]:', err);
});

app.listen(appConfig.PORT, () => {
    console.log(`🔥[Server] listening on port ${appConfig.PORT}`);
});
