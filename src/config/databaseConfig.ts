const developmentConfig = {
    database: process.env.DATABASE_NAME ?? '',
    username: process.env.DATABASE_USERNAME ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
    options: {
        host: process.env.DATABASE_HOST ?? '',
        dialect: 'postgres',
        pool: {
            min: parseInt(process.env.DATABASE_POOL_MIN ?? '0'),
            max: parseInt(process.env.DATABASE_POOL_MAX ?? '5'),
            idle: parseInt(process.env.DATABASE_POOL_IDLE ?? '30000'),
            acquire: parseInt(process.env.DATABASE_POOL_ACQUIRE ?? '10000'),
        },
        define: {
            freezeTableName: true, // prevents Sequelize from auto-pluralization of model names
        },
        logging: false,
    },
};

const productionConfig = {
    ...developmentConfig,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

let config;
if (process.env.NODE_ENV === 'production') {
    config = developmentConfig;
} else {
    config = productionConfig;
}
export default config;
