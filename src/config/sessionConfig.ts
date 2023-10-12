const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default {
    secret: process.env.SESSION_SECRET ?? '',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: ONE_WEEK },
};
