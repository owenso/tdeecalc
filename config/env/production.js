module.exports = {
    pgConnectionString: process.env.DATABASE_URL,
    pgPoolSettings: {
        database:'fitness',
        host: 'dokku-postgres-fitness',
        user:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        port: 5432,
        max: 30,
        min:4,
        idleTimeoutMillis: 1000
    },
    jwtSecret: process.env.JWT_SECRET
};
