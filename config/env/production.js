module.exports = {
    pgConnectionString: process.env.DATABASE_URL,
    pgPoolSettings: {
        max: 30,
        min:4,
        idleTimeoutMillis: 1000
    }
};
